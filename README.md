# Pick or Pass

Aplicação social mobile-first/PWA com a marca **Pick or Pass** em primeiro plano e três experiências integradas:

- **Princeso ou Viking?** — teste ácido com pontuação privada no servidor.
- **Oráculo do Amor** — escolhas guiadas e card ilustrado gerado no navegador.
- **Dilema Diário** — uma escolha por dia e placar comunitário.

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
- `GEMINI_IMAGE_MODEL`: padrão `gemini-2.5-flash-image`, usado para o retrato fictício do Oráculo.
- `PORT`: padrão `3000`.
- `SESSION_TTL_MS`: validade da sessão, padrão 30 minutos.

## Segurança

- Sessões de resultado são mantidas no servidor, expiram e só podem ser usadas uma vez.
- O cliente envia apenas IDs; o servidor resolve o gabarito.
- Chave ausente, timeout e erros do Gemini acionam fallback silencioso.
- O retrato do Oráculo é sempre fictício, adulto e recreativo; nunca representa uma pessoa real ou previsão.
- Rate limiting, limite do corpo e cabeçalhos Helmet estão habilitados.
- Nenhuma resposta pessoal é persistida.

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
