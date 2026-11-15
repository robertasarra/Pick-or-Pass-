const API='https://generativelanguage.googleapis.com/v1beta';
export class GeminiError extends Error {
 constructor(status,code){super(`Gemini ${code}`);this.status=status;this.code=code;}
}
// No model is selected merely because it appears in Google's catalogue.
// Alternatives must be explicitly configured after checking free-tier eligibility.
export function createGeminiClient({env=process.env,fetcher=fetch,now=Date.now,sleep=ms=>new Promise(r=>setTimeout(r,ms)),log=entry=>console.info(JSON.stringify(entry))}={}){
 let catalogue,expires=0,discovery,blockedUntil=0,busy=false;
 const unavailable=new Map();
 async function request(path,body,deadline){
  const remaining=deadline-now();if(remaining<=0)throw new GeminiError(0,'timeout');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),remaining);
  try{
   const response=await fetcher(`${API}/${path}`,{method:body?'POST':'GET',headers:{'x-goog-api-key':env.GEMINI_API_KEY,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
   if(!response.ok){
    const status=response.status;
    const code=({400:'invalid_request',401:'unauthenticated',403:'forbidden',404:'model_not_found',429:'quota_unavailable'})[status]||(status>=500?'upstream_unavailable':'request_failed');
    if(status===429)blockedUntil=now()+300_000;
    if(status===401||status===403)blockedUntil=now()+600_000;
    log({event:'gemini_error',status,code});throw new GeminiError(status,code);
   }
   return await response.json();
  }catch(error){if(error instanceof GeminiError)throw error;throw new GeminiError(0,controller.signal.aborted?'timeout':'transport_error');}
  finally{clearTimeout(timer);}
 }
 async function models(deadline){
  if(catalogue&&now()<expires)return catalogue;
  if(!discovery)discovery=(async()=>{
   const found=new Set();let token;
   do{const page=await request(`models?pageSize=100${token?`&pageToken=${encodeURIComponent(token)}`:''}`,null,deadline);
    for(const model of page.models||[])if(model.supportedGenerationMethods?.includes('generateContent'))found.add(model.name.replace(/^models\//,''));
    token=page.nextPageToken;
   }while(token);
   catalogue=found;expires=now()+600_000;log({event:'gemini_models_validated',configuredAvailable:[env.GEMINI_MODEL||'gemini-2.5-flash',...(env.GEMINI_FALLBACK_MODELS||'').split(',')].filter(x=>found.has(x.trim()))});return found;
  })().finally(()=>{discovery=undefined;});
  return discovery;
 }
 async function generate(body,{timeout=8000,image=false}={}){
  if(!env.GEMINI_API_KEY)throw new GeminiError(0,'not_configured');
  if(image&&env.GEMINI_DYNAMIC_IMAGES!=='true')throw new GeminiError(0,'dynamic_images_disabled');
  if(now()<blockedUntil)throw new GeminiError(0,'circuit_open');
  if(busy)throw new GeminiError(0,'busy');
  busy=true;const deadline=now()+timeout;
  try{
   const available=await models(deadline);
   const configured=image?[env.GEMINI_IMAGE_MODEL]:[env.GEMINI_MODEL||'gemini-2.5-flash',...(env.GEMINI_FALLBACK_MODELS||'').split(',')];
   const candidates=[...new Set(configured.filter(Boolean).map(x=>x.trim().replace(/^models\//,'')))].filter(x=>available.has(x)&&now()>=(unavailable.get(x)||0));
   let last=new GeminiError(404,'no_available_configured_model');
   for(const model of candidates){
    for(let attempt=0;attempt<2;attempt++)try{
     const json=await request(`models/${encodeURIComponent(model)}:generateContent`,body,deadline);
     log({event:'gemini_success',model});return json;
    }catch(error){
     last=error;
     if(error.status===404){unavailable.set(model,now()+3_600_000);break;}
     if(error.status>=500&&attempt===0&&deadline-now()>1500){await sleep(250+Math.floor(Math.random()*250));continue;}
     if(error.status>=500)blockedUntil=now()+30_000;
     throw error;
    }
   }
   throw last;
  }finally{busy=false;}
 }
 return {generate};
}
const client=createGeminiClient();
export async function callGemini(prompt,{timeout=8000}={}){
 const json=await client.generate({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json'}},{timeout});
 const text=(json.candidates?.[0]?.content?.parts||[]).filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');
 return JSON.parse(text);
}
async function generateImage(prompt,timeout){
 const json=await client.generate({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['IMAGE','TEXT']}},{timeout,image:true});
 const part=json.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.data&&/^image\/(png|jpeg|webp)$/.test(p.inlineData.mimeType));
 if(!part)throw new GeminiError(0,'image_missing');return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
}
const pick=list=>list[Math.floor(Math.random()*list.length)];
const portraitLooks=['cabelo preto curto e barba cheia bem cuidada','cabelo castanho ondulado e barba rala','cabelo loiro médio e barba aparada','cabelo cacheado volumoso e rosto sem barba','cabeça raspada e barba desenhada','cabelo ruivo acobreado e barba curta','cabelo grisalho charmoso e barba grisalha curta','cabelo castanho liso penteado para trás e cavanhaque'];
const portraitOutfits=['camisa social azul-marinho aberta sobre camiseta branca','suéter de tricô cor mostarda','jaqueta jeans sobre camiseta clara','blazer casual cinza com camiseta preta','camisa de linho clara','camisa polo verde-escura'];
const portraitScenes=['uma rua urbana com prédios desfocados','uma orla de praia no fim de tarde','um café aconchegante com luzes quentes','um parque arborizado','uma cidade histórica com um ônibus vermelho desfocado ao fundo','uma marina com barcos desfocados ao fundo'];
export async function generateOraclePortrait(profile,{timeout=25_000}={}){const prompt=`Fotografia de retrato realista, enquadramento quadrado do busto com o rosto centralizado, de um homem adulto fictício e inexistente, com aparência claramente entre 28 e 45 anos, sorrindo simpático para a câmera, com ${pick(portraitLooks)}, vestindo ${pick(portraitOutfits)}, em ${pick(portraitScenes)}, luz natural suave e fundo desfocado. Variação ${profile.seed%997}. A pessoa é 100% gerada por IA. Não retrate pessoa real, celebridade, texto, marca, logotipo, nudez, erotização, uniforme, estereótipo cultural ou aparência de menor de idade.`;return generateImage(prompt,timeout);}
const pvScene=s=>s.princesoPercent===100?'um homem adulto boiando relaxado numa boia inflável de flamingo, com drink na mão e óculos escuros, ao lado de uma canoa vazia com dois remos, no meio de um mar de tempestade':s.vikingPercent>=75?'um homem adulto com capacete de viking de festa remando com garra e sorriso confiante uma canoa de madeira em mar de ondas altas, com respingos épicos':s.vikingPercent>=50?'um homem adulto remando uma canoa com um remo só e expressão de esforço pela metade, enquanto o segundo remo descansa embrulhado como presente ao lado dele':'um homem adulto sentado como passageiro na canoa, mexendo no celular com o remo intocado no colo, com o posto do remador vazio em pleno mar agitado';
export async function generatePvScene(scores,{timeout=25_000}={}){const prompt=`Fotografia realista com humor de sátira: ${pvScene(scores)}. Luz dramática de tempestade, estilo cinematográfico, cores intensas, composição horizontal com a cena centralizada. O homem tem entre 30 e 45 anos, é fictício e inexistente, com expressão cômica. Variação ${Math.floor(Math.random()*997)}. Sem texto, sem marca, sem logotipo, sem emoji, sem pessoa real ou celebridade, sem nudez, sem menor de idade.`;return generateImage(prompt,timeout);}

