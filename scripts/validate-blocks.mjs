#!/usr/bin/env node
// PostToolUse hook: validates the Blocks actions of a *.botcmd.json file
// against the public Bot Creator MCP server (validate_actions tool).
//
// Exit 0: nothing to check, valid, or the server is unreachable (never blocks).
// Exit 2: errors found; stderr is fed back to Claude so it can fix them.

import { readFile } from "node:fs/promises";

const ENDPOINT = process.env.BOT_CREATOR_MCP_URL || "https://bot-creator.fr/api/mcp";
const TIMEOUT_MS = 8000;
const SUFFIX = ".botcmd.json";

async function readStdin() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  return raw;
}

// Returns [{ label, actions }] for every action list the file carries.
function collectActionLists(doc) {
  if (Array.isArray(doc)) return [{ label: "actions", actions: doc }];
  if (!doc || typeof doc !== "object") return [];

  const root = doc.command && typeof doc.command === "object" ? doc.command : doc;
  const data = root.data && typeof root.data === "object" ? root.data : root;
  const mode = data.executionMode;
  if (mode && mode !== "workflow") return [];

  const lists = [];
  if (Array.isArray(data.actions) && data.actions.length > 0) {
    lists.push({ label: "data.actions", actions: data.actions });
  }
  const workflows = data.subcommandWorkflows;
  if (workflows && typeof workflows === "object") {
    for (const [route, wf] of Object.entries(workflows)) {
      if (Array.isArray(wf?.actions) && wf.actions.length > 0) {
        lists.push({ label: `data.subcommandWorkflows.${route}.actions`, actions: wf.actions });
      }
    }
  }
  return lists;
}

async function validate(actions) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "validate_actions", arguments: { actions } },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return null;
  const body = await res.json();
  const text = body?.result?.content?.[0]?.text;
  if (typeof text !== "string") return null;
  return JSON.parse(text);
}

async function main() {
  let input;
  try {
    input = JSON.parse(await readStdin());
  } catch {
    return 0;
  }
  const filePath = input?.tool_input?.file_path;
  if (typeof filePath !== "string" || !filePath.endsWith(SUFFIX)) return 0;

  let doc;
  try {
    doc = JSON.parse(await readFile(filePath, "utf8"));
  } catch (err) {
    if (err?.code === "ENOENT") return 0;
    process.stderr.write(`Bot Creator: ${filePath} is not valid JSON (${err.message}). Fix it so it can be imported.\n`);
    return 2;
  }

  const lines = [];
  for (const { label, actions } of collectActionLists(doc)) {
    let report;
    try {
      report = await validate(actions);
    } catch {
      return 0; // offline or timeout: never block the user
    }
    if (!report) return 0;
    for (const e of report.errors ?? []) {
      lines.push(`- ${label} › ${e.path}: ${e.message}`);
    }
  }

  if (lines.length === 0) return 0;
  process.stderr.write(
    `Bot Creator validate_actions found ${lines.length} error(s) in ${filePath}:\n` +
      lines.join("\n") +
      "\nFix every error (check get_schema_manifest for the exact params), then save the file again.\n",
  );
  return 2;
}

main().then(
  (code) => process.exit(code),
  () => process.exit(0),
);
