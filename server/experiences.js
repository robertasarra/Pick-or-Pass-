import { createHash, randomUUID } from 'node:crypto';

const shuffle=(items,rng=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const oracleBank=[
 ['pace','Qual energia você encomenda para o próximo capítulo?',['Calma sem cara de “tanto faz”','Faísca com certificado de responsabilidade','Aventura que sabe usar calendário']],
 ['communication','Qual mensagem faria o Oráculo parar de revirar os olhos?',['“Quero te ver. Que dia funciona?”','“Chegou bem? Me avisa.”','“Vi isso e lembrei de você — e não era cobrança.”']],
 ['partnership','No seu futuro ideal, o bonito da bola de cristal…',['traz o próprio remo e lê o mapa','torce pelas suas conquistas sem abrir competição','aparece também numa terça-feira sem filtro']],
 ['boundary','Qual luxo emocional entra no pacote premium?',['Respeito sem cupom de desconto','Consistência sem caça ao tesouro','Conversa sem defesa de 48 páginas']],
 ['mood','Escolha o primeiro sinal que não exige perícia criminal:',['Café, risada e zero joguinho','Passeio simples que realmente sai do WhatsApp','Um plano com data, hora e existência comprovada']],
 ['symbol','Escolha o símbolo que vai piscar na bola de cristal:',['Sol: clareza, finalmente','Lua: profundidade sem drama em 12 atos','Estrela: surpresa boa, não plot twist tóxico']],
 ['weekend','O sábado perfeito do próximo capítulo tem…',['plano confirmado antes do banho','improviso que não vira sumiço','descanso junto sem obrigação de performance']],
 ['support','Quando sua vida ficar corrida, você quer alguém que…',['pergunte como ajudar','respeite seu espaço sem desaparecer','traga leveza sem minimizar nada']],
 ['humor','Qual tipo de humor combina com sua futura história?',['piada interna que nasce no cotidiano','meme enviado na hora certa','risada que não usa você como alvo']],
 ['conflict','Na primeira discordância, qual milagre básico você escolhe?',['escutar antes de responder','assumir a própria parte sem chamar advogado imaginário','propor solução sem placar de culpa']],
 ['rhythm','Em qual velocidade o romance não capota na curva?',['devagar e consistente','intenso, mas com cinto de conversa clara','natural, sem cronômetro de joguinho']],
 ['surprise','Qual surpresa faria a bola de cristal soltar confete?',['alguém que realmente aparece','um convite com data, hora, local e CEP','uma conversa que simplifica em vez de criar três temporadas']],
 ['routine','Na rotina adulta, qual cena merece close de novela?',['ele lembra do combinado sem tutorial','ele pergunta como foi seu dia e escuta a resposta','ele resolve a parte dele sem abrir chamado no suporte']],
 ['date','O encontro perfeito tem qual tecnologia revolucionária?',['hora marcada e presença física','um lugar escolhido por duas pessoas adultas','confirmação sem você precisar enviar sinal de fumaça']],
 ['initiative','Qual atitude faz o Oráculo tocar uma sirene de esperança?',['propor um plano completo','tomar iniciativa sem pedir medalha','transformar “vamos marcar” em data no calendário']],
 ['consistency','Qual constância parece ficção científica, mas não é?',['responder sem sumir três luas','manter o interesse depois do primeiro episódio','ser gentil também quando não quer impressionar']],
 ['maturity','Na prateleira da maturidade, você escolhe…',['pedido de desculpas com mudança incluída','conversa direta sem caça ao culpado','responsabilidade afetiva com atualização automática']],
 ['goals','Quando você conta um projeto novo, a reação ideal é…',['torcer sem transformar em competição','perguntar como pode apoiar','comemorar sem puxar o assunto para si']],
 ['family','No almoço de família, qual superpoder ajuda mais?',['educação sem atuação indicada ao Oscar','bom humor sem usar ninguém de alvo','saber a hora de ajudar e a hora de respirar']],
 ['travel','Numa viagem, qual sinal evita o documentário do caos?',['divide roteiro e imprevistos','leva documentos e o próprio carregador','não transforma você em agência 24 horas']],
 ['social','Nas redes sociais, o charme adulto é…',['não fazer ciúme como estratégia de marketing','ter vida própria sem desaparecer','conversar em vez de postar indireta em 4K']],
 ['friends','Com seus amigos, o próximo capítulo deveria…',['respeitar seu espaço e se enturmar sem auditoria','ser simpático sem disputar atenção','entender que casal não é prisão domiciliar']],
 ['care','Num dia ruim, qual gesto passa no teste da bola?',['perguntar do que você precisa','oferecer presença sem palestra motivacional','trazer leveza sem diminuir o problema']],
 ['plans','Quando o plano muda, a pessoa ideal…',['avisa antes de você já estar pronta','propõe uma alternativa possível','não culpa Mercúrio por falta de educação']],
 ['money','Ao falar de dinheiro e planos, o clima saudável tem…',['clareza sem interrogatório','limites sem vergonha','decisões compatíveis com a realidade']],
 ['space','Quando alguém pede espaço, qual tradução você prefere?',['uma conversa com prazo e respeito','silêncio combinado, não desaparecimento premium','tempo individual sem castigo emocional']],
 ['affection','Qual demonstração ganha pontos sem virar propaganda?',['carinho coerente com atitudes','atenção aos detalhes sem planilha secreta','presença que não depende de plateia']],
 ['chores','Na vida prática, romance também é…',['notar o que precisa ser feito','dividir tarefas sem gerência externa','não chamar ajuda de “favor especial”']],
 ['trust','A confiança cresce quando existe…',['palavra compatível com atitude','transparência sem invasão de privacidade','segurança que dispensa teste surpresa']],
 ['future','Ao falar do futuro, qual resposta não dá tela azul?',['planos possíveis sem promessas de trailer','curiosidade sobre o que os dois querem','coragem para dizer quando ainda não sabe']]
].map(([id,text,options])=>({id,text,options:options.map((text,i)=>({id:`${id}-${i}`,text}))}));

export function createOracleRound(recentIds=new Set(),rng=Math.random){let pool=oracleBank.filter(q=>!recentIds.has(q.id));if(pool.length<10)pool=oracleBank;return shuffle(pool,rng).slice(0,10).map(q=>({...q,roundId:randomUUID(),options:shuffle(q.options,rng)}));}
export function validateOraclePackage(payload){if(!payload||!Array.isArray(payload.questions)||payload.questions.length!==10)throw new Error('Pacote inválido');const seen=new Set();return payload.questions.map((q,index)=>{if(typeof q.text!=='string'||q.text.length<18||q.text.length>180||seen.has(q.text.toLowerCase()))throw new Error('Pergunta inválida');seen.add(q.text.toLowerCase());if(!Array.isArray(q.options)||q.options.length!==3||q.options.some(x=>typeof x!=='string'||x.length<4||x.length>140))throw new Error('Alternativas inválidas');const id=`ai-${createHash('sha256').update(q.text).digest('hex').slice(0,12)}`;return {id,text:q.text,options:q.options.map((text,i)=>({id:`${id}-${index}-${i}`,text})),roundId:randomUUID()};});}
export function publicOracle(questions){return questions.map(q=>({id:q.roundId,text:q.text,options:q.options}));}
export function oracleResult(questions,answers={}){for(const q of questions)if(!q.options.some(o=>o.id===answers[q.roundId]))throw new Error('Resposta inválida');const chosen=questions.map(q=>answers[q.roundId]);const chosenTexts=questions.map(q=>q.options.find(o=>o.id===answers[q.roundId]).text);const seed=createHash('sha256').update(JSON.stringify(chosen)).digest().readUInt32BE(0);const nouns=['Farol','Cometa','Porto Seguro','Dupla de Expedição','Plot Twist Gentil','Wi-Fi Emocional Estável'];const moods=['Conexão','Encontro','Parceria','Próximo Capítulo','Sinal Verde'];const diagnoses=[
 'Uma presença clara, que não obriga você a interpretar silêncio como mensagem. O futuro ilustrado aponta para reciprocidade e planos que saem do grupo de ideias.',
 'Uma surpresa leve e divertida, com consistência suficiente para não desaparecer depois do brilho inicial. A graça vem acompanhada de responsabilidade.',
 'Um vínculo que cresce nos detalhes: comunicação direta, apoio e tranquilidade sem monotonia. Menos adivinhação, mais atitude.',
 'O próximo capítulo favorece alguém disposto a construir junto, respeitar limites e celebrar suas conquistas sem disputar o protagonismo.'
];const memes=['Alguém aparece com mapa, lanterna e o próprio remo.','O universo manda faísca; você confere se veio com responsabilidade.','Menos borboleta em pânico, mais paz com senso de humor.','Desta vez, o barco chega com dois remos de fábrica.','O futuro respondeu: mínimo esforço não é linguagem do amor.'];return {title:`${moods[seed%moods.length]} ${nouns[(seed>>>3)%nouns.length]}`,diagnosis:diagnoses[(seed>>>5)%diagnoses.length],meme:memes[(seed>>>7)%memes.length],palette:seed%3,seed,profileSummary:chosenTexts.join(' | ').slice(0,900)};}

export const dailyDilemmas=[
 ['truth-friend','Seu melhor amigo traiu o parceiro e pediu segredo.',['conto a verdade para quem está sendo enganado','dou prazo para ele contar antes de eu agir','me afasto até ele resolver','faço uma conversa coletiva digna de final de temporada']],
 ['credit-work','Alguém levou o crédito por uma ideia sua no trabalho.',['corrijo publicamente com fatos','converso em particular e registro tudo depois','mando o histórico no grupo sem legenda','transformo a próxima reunião num documentário com provas']],
 ['phone-found','Você encontra um celular desbloqueado com uma notificação suspeita.',['ignoro o conteúdo e procuro o dono','uso apenas contatos de emergência para devolver','deixo na recepção e saio do roteiro','faço o celular voltar sem virar detetive de série']],
 ['invite-ex','Seu grupo quer convidar o ex de uma amiga para a mesma festa.',['aviso minha amiga antes','peço ao grupo para escolher outra data','crio duas festas e perco a sanidade','deixo os envolvidos decidirem com informação completa']],
 ['money-error','Uma loja devolveu dinheiro a mais no troco.',['volto e devolvo','aviso imediatamente, mesmo já tendo saído','guardo e espero a consciência abrir um chamado','telefono antes que o universo cobre com juros']],
 ['spoiler','Você descobre o final da série que todo o grupo está vendo.',['protejo o segredo como patrimônio histórico','solto pistas vagas e viro ameaça pública','muto o grupo até todos terminarem','finjo amnésia cultural por uma semana']],
 ['queue','Uma pessoa fura uma fila enorme dizendo que é rapidinho.',['aponto o fim da fila com educação','pergunto se existe prioridade real','faço contato visual com a plateia indignada','deixo passar e reclamo no grupo depois']],
 ['group-bill','Na conta do grupo, alguém consumiu o dobro e quer dividir igual.',['proponho dividir pelo consumo','aceito igual para evitar discussão','abro a calculadora e uma audiência pública','pago hoje e nunca mais marco jantar']],
 ['borrowed','Uma amiga pede emprestado algo que nunca devolve.',['empresto com data combinada','digo não e preservo a amizade','entrego com rastreador emocional imaginário','mando a lista das três temporadas anteriores']],
 ['late','A pessoa está quarenta minutos atrasada e não avisou.',['vou embora e aviso com calma','espero mais dez minutos','peço uma prova de vida e um horário real','transformo o encontro em compromisso comigo mesma']]
];
export function todaysDilemma(date=new Date()){const day=Math.floor(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())/86400000),base=dailyDilemmas[day%dailyDilemmas.length],start=day%base[2].length;return {id:`${base[0]}-${day}`,text:base[1],a:base[2][start],b:base[2][(start+1+(day%2))%base[2].length]};}