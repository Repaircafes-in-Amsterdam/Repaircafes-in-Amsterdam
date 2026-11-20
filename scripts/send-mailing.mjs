// Send the same email, as separate individual messages, to every café in
// data/data/cafes.json. Every recipient gets their own message (own To, own
// Message-ID), so replies arrive as separate threads.
//
// The mail file starts with front matter holding the subject:
//   ---
//   subject: Hoi
//   ---
// The body is Markdown (single line breaks are kept). It's converted to HTML,
// and that HTML to the plain text version.
//
// Dry run (default, sends nothing, writes previews to .mailing-preview.local.*):
//   npm run send-mailing -- --body mails/mailing.md
// Test to yourself first:
//   npm run send-mailing -- --body mails/mailing.md --only you@example.org --send
// Send for real:
//   npm run send-mailing -- --body mails/mailing.md --send
//
// SMTP settings come from environment variables or `.env.local`
// (gitignored), see scripts/send-mailing.env.example.
import fs from "fs";
import readline from "readline/promises";
import { parseArgs } from "util";
import nodemailer from "nodemailer";
import { marked } from "marked";
import { convert } from "html-to-text";
import loadJSON from "../data/loadJSON.mjs";

const ENV_FILE = ".env.local";
const SENT_LOG = ".mailing-sent.local.log"; // lets an interrupted run resume

const { values: args } = parseArgs({
  options: {
    subject: { type: "string" }, // overrides the subject from the front matter
    body: { type: "string" }, // Markdown file with front matter
    send: { type: "boolean", default: false },
    only: { type: "string" }, // send only to this address (testing)
    delay: { type: "string", default: "5" }, // seconds between messages
  },
});
if (!args.body) {
  console.error("Usage: --body <file> [--subject <text>] [--only <address>] [--send]");
  process.exit(1);
}

if (fs.existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

async function getRecipients() {
  const seen = new Map();
  // Our own copy, sent first, so we can always look up what was sent when.
  const archive = process.env.MAIL_ARCHIVE;
  if (archive) seen.set(archive.toLowerCase(), { name: "(archive copy)", address: archive });
  for (const cafe of await loadJSON("cafes.json")) {
    // An email field may hold several addresses.
    for (const address of (cafe.email || "").split(/[,;\s]+/)) {
      if (address.includes("@") && !seen.has(address.toLowerCase())) {
        seen.set(address.toLowerCase(), { name: cafe.name, address });
      }
    }
  }
  return [...seen.values()];
}

const { frontMatter, content: source } = parseFrontMatter(fs.readFileSync(args.body, "utf8"));
const subject = args.subject || frontMatter.subject;
if (!subject) {
  console.error(`No subject, add it to the front matter of ${args.body}`);
  process.exit(1);
}
const html = `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
${marked.parse(source, { breaks: true })}</body></html>
`;
const text = convert(html, {
  wordwrap: false,
  selectors: [
    { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
    ...["h1", "h2", "h3", "h4", "h5", "h6"].map((selector) => ({
      selector,
      options: { uppercase: false },
    })),
  ],
});

// Minimal front matter: `key: value` lines between `---` lines.
function parseFrontMatter(file) {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { frontMatter: {}, content: file.trim() };
  const frontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const [, key, value] = line.match(/^(\w+):\s*(.*)$/) || [];
    if (key) frontMatter[key] = value.replace(/^(["'])(.*)\1$/, "$2");
  }
  return { frontMatter, content: file.slice(match[0].length).trim() };
}

let todo = args.only ? [{ name: "test", address: args.only }] : await getRecipients();
const done =
  fs.existsSync(SENT_LOG) && !args.only
    ? new Set(fs.readFileSync(SENT_LOG, "utf8").split(/\s+/))
    : new Set();
todo = todo.filter(({ address }) => !done.has(address.toLowerCase()));

console.log(`Subject: ${subject}\n`);
console.log(`${todo.length} recipients${done.size ? " (already sent are skipped)" : ""}:`);
for (const { name, address } of todo) console.log(`  ${address.padEnd(45)} ${name}`);

const message = (to) => ({
  from: process.env.MAIL_FROM,
  to,
  replyTo: process.env.REPLY_TO,
  subject,
  text,
  html,
});

if (!args.send) {
  fs.writeFileSync(".mailing-preview.local.html", html);
  fs.writeFileSync(".mailing-preview.local.txt", text);
  // The complete message as it would be sent (open it in a mail client).
  const preview = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const { message: eml } = await preview.sendMail(message(todo[0]?.address));
  fs.writeFileSync(".mailing-preview.local.eml", eml);
  console.log(
    "\nDry run, nothing sent. Preview: .mailing-preview.local.{html,txt,eml}. Add --send to send.",
  );
  process.exit(0);
}

const { SMTP_HOST, SMTP_PORT = "587", SMTP_USER, SMTP_PASSWORD, MAIL_FROM } = process.env;
for (const [key, value] of Object.entries({ SMTP_HOST, SMTP_USER, SMTP_PASSWORD, MAIL_FROM })) {
  if (!value) {
    console.error(`Missing ${key}, see scripts/send-mailing.env.example`);
    process.exit(1);
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const answer = await rl.question(`\nSend to ${todo.length} recipients from ${MAIL_FROM}? Type 'yes': `);
rl.close();
if (answer !== "yes") {
  console.log("Aborted.");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_PORT === "465", // otherwise upgraded with STARTTLS
  requireTLS: SMTP_PORT !== "465", // never fall back to plain text
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

let failed = 0;
for (const [i, { address }] of todo.entries()) {
  const progress = `${i + 1}/${todo.length}`.padEnd(2 * String(todo.length).length + 1);
  try {
    await transport.sendMail(message(address));
    console.log(`sent   ${progress} ${address}`);
    if (!args.only) fs.appendFileSync(SENT_LOG, `${address.toLowerCase()}\n`);
  } catch (error) {
    failed++;
    console.error(`FAILED ${progress} ${address}: ${error.message}`);
  }
  if (i < todo.length - 1) await new Promise((r) => setTimeout(r, Number(args.delay) * 1000));
}
if (failed) {
  console.error(`\n${failed} of ${todo.length} failed. Run again to retry only those.`);
  process.exitCode = 1;
}
