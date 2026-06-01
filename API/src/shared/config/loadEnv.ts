import fs from "fs";
import path from "path";

let loaded = false;

function parseEnvFile(content: string) {
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getCandidatePaths() {
  return [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), "API/.env"),
    path.resolve(process.cwd(), "API/.env.local"),
    path.resolve(__dirname, "../../../.env"),
    path.resolve(__dirname, "../../../.env.local"),
    path.resolve(__dirname, "../../../../.env"),
    path.resolve(__dirname, "../../../../.env.local"),
    path.resolve(process.cwd(), ".env.example"),
    path.resolve(process.cwd(), "API/.env.example"),
    path.resolve(__dirname, "../../../.env.example"),
    path.resolve(__dirname, "../../../../.env.example"),
  ];
}

export function loadEnv() {
  if (loaded) {
    return;
  }

  loaded = true;

  for (const candidatePath of getCandidatePaths()) {
    if (!fs.existsSync(candidatePath)) {
      continue;
    }

    parseEnvFile(fs.readFileSync(candidatePath, "utf-8"));
  }
}

loadEnv();
