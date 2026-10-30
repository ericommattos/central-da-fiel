# Integração esportiva

API v4 football-data.org. Escopo: Brasileirão Série A masculino (BSA), sem prometer cobertura de Brabas, estaduais ou copas.

Cadastrar conta no provedor e configurar FOOTBALL_DATA_TOKEN nas variáveis de ambiente da Vercel para Preview e Production. Nunca inserir a chave no frontend, repositório ou chat. Reimplantar após configurar. A chave ainda não foi fornecida; não afirmar que automação está ativa.

/api/sports usa duas consultas e cache CDN de 15 minutos, timeout, validação de respostas e erros sem detalhes sensíveis. Limite gratuito documentado: 10 requisições/minuto; tráfego distribuído pode exigir cache persistente ou plano maior. Frontend tenta API e recorre ao snapshot manual com aviso. Classificação antiga não é tratada como atual.

Sites permanece estático: usa o snapshot. Vercel executa a função Node. GitHub contém o código compartilhado; hospedagens não se sincronizam automaticamente.

Fonte e documentação: https://www.football-data.org/coverage e https://docs.football-data.org/general/v4/policies.html
