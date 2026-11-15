# Publicação parcial autorizada — 15/11/2026

O responsável autorizou expressamente publicar as correções testadas, mantendo a contagem de visitas desativada e registrando testes em celulares físicos como pendentes. Esta autorização atualiza a condição anterior de bloqueio total; não implica conclusão integral da missão.

## Publicação comprovada

- PR principal: https://github.com/robertasarra/Pick-or-Pass-/pull/7 — merged.
- Commit de merge: 3346991ce6bc5dada8c3f82f7427eb57ccf7c973.
- Render: dep-dbsq13ff3r2c73em4810, live, mesmo commit, deploy automático em main.
- Serviço: srv-d9edfj5aeets73avdrn0, workspace confirmado pelo responsável.
- CI da implementação: Node 20 e 22 aprovados, 40 testes, lint e build.
- Sem alteração de faturamento, credenciais, plano ou domínio. Estatísticas GA4 permanecem desativadas.

A publicação comprova que o código está no Render. Os resultados locais e a instalabilidade Chromium não são comprovação de todos os fluxos em produção ou em aparelhos físicos.

## Correção complementar de dependências

O log de build do Render apontou 7 vulnerabilidades existentes (1 crítica, 5 altas, 1 moderada). npm audit confirmou os alertas. npm audit fix aplicou somente atualizações compatíveis com as faixas já declaradas, sem --force e sem mudança de versões principais:

| Pacote | Antes | Depois |
| --- | --- | --- |
| body-parser | 2.3.0 | 2.4.0 |
| content-type (body-parser) | 2.0.0 | 2.1.0 |
| brace-expansion | 1.1.16 | 1.1.22 |
| ip-address | 10.2.0 | 10.7.6 |
| js-yaml | 4.3.0 | 4.3.2 |
| proxy-addr | 2.0.7 | 2.0.8 |
| qs | 6.15.3 | 6.17.1 |
| zod | 4.4.3 | 4.6.7 |

Após atualização: npm audit = 0 vulnerabilidades reportadas; 40 testes, lint e build aprovados localmente. Resultado bruto: evidence/dependency-audit.json. Isso não constitui garantia de ausência de falhas não conhecidas. A conclusão do PR complementar e seu deploy devem ser comprovados separadamente.

## Verificação adicional móvel

O teste scripts/mobile-check.py executa Chromium/Pixel 5 emulado por padrão. POP_TEST_ENGINES=chromium,webkit permite incluir WebKit quando suas bibliotecas estiverem disponíveis. Foram renderizadas as 30 cenas, gerado PNG para a API de compartilhamento interceptada, confirmado download e verificada ausência de respostas API no cache. Relatório: evidence/mobile-results.json. A folha nativa de compartilhamento foi simulada; nenhuma postagem foi feita.

O WebKit foi baixado, mas sua execução foi bloqueada pela ausência de libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen e libGLESv2. Nenhuma biblioteca do sistema foi alterada. Isso permanece uma limitação do ambiente, não um teste Safari aprovado.

## Pendências mantidas

- Identificar conta/ID real GA4, dados do controlador e canal LGPD; integração e preparação do painel privado existem, mas não há dados reais coletados ou painel configurado na propriedade.
- Validar modelos com a chave real do Render por logs da execução; nenhum segredo foi lido ou alterado.
- Instalação física iOS/Android, compartilhamento nativo em aparelho e preview externo em redes sociais.
- Confirmar conclusão dos quatro fluxos no endereço público e registrar imagens/commit observados. Testes sintéticos não devem ser apresentados como tração de usuários.
- Votos e sessões permanecem voláteis; não existe novo banco ou infraestrutura paga.

A descoberta de contas GA4 utilizou a skill Windsor.ai google-analytics-4; não havia propriedade GA4 conectada. Leitura de logs/deploy seguiu a skill Render render-debug. Nenhuma mensagem foi enviada a terceiros.
