import { createHash, randomUUID } from 'node:crypto';

export const AXES=['iniciativa','comunicacao','consistencia','reciprocidade','responsabilidade','coragem_emocional','parceria','resolucao_conflitos'];
const scenarios=[
['iniciativa','Quando chega a hora de marcar o encontro','propõe opções, combina o horário e confirma tudo','ajuda a decidir e cumpre o combinado','responde “você que sabe” até você virar produtora do evento','espera lugar, horário, transporte e talvez um lembrete com desenho'],
['comunicacao','Quando você pergunta se está tudo bem','fala com clareza, sem transformar conversa em caça ao tesouro','explica o que sente e também escuta','manda “de boa” e inicia uma temporada inteira de silêncio','responde com um emoji e espera que você consulte um oráculo'],
['consistencia','Depois de uma semana muito carinhosa','mantém presença e coerência sem sumir no mapa','continua demonstrando interesse com atitudes','desaparece como se o afeto tivesse teste grátis de sete dias','volta três semanas depois com um “e aí, sumida?” histórico'],
['reciprocidade','Quando você faz um esforço importante pela relação','reconhece e retribui sem precisar de tutorial','divide o cuidado porque parceria não é trabalho solo','aceita tudo como benefício vitalício do plano premium','agradece com um coração e renova sua assinatura de esforço'],
['responsabilidade','Quando ele comete um erro','reconhece, pede desculpas e muda a atitude','assume a parte dele sem montar tribunal','explica por 48 páginas como a culpa chegou até você','pede desculpa pelo que você “entendeu errado”'],
['coragem_emocional','Quando a conversa fica desconfortável','permanece presente e conversa com respeito','encara o assunto sem atacar nem fugir','precisa de espaço até o problema vencer por abandono','ativa o modo avião emocional por tempo indeterminado'],
['parceria','Quando você conquista algo importante','comemora de verdade e pergunta como apoiar','fica feliz sem competir com o seu brilho','muda de assunto porque seu sucesso afetou o protagonismo dele','elogia por três segundos e começa uma palestra sobre si mesmo'],
['resolucao_conflitos','Quando surge um conflito','procura uma solução justa para os dois','ouve, negocia e combina mudanças concretas','coleciona argumentos antigos como cartas raras','declara empate técnico e não resolve absolutamente nada'],
['iniciativa','Quando vocês falam em fazer uma viagem','pesquisa junto, divide decisões e executa sua parte','transforma a ideia em plano compartilhado','diz “vamos vendo” até as passagens virarem relíquia','leva entusiasmo, mas esquece agenda, reserva e existência do calendário'],
['comunicacao','Quando os planos precisam mudar','avisa cedo, explica e propõe alternativa','comunica com consideração pelo seu tempo','some no horário e reaparece com “foi mal, correria”','avisa depois, como narrador de um evento já encerrado'],
];
const intros=['No primeiro mês:','Numa terça-feira comum:','Quando ninguém está cobrando:','Na vida real, sem filtro:'];
export const APPROVED_BANK=scenarios.flatMap((s,si)=>intros.map((intro,vi)=>makeQuestion(s,si,vi,intro)));
function makeQuestion([axis,stem,v1,v2,p1,p2],si,vi,intro){
 const choices=[['v1',v1,'VIKING',2],['p1',p1,'PRINCESO',2],['v2',v2,'VIKING',1],['p2',p2,'PRINCESO',1]].map(([suffix,text,category,intensity])=>({id:`q${si}-${vi}-${suffix}`,text,category,intensity,scores:{[axis]:category==='VIKING'?intensity:-intensity}}));
 const text=`${intro} ${stem}, ele…`; return {id:`fallback-${si}-${vi}`,text,axis,choices,hash:createHash('sha256').update(text.toLowerCase()).digest('hex'),promptVersion:'pv-1.0'};
}
export function publicQuestion(q){return {id:q.id,text:q.text,axis:q.axis,alternatives:q.choices.map(({id,text})=>({id,text}))};}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createFallbackRound(recent=new Set(),rng=Math.random){const pool=shuffle(APPROVED_BANK.filter(q=>!recent.has(q.hash)),rng);const selected=[];for(const axis of AXES){const q=pool.find(x=>x.axis===axis&&!selected.includes(x));if(q)selected.push(q);}for(const q of pool){if(selected.length===10)break;if(!selected.includes(q))selected.push(q);}return selected.map(q=>({...q,id:randomUUID(),choices:shuffle(q.choices,rng)}));}
