const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("../../lib/project-root");

const projectRoot = findProjectRoot(__dirname);
const marketplacePath = path.join(projectRoot, ".agents", "plugins", "marketplace.json");
const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));

assert.strictEqual(
  marketplace.name,
  "antigravity-awesome-skills",
  "Codex marketplace name should match the repository plugin name",
);
assert.strictEqual(
  marketplace.interface?.displayName,
  "Antigravity Awesome Skills",
  "Codex marketplace display name should be present",
);
assert.ok(Array.isArray(marketplace.plugins), "marketplace.json must define a plugins array");
assert.ok(marketplace.plugins.length > 0, "marketplace.json must contain at least one plugin");

const pluginEntry = marketplace.plugins.find((plugin) => plugin.name === "antigravity-awesome-skills");
assert.ok(pluginEntry, "marketplace.json must include the antigravity-awesome-skills plugin entry");
assert.deepStrictEqual(
  pluginEntry.source,
  {
    source: "local",
    path: "./plugins/antigravity-awesome-skills",
  },
  "Codex plugin entry should resolve to the repo-local plugin directory",
);
assert.strictEqual(
  pluginEntry.policy?.installation,
  "AVAILABLE",
  "Codex plugin entry must include policy.installation",
);
assert.strictEqual(
  pluginEntry.policy?.authentication,
  "ON_INSTALL",
  "Codex plugin entry must include policy.authentication",
);
assert.strictEqual(
  pluginEntry.category,
  "Productivity",
  "Codex plugin entry must include a category",
);

const pluginRoot = path.join(projectRoot, "plugins", "antigravity-awesome-skills");
const pluginManifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const pluginManifest = JSON.parse(fs.readFileSync(pluginManifestPath, "utf8"));

assert.strictEqual(pluginManifest.name, "antigravity-awesome-skills");
assert.strictEqual(pluginManifest.version, "8.10.0");
assert.strictEqual(pluginManifest.skills, "./skills/");

const pluginSkillsPath = path.join(pluginRoot, "skills");
assert.ok(fs.existsSync(pluginSkillsPath), "Codex plugin skills path must exist");
assert.ok(fs.statSync(pluginSkillsPath).isDirectory(), "Codex plugin skills path must be a directory");

console.log("ok");
