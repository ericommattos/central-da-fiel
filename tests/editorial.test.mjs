import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {validatePublished} from '../scripts/validate-published.mjs';
const root=mkdtempSync(join(tmpdir(),'fiel-editorial-'));mkdirSync(join(root,'noticias/teste'),{recursive:true});mkdirSync(join(root,'assets'));writeFileSync(join(root,'noticias/teste/index.html'),'ok');writeFileSync(join(root,'assets/foto.webp'),'ok');
const n={id:'teste',title:'Título',summary:'Resumo',category:'Masculino',type:'Notícia',date:'2026-10-30',url:'/noticias/teste/',image:'/assets/foto.webp',imageAlt:'Fotografia de arquivo',status:'published'};
test('Aceita catálogo com arquivo existente',()=>assert.deepEqual(validatePublished([n],root),[]));
test('Recusa rascunho e campo privado',()=>{assert.ok(validatePublished([{...n,status:'draft',privateNotes:'x'}],root).length>=2)});
test('Recusa página ausente, caminho externo e duplicidade',()=>{assert.ok(validatePublished([{...n,url:'/noticias/ausente/'}],root).length);assert.ok(validatePublished([{...n,image:'/assets/../../secret'}],root).length);assert.ok(validatePublished([n,n],root).length)});
test.after(()=>rmSync(root,{recursive:true,force:true}));
