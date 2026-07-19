import { createHash } from 'node:crypto';

export const oracleQuestions=[
 {id:'pace',text:'Qual energia você quer encontrar no próximo capítulo?',options:[['calm','Calma que não parece desinteresse'],['spark','Faísca com responsabilidade'],['adventure','Aventura com endereço conhecido']]},
 {id:'communication',text:'A mensagem que você gostaria de receber é…',options:[['clear','“Quero te ver. Que dia funciona?”'],['care','“Chegou bem? Me avisa.”'],['fun','“Vi isso e lembrei de você.”']]},
 {id:'partnership',text:'No seu futuro ideal, a pessoa…',options:[['team','divide o remo e o planejamento'],['support','torce pelas suas conquistas'],['presence','aparece também nos dias comuns']]},
 {id:'boundary',text:'Qual luxo emocional não pode faltar?',options:[['respect','Respeito sem negociação'],['consistency','Consistência sem caça ao tesouro'],['dialogue','Conversa sem tribunal']]},
 {id:'mood',text:'Escolha o cenário do primeiro bom sinal:',options:[['coffee','Café, risada e zero joguinho'],['walk','Passeio simples que vira memória'],['event','Um plano inesperado que realmente acontece']]},
 {id:'symbol',text:'Escolha um símbolo para o que vem aí:',options:[['sun','Sol: clareza'],['moon','Lua: profundidade'],['star','Estrela: surpresa boa']]}
];
export function publicOracle(){return oracleQuestions.map(q=>({id:q.id,text:q.text,options:q.options.map(([id,text])=>({id,text}))}));}
export function oracleResult(answers={}){for(const q of oracleQuestions)if(!q.options.some(([id])=>id===answers[q.id]))throw new Error('Resposta inválida');const seed=createHash('sha256').update(JSON.stringify(answers)).digest().readUInt32BE(0);const archetypes=[
 ['Conexão Farol','Uma presença clara, que não obriga você a interpretar silêncio como mensagem. O futuro ilustrado aponta para reciprocidade e planos que saem do grupo de ideias.','Alguém aparece com mapa, lanterna e o próprio remo.'],
 ['Encontro Cometa','Uma surpresa leve e divertida, mas com consistência suficiente para não desaparecer depois do brilho inicial.','O universo manda faísca; você confere se veio com responsabilidade.'],
 ['Parceria Porto Seguro','Um vínculo que cresce nos detalhes: comunicação direta, apoio e tranquilidade sem monotonia.','Menos borboleta em pânico, mais paz com senso de humor.'],
 ['Dupla de Expedição','O próximo capítulo favorece alguém disposto a construir junto, respeitar limites e celebrar suas conquistas.','Desta vez, o barco chega com dois remos de fábrica.']
];const [title,diagnosis,meme]=archetypes[seed%archetypes.length];return {title,diagnosis,meme,palette:seed%3,symbol:answers.symbol,seed};}

export const dailyDilemmas=[
 {id:'truth-friend',text:'Seu melhor amigo traiu o parceiro e pediu segredo. Você…',a:'conta a verdade para quem está sendo enganado',b:'dá prazo para ele contar antes de você agir'},
 {id:'credit-work',text:'Alguém levou o crédito por uma ideia sua no trabalho. Você…',a:'corrige publicamente com fatos',b:'conversa em particular e registra tudo depois'},
 {id:'phone-found',text:'Você encontra um celular desbloqueado e uma notificação muito suspeita aparece. Você…',a:'ignora o conteúdo e procura o dono',b:'usa apenas contatos de emergência para devolver'},
 {id:'invite-ex',text:'Seu grupo quer convidar o ex de uma amiga para a mesma festa. Você…',a:'avisa sua amiga antes',b:'pede ao grupo para escolher outra data'},
 {id:'money-error',text:'Uma loja devolveu dinheiro a mais no seu troco. Você…',a:'volta e devolve',b:'avisa imediatamente, mesmo já tendo saído'}
];
export function todaysDilemma(date=new Date()){const day=Math.floor(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())/86400000);return dailyDilemmas[day%dailyDilemmas.length];}
