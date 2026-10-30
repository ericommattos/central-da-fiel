(async()=>{
 const stamp=document.createElement('p');stamp.className='small';stamp.style.cssText='padding:0 22px;color:#d9bb80';document.querySelector('.topgrid').after(stamp);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function date(v){return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(new Date(v));}
 try{
   let live=true,r;
   try {r=await fetch('/api/sports',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();r=await r.json();if(r.mode!=='api')throw Error();}
   catch{live=false;r=await fetch('data/sports.json').then(x=>{if(!x.ok)throw Error();return x.json()});}
   if(!r.checkedAt || !Number.isFinite(Date.parse(r.checkedAt)))throw Error();
   window.fielSports=r;window.fielSportsFresh=live;
   const age=Date.now()-Date.parse(r.checkedAt);if(live&&age>1200000)live=false;
   stamp.textContent=(live?'Atualização automática · ':'Consulta de arquivo · ')+date(r.checkedAt)+' (Brasília)'+(live?' · Brasileirão masculino':' · Integração automática indisponível');
   const next=document.querySelector('.next');
   if(r.nextMatch&&Date.parse(r.nextMatch.kickoff)>Date.now()){
     const m=r.nextMatch;next.querySelector('.pending').innerHTML='<strong>'+esc(m.home)+' × '+esc(m.away)+'</strong><br>'+esc(date(m.kickoff))+' (Brasília)<br>'+esc(m.venue||'Local não informado')+'<br>'+esc(m.competition);
     next.querySelector('.opponent').textContent=/corinthians/i.test(m.home)?m.away:m.home;
     next.querySelector('.opponent').style.fontSize='16px';
   }else{next.querySelector('.pending').textContent='Próxima partida ainda não confirmada nesta consulta.';next.querySelector('.opponent').textContent='A confirmar';}
   if(r.lastResult){const m=r.lastResult;document.querySelector('.pending-score').textContent=m.home+' '+m.homeScore+' × '+m.awayScore+' '+m.away;document.querySelector('.last .small').textContent=(m.kickoff?date(m.kickoff):m.date)+' · '+(m.competition||'Brasileirão');}
   if(live&&Array.isArray(r.standings)){
     const body=document.querySelector('.standing tbody');body.innerHTML=r.standings.map(t=>'<tr'+(t.isCorinthians?' style="background:#393020;font-weight:bold"':'')+'><td>'+esc(t.position)+'</td><td>'+esc(t.name)+'</td><td>'+esc(t.points)+'</td><td>'+esc(t.played)+'</td></tr>').join('');
     document.querySelector('.standing .small').textContent='Fonte: football-data.org · '+date(r.checkedAt);body.closest('.table').parentElement.style.maxHeight='360px';body.closest('.table').parentElement.style.overflowY='auto';
   }
   window.fielSportsFresh=live;renderSportsDetail();
   if(r.mode==='api')document.querySelectorAll('.next .source-link,.last .source-link').forEach(a=>{a.href='https://www.football-data.org/';a.textContent='Fonte: football-data.org ↗'});
 }catch{stamp.textContent='Não foi possível consultar os dados esportivos. Consulte as fontes oficiais.';}
})();

function renderSportsDetail(){
 const key=location.hash.slice(1),r=window.fielSports,d=document.querySelector('#detail');
 if(!r||!d||!['jogos','calendario','resultados','classificacao'].includes(key))return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=v=>{const n=new Date(v);return Number.isFinite(+n)?new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(n):'Horário a confirmar'};
 const active=window.fielSportsFresh;
 let body='';
 if(key==='classificacao'){
  body=active&&Array.isArray(r.standings)?'<div style="overflow-x:auto"><table class="table"><caption style="text-align:left;padding:15px 0">Brasileirão Série A · Masculino</caption><thead><tr><th scope="col">Pos.</th><th scope="col">Clube</th><th scope="col">Pontos</th><th scope="col">Jogos</th></tr></thead><tbody>'+r.standings.map(t=>'<tr'+(t.isCorinthians?' style="background:#393020;font-weight:bold"':'')+'><td>'+esc(t.position)+'</td><td>'+esc(t.name)+(t.isCorinthians?' ★':'')+'</td><td>'+esc(t.points)+'</td><td>'+esc(t.played)+'</td></tr>').join('')+'</tbody></table></div>':'<p>A classificação atual está indisponível. Não exibimos uma tabela antiga como atual.</p>';
 }else{
  const results=key==='resultados';
  const list=results?(r.results||[r.lastResult].filter(Boolean)):(r.upcoming||[r.nextMatch].filter(Boolean));
  body=list.length?list.map(m=>'<article style="margin:12px 0;padding:20px;border:1px solid #51452f;border-radius:5px"><span class="tag">'+esc(m.competition||'Brasileirão')+(m.round?' · Rodada '+esc(m.round):'')+'</span><h3 style="font:800 28px Barlow Condensed,Arial;margin:14px 0">'+esc(m.home)+(results?' '+esc(m.homeScore)+' × '+esc(m.awayScore)+' ':' × ')+esc(m.away)+'</h3><p>'+esc(fmt(m.kickoff||m.date))+' (Brasília)'+(m.venue?' · '+esc(m.venue):'')+'</p></article>').join(''):'<p>Nenhuma partida confirmada nesta consulta.</p>';
 }
 d.innerHTML='<a class="btn" href="#inicio">← VOLTAR AO INÍCIO</a><h2>'+({jogos:'PRÓXIMOS JOGOS',calendario:'CALENDÁRIO',resultados:'ÚLTIMOS RESULTADOS',classificacao:'CLASSIFICAÇÃO'}[key])+'</h2><div style="display:flex;gap:10px;flex-wrap:wrap;margin:20px 0"><a class="btn" href="#jogos">JOGOS</a><a class="btn" href="#resultados">RESULTADOS</a><a class="btn" href="#classificacao">CLASSIFICAÇÃO</a></div><p>'+(active?'Consulta automática':'Dados de arquivo · atualização automática indisponível')+' · '+esc(fmt(r.checkedAt))+' (Brasília)</p>'+body+'<p><a class="source" href="https://www.football-data.org/" target="_blank" rel="noopener">Dados: football-data.org ↗</a></p><p class="small">Cobertura desta integração: Brasileirão masculino. Datas podem mudar. Futebol feminino e demais competições aguardam integração própria.</p>';
}
window.addEventListener('hashchange',renderSportsDetail);
document.querySelectorAll('.shortcut').forEach(a=>{if(a.textContent.includes('RESULTADOS'))a.href='#resultados'});
