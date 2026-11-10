const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const ts = require("typescript");

// Small CommonJS loader for testing pure TypeScript helpers on Node 20.
const cache = new Map();
module.exports = function loadTypeScript(filename) {
  const absolute = path.resolve(filename);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const compiled = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const module = { exports: {} };
  cache.set(absolute, module);
  const normalRequire = createRequire(absolute);
  const requireLocal = (name) => name.startsWith(".")
    ? loadTypeScript(path.resolve(path.dirname(absolute), `${name}.ts`))
    : normalRequire(name);
  vm.runInThisContext(`(function(require,module,exports){${compiled.outputText}\n})`, { filename: absolute })(requireLocal, module, module.exports);
  return module.exports;
};
