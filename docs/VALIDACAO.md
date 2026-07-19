# Relatório de implementação e validação

## Arquitetura

- `public/`: interface, PWA e compartilhamento.
- `server/`: API, banco de perguntas, pontuação e Gemini.
- `test/`: testes determinísticos.
- `legacy/`: ZIP original preservado.

## Limites verdadeiros

- A geração de perguntas por Gemini ainda não é habilitada: o acervo local prepara todas as rodadas. O Gemini é usado apenas para variar o diagnóstico final quando configurado.
- Sessões estão em memória; reiniciar ou escalar o servidor invalida sessões abertas. Redis é recomendado antes de múltiplas instâncias.
- Não houve teste real com uma chave Gemini, porque nenhuma chave foi fornecida.
- O download cria um card Canvas; Web Share compartilha texto e link, não o arquivo PNG diretamente.

## Banco e migrations

Não há banco nem migrations nesta versão. O acervo é versionado no código e nenhuma resposta é persistida.
