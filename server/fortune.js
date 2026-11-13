import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

export const FORTUNE_TRAITS=['humor','aventura','tranquilidade','criatividade','gentileza','comunicacao','espontaneidade','confiabilidade','curiosidade','atitude','romantismo','inteligencia','sociabilidade','misterio'];
const createdAt='2026-11-13T00:00:00.000Z';
const option=(id,text,traits)=>({id,text,traits});
const q=(id,text,options)=>({id,text,options});

export const FORTUNE_QUESTION_BANK=[
 q('mensagem-22h','Uma mensagem inesperada chega às 22h. Qual faria você sorrir?',[
  option('lembranca','“Vi isso e lembrei de você.”',['gentileza','comunicacao']),option('plano','“Prepare-se. Tenho um plano para amanhã.”',['atitude','aventura']),option('opiniao','“Preciso da sua opinião sobre uma coisa.”',['inteligencia','curiosidade']),option('acordada','“Ainda está acordada? Trouxe um meme e boas intenções.”',['humor','espontaneidade'])]),
 q('quatro-energias','A bola revelou quatro energias. Qual você deixa entrar?',[
  option('rir','Alguém que faz você rir sem fazer você de piada.',['humor','gentileza']),option('paz','Alguém que transmite paz sem virar paisagem.',['tranquilidade','confiabilidade']),option('aventura','Alguém que transforma um passeio em aventura.',['aventura','espontaneidade']),option('atencao','Alguém que realmente presta atenção no que você diz.',['comunicacao','gentileza'])]),
 q('chuva','O destino marcou encontro num dia de chuva. O que salva a noite?',[
  option('conversa','Uma conversa que faz o relógio perder o emprego.',['comunicacao','curiosidade']),option('improviso','Um plano improvisado que, contra todas as estatísticas, dá certo.',['espontaneidade','criatividade']),option('humor','Muito humor quando tudo começa a dar errado.',['humor','tranquilidade']),option('guarda-chuva','Alguém que trouxe o guarda-chuva sem precisar de lembrete.',['confiabilidade','atitude'])]),
 q('segunda-conversa','O que faz alguém merecer uma segunda conversa?',[
  option('escuta','Escutou de verdade — evento raro, ingresso disputado.',['comunicacao','gentileza']),option('risada','Fez você rir e não precisou humilhar ninguém.',['humor','inteligencia']),option('curiosidade','Perguntou algo que não cabia num formulário de cadastro.',['curiosidade','inteligencia']),option('coerencia','Falou bonito e agiu na mesma língua.',['confiabilidade','atitude'])]),
 q('encontro','Seu encontro perfeito começa como?',[
  option('planejado','Planejado, confirmado e sem caça ao endereço.',['confiabilidade','comunicacao']),option('surpresa','Com uma surpresa boa — não um sumiço temático.',['espontaneidade','romantismo']),option('cultural','Com arte, música ou uma exposição que rende assunto.',['criatividade','curiosidade']),option('simples','Com café e zero necessidade de impressionar o algoritmo.',['tranquilidade','gentileza'])]),
 q('tempestade','Quando surge uma tempestade, qual companhia combina com você?',[
  option('danca','Quem dança na chuva e depois ajuda a secar a sala.',['aventura','atitude']),option('abrigo','Quem encontra abrigo sem transformar tudo em drama.',['tranquilidade','confiabilidade']),option('piada','Quem faz uma piada e ainda segura o guarda-chuva.',['humor','gentileza']),option('mapa','Quem consulta o mapa antes de declarar o fim do mundo.',['inteligencia','atitude'])]),
 q('conversa','O que não pode faltar numa boa conversa?',[
  option('humor','Humor com timing e sem plateia sacrificada.',['humor','sociabilidade']),option('curiosidade','Curiosidade que não parece interrogatório policial.',['curiosidade','comunicacao']),option('silencio','Silêncios confortáveis, sem mensagem subliminar.',['tranquilidade','confiabilidade']),option('ideias','Ideias que fazem a sobremesa chegar cedo demais.',['inteligencia','criatividade'])]),
 q('portas','O destino oferece quatro portas. Qual você abre?',[
  option('trilha','A que dá numa trilha com vista e água na mochila.',['aventura','confiabilidade']),option('palco','A que tem música, luz e uma história para contar.',['criatividade','sociabilidade']),option('biblioteca','A que esconde livros, café e um sujeito interessante.',['inteligencia','misterio']),option('jardim','A que leva a um jardim onde ninguém tem pressa.',['tranquilidade','romantismo'])]),
 q('coracao','Seu coração confia primeiro em quê?',[
  option('humor','No humor que alivia, não no que disfarça grosseria.',['humor','gentileza']),option('atitude','Na atitude que dispensa legenda motivacional.',['atitude','confiabilidade']),option('inteligencia','Na inteligência que também sabe dizer “eu não sei”.',['inteligencia','comunicacao']),option('gentileza','Na gentileza que aparece quando ninguém está olhando.',['gentileza','confiabilidade'])]),
 q('domingo','Domingo à tarde. Qual cena ganha aprovação das cartas?',[
  option('cozinha','Cozinhar juntos e sobreviver à opinião sobre o alho.',['gentileza','humor']),option('passeio','Um passeio sem transformar lazer em prova de resistência.',['aventura','tranquilidade']),option('filme','Filme, sofá e acordo diplomático sobre o controle remoto.',['tranquilidade','comunicacao']),option('evento','Um evento escolhido pelos dois — democracia ainda vive.',['sociabilidade','curiosidade'])]),
 q('atraso','Ele vai se atrasar vinte minutos. Qual mensagem passa no teste?',[
  option('aviso','“Vou atrasar vinte minutos. Desculpe. Posso compensar?”',['comunicacao','confiabilidade']),option('foto','Uma foto do trânsito e um plano B real.',['criatividade','atitude']),option('cafe','“Peça um café por minha conta. Estou chegando.”',['gentileza','atitude']),option('honesto','“Calculei mal o tempo. A culpa é minha, não de Mercúrio.”',['humor','confiabilidade'])]),
 q('viagem','Numa viagem, qual talento vale mais?',[
  option('mapa','Ler mapas sem declarar guerra ao aplicativo.',['inteligencia','tranquilidade']),option('improviso','Improvisar quando o museu fecha e ainda salvar o dia.',['criatividade','espontaneidade']),option('mala','Levar o próprio carregador. As cartas aplaudem o básico.',['confiabilidade','atitude']),option('gente','Fazer amizade sem entregar sua biografia ao aeroporto inteiro.',['sociabilidade','humor'])]),
 q('elogio','Qual elogio faz a névoa mudar de cor?',[
  option('ideias','“Gosto do jeito como você pensa.”',['inteligencia','curiosidade']),option('presenca','“Você deixa as coisas mais leves.”',['gentileza','tranquilidade']),option('coragem','“Admiro a forma como você encara a vida.”',['atitude','aventura']),option('risada','“Sua risada melhorou meu dia.”',['humor','romantismo'])]),
 q('plano-furou','O plano furou. O que o crush da profecia faz?',[
  option('alternativa','Propõe uma alternativa antes do terceiro suspiro.',['atitude','criatividade']),option('conversa','Pergunta o que você prefere e realmente espera a resposta.',['comunicacao','gentileza']),option('ri','Ri do caos sem fingir que o problema não existe.',['humor','tranquilidade']),option('resolve','Resolve a parte dele sem abrir chamado no seu nome.',['confiabilidade','atitude'])]),
 q('festa','Numa festa onde você conhece pouca gente, ele…',[
  option('inclui','inclui você na conversa sem virar seu guia turístico.',['sociabilidade','gentileza']),option('dupla','combina um sinal secreto para resgate diplomático.',['humor','comunicacao']),option('explora','convida você a explorar o lugar, sem abandonar o mapa.',['aventura','atitude']),option('observa','fica por perto e entende seu ritmo.',['tranquilidade','curiosidade'])]),
 q('presente','Qual presente simbólico o destino deixaria na mesa?',[
  option('livro','Um livro com uma frase marcada — e sem prova oral depois.',['inteligencia','romantismo']),option('ingresso','Dois ingressos para algo que vocês nunca fizeram.',['aventura','curiosidade']),option('playlist','Uma playlist curta, boa e sem indireta passivo-agressiva.',['criatividade','romantismo']),option('bilhete','Um bilhete engraçado que você guardaria.',['humor','gentileza'])]),
 q('misterio','Que tipo de mistério ainda é aceitável?',[
  option('livro','O final do livro que ele recomendou.',['misterio','inteligencia']),option('surpresa','O lugar de uma surpresa com hora marcada.',['misterio','confiabilidade']),option('talento','Um talento inesperado que surge no karaokê.',['criatividade','sociabilidade']),option('nenhum','Mistério só na série; na relação, legenda ativada.',['comunicacao','atitude'])]),
 q('rotina','Qual gesto simples faz o oráculo exagerar no brilho?',[
  option('lembra','Lembrar do que você contou sem consultar ata.',['gentileza','comunicacao']),option('confirma','Confirmar o encontro antes de você perguntar.',['confiabilidade','atitude']),option('meme','Enviar o meme perfeito no momento exato.',['humor','curiosidade']),option('cafe','Saber seu café e respeitar quando você quer silêncio.',['tranquilidade','gentileza'])]),
 q('decisao','Diante de uma decisão difícil, a melhor energia é…',[
  option('ouve','ouvir os dois lados sem abrir uma CPI.',['comunicacao','inteligencia']),option('age','decidir e assumir as consequências.',['atitude','confiabilidade']),option('inventa','achar uma terceira opção que ninguém viu.',['criatividade','curiosidade']),option('respira','respirar antes de transformar dúvida em temporada.',['tranquilidade','gentileza'])]),
 q('primeiro-sinal','Qual primeiro sinal merece continuação?',[
  option('pergunta','Ele faz uma pergunta e fica para ouvir a resposta.',['comunicacao','curiosidade']),option('horario','Chega no horário sem postar medalha por isso.',['confiabilidade','atitude']),option('riso','Faz a mesa rir sem monopolizar o microfone.',['humor','sociabilidade']),option('cuidado','Percebe um detalhe e cuida sem invadir.',['gentileza','romantismo'])]),
 q('cafe','A cafeteria errou os pedidos. Qual reação faz a bola aprovar?',[option('resolve','Resolve com educação e salva a conversa.',['gentileza','atitude']),option('ri','Transforma o erro em piada sem descontar em ninguém.',['humor','tranquilidade']),option('troca','Propõe trocar os copos e chama o acaso de roteiro.',['espontaneidade','romantismo'])]),
 q('playlist','O destino entregou o controle da música. O que toca?',[option('classico','Uma seleção clássica sem palestra introdutória.',['romantismo','tranquilidade']),option('danca','Algo que transforma a sala numa pista.',['sociabilidade','espontaneidade']),option('descoberta','Uma descoberta que rende conversa.',['criatividade','curiosidade'])]),
 q('livraria','Na livraria, onde o crush da névoa desaparece?',[option('viagem','Nos mapas e relatos de viagem.',['aventura','curiosidade']),option('romance','Nos romances com finais inteligentes.',['romantismo','inteligencia']),option('arte','Nos livros de arte e ideias estranhas.',['criatividade','misterio'])]),
 q('amigos','Seus amigos fazem uma pergunta difícil. Ele…',[option('responde','responde sem abrir um PowerPoint defensivo.',['comunicacao','confiabilidade']),option('brinca','brinca, mas sabe a hora de falar sério.',['humor','inteligencia']),option('escuta','escuta antes de conquistar a banca.',['gentileza','tranquilidade'])]),
 q('museu','No museu, qual comportamento ganha moldura dourada?',[option('olhar','Olhar sem fingir que entendeu a instalação.',['curiosidade','tranquilidade']),option('inventar','Inventar títulos melhores para as obras.',['criatividade','humor']),option('conversar','Perguntar o que você viu antes de dar a tese.',['comunicacao','gentileza'])]),
 q('cozinha','Uma receita começa a dar errado. Qual energia entra em cena?',[option('organiza','Lê a parte ignorada da receita.',['confiabilidade','inteligencia']),option('improvisa','Inventa um prato e dá um nome convincente.',['criatividade','espontaneidade']),option('ri','Pede pizza sem procurar culpados.',['humor','gentileza'])]),
 q('celular','Durante o encontro, o celular dele…',[option('guardado','fica guardado sem prêmio de presença.',['gentileza','comunicacao']),option('mapa','aparece só para achar o próximo lugar.',['aventura','atitude']),option('foto','registra uma foto e volta à conversa.',['criatividade','romantismo'])]),
 q('segunda','Segunda-feira chegou sem delicadeza. Qual mensagem ajuda?',[option('apoio','“Quer desabafar ou quer ajuda?”',['gentileza','comunicacao']),option('plano','“Eu cuido do nosso plano de depois.”',['atitude','confiabilidade']),option('meme','Um meme preciso, receitado pelas estrelas.',['humor','curiosidade'])]),
 q('elevador','Vocês ficam presos no elevador por minutos. Ele…',[option('calma','mantém a calma e chama ajuda.',['tranquilidade','confiabilidade']),option('piada','faz uma piada sem repertório de pânico.',['humor','gentileza']),option('saida','procura soluções sem virar herói de filme ruim.',['inteligencia','atitude'])]),
 q('convite','Chega um convite de última hora. Qual resposta combina?',[option('vamos','“Vamos. Eu organizo como chegar.”',['aventura','atitude']),option('avaliar','“Quero ir. Cabe na nossa energia?”',['comunicacao','gentileza']),option('surpresa','“Tenho uma ideia melhor para essa história.”',['criatividade','espontaneidade'])])
];

