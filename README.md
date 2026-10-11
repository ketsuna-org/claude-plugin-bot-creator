# Bot Creator plugin for Claude Code

[Français](README.fr.md)

Build Discord bot commands for [Bot Creator](https://bot-creator.fr) with Claude Code. Claude grounds every command in the official documentation, validates it, and exports it as a file you import into the app in one paste.

## Install

```
/plugin marketplace add ketsuna-org/claude-plugin-bot-creator
/plugin install bot-creator@bot-creator
```

Run `/mcp` to check that the `bot-creator` server is connected. It is public and read-only, and it needs no account or token.

## What you get

| Component | What it does |
|---|---|
| **MCP server** `bot-creator` | Official docs at `https://bot-creator.fr/api/mcp`: `plan_solution`, `get_schema_manifest`, `list_actions`, `validate_actions`, `search_docs` and `get_doc` |
| **Skill** `author-command` | Used automatically when you ask for a Discord or Bot Creator command. It picks the engine (BDFD, Blocks or JavaScript), plans with the docs, avoids the classic mistakes and validates Blocks JSON |
| **Skill** `import-format` | The exact `bot_creator_command` JSON accepted by *Import command* in the app |
| `/bot-creator:new-command` | `/bot-creator:new-command "slash /warn with a user and a reason, mods only" --mode blocks` |
| `/bot-creator:validate` | `/bot-creator:validate warn.botcmd.json`: checks the envelope and the actions, then proposes fixes |
| `/bot-creator:docs` | `/bot-creator:docs setUserVar bdfd`: signature, return value and example |
| **Agent** `bot-creator-expert` | Designs multi-command features, such as tickets, economy or moderation, end to end |
| **Hook** | Every time Claude saves a `*.botcmd.json`, its Blocks actions are re-checked with `validate_actions`, and errors go back to Claude to fix |

## Import a command into the app

1. Open the `<name>.botcmd.json` file Claude wrote and copy its content.
2. In Bot Creator, open your bot, create a command, then choose **Import command**.
3. Paste the JSON (or its Base64) and save.

## Privacy

The MCP server and the hook only call `https://bot-creator.fr/api/mcp`. The hook sends nothing but the Blocks `actions` array of `*.botcmd.json` files. It never sends bot tokens or other files. If the server is unreachable, or `node` is not installed, the hook does nothing and never blocks you.

To point the hook at another server, set `BOT_CREATOR_MCP_URL`.

## Requirements

- Claude Code with plugin support
- Node.js 18 or later, for the validation hook only (optional)

## Docs

- MCP server: https://bot-creator.fr/docs/mcp
- Bot Creator docs: https://bot-creator.fr/docs

## License

MIT
