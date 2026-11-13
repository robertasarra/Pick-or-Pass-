# Validação — A Vidente Leu Meu Destino

Data: 13/11/2026
Repositório: `robertasarra/Pick-or-Pass-`
Branch analisada: `main`
SHA-base: `393f61d009568c6b0a642baefb8d4a9a82cc5ece`
Estado: implementação local para revisão; sem commit, push, merge ou deploy.

## Escopo implementado

- Quarta experiência independente na landing, sem substituir o Oráculo do Amor.
- Introdução com cena original, névoa, partículas, brilho, movimento leve, opção de pular e áudio desligado inicialmente.
- Consulta com 7–10 perguntas por rodada, três ou quatro alternativas, comentários da vidente, reações visuais e fragmentos a cada três respostas.
- Gemini Flash somente no backend, em uma chamada JSON por rodada, com timeout e validação.
- Banco local aprovado com 30 perguntas para funcionamento integral sem Gemini.
- Sessão temporária assinada; ordem, duplicidade e IDs das respostas são validados no servidor.
- Pontuação e características internas não aparecem no payload público.
- Motor híbrido de 70% compatibilidade e 30% surpresa controlada.
- Galeria local aprovada com 24 personagens adultos fictícios; nenhuma imagem é gerada durante a partida.
- Antirrepetição imediata de personagem.
- Resultado com nome, arquétipo, três características, local genérico, primeiro sinal, previsão, frase e aviso recreativo.
- Cards Canvas vertical 1080×1920 e quadrado 1080×1080, sem respostas privadas.
- Métricas agregadas em memória: partidas iniciadas/concluídas, abandono por pergunta expirada, duração total, personagens, fallback, falhas do Gemini, compartilhamentos e consultas repetidas.
- Cache PWA atualizado com scripts, estilos e ativos do módulo.

## Proteções verificadas

- `GEMINI_API_KEY` continua restrita ao servidor.
- Nenhuma foto, nome real, endereço, escola, telefone, rede social ou localização é solicitado.
- Validador recusa termos invasivos e características fora da lista aprovada.
- Personagem final sempre pertence à galeria local.
- Resultado não usa reconhecimento facial, upload de foto ou pessoa real.
- Reuso ou adulteração do token da rodada retorna erro `400`.
- Rate limiting existente em `/api` também cobre as quatro novas rotas.

## Comandos e resultados

```text
npm ci
Resultado: 155 pacotes instalados.

npm run lint
Resultado: aprovado, zero erros.

npm test
Resultado: 23/23 testes aprovados.

npm run build
Resultado: aprovado; public copiado para dist.
```

Teste real da API sem `GEMINI_API_KEY`:

```text
Perguntas na rodada: 8
Fallback local: aprovado
Personagem da galeria: aprovado
Campos privados no payload: nenhum
Token reutilizado/adulterado: rejeitado com 400
Princeso ou Viking: 10 perguntas, aprovado
```

Validação visual no navegador compartilhado:

- landing abriu com as quatro experiências;
- introdução da Vidente exibiu cena, névoa, partículas, botão Pular e `Som: desligado`;
- consulta chegou ao resultado usando fallback local;
- retrato foi recortado dentro da bola;
- nome, arquétipo, características, previsão, aviso e botões foram exibidos;
- não foram observados erros JavaScript do aplicativo; os únicos logs de erro vieram da extensão do navegador de teste, fora do código da PWA.

## Testes automatizados adicionados

- banco local mínimo de 30 perguntas;
- exatamente 24 personagens ativos e mapeados no atlas;
- rodadas de 7, 8, 9 e 10 perguntas;
- payload sem pesos ou características internas;
- rejeição de pergunta invasiva;
- influência das respostas no arquétipo;
- surpresa incapaz de selecionar personagem incompatível;
- antirrepetição imediata;
- resultado sempre oriundo da galeria;
- card/resultado sem IDs de respostas;
- token assinado e adulteração rejeitada.

## Pendências verdadeiras

- Não houve chamada real ao Gemini nesta sessão porque nenhuma chave foi lida ou exposta; o caminho sem Gemini foi testado de ponta a ponta.
- O teste automatizado com Chromium local foi bloqueado pelo isolamento do executor (`socket() Operation not permitted`). A validação visual foi feita no navegador compartilhado.
- O painel administrativo não foi criado: o repositório não possui painel existente, e a ordem proíbe criar um painel separado.
- Métricas e sessões permanecem em memória, como no restante do aplicativo. Escala com múltiplas instâncias exigirá armazenamento compartilhado.
- A animação é leve e 2D em camadas; uma personagem com mãos e piscadas articuladas de forma independente exigiria ativos rigados adicionais.

## Teste manual simples

1. Execute `npm run dev`.
2. Abra `http://localhost:3000`.
3. Escolha **A Vidente Leu Meu Destino**.
4. Confirme que o som começa desligado e teste ligar/desligar.
5. Teste **Pular introdução** e depois **Começar a consulta**.
6. Responda às 7–10 perguntas e observe as reações da bola.
7. Teste **Pular revelação**.
8. Confira retrato, nome, arquétipo, características e previsão.
9. Baixe os cards vertical e quadrado e confirme que não contêm respostas.
10. Use **Consultar novamente** e confirme que o personagem não se repete imediatamente.
