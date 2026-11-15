// Optional analytics: no SDK, identifiers or events before affirmative consent.
(()=>{
 const KEY='pop-analytics-consent-v1';let enabled=false,measurementId,consent;
 try{consent=window.localStorage.getItem(KEY)}catch{/* Storage may be disabled. */}
 const queue=[];
 function track(name,parameters={}){if(!enabled)return;if(window.gtag)window.gtag('event',name,parameters);else if(queue.length<50)queue.push([name,parameters]);}
 window.popTrack=track;
 const origin=value=>{try{return new URL(value).origin}catch{return ''}};
 async function activate(){
  try{
   const response=await fetch('/api/config');if(!response.ok)return;const config=await response.json();
   measurementId=config.ga4MeasurementId;if(!/^G-[A-Z0-9]+$/.test(measurementId||''))return;
   enabled=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
   window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   window.gtag('js',new Date());window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+'/',page_referrer:origin(document.referrer)});
   const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;document.head.append(script);
   track('page_view',{page_location:location.origin+'/',page_referrer:origin(document.referrer),page_title:'Pick or Pass'});
   if(window.matchMedia('(display-mode: standalone)').matches)track('pwa_launch');
   for(const [name,params] of queue.splice(0))track(name,params);
  }catch{/* Analytics must never prevent playing. */}
 }
 const settings=document.createElement('button');settings.textContent='Privacidade e métricas';settings.className='privacy-settings';settings.onclick=preferences;
 document.body.append(settings);
 function preferences(){
  if(document.querySelector('#privacyConsent'))return;
  const box=document.createElement('aside');box.id='privacyConsent';box.setAttribute('aria-label','Preferências de privacidade');
  const text=document.createElement('p');text.textContent='Podemos usar Google Analytics para medir visitas e partidas? É opcional. Não enviamos suas respostas ou dados pessoais fornecidos no jogo. Você pode recusar e continuar jogando.';
  const policy=document.createElement('a');policy.href='/privacy.html';policy.textContent='Leia a política de privacidade';
  const accept=document.createElement('button'),reject=document.createElement('button');accept.textContent='Aceitar métricas';reject.textContent='Recusar métricas';
  function save(value){try{window.localStorage.setItem(KEY,value)}catch{}consent=value;box.remove();if(value==='yes')activate();else{
   enabled=false;if(measurementId)window[`ga-disable-${measurementId}`]=true;
   if(window.gtag)window.gtag('consent','update',{analytics_storage:'denied'});
   for(const item of document.cookie.split(';')){const name=item.trim().split('=')[0];if(name==='_ga'||name.startsWith('_ga_'))document.cookie=`${name}=; Max-Age=0; Path=/; SameSite=Lax`;}
  }}
  accept.onclick=()=>{if(measurementId)window[`ga-disable-${measurementId}`]=false;save('yes')};reject.onclick=()=>save('no');
  box.append(text,policy,accept,reject);document.body.append(box);
 }
 if(consent==='yes')activate();else if(consent!=='no')preferences();
 const originalFetch=window.fetch.bind(window);
 const routes={'/api/daily':['game_start','daily'],'/api/pv/round':['game_start','pv'],'/api/pv/result':['game_complete','pv'],'/api/oracle/questions':['game_start','oracle'],'/api/oracle/result':['game_complete','oracle'],'/api/vidente/iniciar':['game_start','vidente'],'/api/vidente/finalizar':['game_complete','vidente'],'/api/daily/vote':['game_complete','daily']};
 window.fetch=async(...args)=>{const response=await originalFetch(...args);const entry=routes[args[0]];if(response.ok&&entry)track(entry[0],{game:entry[1]});return response};
 document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;const id=button.id.toLowerCase();if(id.includes('share'))track('share_action',{game:id.replace(/share.*/, '')});});
 window.addEventListener('appinstalled',()=>track('pwa_install',{method:'appinstalled'}));
})();
