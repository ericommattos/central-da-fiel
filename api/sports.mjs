import { normalizeFootball } from '../lib/football.mjs';
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'Método não permitido'});
  const token=process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'Integração esportiva ainda não configurada'});}
  try {
    const responses=await Promise.all(['matches','standings'].map(async resource=>{
      const response=await fetch('https://api.football-data.org/v4/competitions/BSA/'+resource,{headers:{'X-Auth-Token':token},signal:AbortSignal.timeout(8000)});
      if(!response.ok) throw new Error('Provedor indisponível');
      return response.json();
    }));
    const data=normalizeFootball(...responses);
    res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch {res.setHeader('Cache-Control','no-store');return res.status(502).json({error:'Não foi possível atualizar os dados esportivos'});}
}
