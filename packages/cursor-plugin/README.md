# SwitchBot for Cursor

Control SwitchBot smart-home devices and scenes from [Cursor](https://cursor.com) via the SwitchBot OpenAPI CLI MCP server. The default profile exposes 17 tools (read + action); `--tools all` adds policy, audit, and automation-rule tools (28 total). A skill, always-on safety rule, and slash commands keep device control policy-aware.

This package is **not published to npm**. Cursor loads it from Git (`packages/cursor-plugin`) or from `~/.cursor/plugins/local/switchbot/`.

## Requirements

- Node.js ≥ 18
- [`@switchbot/openapi-cli`](https://www.npmjs.com/package/@switchbot/openapi-cli) ≥ 3.7.1 (via `npx`; a global install is optional)
- Cursor ≥ 3.13

When you enable the plugin, Cursor asks for two secrets:

1. **SwitchBot Open API token**
2. **SwitchBot Open API secret**

Get them in the SwitchBot app: Profile → Preferences → tap **App Version** 10 times → **Developer Options**. Cursor stores them as plugin variables and injects `SWITCHBOT_TOKEN` / `SWITCHBOT_SECRET` into the MCP process.

## Installation (local, from this repo)

From a clone of `switchbot-openapi-cli`:

**Windows (PowerShell)**

```powershell
$src = (Resolve-Path ".\packages\cursor-plugin").Path
$dst = Join-Path $env:USERPROFILE ".cursor\plugins\local\switchbot"
New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
cmd.exe /c mklink /J "$dst" "$src"
```

**macOS / Linux**

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/packages/cursor-plugin" ~/.cursor/plugins/local/switchbot
```

Reload Cursor. If the token/secret form does not appear, disable and re-enable the plugin (or fill **Cursor Settings → Plugins → SwitchBot**).

To expose admin tools, change `mcp.json` args to `["-y", "@switchbot/openapi-cli", "mcp", "serve", "--tools", "all"]` and reload Cursor.

## Components

### Skills

| Skill | Description |
|:------|:------------|
| `switchbot` | Drive the `switchbot` CLI and MCP tools safely: bootstrap, name resolution, safety tiers, policy |

### Rules

| Rule | Description |
|:-----|:------------|
| `switchbot-safety` | Always-on gates: no guessed IDs, confirm destructive actions, never ask for tokens |

### Commands

| Command | Description |
|:--------|:------------|
| `/switchbot-devices` | List devices with name, type, room, and status |
| `/switchbot-status` | Live status for a named device |
| `/switchbot-doctor` | CLI, credentials, MCP, and quota health check |
| `/switchbot-scene` | Run a scene by name (no automatic undo) |
| `/switchbot-plan` | Draft an execution plan from natural language |

### MCP

`mcp.json` starts `npx -y @switchbot/openapi-cli mcp serve` (default 17-tool profile). Token and secret come from plugin `variables` — they are not committed.

## Typical flow

1. Enable the plugin, enter token + secret when prompted, then restart MCP if needed.
2. Ask in chat (skill + safety rule apply) or use a slash command.
3. The agent bootstraps via `account_overview`, resolves names, and respects `policy.yaml` tiers.

## Related packages

- [`@switchbot/openapi-cli`](https://www.npmjs.com/package/@switchbot/openapi-cli) — CLI and MCP server
- [`@switchbot/claude-code-plugin`](https://www.npmjs.com/package/@switchbot/claude-code-plugin) — Claude Code variant
- [`@switchbot/codex-plugin`](https://www.npmjs.com/package/@switchbot/codex-plugin) — OpenAI Codex CLI variant
- [`@switchbot/openclaw-skill`](https://www.npmjs.com/package/@switchbot/openclaw-skill) — OpenClaw / ClawhHub variant

## License

MIT
