(()=> {
let articles=null,failed=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function card(n){return '<a class="news" href="'+esc(n.url)+'"><img loading="lazy" src="'+esc(n.image)+'" alt="'+esc(n.imageAlt)+'"><div class="copy"><span class="tag">'+esc(n.type)+' · '+esc(n.category)+'</span><h4>'+esc(n.title)+'</h4><p>'+esc(n.summary)+'</p><small>'+esc(n.date.split('-').reverse().join('/'))+' · Ler matéria →</small></div></a>'}
function renderNews(){
 if(!['noticias','brabas'].includes(location.hash.slice(1)))return;
 const detail=document.querySelector('#detail'),female=location.hash==='#brabas';
 detail.innerHTML='<a class="btn" href="#inicio">← VOLTAR AO INÍCIO</a><h2>'+(female?'AS BRABAS':'NOTÍCIAS')+'</h2><p>'+(female?'Futebol feminino com espaço próprio na Central da Fiel.':'Reportagens, análises e informações do Timão, com revisão editorial.')+'</p><form class="news-tools" role="search"><label>Buscar notícias<input name="query" type="search" placeholder="Título ou assunto" autocomplete="off"></label><label>Categoria<select name="category"><option value="">Todas</option><option>Masculino</option><option>As Brabas</option><option>Fiel Torcida</option><option>História</option></select></label></form><p class="news-count" role="status" aria-live="polite"></p><div class="news-results"></div>';
 const form=detail.querySelector('form'),select=form.elements.category;if(female){select.value='As Brabas';select.disabled=true;}
 function filter(){const q=fold(form.elements.query.value.trim()),cat=select.value;const list=(articles||[]).filter(n=>(!cat||n.category===cat)&&fold(n.title+' '+n.summary).includes(q));detail.querySelector('.news-count').textContent=articles?list.length+' matéria(s) publicada(s)':failed?'Consulta indisponível':'Carregando notícias…';detail.querySelector('.news-results').innerHTML=list.length?list.map(card).join(''):'<div class="news-empty">'+(failed?'Não foi possível carregar a lista. Recarregue a página.':articles?(q?'Nenhuma notícia encontrada. Tente outro termo.':'Ainda não há matérias publicadas nesta categoria. Novos textos passam por apuração e aprovação editorial.'):'Aguarde a consulta.')+'</div>';}
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',filter);form.addEventListener('change',filter);filter();
}
window.addEventListener('hashchange',renderNews);renderNews();
fetch('/data/news.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(rows=>{if(!Array.isArray(rows))throw Error();articles=rows.filter(n=>n.status==='published'&&/^\/noticias\/[a-z0-9-]+\/$/.test(n.url)&&typeof n.title==='string');document.querySelector('.newsgrid').innerHTML=articles.slice(0,4).map(card).join('');renderNews()}).catch(()=>{failed=true;renderNews()});
})();