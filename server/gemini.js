const endpoint=(model,key)=>`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
const FALLBACK_TEXT_MODEL='gemini-2.5-flash',FALLBACK_IMAGE_MODEL='gemini-2.5-flash-image';
const modelsFor=(envName,fallback)=>[...new Set([process.env[envName]||fallback,fallback])];
async function geminiRequest(model,body,timeout){const key=process.env.GEMINI_API_KEY;if(!key)throw new Error('Gemini indisponível');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);try{const res=await fetch(endpoint(model,key),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:controller.signal});if(!res.ok)throw new Error(`Gemini HTTP ${res.status}`);return await res.json();}finally{clearTimeout(timer);}}
async function withModelFallback(models,run){let lastError;for(const model of models)try{return await run(model);}catch(error){lastError=error;if(!/HTTP (404|400)/.test(error.message))throw error;console.info(`Modelo ${model} indisponível, tentando alternativa:`,error.message);}throw lastError;}
export async function callGemini(prompt,{timeout=8000}={}){return withModelFallback(modelsFor('GEMINI_MODEL',FALLBACK_TEXT_MODEL),async model=>{const json=await geminiRequest(model,{contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:.9}},timeout);return JSON.parse(json.candidates?.[0]?.content?.parts?.[0]?.text||'{}');});}
async function generateImage(prompt,timeout,imageConfig){return withModelFallback(modelsFor('GEMINI_IMAGE_MODEL',FALLBACK_IMAGE_MODEL),async model=>{const json=await geminiRequest(model,{contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE','TEXT'],imageConfig}},timeout);const part=json.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.data);if(!part)throw new Error('Imagem ausente');return `data:${part.inlineData.mimeType||'image/png'};base64,${part.inlineData.data}`;});}
const pick=list=>list[Math.floor(Math.random()*list.length)];
const portraitLooks=['cabelo preto curto e barba cheia bem cuidada','cabelo castanho ondulado e barba rala','cabelo loiro médio e barba aparada','cabelo cacheado volumoso e rosto sem barba','cabeça raspada e barba desenhada','cabelo ruivo acobreado e barba curta','cabelo grisalho charmoso e barba grisalha curta','cabelo castanho liso penteado para trás e cavanhaque'];
const portraitOutfits=['camisa social azul-marinho aberta sobre camiseta branca','suéter de tricô cor mostarda','jaqueta jeans sobre camiseta clara','blazer casual cinza com camiseta preta','camisa de linho clara','camisa polo verde-escura'];
const portraitScenes=['uma rua urbana com prédios desfocados','uma orla de praia no fim de tarde','um café aconchegante com luzes quentes','um parque arborizado','uma cidade histórica com um ônibus vermelho desfocado ao fundo','uma marina com barcos desfocados ao fundo'];
export async function generateOraclePortrait(profile,{timeout=25_000}={}){const prompt=`Fotografia de retrato realista, enquadramento quadrado do busto com o rosto centralizado, de um homem adulto fictício e inexistente, com aparência claramente entre 28 e 45 anos, sorrindo simpático para a câmera, com ${pick(portraitLooks)}, vestindo ${pick(portraitOutfits)}, em ${pick(portraitScenes)}, luz natural suave e fundo desfocado. Variação ${profile.seed%997}. A pessoa é 100% gerada por IA. Não retrate pessoa real, celebridade, texto, marca, logotipo, nudez, erotização, uniforme, estereótipo cultural ou aparência de menor de idade.`;return generateImage(prompt,timeout);}
const pvScenes = {
 'viking': 'homem contemporâneo muito bonito, forte e atlético, com olhos azuis naturais bem visíveis e presença marcante, de mangas arregaçadas, tomando a iniciativa para resolver uma tarefa em casa, expressão segura e atenta',
 'viking-parcial': 'homem contemporâneo bonito, forte, de olhos azuis naturais bem visíveis, começando a ajudar em uma tarefa em casa, mas parando no meio com expressão de quem espera instruções',
 'princeso': 'homem contemporâneo arrumado, relaxado no sofá, pedindo que alguém pegue um objeto que está ao alcance da própria mão',
 'princeso-absoluto': 'homem contemporâneo impecavelmente arrumado, diante de um aparelho com botão visível, fazendo uma expressão teatral de impotência enquanto espera que alguém aperte o botão'
};

const pvSceneDetails = {
 'viking': ['instalando uma prateleira', 'preparando o jantar', 'organizando as compras', 'consertando uma bicicleta', 'arrumando a mesa'],
 'viking-parcial': ['uma prateleira pela metade', 'uma receita que largou no meio', 'uma bicicleta parcialmente montada', 'uma mesa ainda por arrumar', 'compras esquecidas no chão'],
 'princeso': ['um controle remoto', 'uma xícara de café', 'um copo de água', 'um carregador de celular', 'um par de pantufas'],
 'princeso-absoluto': ['o botão de um abajur', 'o botão de um ventilador', 'o botão de um controle remoto', 'o botão de uma cafeteira', 'o botão de uma caixa de som']
};

export async function generatePvScene(profile, { timeout = 12_000 } = {}) {
 const prompt = `Foto editorial realista e bem-humorada, quadrada 1:1, de ${pvScenes[profile]}. Elemento em destaque na cena: ${pick(pvSceneDetails[profile])}. Homem fictício adulto, aparência e roupa variadas, luz natural, rosto e gesto principais centralizados, com margem em todos os lados. Preencha toda a imagem sem bordas. Variação visual ${Math.random().toString(36).slice(2)}. Sem fantasias, capacetes, coroas, barcos, marcas, letras, celebridades ou pessoas reais.`;
 return generateImage(prompt, timeout, { aspectRatio: '1:1' });
}
