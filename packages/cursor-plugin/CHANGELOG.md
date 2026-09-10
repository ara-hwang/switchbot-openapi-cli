# Changelog

## 0.1.2

- Prompt for SwitchBot Open API token and secret when enabling the plugin (`variables`), and pass them to MCP as `SWITCHBOT_TOKEN` / `SWITCHBOT_SECRET`.

## 0.1.1

- Launch MCP via `npx -y @switchbot/openapi-cli mcp serve` so Windows Cursor does not depend on a global `switchbot` PATH shim.

## 0.1.0

- Initial Cursor plugin scaffold for SwitchBot smart-home control.
- Added SwitchBot skill (MCP-first bootstrap, safety tiers, policy compliance).
- Registered `switchbot mcp serve` via `mcp.json` (default 17-tool profile).
- Added always-on safety rule for destructive actions and credentials.
- Added slash commands: `/switchbot-devices`, `/switchbot-status`, `/switchbot-doctor`, `/switchbot-scene`, `/switchbot-plan`.
