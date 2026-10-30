import {readFileSync,existsSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
export function validatePublished(rows,root){
 const errors=[],ids=new Set(),urls=new Set();
 if(!Array.isArray(rows))return ['Catálogo deve ser uma lista'];
 const base=resolve(root);
 const local=(url)=>{const p=resolve(base,'.'+url);return p.startsWith(base+sep)&&existsSync(p)};
 for(const [i,n] of rows.entries()){
  const label='Item '+(i+1);
  if(!n||typeof n!=='object'){errors.push(label+': formato inválido');continue}
  if(n.status!=='published')errors.push(label+': rascunhos não podem constar no catálogo público');
  for(const k of ['id','title','summary','category','type','date','url','image','imageAlt'])if(typeof n[k]!=='string'||!n[k].trim())errors.push(label+': campo obrigatório '+k);
  if(ids.has(n.id)||urls.has(n.url))errors.push(label+': ID ou URL duplicado');
  ids.add(n.id);urls.add(n.url);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(n.date||'')||!Number.isFinite(Date.parse(n.date)))errors.push(label+': data inválida');
  if(!/^\/noticias\/[a-z0-9-]+\/$/.test(n.url||''))errors.push(label+': URL de notícia inválida');
  else if(!local(n.url+'index.html'))errors.push(label+': página da notícia não existe');
  if(!/^\/assets\/[a-zA-Z0-9._-]+$/.test(n.image||'')||!local(n.image||''))errors.push(label+': imagem local não existe');
  if(Object.keys(n).some(k=>['draft','draftContent','privateNotes','token','secret'].includes(k)))errors.push(label+': campo privado proibido');
 }
 return errors;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
  const errors=validatePublished(JSON.parse(readFileSync('dist/data/news.json','utf8')),'dist');
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
  else console.log('Catálogo publicado e arquivos associados: OK');
 }catch{console.error('Não foi possível validar o catálogo publicado');process.exitCode=1}
}
