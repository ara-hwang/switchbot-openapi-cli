---
name: switchbot-scene
description: Execute a SwitchBot scene by name
---

Execute the SwitchBot scene the user names.

1. Call `list_scenes` to get available scenes.
2. Find the one matching the user's input (exact name, then substring).
3. If multiple scenes match, confirm with the user before executing.
4. Use the `run_scene` MCP tool to execute.
5. Report the result and note that scene execution is one-way — there is no automatic undo.

If MCP tools are unavailable, fall back to `switchbot scenes list --json` and `switchbot scenes run <id>`.

User input: $ARGUMENTS
