import fs from 'node:fs';
const file = new URL('../repo.config.json', import.meta.url);
const cfg = JSON.parse(fs.readFileSync(file,'utf8'));
const match = process.env.GITHUB_REPOSITORY?.match(/^([\w.-]+)\/([\w.-]+)$/);
if (!match) throw Error('Missing GitHub repository identity');
if (process.env.GITHUB_REPOSITORY === 'elhizazi1/rawanide-community-repository-template') process.exit(0);
if (cfg.owner !== 'YOUR_GITHUB_USERNAME' || cfg.repo !== 'YOUR_REPOSITORY_NAME') { console.log('Already initialized or manually configured; no changes'); process.exit(0); }
const [,owner,repo] = match;
cfg.owner=owner; cfg.repo=repo; cfg.branch=process.env.GITHUB_REF_NAME || 'main';
cfg.hosting ||= {};
cfg.hosting.rawBaseUrl ||= `https://raw.githubusercontent.com/${owner}/${repo}/${cfg.branch}`;
cfg.hosting.repositoryUrl ||= `https://github.com/${owner}/${repo}`;
cfg.hosting.homepageUrl ||= `https://${owner.toLowerCase()}.github.io/${repo}/`;
fs.writeFileSync(file,JSON.stringify(cfg,null,2)+'\n');
