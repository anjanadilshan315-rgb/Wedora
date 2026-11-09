const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const { spawnSync } = require("node:child_process");

/** Detect incomplete installs before Next.js shows a browser build error. */
function missingDependencies(manifest, resolvePackage, includeDev) {
  const packages = { ...manifest.dependencies, ...(includeDev ? manifest.devDependencies : {}) };
  return Object.keys(packages).filter((name) => {
    try { resolvePackage(name); return false; }
    catch { return true; }
  });
}

async function checkProject({ root, includeDev, install }) {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 20 || (major === 20 && minor < 9)) throw new Error("This project requires Node.js 20.9 or newer. Update Node.js, then run npm install.");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const projectRequire = createRequire(path.join(root, "package.json"));

  async function inspect() {
    const missing = missingDependencies(manifest, (name) => projectRequire.resolve(name.startsWith("@types/") ? `${name}/package.json` : name), includeDev);
    // libSQL uses platform-specific packages. Check the actual database driver,
    // not just whether its JavaScript entry point exists after copying a project.
    if (!missing.includes("@libsql/client")) {
      let client;
      try {
        client = projectRequire("@libsql/client").createClient({ url: ":memory:" });
        await client.execute("SELECT 1");
      } catch { missing.push("@libsql/client (database driver for this computer)"); }
      finally { if (client) client.close(); }
    }
    return missing;
  }

  let missing = await inspect();
  if (!missing.length) return;
  const repairCommand = "npm install --include=dev --include=optional";
  if (!install) throw new Error(`Missing project dependencies: ${missing.join(", ")}.\nRun ${repairCommand}, then try again.`);
  console.log(`[setup] Missing dependencies: ${missing.join(", ")}`);
  console.log("[setup] Installing the project's dependencies before starting Next.js. Internet access is required.");
  const npmCli = process.env.npm_execpath;
  if (!npmCli || !fs.existsSync(npmCli)) throw new Error(`Run ${repairCommand}, then npm run dev.`);
  const result = spawnSync(process.execPath, [npmCli, "install", "--include=dev", "--include=optional"], {
    cwd: root, stdio: "inherit", windowsHide: true,
  });
  if (result.error || result.status !== 0) throw new Error(`Dependency installation did not finish. Check your internet connection, then run ${repairCommand}.`);
  // A fresh module cache is needed if the first import found an incomplete driver.
  for (const filename of Object.keys(require.cache)) {
    if (filename.includes(`${path.sep}node_modules${path.sep}`)) delete require.cache[filename];
  }
  missing = await inspect();
  if (missing.length) throw new Error(`Dependencies are still incomplete: ${missing.join(", ")}.\nRun npm ci --include=dev --include=optional to reinstall from the lock file. Do not copy node_modules from another computer.`);
  console.log("[setup] Dependencies are ready. Starting the development server.");
}

module.exports = { missingDependencies, checkProject };
if (require.main === module) {
  checkProject({ root: path.resolve(__dirname, ".."), includeDev: process.argv.includes("--dev"), install: process.argv.includes("--install") })
    .catch((error) => { console.error(`\n[setup] ${error.message}\n`); process.exitCode = 1; });
}
