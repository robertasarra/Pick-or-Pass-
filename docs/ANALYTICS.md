# Tração, privacidade e painel administrativo

A integração está desabilitada até configurar um GA4_MEASUREMENT_ID real. Não há identificador fictício de produção. Sem consentimento, não são carregados SDK, cookies ou eventos do GA4. O jogo permanece disponível. Revogação interrompe eventos e remove cookies próprios _ga acessíveis ao aplicativo.

## Ativação e governança

Antes de ativar, o responsável deve preencher a identificação do controlador e canal de direitos na política pública, definir retenção no GA4 (recomendação operacional: 2 meses), confirmar contratos e transferência internacional e avaliar consentimento aplicável com assessoria responsável. O texto fornecido não constitui certificação jurídica. Não ativar Google Signals, personalização de anúncios ou coleta de dados fornecidos pelo usuário. Desabilitar medição otimizada de formulários/URLs com parâmetros na propriedade. Configurar acesso com contas Google individuais e MFA, mínimo privilégio; não adicionar senha fixa nem endpoint público de relatórios.

O painel administrativo preparado será uma exploração privada na propriedade GA4 existente: acesso por identidade Google, sem infraestrutura adicional ou contratação. O ID e o acesso à propriedade não foram fornecidos; portanto a criação na propriedade e dados reais estão pendentes. Nenhuma contagem é simulada.

## Contrato de eventos

| Evento | Gatilho e parâmetros permitidos |
| --- | --- |
| page_view | consentimento + ID válido; URL sem query/hash e referenciador reduzido ao domínio |
| game_start | API de início retorna sucesso; game=pv/oracle/vidente |
| game_complete | API de resultado retorna sucesso; game=pv/oracle/vidente/daily |
| pv_result | imagem carregada e resultado PV pronto; category=viking/princeso/intermediate |
| share_action | botão de compartilhar acionado; mede intenção, não postagem efetiva |
| card_download | navegador recebeu comando de download; não comprova gravação final no dispositivo |
| pwa_install | evento appinstalled do navegador; não cobre todas as instalações, sobretudo iOS |
| pwa_launch | execução em display-mode standalone com consentimento já ativo |

Não enviar IDs de perguntas, respostas, sessão de jogo, prompts, diagnósticos, nome, contato ou texto compartilhado ao analytics. Bloqueadores e recusa reduzem cobertura; comparações devem mencionar essa limitação.

## Preparação do painel privado GA4

Criar exploração “Pick or Pass — Tração”, disponível somente a usuários autorizados da propriedade. Filtro por data e comparação com período anterior de mesma duração. Registrar dimensões personalizadas game e category, escopo evento. Não publicar exportações com dados identificáveis.

| Indicador | Definição e limite |
| --- | --- |
| Visitantes estimados | Total users; navegadores/cookies estimados, não pessoas ou contas |
| Ativos | Active users conforme definição GA4 |
| Novos visitantes | New users / first_visit |
| Retorno | Returning users e percentual sobre total; não subtrair novos de ativos |
| Jogadores | Usuários distintos com game_start; daily é reportado separadamente |
| Iniciadas/concluídas | Event count de game_start/game_complete por game; excluir daily da taxa |
| Conclusão | Concluídas/iniciadas por jogo e período; limites de janela podem distorcer; para funil usar exploração de sequência na mesma sessão |
| Viking/Princeso/intermediário | Event count de pv_result por category; não inferir por título |
| Compartilhamentos/downloads | share_action/card_download; distinguir acionamento de sucesso externo |
| Origem | Session source/medium, domínio de referência; sem armazenar UTM ou texto livre nesta versão |
| Instalações observadas | pwa_install; pwa_launch é lançamento, não nova instalação |
| Contas cadastradas | Não aplicável: não existe cadastro |

Abas: visão geral; funil por jogo; categorias PV; aquisição e retorno; compartilhamentos e PWA. Crescimento: (atual-anterior)/anterior; se anterior=0, mostrar “sem base de comparação”, nunca infinito ou crescimento inventado.

GA4 padrão não exige contratação de infraestrutura pelo aplicativo. Nenhum serviço pago foi contratado ou habilitado. Não existe armazenamento durável próprio para métricas; os contadores antigos da Vidente e votos do Dilema estão em memória e reiniciam com o processo, portanto não são fonte histórica de tração. Nunca apresentar esses contadores como usuários reais acumulados.
