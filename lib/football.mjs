export function normalizeFootball(matches, standings, now = new Date()) {
  if (!Array.isArray(matches?.matches) || !Array.isArray(standings?.standings)) throw new Error('Formato inesperado do provedor');
  const rows = standings.standings.find(x => x.type === 'TOTAL')?.table;
  if (!Array.isArray(rows) || rows.length < 2) throw new Error('Classificação indisponível');
  const club = rows.find(x => /corinthians/i.test(x.team?.name));
  if (!club?.team?.id) throw new Error('Corinthians não localizado');
  const id = club.team.id;
  const games = matches.matches.filter(m => m.homeTeam?.id === id || m.awayTeam?.id === id).sort((a,b) => Date.parse(a.utcDate)-Date.parse(b.utcDate));
  const next = games.find(m => ['SCHEDULED','TIMED'].includes(m.status) && Date.parse(m.utcDate) > +now);
  const last = games.filter(m => m.status === 'FINISHED' && Date.parse(m.utcDate) <= +now).at(-1);
  function match(m) {
    if (!m) return null;
    const result = {home:m.homeTeam.name,away:m.awayTeam.name,kickoff:m.utcDate,competition:m.competition?.name || 'Brasileirão Série A',round:m.matchday ?? null,venue:m.venue ?? null,source:'https://www.football-data.org/'};
    if (m.status === 'FINISHED') {
      if (!Number.isInteger(m.score?.fullTime?.home) || !Number.isInteger(m.score?.fullTime?.away)) throw new Error('Placar inválido');
      result.homeScore=m.score.fullTime.home; result.awayScore=m.score.fullTime.away;
    }
    return result;
  }
  return {checkedAt:now.toISOString(),timezone:'America/Sao_Paulo',mode:'api',scope:'Brasileirão Série A masculino',source:'https://www.football-data.org/',nextMatch:match(next),lastResult:match(last),upcoming:games.filter(m=>['SCHEDULED','TIMED'].includes(m.status)&&Date.parse(m.utcDate)>+now).slice(0,10).map(match),results:games.filter(m=>m.status==='FINISHED'&&Date.parse(m.utcDate)<=+now).slice(-10).reverse().map(match),standings:rows.map(r=>{
    if (!r.team?.name || ![r.position,r.points,r.playedGames].every(Number.isInteger)) throw new Error('Linha de classificação inválida');
    return {position:r.position,name:r.team.name,points:r.points,played:r.playedGames,isCorinthians:r.team.id===id};
  })};
}