const characterSeed=[
 ['theo','Theo','O Guardião da Boa Conversa',['comunicacao','gentileza','curiosidade']],['davi','Davi','O Aventureiro Gentil',['aventura','gentileza','atitude']],['elias','Elias','O Artista das Estrelas',['criatividade','romantismo','curiosidade']],['noah','Noah','O Misterioso que Responde',['misterio','inteligencia','comunicacao']],['kenji','Kenji','O Herói Tranquilo',['tranquilidade','confiabilidade','gentileza']],['gael','Gael','O Leitor de Mapas e Mensagens',['aventura','comunicacao','curiosidade']],
 ['ravi','Ravi','O Aventureiro Organizado',['aventura','atitude','confiabilidade']],['mateo','Mateo','O Engraçado da Profecia',['humor','espontaneidade','gentileza']],['ben','Ben','O Improviso que Confirma',['espontaneidade','criatividade','confiabilidade']],['nilo','Nilo','O Rebelde Responsável',['atitude','criatividade','confiabilidade']],['samir','Samir','O Romântico Discreto',['romantismo','gentileza','misterio']],['caio','Caio','O Crush que Chega no Horário',['confiabilidade','atitude','humor']],
 ['malik','Malik','O Contador de Histórias',['sociabilidade','criatividade','humor']],['tomas','Tomás','O Curioso que Escuta',['curiosidade','comunicacao','inteligencia']],['ian','Ian','O Porto Seguro com Piadas',['tranquilidade','humor','confiabilidade']],['bento','Bento','O Explorador de Cafeterias',['curiosidade','aventura','sociabilidade']],['akio','Akio','O Estrategista Gentil',['inteligencia','gentileza','atitude']],['vicente','Vicente','O Clássico sem Joguinhos',['romantismo','comunicacao','confiabilidade']],
 ['otto','Otto','O Espontâneo com Calendário',['espontaneidade','humor','confiabilidade']],['amir','Amir','O Inventor de Bons Planos',['criatividade','atitude','inteligencia']],['leon','Leon','O Companheiro de Expedição',['aventura','sociabilidade','gentileza']],['hugo','Hugo','O Cavalheiro do Bom Senso',['tranquilidade','inteligencia','confiabilidade']],['milo','Milo','O Charme que Presta Atenção',['romantismo','comunicacao','curiosidade']],['zeca','Zeca','O Sorriso que Traz Guarda-Chuva',['humor','gentileza','atitude']]
];
const defaultPhrases=['Ele faz perguntas e fica para ouvir a resposta. A bola considera isso magia avançada.','Ele combina leveza com presença — raridade que fez as cartas pedirem bis.','Ele sabe transformar intenção em plano sem criar uma reunião para decidir.'];
const defaultPredictions=['Vocês poderão se encontrar quando você estiver procurando outra coisa — provavelmente o carregador do celular.','As cartas apontam para uma conversa simples que vai durar mais que o café.','O destino prevê um encontro sem roteiro perfeito e, surpreendentemente, com horário confirmado.'];
const defaultPlaces=['em uma livraria','em um evento cultural','durante um passeio com amigos','em uma cafeteria','em uma atividade esportiva','em um curso','em uma exposição','por meio de amigos em comum','durante uma viagem','em uma conversa online segura'];

