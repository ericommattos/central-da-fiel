(async()=>{
 const stamp=document.createElement('p');stamp.className='small';stamp.style.cssText='padding:0 22px;color:#d9bb80';document.querySelector('.topgrid').after(stamp);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function date(v){return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(new Date(v));}
 try{
   let live=true,r;
   try {r=await fetch('/api/sports',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();r=await r.json();if(r.mode!=='api')throw Error();}
   catch{live=false;r=await fetch('data/sports.json').then(x=>{if(!x.ok)throw Error();return x.json()});}
   if(!r.checkedAt || !Number.isFinite(Date.parse(r.checkedAt)))throw Error();
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
   if(r.mode==='api')document.querySelectorAll('.next .source-link,.last .source-link').forEach(a=>{a.href='https://www.football-data.org/';a.textContent='Fonte: football-data.org ↗'});
 }catch{stamp.textContent='Não foi possível consultar os dados esportivos. Consulte as fontes oficiais.';}
})();
