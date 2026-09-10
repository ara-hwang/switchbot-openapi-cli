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

  it('declares SWITCHBOT_TOKEN and SWITCHBOT_SECRET variables', () => {
    const required = plugin.variables?.required ?? [];
    assert.ok(required.includes('SWITCHBOT_TOKEN'));
    assert.ok(required.includes('SWITCHBOT_SECRET'));
    assert.ok(plugin.variables?.properties?.SWITCHBOT_TOKEN);
    assert.ok(plugin.variables?.properties?.SWITCHBOT_SECRET);
  });
});

describe('mcp.json', () => {
  it('starts the CLI via npx with interpolated credentials', () => {
    const server = mcp.mcpServers?.switchbot;
    assert.ok(server);
    assert.equal(server.command, 'npx');
    assert.deepEqual(server.args, ['-y', '@switchbot/openapi-cli', 'mcp', 'serve']);
    assert.equal(server.env?.SWITCHBOT_TOKEN, '${SWITCHBOT_TOKEN}');
    assert.equal(server.env?.SWITCHBOT_SECRET, '${SWITCHBOT_SECRET}');
  });
});

describe('repo marketplace.json', () => {
  it('points at packages/cursor-plugin', () => {
    const entry = marketplace.plugins.find((p) => p.name === 'switchbot');
    assert.ok(entry);
    assert.equal(entry.source, './packages/cursor-plugin');
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
