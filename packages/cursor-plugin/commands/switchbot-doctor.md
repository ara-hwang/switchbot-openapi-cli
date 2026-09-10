---
name: switchbot-doctor
description: Check SwitchBot integration health — CLI version, credentials, MCP server, quota
---

Run a health check on the SwitchBot integration.

1. Execute `switchbot doctor --json`.
2. Parse the output and report: CLI version, credential status, MCP server status, and quota usage.
3. Flag any failures with remediation hints.

If the CLI is not found, instruct the user to run:

```bash
npm install -g @switchbot/openapi-cli
```

Do not run `switchbot doctor --fix --yes` unless the user asked for it.
