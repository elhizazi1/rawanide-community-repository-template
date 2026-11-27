#!/usr/bin/env node
// Read-only preflight for existing repositories. Never rewrites a published package.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const get=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))
const cfg=get('repo.config.json')
const existing=fs.existsSync(path.join(root,'repository.json'))?get('repository.json'):null
const errors=[]
if(existing && !(existing.id === 'community.example.repository' && (!existing.extensions || existing.extensions.length === 0) && !existing.verification)){
 if(existing.id!==cfg.repository.id) errors.push(`Repository ID mismatch: published=${existing.id}, config=${cfg.repository.id}`)
 if(existing.verification && existing.verification!==cfg.verification) errors.push('Published verification token differs from config')
 for(const e of existing.extensions||[]){
  const id=e.id, version=e.version
  if(!id||!version){errors.push('Published extension lacks id/version');continue}
  const file=path.join(root,'extensions',id,version,`${id}-${version}.r1`)
  if(!fs.existsSync(file)){errors.push(`Missing published package: ${id}@${version}`);continue}
  const buf=fs.readFileSync(file),sha=crypto.createHash('sha256').update(buf).digest('hex')
  if(e.sha256 && e.sha256!==sha)errors.push(`SHA-256 mismatch: ${id}@${version}`)
  if(e.sizeBytes!=null && e.sizeBytes!==buf.length)errors.push(`Size mismatch: ${id}@${version}`)
  const meta=path.join(root,'extensions',id,version,'marketplace.json')
  if(fs.existsSync(meta)){
   const m=get(path.relative(root,meta))
   if(m.id!==id||m.version!==version)errors.push(`Marketplace metadata ID/version mismatch: ${id}@${version}`)
  }
 }
}
if(errors.length){for(const e of errors)console.error('IDENTITY GUARD: '+e);process.exit(1)}
console.log('Identity guard passed (read-only). Published ID, verification and package checks completed.')
