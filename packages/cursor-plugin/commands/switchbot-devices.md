---
name: switchbot-devices
description: List all SwitchBot devices with name, type, room, and current on/off or sensor status
---

List all SwitchBot devices. For each device show: name, type, room, and current status (on/off, temperature, humidity, or battery as applicable).

1. Use the `list_devices` MCP tool to get the device inventory.
2. Call `get_device_status` for each physical device.
3. Present the result as a concise table.

If MCP tools are unavailable, fall back to `switchbot devices list --json` and `switchbot devices status <id> --json`. Never guess deviceIds.
