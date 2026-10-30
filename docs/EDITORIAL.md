# Fluxo editorial — revisão no chat
## Operação
1. Preparar a proposta no chat com título, subtítulo, texto, categoria, fontes com links, data da apuração e indicação dos direitos da imagem.
2. Erico Mattos aprova ou pede correções. A autorização precisa identificar a matéria; mudanças substanciais no texto exigem nova revisão.
3. Somente após aprovação: gerar a página e incluir no catálogo público dist/data/news.json.
4. Executar testes e validação, publicar e verificar URL e resposta.
## Privacidade
Rascunhos e notas de revisão ficam no chat, nunca neste repositório público. O catálogo contém apenas conteúdo já publicado. Não há painel privado nem banco de rascunhos nesta arquitetura.
## Validação
node scripts/validate-published.mjs
node --test tests/*.test.mjs
O validador verifica estado publicado, campos, caminhos locais, duplicidades e existência de arquivos. Não autentica aprovação humana e não detecta todo possível dado sensível: revisão humana continua obrigatória. O build da Vercel deve executar o validador antes de publicar.
## Registro
A matéria Corinthians x Mirassol de 30/10/2026 foi incorporada do pacote integrado autorizado. Novas matérias aguardam autorização específica. Conteúdo esportivo automático é separado da publicação editorial.
