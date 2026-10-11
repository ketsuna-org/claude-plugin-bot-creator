---
description: Search the Bot Creator documentation (BDFD functions, Blocks actions, JavaScript API)
argument-hint: "<function, action or topic> [bdfd|blocks|javascript|general]"
---

Answer from the official Bot Creator documentation: $ARGUMENTS

1. Call `search_docs` on the bot-creator MCP server. If the user named a mode, pass it as `api_type`.
2. Open the best match with `get_doc`. Use `full_markdown: true` only when the user needs the guide or examples, not just the signature.
3. Answer briefly, in the user's language:
   - the signature or params;
   - what it returns;
   - one minimal example;
   - the doc slug: https://bot-creator.fr/docs/<slug>/

If nothing matches, say so and suggest the closest results. Never invent a function.
