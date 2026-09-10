---
name: switchbot-status
description: Show live status for a specific SwitchBot device (pass device name or ID)
---

Show the current live status for the SwitchBot device the user names.

1. Resolve the device name to a `deviceId` using alias → exact → prefix → substring → fuzzy.
2. If multiple devices match at the same tier, list them and ask the user to pick one. Never pick silently.
3. Call `get_device_status` (or `switchbot devices status <id> --json` if MCP is unavailable).

User input: $ARGUMENTS
