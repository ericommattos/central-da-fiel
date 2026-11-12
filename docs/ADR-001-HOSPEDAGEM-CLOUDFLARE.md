# ADR-001 — Hospedagem da Central da Fiel

Data: 2026-11-12
Status: APROVADA — migração ainda não executada

## Decisão
Adotar Cloudflare como destino de hospedagem do MVP comercial da Central da Fiel, preservando o GitHub como repositório de código e mantendo a Vercel existente intacta até que a nova versão seja implementada, publicada em ambiente de teste e validada.

## Motivos
- Começar com custos mínimos para blog híbrido de notícias e análises.
- Evitar custo recorrente do Vercel Pro antes de validar audiência.
- Manter domínio próprio independente da plataforma.
- Priorizar site estático e conteúdo editorial aprovado, sem login ou banco de dados inicial.

## Infraestrutura existente
- GitHub: https://github.com/ericommattos/central-da-fiel
- Vercel: projeto central-da-fiel da equipe MATTOS; URL https://central-da-fiel.vercel.app/
- Não remover ou alterar a Vercel durante o teste.

## Execução segura
1. Auditar o repositório, a versão 0.7 e a referência visual aprovada.
2. Implementar MVP responsivo e conteúdo verificável no GitHub.
3. Criar projeto Cloudflare conectado ao GitHub, quando houver acesso à conta Cloudflare, em domínio de teste *.pages.dev ou *.workers.dev.
4. Verificar conteúdo, responsividade, HTTPS, compartilhamento, indexação e limites do plano.
5. Só então apontar domínio próprio para Cloudflare e manter rollback documentado.
6. Não registrar/comprar domínios ou contratar plano sem aprovação de preço.

## Restrições e pendências
- Nenhuma conexão Cloudflare disponível neste chat em 2026-11-12. O acesso à conta deverá ser providenciado para executar a migração.
- Nenhuma implantação Cloudflare foi realizada nesta decisão.
- Domínios centraldafiel.com.br e centraldafiel.com ainda não foram comprados.
- Publicação de notícias exige aprovação humana; evitar dados fictícios e imagens sem licença.
