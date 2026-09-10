# Cursor network access for SwitchBot

Cursor manages the SwitchBot MCP server process and its network access via
the `mcp.json` file bundled with this plugin (`npx -y @switchbot/openapi-cli mcp serve`).
No extra Cursor MCP config is required once the plugin is enabled.

The Output channel name `mcp-server-plugin-switchbot-switchbot.workspaceId-empty-window`
is Cursor's log id for this plugin MCP. `empty-window` does not mean a workspace is missing.

## If the MCP server fails with Connection closed

Windows often reports:

```text
'switchbot' is not recognized as an internal or external command
```

That means Cursor's PATH does not include a global `switchbot` shim. This plugin
already launches via `npx`. Reload Cursor (MCP: Restart Servers) after enabling it.

1. **Node.js:** `node -v` — should be 18 or later
2. **CLI via npx:** `npx -y @switchbot/openapi-cli --version` — should print `3.7.1` or later
3. **Credentials:** plugin variables `SWITCHBOT_OPENAPI_TOKEN` and `SWITCHBOT_OPENAPI_SECRET` (Cursor prompts on enable; mapped to `SWITCHBOT_TOKEN` / `SWITCHBOT_SECRET` for the CLI)
4. **Network:** outbound HTTPS to `api.switch-bot.com` must be allowed

If credentials are missing, re-enter them in **Cursor Settings → Plugins → SwitchBot**, or:

```bash
npx -y @switchbot/openapi-cli auth login
```

Then reload Cursor (or restart the agent) to restart the MCP server.
