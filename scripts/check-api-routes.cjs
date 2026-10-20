// npm run check:api: every API call the website makes, against the routes
// the API defines (cpcllc-backend controllers). Fails when a call has no
// route or the wrong method. 2026-10-20: six calls had drifted (reviews read
// one review by the business owner's id; a review form, job proposals and
// metrics called routes that no longer exist).
//
//   npm run check:api                       # API checkout at ../cpcllc-backend
//   node scripts/check-api-routes.cjs <api root> <web root>
const fs = require('fs');
const path = require('path');
const apiRoot = process.argv[2] || path.join(__dirname, "..", "..", "cpcllc-backend");
const webRoot = process.argv[3] || path.join(__dirname, "..");

function walk(dir, filter, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

const apiTs = walk(path.join(apiRoot, 'src'), (p) => p.endsWith('.ts'));
function constValue(name) {
  const re = new RegExp('export const ' + name + "\\s*=\\s*['\"`]([^'\"`]+)");
  for (const f of apiTs) {
    const m = fs.readFileSync(f, 'utf8').match(re);
    if (m) return m[1];
  }
  return '{' + name + '}';
}

// ---- API routes. A file may hold several controllers; each @Controller owns
// the routes written after it.
const routes = [];
for (const f of apiTs.filter((p) => p.endsWith('.controller.ts'))) {
  const src = fs.readFileSync(f, 'utf8');
  const parts = src.split(/(?=@Controller\()/).filter((p) => p.startsWith('@Controller('));
  for (const part of parts) {
    let base = '';
    const lit = part.match(/^@Controller\(\s*(?:\{[^}]*?path:\s*)?(['"`])([^'"`]*)\1/);
    const named = part.match(/^@Controller\(\s*(?:\{[^}]*?path:\s*)?([A-Z_][A-Z0-9_]*)/);
    if (lit) base = lit[2];
    else if (named) base = constValue(named[1]);
    const re = /@(Get|Post|Put|Patch|Delete|All)\(\s*(?:(['"`])([^'"`]*)\2)?/g;
    let m;
    while ((m = re.exec(part))) {
      const full = [base, m[3] || '']
        .filter(Boolean)
        .join('/')
        .replace(/\/+/g, '/')
        .replace(/^\/|\/$/g, '');
      routes.push({ method: m[1].toUpperCase(), path: full, file: path.relative(apiRoot, f) });
    }
  }
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toRegex = (p) =>
  new RegExp(
    '^' +
      p
        .split('/')
        .map((seg) => (seg.startsWith(':') ? '[^/]+' : seg === '*path' || seg === '*' ? '.*' : esc(seg)))
        .join('/') +
      '$',
  );
const compiled = routes.map((r) => ({ ...r, re: toRegex(r.path) }));

// ---- Website calls: axiosInstance.<verb>("path" | `path${x}`), with a
// file-level `const base = "..."` resolved.
const calls = [];
const files = walk(webRoot, (p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p));
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  const bc = src.match(/const (base|BASE)\s*=\s*["'`]([^"'`]+)["'`]/);
  if (bc) src = src.split('${' + bc[1] + '}').join(bc[2]);
  const re = /\b(?:axiosInstance|apiClient|http)\.(get|post|put|patch|delete)\s*(?:<[^>]*>)?\(\s*(['"`])([^'"`]+)\2/g;
  let m;
  while ((m = re.exec(src))) {
    const p = m[3]
      .replace(/\$\{[^}]+\}/g, ':x')
      .replace(/\?.*$/, '')
      .replace(/^\/+|\/+$/g, '');
    if (/^https?:/.test(p)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    calls.push({ method: m[1].toUpperCase(), path: p, at: path.relative(webRoot, f) + ':' + line });
  }
}

const missing = [];
const wrongVerb = [];
for (const c of calls) {
  const concrete = c.path.replace(/:x/g, '0123456789abcdef01234567');
  const byPath = compiled.filter((r) => r.re.test(concrete));
  if (!byPath.length) missing.push(c);
  else if (!byPath.some((r) => r.method === c.method || r.method === 'ALL')) {
    wrongVerb.push({ ...c, api: byPath.map((r) => r.method + ' ' + r.path).join(' | ') });
  }
}
console.log('API routes: ' + routes.length + '; website calls: ' + calls.length);
console.log('\n== Website calls with NO matching API route (' + missing.length + ')');
for (const c of missing) console.log(c.method + ' ' + c.path + '   <- ' + c.at);
console.log('\n== Website calls whose path exists with a different verb (' + wrongVerb.length + ')');
for (const c of wrongVerb) console.log(c.method + ' ' + c.path + '   <- ' + c.at + '   (API: ' + c.api + ')');
process.exitCode = missing.length || wrongVerb.length ? 1 : 0;
