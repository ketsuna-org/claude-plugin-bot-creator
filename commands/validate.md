---
description: Validate a Bot Creator command file or Blocks actions JSON and fix the errors
argument-hint: "<path/to/command.botcmd.json>"
---

Validate the Bot Creator command in: $ARGUMENTS

1. Read the file. It can be any of these:
   - a `bot_creator_command` envelope (see the `import-format` skill);
   - a `data` object;
   - a raw array of Blocks actions.
2. Check the envelope fields against the `import-format` skill: `type`, `commandType`, `contexts`, `integrationTypes`, option types and option names.
3. If `executionMode` is `workflow` or absent, run the `validate_actions` tool of the bot-creator MCP server on these:
   - `data.actions`;
   - each `data.subcommandWorkflows.<route>.actions`.
4. For `bdfd_script` and `javascript`, review the script against the ground-truth rules of the `author-command` skill. Check every function you are unsure of with `get_doc`.
5. List the problems. Then propose the corrected file, and write it only if the user agrees.
