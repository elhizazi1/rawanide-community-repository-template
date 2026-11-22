#!/usr/bin/env node
// Offline verification of generated marketplace data and archive integrity.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'repo.config.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'repository.json'), 'utf8'));
const failures = [];
const check = (condition, msg) => { if (!condition) failures.push(msg); };
const files = [];
function scan(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, ent.name);
    if (ent.isDirectory()) scan(file);
    else if (ent.name === 'marketplace.json') files.push(file);
  }
}
scan(path.join(root, 'extensions'));
for (const metaFile of files) {
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const archive = path.join(path.dirname(metaFile), meta.package?.file || `${meta.id}-${meta.version}.r1`);
  check(fs.existsSync(archive), `Missing archive: ${archive}`);
  if (!fs.existsSync(archive)) continue;
  const buffer = fs.readFileSync(archive);
  const sha = crypto.createHash('sha256').update(buffer).digest('hex');
  check(typeof meta.package?.sha256 === 'string' && meta.package.sha256 === sha, `Incorrect or missing SHA-256 in ${metaFile}`);
  check(meta.package?.size === buffer.length, `Incorrect or missing size in ${metaFile}`);
}
check(Array.isArray(config.extensions), 'Missing config extensions array');
check(catalog && typeof catalog === 'object', 'Invalid repository.json');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`PASS: catalog JSON, ${files.length} marketplace records and archive integrity`);