export const FORTUNE_CHARACTERS=characterSeed.map(([id,nomeFicticio,arquetipo,caracteristicasCompativeis],index)=>({
 id,nomeFicticio,imagem:{src:'/assets/fortune-crush-atlas.webp',atlas:{columns:6,rows:4,column:index%6,row:Math.floor(index/6)}},arquetipo,caracteristicasCompativeis,
 paleta:['violeta','dourado','ciano','magenta'][index%4],frasesPossiveis:[...defaultPhrases],previsoesPossiveis:[...defaultPredictions],locaisFicticiosDeEncontro:[...defaultPlaces],status:'active',versao:1,createdAt,updatedAt:createdAt
}));

export const FORTUNE_COMMENTS=[
 'Interessante… a névoa não esperava por essa.','As cartas concordaram. A bola ainda está desconfiada.','Essa resposta fez alguém aparecer na névoa… ou era só falta de sinal?','O destino anotou. Não prometeu concordar.','As estrelas ficaram curiosas.','Vejo atitude… mas ainda há uma pequena neblina de enrolação.','O oráculo percebeu que você não aceita qualquer profecia.','A bola brilhou. Isso costuma ser bom — ou dramaticamente interessante.','Estamos quase lá. Já consigo ver um cabelo… ou talvez seja uma nuvem.','Silêncio! O rosto está começando a aparecer.'
];
export const FORTUNE_REVEALS=['A névoa se abriu… e alguém estava olhando de volta.','As cartas discutiram, mas finalmente chegaram a um acordo.','O destino demorou porque estava escolhendo com cuidado.','A bola de cristal encontrou um rosto.','As estrelas enviaram o perfil. Sem foto no espelho da academia.','O oráculo terminou a busca. Surpreendentemente, ninguém respondeu apenas “kk”.','Seu crush atravessou a névoa e chegou até aqui.','O destino entregou. Agora confira se a profecia combina com você.'];

