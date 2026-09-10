import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const plugin = JSON.parse(readFileSync(resolve(root, '.cursor-plugin/plugin.json'), 'utf8'));
const mcp = JSON.parse(readFileSync(resolve(root, 'mcp.json'), 'utf8'));
const marketplace = JSON.parse(
  readFileSync(resolve(root, '../../.cursor-plugin/marketplace.json'), 'utf8'),
);

const PLUGIN_VAR_RE = /\$\{([A-Z][A-Z0-9_]*)\}/g;

function collectPluginPlaceholders(value, out = new Set()) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(PLUGIN_VAR_RE)) {
      out.add(match[1]);
    }
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectPluginPlaceholders(item, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectPluginPlaceholders(item, out);
  }
  return out;
}

describe('Cursor plugin.json', () => {
  it('has kebab-case name', () => {
    assert.match(plugin.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('has semver version', () => {
    assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
  });

  it('declares relative component paths that exist', () => {
    for (const key of ['skills', 'rules', 'commands', 'mcpServers']) {
      const p = plugin[key];
      assert.equal(typeof p, 'string');
      assert.ok(!p.startsWith('/'), `${key} must be relative`);
      assert.ok(!p.includes('..'), `${key} must not traverse parents`);
      assert.ok(existsSync(resolve(root, p)), `${key} path missing: ${p}`);
    }
  });

  it('declares SWITCHBOT_OPENAPI_TOKEN and SWITCHBOT_OPENAPI_SECRET variables', () => {
    const required = plugin.variables?.required ?? [];
    assert.ok(required.includes('SWITCHBOT_OPENAPI_TOKEN'));
    assert.ok(required.includes('SWITCHBOT_OPENAPI_SECRET'));
    assert.ok(plugin.variables?.properties?.SWITCHBOT_OPENAPI_TOKEN);
    assert.ok(plugin.variables?.properties?.SWITCHBOT_OPENAPI_SECRET);
  });
});

describe('mcp.json', () => {
  it('starts the CLI via npx with interpolated credentials', () => {
    const server = mcp.mcpServers?.switchbot;
    assert.ok(server);
    assert.equal(server.command, 'npx');
    assert.deepEqual(server.args, ['-y', '@switchbot/openapi-cli', 'mcp', 'serve']);
    assert.equal(server.env?.SWITCHBOT_TOKEN, '${SWITCHBOT_OPENAPI_TOKEN}');
    assert.equal(server.env?.SWITCHBOT_SECRET, '${SWITCHBOT_OPENAPI_SECRET}');
  });

  it('maps plugin variables to CLI env keys without self-referential placeholders', () => {
    const server = mcp.mcpServers?.switchbot;
    const env = server?.env ?? {};
    for (const [envKey, value] of Object.entries(env)) {
      assert.match(value, /^\$\{[A-Z][A-Z0-9_]*\}$/);
      const placeholder = value.slice(2, -1);
      assert.notEqual(placeholder, envKey, `${envKey} must not reference itself (${value})`);
    }
  });

  it('declares every ${VAR} placeholder from mcp.json in plugin variables', () => {
    const placeholders = collectPluginPlaceholders(mcp);
    const declared = new Set(Object.keys(plugin.variables?.properties ?? {}));
    for (const name of placeholders) {
      assert.ok(declared.has(name), `mcp.json placeholder \${${name}} is missing from plugin.json variables`);
    }
  });
});

describe('repo marketplace.json', () => {
  it('points at packages/cursor-plugin', () => {
    const entry = marketplace.plugins.find((p) => p.name === 'switchbot');
    assert.ok(entry);
    assert.equal(entry.source, './packages/cursor-plugin');
    assert.equal(entry.version, plugin.version);
    assert.ok(existsSync(resolve(root, '../../', entry.source, '.cursor-plugin/plugin.json')));
  });
});

describe('component frontmatter', () => {
  it('skill has name and description', () => {
    const text = readFileSync(resolve(root, 'skills/switchbot/SKILL.md'), 'utf8');
    assert.match(text, /^---\r?\nname: switchbot\r?\n/);
    assert.match(text, /\ndescription: /);
  });

  it('rule has description and alwaysApply', () => {
    const text = readFileSync(resolve(root, 'rules/switchbot-safety.mdc'), 'utf8');
    assert.match(text, /\ndescription: /);
    assert.match(text, /\nalwaysApply: true\r?\n/);
  });

  it('commands have name and description', () => {
    const names = [
      'switchbot-devices',
      'switchbot-status',
      'switchbot-doctor',
      'switchbot-scene',
      'switchbot-plan',
    ];
    for (const name of names) {
      const text = readFileSync(resolve(root, `commands/${name}.md`), 'utf8');
      assert.match(text, new RegExp(`^---\\r?\\nname: ${name}\\r?\\n`));
      assert.match(text, /\ndescription: /);
    }
  });
});
