// Send the same email, as separate individual messages, to every café in
// data/data/cafes.json. Every recipient gets their own message (own To, own
// Message-ID), so replies arrive as separate threads.
//
// Dry run (default, sends nothing):
//   npm run send-mailing -- --subject "Hoi" --body mailing.txt
// Test to yourself first:
//   npm run send-mailing -- --subject "Hoi" --body mailing.txt --only you@example.org --send
// Send for real:
//   npm run send-mailing -- --subject "Hoi" --body mailing.txt --send
//
// SMTP settings come from environment variables or `.env.mailing.local`
// (gitignored), see scripts/send-mailing.env.example.
import fs from "fs";
import readline from "readline/promises";
import { parseArgs } from "util";
import nodemailer from "nodemailer";
import loadJSON from "../data/loadJSON.mjs";

const ENV_FILE = ".env.mailing.local";
const SENT_LOG = ".mailing-sent.local.log"; // lets an interrupted run resume

const { values: args } = parseArgs({
  options: {
    subject: { type: "string" },
    body: { type: "string" }, // plain text file
    html: { type: "string" }, // optional HTML version
    send: { type: "boolean", default: false },
    only: { type: "string" }, // send only to this address (testing)
    delay: { type: "string", default: "5" }, // seconds between messages
  },
});
if (!args.subject || !args.body) {
  console.error("Usage: --subject <text> --body <file> [--html <file>] [--only <address>] [--send]");
  process.exit(1);
}

if (fs.existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

async function getRecipients() {
  const seen = new Map();
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

const text = fs.readFileSync(args.body, "utf8");
const html = args.html && fs.readFileSync(args.html, "utf8");

let todo = args.only ? [{ name: "test", address: args.only }] : await getRecipients();
const done =
  fs.existsSync(SENT_LOG) && !args.only
    ? new Set(fs.readFileSync(SENT_LOG, "utf8").split(/\s+/))
    : new Set();
todo = todo.filter(({ address }) => !done.has(address.toLowerCase()));

console.log(`${todo.length} recipients${done.size ? " (already sent are skipped)" : ""}:`);
for (const { name, address } of todo) console.log(`  ${address.padEnd(45)} ${name}`);

if (!args.send) {
  console.log("\nDry run, nothing sent. Add --send to send.");
  process.exit(0);
}

const { SMTP_HOST, SMTP_PORT = "587", SMTP_USER, SMTP_PASSWORD, MAIL_FROM, REPLY_TO } = process.env;
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
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

for (const [i, { address }] of todo.entries()) {
  try {
    await transport.sendMail({
      from: MAIL_FROM,
      to: address,
      replyTo: REPLY_TO,
      subject: args.subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`FAILED ${address}: ${error.message}`);
    continue;
  }
  console.log(`sent   ${address}`);
  if (!args.only) fs.appendFileSync(SENT_LOG, `${address.toLowerCase()}\n`);
  if (i < todo.length - 1) await new Promise((r) => setTimeout(r, Number(args.delay) * 1000));
}
