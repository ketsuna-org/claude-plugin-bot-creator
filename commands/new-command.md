---
description: Create a Bot Creator Discord command (BDFD, Blocks or JavaScript), validated and ready to import
argument-hint: "<what the command does> [--mode bdfd|blocks|javascript]"
---

Create a Bot Creator command for this request: $ARGUMENTS

Follow the `author-command` skill of the bot-creator plugin step by step:
1. Pick the mode: `--mode` if given, otherwise infer it.
2. Call `plan_solution`.
3. For Blocks, call `get_schema_manifest`, then `validate_actions` until there are zero errors.
4. Deliver the result.

Also write `<command-name>.botcmd.json` in the current directory, using the `import-format` skill, so the user can paste it into *Import command* in the app.
