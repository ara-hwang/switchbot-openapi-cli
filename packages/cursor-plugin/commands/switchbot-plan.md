---
name: switchbot-plan
description: Generate an execution plan from natural language (e.g. turn off all lights)
---

Generate a SwitchBot execution plan from the user's intent.

1. Resolve any device names to deviceIds using `list_devices` (alias → exact → prefix → substring → fuzzy).
2. Call `plan_suggest` with the intent and device_ids to generate a plan.
3. Show the generated plan to the user for review. Ask if they want to:
   - Execute it (call `plan_run` with `yes: true`)
   - Execute with dry-run first (call `plan_run` without `yes: true`)
   - Modify it before executing
   - Cancel

Never execute destructive plans without explicit user confirmation. Prefer `--require-approval` / dry-run for lock, unlock, and delete steps.

If MCP tools are unavailable:

```bash
switchbot plan suggest --intent "..." --device <id>
switchbot plan run plan.json --require-approval
```

User input: $ARGUMENTS
