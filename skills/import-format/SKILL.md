---
name: import-format
description: Exact JSON format of a Bot Creator command share payload (type "bot_creator_command"), the file the app accepts in "Import command". Use when writing or fixing a *.botcmd.json file, or when the user wants to import or export a Bot Creator command as JSON.
---

# Bot Creator command import format

The Bot Creator app shares and imports a single command as this JSON envelope. In the command editor, *Import command* accepts it raw or Base64-encoded. Save it as `<command-name>.botcmd.json`.

```json
{
  "version": 1,
  "type": "bot_creator_command",
  "command": {
    "name": "ping",
    "commandType": "chatInput",
    "description": "Check that the bot is alive",
    "integrationTypes": ["guildInstall"],
    "contexts": ["guild"],
    "options": [],
    "data": {
      "version": 1,
      "commandType": "chatInput",
      "editorMode": "advanced",
      "executionMode": "workflow",
      "triggerType": "slash",
      "bdfdScriptContent": "",
      "jsScriptContent": "",
      "defaultMemberPermissions": "",
      "actions": [
        {
          "type": "respondWithMessage",
          "payload": { "content": "Pong!", "ephemeral": true }
        }
      ]
    }
  }
}
```

## Field values

| Field | Allowed values |
|---|---|
| `command.commandType` / `data.commandType` | `chatInput` (slash command), `user` (user context menu), `message` (message context menu). Context menus have no description and no options. |
| `integrationTypes` | `guildInstall`, `userInstall` |
| `contexts` | `guild`, `botDm`, `privateChannel` |
| `data.executionMode` | `workflow` (Blocks, uses `actions`), `bdfd_script` (uses `bdfdScriptContent`), `javascript` (uses `jsScriptContent`) |
| `data.triggerType` | `slash` (default) |
| `data.defaultMemberPermissions` | Discord permission bitfield as a string, or `""` for everyone |

Only the field matching `executionMode` is read. Leave the others empty (`""` or `[]`).

## Options

Each entry of `command.options` has this shape:

```json
{
  "type": "string",
  "name": "reason",
  "description": "Why",
  "required": false,
  "minLength": 1,
  "maxLength": 200,
  "choices": [{ "name": "Spam", "value": "spam" }]
}
```

- `type` is one of `string`, `integer`, `number`, `boolean`, `user`, `channel`, `role`, `mentionable`, `attachment`, `subCommand` or `subCommandGroup`.
- Optional fields:
  - `minValue` / `maxValue` (numbers);
  - `minLength` / `maxLength` (strings);
  - `channelTypes` (array of Discord channel type ints);
  - `choices` (max 25);
  - `options` (children of a `subCommand` or `subCommandGroup`).
- Names follow Discord rules: lowercase, 1-32 chars, no spaces. Required options come before optional ones.
- In Blocks, read an option with `((opts.<name>))`, or `((opts.<name>.id))` for a user, channel, role or mentionable. In BDFD, use `$message[<name>]`.

## Checklist before saving

- The JSON is valid, with no comments and no trailing commas.
- `type` is exactly `"bot_creator_command"` and `version` is `1`.
- For `workflow`, the `actions` passed `validate_actions` with zero errors. The plugin hook checks this again on save.
- For `bdfd_script` or `javascript`, the whole script is a single JSON string, with escaped `\n` and `"`.