const unsafe=/(endereço|escola|telefone|whatsapp|cpf|instagram|localização|onde você mora|conteúdo sexual|nudez)/i;
const shuffle=(items,rng=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const hash=text=>createHash('sha256').update(text.toLowerCase()).digest('hex').slice(0,16);

export function validateFortunePackage(payload,count){
 if(!payload||!Array.isArray(payload.questions)||payload.questions.length!==count)throw new Error('Pacote da vidente inválido');
 const seen=new Set();
 return payload.questions.map((question,index)=>{
  if(typeof question.text!=='string'||question.text.length<18||question.text.length>190||unsafe.test(question.text)||seen.has(hash(question.text)))throw new Error('Pergunta da vidente inválida');
  seen.add(hash(question.text));
  if(!Array.isArray(question.options)||question.options.length<3||question.options.length>4)throw new Error('Alternativas da vidente inválidas');
  const options=question.options.map((answer,i)=>{
   if(!answer||typeof answer.text!=='string'||answer.text.length<3||answer.text.length>140||unsafe.test(answer.text)||!Array.isArray(answer.traits)||answer.traits.length<1||answer.traits.length>2||answer.traits.some(t=>!FORTUNE_TRAITS.includes(t)))throw new Error('Alternativa da vidente inválida');
   return option(`ai-${index}-${i}`,answer.text,[...new Set(answer.traits)]);
  });
  return {id:`ai-${hash(question.text)}`,text:question.text,options};
 });
}
export function createFortuneRound({count=7,recentIds=new Set(),rng=Math.random,questions=FORTUNE_QUESTION_BANK}={}){
 if(count<7||count>10)throw new Error('Quantidade de perguntas inválida');
 let pool=questions.filter(question=>!recentIds.has(question.id));if(pool.length<count)pool=questions;
 return shuffle(pool,rng).slice(0,count).map(question=>({...question,roundId:randomUUID(),options:shuffle(question.options,rng)}));
}
export function publicFortuneRound(questions){return questions.map(({roundId,text,options})=>({id:roundId,text,options:options.map(({id,text})=>({id,text}))}));}

export function scoreFortuneRound(questions,answers={}){
 const totals=Object.fromEntries(FORTUNE_TRAITS.map(t=>[t,0]));
 for(const question of questions){const picked=question.options.find(answer=>answer.id===answers[question.roundId]);if(!picked)throw new Error('Resposta inexistente ou ausente');for(const trait of picked.traits)totals[trait]++;}
 return Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([trait])=>trait);
}

