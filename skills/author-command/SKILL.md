---
name: author-command
description: Design a Discord bot command for Bot Creator (bot-creator.fr) in BDFD (BDScript), Blocks (visual/JSON actions) or JavaScript, grounded in the official docs and validated before delivery. Use when the user asks for a Discord command, slash command, button/modal handler, ticket system, economy, moderation or any feature for a Bot Creator bot, or mentions BDFD, BDScript, Blocks or Bot Creator.
---

# Author a Bot Creator command

Bot Creator runs one command in one of three engines. Never mix their syntaxes.

| Mode | Engine | What you write |
|---|---|---|
| `bdfd` (default) | BDScript | A `$function[...]` script |
| `blocks` | Visual actions | A JSON array of `{ "type", "key"?, "payload" }` |
| `javascript` | BDJS | The body of an async function (no `import`/`export`) |

All docs come from the **bot-creator** MCP server shipped with this plugin. Use its tools by their short names below. Do not answer from memory when a tool can confirm it.

## Workflow

1. **Pick the mode.** Use what the user asked for. A bot already in JavaScript means `javascript`. If they want a visual, no-code flow, use `blocks`. Otherwise use `bdfd`. If it is genuinely unclear and it matters, ask one short question.
2. **Plan first.** Call `plan_solution` with the user's intent and the mode. Follow its `decision`:
   - `auto`: write the command from the returned functions and skeleton.
   - `review`: read 1-2 of the suggested functions with `get_doc`, then write it.
   - `ask_user`: ask the clarifying question it suggests before writing anything.
   
   Do not loop on `search_docs` + `get_doc` when `plan_solution` already answered.
3. **Blocks only:**
   - Get the exact params with `get_schema_manifest`. Pass `names` for the actions you use, and use `mode: "types"` for nested `Embed`, `ComponentsDef`, `Condition` or `Action[]`.
   - Then **always** run `validate_actions` on the full array. Fix every error and re-validate until `valid` is true.
4. **Deliver** (see below).

## Ground-truth rules (most common mistakes)

- `$let` does not exist. Temporary values use `$var[name;value]` / `$var[name]`.
- Persistent storage is scoped:
  - `$setVar`/`$getVar` (global)
  - `$setUserVar`/`$getUserVar`
  - `$setServerVar`/`$getServerVar`
  - `$setMemberVar`/`$getMemberVar`
- **Interactions acknowledge automatically.** Slash commands, buttons and modals already reply:
  - In BDFD, plain text and embeds *are* the reply. Never add `$sendMessage` to reply, or the text appears twice.
  - In Blocks, reply with `respondWithMessage`.
- **Private reply:** add `$ephemeral` (BDFD) or `"ephemeral": true` on `respondWithMessage` (Blocks).
- **Another channel:** use `$channelSendMessage[channelID;content]` (BDFD), or `sendMessage` with `channelId` (Blocks).
- **Slash options:**
  - In BDFD, use `$message[name]`.
  - In `((...))` placeholders, use `((opts.name))`, or `((opts.name.id))` for a user, channel or role option.
  - `$slashOption` and `$getOption` do not exist.
- **Blocks results:** set `key` **on the action** (not inside `payload`), then read it with `((action.<key>))`. Without a key, the result is `action_<position>`.
- **Blocks action names:** use only the native ones (`list_actions`). Never invent an action, and never translate a BDFD function name into a Blocks type.
- **Tickets:**
  - BDFD has `$newTicket[...]` and `$closeTicket[...]`.
  - In Blocks, chain `createChannel`, then `editChannelPermissions` (allow bitmask `68608`), then a message with a close button, plus a button handler that runs `removeChannel`.
  - The `production_ticket_workflow` prompt gives a full flow.
- **JavaScript:** the script is the body of an async function. Do not use `import`/`export`, and do not use `client.db`. Check the APIs with `get_doc` (api_type `javascript`).

## Delivery

Always give:

1. **The command definition:**
   - name: lowercase, 1-32 chars, no spaces;
   - description;
   - options, each with type, name, description and required;
   - the mode.
2. **The code:**
   - a ```` ```bdfd ```` block for BDFD;
   - a ```` ```js ```` block for JavaScript;
   - a ```` ```json ```` block for Blocks.
3. **How to add it in the app:** create the command, choose the mode, then paste the code.

If the user works in a project folder, or asks for a file, also write `<command-name>.botcmd.json` in the **import format** described in the `import-format` skill. The user can then paste it into *Import command* in the app. The plugin's hook re-validates the Blocks actions of every `*.botcmd.json` you save. If it reports errors, fix them and save again.

Keep explanations short. The user wants a working command, not a tutorial.
