const endpoint=(model,key)=>`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
const FALLBACK_TEXT_MODEL='gemini-2.5-flash',FALLBACK_IMAGE_MODEL='gemini-2.5-flash-image';
const modelsFor=(envName,fallback)=>[...new Set([process.env[envName]||fallback,fallback])];
async function geminiRequest(model,body,timeout){const key=process.env.GEMINI_API_KEY;if(!key)throw new Error('Gemini indisponível');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);try{const res=await fetch(endpoint(model,key),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:controller.signal});if(!res.ok)throw new Error(`Gemini HTTP ${res.status}`);return await res.json();}finally{clearTimeout(timer);}}
async function withModelFallback(models,run){let lastError;for(const model of models)try{return await run(model);}catch(error){lastError=error;if(!/HTTP (404|400)/.test(error.message))throw error;console.info(`Modelo ${model} indisponível, tentando alternativa:`,error.message);}throw lastError;}
export async function callGemini(prompt,{timeout=8000}={}){return withModelFallback(modelsFor('GEMINI_MODEL',FALLBACK_TEXT_MODEL),async model=>{const json=await geminiRequest(model,{contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:.9}},timeout);return JSON.parse(json.candidates?.[0]?.content?.parts?.[0]?.text||'{}');});}
async function generateImage(prompt,timeout){return withModelFallback(modelsFor('GEMINI_IMAGE_MODEL',FALLBACK_IMAGE_MODEL),async model=>{const json=await geminiRequest(model,{contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE','TEXT']}},timeout);const part=json.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.data);if(!part)throw new Error('Imagem ausente');return `data:${part.inlineData.mimeType||'image/png'};base64,${part.inlineData.data}`;});}
const pick=list=>list[Math.floor(Math.random()*list.length)];
const portraitLooks=['cabelo preto curto e barba cheia bem cuidada','cabelo castanho ondulado e barba rala','cabelo loiro médio e barba aparada','cabelo cacheado volumoso e rosto sem barba','cabeça raspada e barba desenhada','cabelo ruivo acobreado e barba curta','cabelo grisalho charmoso e barba grisalha curta','cabelo castanho liso penteado para trás e cavanhaque'];
const portraitOutfits=['camisa social azul-marinho aberta sobre camiseta branca','suéter de tricô cor mostarda','jaqueta jeans sobre camiseta clara','blazer casual cinza com camiseta preta','camisa de linho clara','camisa polo verde-escura'];
const portraitScenes=['uma rua urbana com prédios desfocados','uma orla de praia no fim de tarde','um café aconchegante com luzes quentes','um parque arborizado','uma cidade histórica com um ônibus vermelho desfocado ao fundo','uma marina com barcos desfocados ao fundo'];
export async function generateOraclePortrait(profile,{timeout=25_000}={}){const prompt=`Fotografia de retrato realista, enquadramento quadrado do busto com o rosto centralizado, de um homem adulto fictício e inexistente, com aparência claramente entre 28 e 45 anos, sorrindo simpático para a câmera, com ${pick(portraitLooks)}, vestindo ${pick(portraitOutfits)}, em ${pick(portraitScenes)}, luz natural suave e fundo desfocado. Variação ${profile.seed%997}. A pessoa é 100% gerada por IA. Não retrate pessoa real, celebridade, texto, marca, logotipo, nudez, erotização, uniforme, estereótipo cultural ou aparência de menor de idade.`;return generateImage(prompt,timeout);}
const sceneDirections = [
  'Na água, use a distribuição dos remos para mostrar quem assume o esforço.',
  'Num porto de aventura, use o embarque e a bagagem para mostrar quem toma a iniciativa.',
  'Numa estrada de fantasia, use uma carruagem atolada para mostrar como a dupla reage ao imprevisto.',
  'Num banquete medieval, use os preparativos para mostrar quem divide as tarefas.',
  'Durante uma expedição, use um mapa molhado e a busca por abrigo para mostrar quem resolve o problema.',
  'Num cais sob chuva, use a montagem de uma barraca para mostrar como a dupla se organiza.',
];
const lastPvDirection = new Map();

export function buildPvScenePrompt(result) {
  const { title, diagnosis, verdict, shareLine, vikingPercent, princesoPercent } = result;
  const tier = princesoPercent === 100 ? 0 : vikingPercent >= 75 ? 3 : vikingPercent >= 50 ? 2 : 1;
  const behaviors = [
    'Ela faz todo o trabalho enquanto ele aproveita o passeio como hóspede VIP.',
    'Ela carrega a maior parte do trabalho enquanto ele dá palpites ou oferece ajuda decorativa.',
    'Mostre uma ajuda real dele e um vacilo visível na mesma cena.',
    'Mostre os dois contribuindo de verdade, com humor na situação e cumplicidade entre eles.',
  ];
  const previous = lastPvDirection.get(tier);
  const direction = pick(sceneDirections.filter(scene => scene !== previous));
  lastPvDirection.set(tier, direction);

  return [
    'Crie uma fotografia realista horizontal para o resultado do jogo de humor adulto Princeso ou Viking. Estética de filme de aventura épica, com uma piada visual ácida e legível em tela pequena.',
    'Os dados abaixo descrevem o resultado. Use-os como referência narrativa.',
    JSON.stringify({ title, diagnosis, verdict, shareLine, vikingPercent, princesoPercent }),
    behaviors[tier],
    direction,
    'Traduza a ironia específica do diagnóstico em ações e objetos visíveis. Use expressões naturais e poses sérias para acentuar o absurdo. Mantenha rostos e a ação principal no centro, para a imagem funcionar também no recorte horizontal do card.',
    'Use apenas personagens adultos fictícios. Sem texto na imagem, marcas, logotipos, celebridades, nudez ou violência.',
  ].join('\n');
}

export async function generatePvScene(result, { timeout = 25_000 } = {}) {
  return generateImage(buildPvScenePrompt(result), timeout);
}