export function selectFortuneCharacter({topTraits,characters=FORTUNE_CHARACTERS,recentIds=new Set(),rng=Math.random}){
 const active=characters.filter(c=>c.status==='active'&&!recentIds.has(c.id));const pool=active.length?active:characters.filter(c=>c.status==='active');
 const ranked=pool.map(character=>{const matches=character.caracteristicasCompativeis.filter(t=>topTraits.includes(t)).length;return {character,matches,score:(matches/3)*.7+rng()*.3};}).filter(x=>x.matches>0).sort((a,b)=>b.score-a.score);
 if(!ranked.length)throw new Error('Nenhum personagem compatível');return ranked[0].character;
}

export function buildFortuneResult({questions,answers,recentIds=new Set(),rng=Math.random}){
 const topTraits=scoreFortuneRound(questions,answers),character=selectFortuneCharacter({topTraits,recentIds,rng});const seed=createHash('sha256').update(JSON.stringify(answers)+character.id).digest().readUInt32BE(0);
 const phrase=character.frasesPossiveis[seed%character.frasesPossiveis.length],prediction=character.previsoesPossiveis[(seed>>>3)%character.previsoesPossiveis.length],place=character.locaisFicticiosDeEncontro[(seed>>>5)%character.locaisFicticiosDeEncontro.length],firstSigns=['Ele fará uma pergunta e ficará para ouvir a resposta.','Ele confirmará o plano sem sinal de fumaça.','Ele lembrará de um detalhe e usará isso para fazer você rir.','Ele aparecerá com atitude tranquila — e o próprio carregador.'];
 return {character:{id:character.id,name:character.nomeFicticio,archetype:character.arquetipo,image:character.imagem,palette:character.paleta},traits:topTraits,description:phrase,where:place,firstSign:firstSigns[(seed>>>9)%firstSigns.length],prediction,revealLine:FORTUNE_REVEALS[(seed>>>7)%FORTUNE_REVEALS.length],shareLine:`${character.nomeFicticio} — ${character.arquetipo}. ${prediction}`,disclaimer:'Experiência criada apenas para entretenimento. O resultado não prevê acontecimentos reais.'};
}

export function createRoundSigner(secret=randomBytes(32)){
 const sign=id=>`${id}.${createHmac('sha256',secret).update(id).digest('base64url')}`;
 const verify=token=>{if(typeof token!=='string')return null;const dot=token.lastIndexOf('.');if(dot<1)return null;const id=token.slice(0,dot),expected=Buffer.from(sign(id)),received=Buffer.from(token);return expected.length===received.length&&timingSafeEqual(expected,received)?id:null;};return {sign,verify};
}
