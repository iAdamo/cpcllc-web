// Adds the @next/swc-* platform packages missing from package-lock.json.
//
//   node scripts/fill-swc-lockfile.mjs          # report what is missing
//   node scripts/fill-swc-lockfile.mjs --write  # add them from the npm registry
//
// Why: npm writes only the current platform's optional packages when a
// lockfile is made on one machine (npm/cli#4828), so this lockfile, made on
// Windows, had only @next/swc-win32-x64-msvc. `npm ci` on the Linux server
// then has no compiler to install and `next build` fetches one at build
// time. Next tries to patch the lockfile itself, but asks the registry for
// its own version (15.3.8) while the SWC packages are 15.3.5, gets nothing,
// and prints "Failed to patch lockfile ... reading 'os'".
//
// Each entry is what npm itself records: version, resolved tarball,
// integrity, os, cpu, libc and engines from the registry, marked optional.
// Run it after any Next upgrade (lib/swcLockfile.test.ts fails until you do).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LOCK = fileURLToPath(new URL("../package-lock.json", import.meta.url));
const REGISTRY = "https://registry.npmjs.org/";

const raw = readFileSync(LOCK, "utf8");
const lock = JSON.parse(raw);
const next = lock.packages["node_modules/next"];
const wanted = Object.entries(next.optionalDependencies ?? {}).filter(([name]) => name.startsWith("@next/swc-"));
const missing = wanted.filter(([name, version]) => lock.packages[`node_modules/${name}`]?.version !== version);

if (!missing.length) {
  console.log(`All ${wanted.length} @next/swc packages are in the lockfile.`);
  process.exit(0);
}
console.log(`Missing from the lockfile: ${missing.map(([n, v]) => `${n}@${v}`).join(", ")}`);
if (!process.argv.includes("--write")) process.exit(1);

for (const [name, version] of missing) {
  const res = await fetch(`${REGISTRY}${name}/${version}`);
  if (!res.ok) throw new Error(`${name}@${version}: registry answered ${res.status}`);
  const meta = await res.json();
  if (!meta.dist?.tarball || !meta.dist?.integrity) throw new Error(`${name}@${version}: no tarball or integrity`);
  lock.packages[`node_modules/${name}`] = {
    version,
    resolved: meta.dist.tarball,
    integrity: meta.dist.integrity,
    cpu: meta.cpu,
    ...(meta.libc ? { libc: meta.libc } : {}),
    license: meta.license,
    optional: true,
    os: meta.os,
    engines: meta.engines,
  };
  console.log(`added ${name}@${version}`);
}

// npm keeps "packages" sorted by path; keep the file the way npm writes it.
lock.packages = Object.fromEntries(
  Object.entries(lock.packages).sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : a.localeCompare(b, "en"))),
);
const eol = raw.includes("\r\n") ? "\r\n" : "\n";
writeFileSync(LOCK, JSON.stringify(lock, null, 2).replace(/\n/g, eol) + eol);
