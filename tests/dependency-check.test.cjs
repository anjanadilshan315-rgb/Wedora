const test = require("node:test");
const assert = require("node:assert/strict");
const { missingDependencies } = require("../scripts/check-dependencies.cjs");

const manifest = { dependencies: { "@libsql/client": "^0.18.0", next: "16.3.8" }, devDependencies: { typescript: "^5" } };
const resolveFrom = (installed) => (name) => {
  if (!installed.includes(name)) throw new Error("MODULE_NOT_FOUND");
  return `/node_modules/${name}/index.js`;
};

test("a laptop with old dependencies reports the missing database client", () => {
  assert.deepEqual(missingDependencies(manifest, resolveFrom(["next", "typescript"]), true), ["@libsql/client"]);
});
test("a fresh development setup reports all missing packages", () => {
  assert.deepEqual(missingDependencies(manifest, resolveFrom([]), true), ["@libsql/client", "next", "typescript"]);
});
test("production startup does not require development-only packages", () => {
  assert.deepEqual(missingDependencies(manifest, resolveFrom(["@libsql/client", "next"]), false), []);
});
test("a complete installation requires no dependency repair", () => {
  assert.deepEqual(missingDependencies(manifest, resolveFrom(["@libsql/client", "next", "typescript"]), true), []);
});
