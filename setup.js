(() => {
'use strict';
const form = document.getElementById('form');
const status = document.getElementById('status');
const preview = document.getElementById('avatar-preview');
const fallback = 'assets/developer-avatar.svg';
const fields = ['name','nameAr','repositoryName','repositoryNameAr','description','descriptionAr','avatarUrl','website','github','gitlab','email','defaultLanguage'];
const field = n => form.elements.namedItem(n);
const get = n => field(n).value.trim();
const set = (n,v) => {field(n).value = typeof v === 'string' ? v : '';};
const message = (s,kind='success') => {status.textContent=s;status.dataset.kind=kind;};
const isHttps = v => {try {const u=new URL(v);return u.protocol==='https:' && !!u.hostname && !u.username && !u.password;}catch{return false;}};
const isAsset = v => /^assets\/[a-zA-Z0-9_./-]+$/.test(v) && !v.split('/').includes('..') && !v.includes('//');
const validUrl = (v,asset=false) => !v || isHttps(v) || (asset && isAsset(v));
function validate(d){
  if(!d.name || !d.repositoryName || !d.description) throw Error('يرجى إدخال اسم المطور واسم المستودع ووصفه.');
  for(const k of ['avatarUrl','website','github','gitlab']) if(!validUrl(d[k],k==='avatarUrl')) throw Error('الرابط غير صالح: '+k);
  if(d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) throw Error('البريد الإلكتروني غير صالح.');
}
function apply(d){
  if(!d || d.schemaVersion!==1) throw Error('ملف developer.json غير مدعوم.');
  for(const n of fields){
    const v=n==='nameAr' ? d.i18n?.ar?.developerName : n==='repositoryNameAr' ? d.i18n?.ar?.name : n==='descriptionAr' ? d.i18n?.ar?.description : d[n];
    set(n,v || (n==='defaultLanguage'?'ar':''));
  }
  updatePreview();
}
function updatePreview(){const v=get('avatarUrl');preview.src=validUrl(v,true)&&v?v:fallback;}
preview.addEventListener('error',()=>{if(!preview.src.endsWith('/'+fallback)) preview.src=fallback;});
field('avatarUrl').addEventListener('input',updatePreview);
document.getElementById('export').addEventListener('click',()=>{
 try{
  if(!form.reportValidity())return;
  const d=Object.fromEntries(fields.map(n=>[n,get(n)]));validate(d);
  const output={schemaVersion:1,name:d.name,repositoryName:d.repositoryName,description:d.description,i18n:{ar:{name:d.repositoryNameAr||d.repositoryName,description:d.descriptionAr||d.description}}};
  // Keep developerName optional for backward compatibility with older templates.
  if(d.nameAr) output.i18n.ar.developerName=d.nameAr;
  Object.assign(output,{avatarUrl:d.avatarUrl,website:d.website,github:d.github,gitlab:d.gitlab,email:d.email,defaultLanguage:d.defaultLanguage});
  const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)+'\n'],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='developer.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
  message('تم تصدير developer.json. انقله إلى جذر المستودع ثم شغّل البناء.');
 }catch(e){message(e.message,'error');}
});
document.getElementById('load').addEventListener('click',()=>document.getElementById('file').click());
document.getElementById('file').addEventListener('change',async e=>{
 try{const f=e.target.files?.[0];if(!f)return;const data=JSON.parse(await f.text());apply(data);message('تم استيراد بيانات المطور بنجاح.');}
 catch(err){message('فشل الاستيراد: '+err.message,'error');}
 finally{e.target.value='';}
});
document.getElementById('reset').addEventListener('click',()=>{if(!confirm('هل تريد مسح الحقول الحالية؟'))return;form.reset();fields.forEach(n=>{if(n!=='defaultLanguage')set(n,'');});updatePreview();message('تمت إعادة ضبط الحقول.');});
fetch('developer.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(d)apply(d);}).catch(()=>{message('يمكنك استيراد developer.json يدويًا عند فتح الصفحة محليًا.');});
})();
