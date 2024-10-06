import { JWT } from "google-auth-library";
import nextEnv from "@next/env";

export default function getAuth() {
  const projectDir = process.cwd();
  const { loadEnvConfig } = nextEnv;
  loadEnvConfig(projectDir);
  // Authenticate with google
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  // See https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
  const serviceAccountAuth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return serviceAccountAuth;
}
