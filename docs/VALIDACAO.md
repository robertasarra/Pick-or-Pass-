# Relatório de implementação e validação

## Arquitetura

- `public/`: interface, PWA e compartilhamento.
- `server/`: API, banco de perguntas, pontuação e Gemini.
- `test/`: testes determinísticos.
- `legacy/`: ZIP original preservado.

## Experiências da landing v3

- Logo Pick or Pass em evidência na entrada.
- Três rotas de experiência no mesmo aplicativo: Princeso ou Viking, Oráculo do Amor e Dilema Diário.
- Cards compartilháveis não expõem respostas privadas.
- Oráculo produz composição ilustrada em Canvas a partir das escolhas e inclui aviso de entretenimento.

## Regras de variação recreativa

- Princeso ou Viking embaralha alternativas, evita a rodada anterior e volta ao acervo completo sem esgotar o fallback.
- Oráculo sorteia 6 entre 12 perguntas, embaralha as alternativas e evita repetir a rodada imediatamente anterior.
- Diagnósticos do Oráculo combinam títulos, textos e memes a partir das escolhas.
- Dilema Diário muda pergunta e alternativas conforme a data.
- Resultado exatamente 100% Princeso recebe a chancela `FOGE BINO QUE E ROUBADA` no resultado e no card baixável.

## Limites verdadeiros

- A geração de perguntas por Gemini ainda não é habilitada: o acervo local prepara todas as rodadas. O Gemini é usado apenas para variar o diagnóstico final quando configurado.
- Sessões estão em memória; reiniciar ou escalar o servidor invalida sessões abertas. Redis é recomendado antes de múltiplas instâncias.
- Não houve teste real com uma chave Gemini, porque nenhuma chave foi fornecida.
- O download cria um card Canvas; Web Share compartilha texto e link, não o arquivo PNG diretamente.

## Banco e migrations

Não há banco nem migrations nesta versão. O acervo é versionado no código e nenhuma resposta é persistida.
