# Pick or Pass

Aplicação social mobile-first/PWA com a marca **Pick or Pass** em primeiro plano e quatro experiências integradas:

- **Princeso ou Viking?** — teste ácido com pontuação privada no servidor.
- **Oráculo do Amor** — escolhas guiadas e card ilustrado gerado no navegador.
- **Dilema Diário** — uma escolha por dia e placar comunitário.
- **A Vidente Leu Meu Destino** — consulta recreativa com 7–10 perguntas, vidente animada e galeria local de 24 crushes fictícios.

## Executar

```bash
npm install
cp .env.example .env
npm run dev
```

Acesse `http://localhost:3000`. Sem `GEMINI_API_KEY`, a partida continua com o acervo aprovado e diagnósticos determinísticos.

## Variáveis

- `GEMINI_API_KEY`: chave do Google AI Studio, usada somente no servidor.
- `GEMINI_MODEL`: padrão `gemini-2.5-flash`.
- `GEMINI_IMAGE_MODEL`: padrão `gemini-3.1-flash-image`, usado para o retrato fictício do Oráculo.
- `PORT`: padrão `3000`.
- `SESSION_TTL_MS`: validade da sessão, padrão 30 minutos.

## Segurança

- Sessões de resultado são mantidas no servidor, expiram e só podem ser usadas uma vez.
- O cliente envia apenas IDs; o servidor resolve o gabarito.
- Chave ausente, timeout e erros do Gemini acionam fallback silencioso.
- O retrato do Oráculo é sempre fictício, adulto e recreativo; nunca representa uma pessoa real ou previsão.
- Rate limiting, limite do corpo e cabeçalhos Helmet estão habilitados.
- Nenhuma resposta pessoal é persistida.
- A Vidente usa uma sessão temporária assinada, calcula compatibilidade no servidor e nunca envia pesos ao navegador.
- A galeria da Vidente é local e aprovada; nenhuma imagem é gerada durante a partida.
- O Gemini varia perguntas da Vidente em uma única chamada validada. Sem Gemini, o banco local mantém a experiência completa.

## A Vidente Leu Meu Destino

Rotas do módulo:

- `POST /api/vidente/iniciar`
- `POST /api/vidente/responder`
- `POST /api/vidente/finalizar`
- `POST /api/vidente/compartilhar`

O resultado combina 70% de compatibilidade com as respostas e 30% de surpresa controlada. O sorteio só considera personagens que compartilham pelo menos uma das três características predominantes e evita repetição imediata.

## Validação

```bash
npm run lint
npm test
npm run build
```

O protótipo original recebido está preservado em `legacy/` como referência e rollback visual.

## Deploy

Este projeto precisa de um serviço Node (Render, Railway, Fly.io ou equivalente). GitHub Pages sozinho não executa o backend e não deve receber a chave Gemini. Configure `npm start`, Node 20+ e as variáveis acima.

## Rollback

Reverta o commit da funcionalidade ou publique temporariamente `legacy/` como site estático. A aplicação atual não possui migration nem banco externo.
