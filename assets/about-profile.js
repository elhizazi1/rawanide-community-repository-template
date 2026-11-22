/* Presentation only. Never writes repository ID, verification, or package metadata. */
(function(){'use strict';
function embedded(){try{var n=document.getElementById('data');return JSON.parse(n.textContent).repository||{}}catch(e){return {}}}
function safeUrl(v){try{var u=new URL(v);return u.protocol==='https:'||u.protocol==='http:'?u.href:null}catch(e){return null}}
function apply(d){var repo=embedded();d=d||{};var name=(d.name||repo.publisher||'Community Developer').trim();
var heading=document.querySelector('[data-i18n="about_name"]');if(heading)heading.textContent=name;
var bio=document.querySelector('[data-i18n="about_bio"]');if(bio)bio.textContent=d.bio||d.description||repo.description||'RawanIDE extension developer.';
var avatar=document.querySelector('[data-profile-avatar]');if(avatar){var path=d.avatarUrl||'assets/developer-avatar.svg';var u=safeUrl(path);if(!u&&/^(?!\/|\.|.*\.\.\/)[a-zA-Z0-9_/-]+\.(svg|png|jpg|jpeg|webp)$/i.test(path))u='../'+path;if(u)avatar.src=u;avatar.alt=name}
var source=safeUrl(repo.repositoryUrl);document.querySelectorAll('[data-profile-source],[data-profile-footer-source]').forEach(function(n){if(source)n.href=source;else n.hidden=true});
['website','github','gitlab','email'].forEach(function(k){var n=document.querySelector('[data-profile-link="'+k+'"]');if(!n)return;var v=d[k];if(!v){n.hidden=true;return}var url=k==='email'?'mailto:'+encodeURIComponent(v):safeUrl(v);if(!url){n.hidden=true;return}n.href=url;n.hidden=false;var t=n.querySelector('[data-profile-value]');if(t)t.textContent=v});
var cr=document.querySelector('[data-profile-copyright]');if(cr)cr.textContent=name;
document.title=name+' · RawanIDE Community';}
function run(){var repo=embedded();apply({name:repo.publisher,description:repo.description});fetch('../developer.json').then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&d.schemaVersion===1)apply(d)}).catch(function(){})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

;(function(){function update(){var node=document.getElementById("data");if(!node)return;try{var u=JSON.parse(node.textContent).repository.repositoryUrl;var url=new URL(u);if(url.protocol!=="https:"||!/^(github|gitlab)\.com$/.test(url.hostname))return;document.querySelectorAll("[data-repository-source-link]").forEach(function(a){a.href=url.href;a.textContent=url.hostname==="gitlab.com"?"GitLab":"GitHub";a.hidden=false})}catch(e){}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",update);else update()})();
