(()=>{
 const shell=window.pickOrPass,$=selector=>document.querySelector(selector);let roundId,questions=[],index=0,result,soundOn=false,audioContext,revealTimer;
 const scene=$('#fortuneIntro'),soundButtons=[$('#fortuneSound'),$('#fortuneQuizSound')];
 const errorText={start:'A névoa ficou um pouco confusa. O oráculo usará as cartas de emergência.',answer:'As estrelas estão demorando demais. A vidente decidiu tentar outra vez.',finish:'O rosto ainda está tímido. Vamos revelar outra visão.'};

 function syncSound(){soundButtons.forEach(button=>{button.setAttribute('aria-pressed',String(soundOn));button.textContent=button.classList.contains('compact')?(soundOn?'Som ✓':'Som'):`Som: ${soundOn?'ligado':'desligado'}`;button.setAttribute('aria-label',soundOn?'Desligar efeitos sonoros':'Ligar efeitos sonoros')})}
 function tone(frequency=440,duration=.12){if(!soundOn)return;audioContext??=new(window.AudioContext||window.webkitAudioContext)();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.075,audioContext.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration)}
 soundButtons.forEach(button=>button.addEventListener('click',()=>{soundOn=!soundOn;syncSound();tone(660,.16)}));syncSound();

 function restartIntro(){scene.classList.remove('intro-skipped');void scene.offsetWidth;scene.classList.add('intro-running');setTimeout(()=>scene.classList.remove('intro-running'),6500)}
 document.querySelector('.experience.fortune').addEventListener('click',restartIntro);
 $('#fortuneSkipIntro').addEventListener('click',()=>{scene.classList.add('intro-skipped');$('#fortuneStart').focus();tone(520,.09)});

 async function api(path,body){const response=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body||{})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Falha na consulta');return data}
 async function start(){
  $('#fortuneStart').disabled=true;$('#fortuneStart').textContent='ABRINDO AS CARTAS…';tone(392,.18);
  try{const repeat=window.sessionStorage.getItem('fortunePlayed')==='1',data=await api('/api/vidente/iniciar',{repeat});roundId=data.roundId;questions=data.questions;index=0;result=null;$('#fortuneComment').textContent=`“${data.opening}”`;renderQuestion();shell.show('fortuneQuiz')}
  catch(error){shell.toast(error.message||errorText.start)}finally{$('#fortuneStart').disabled=false;$('#fortuneStart').textContent='COMEÇAR A CONSULTA'}
 }
 function renderQuestion(){const question=questions[index];$('#fortuneCount').textContent=`${index+1}/${questions.length}`;$('#fortuneBar').style.width=`${index/questions.length*100}%`;$('#fortuneQuestion').textContent=question.text;$('#fortuneAnswers').replaceChildren(...question.options.map((answer,answerIndex)=>{const button=document.createElement('button');button.type='button';button.textContent=answer.text;button.setAttribute('aria-label',`Alternativa ${answerIndex+1}: ${answer.text}`);button.addEventListener('click',()=>answerQuestion(answer.id));return button}))}
 async function answerQuestion(answerId){
  const buttons=[...$('#fortuneAnswers').querySelectorAll('button')];buttons.forEach(button=>button.disabled=true);tone(520+index*28,.1);
  try{const data=await api('/api/vidente/responder',{roundId,questionIndex:index,answerId});react(data);index++;$('#fortuneBar').style.width=`${data.progress*100}%`;if(index<questions.length)setTimeout(renderQuestion,430);else setTimeout(finish,520)}
  catch(error){buttons.forEach(button=>button.disabled=false);shell.toast(error.message||errorText.answer)}
 }
 function react(data){$('#fortuneComment').textContent=`“${data.comment}”`;const aura=$('#fortuneAura');aura.className=`fortune-aura ${data.visualReaction||'pulse'}`;if(data.fragment){const fragment=$('#fortuneFragment');fragment.className=`fortune-fragment ${data.fragment} show`;setTimeout(()=>fragment.classList.remove('show'),850)}}
 async function finish(){
  $('#fortuneRevealPortrait').hidden=true; shell.show('fortuneReveal');tone(330,.25);$('#fortuneRevealLine').textContent='“O destino escolheu. Agora não adianta culpar as estrelas.”';
  try{result=await api('/api/vidente/finalizar',{roundId});portraitStyle($('#fortuneRevealPortrait'),result.character.image);$('#fortuneRevealPortrait').hidden=false;revealTimer=setTimeout(showResult,4800)}catch(error){shell.toast(error.message||errorText.finish);setTimeout(()=>shell.show('fortuneIntro'),1300)}
 }
 function portraitStyle(element,image){const {columns,rows,column,row}=image.atlas;element.style.backgroundImage=`url(${image.src})`;element.style.backgroundSize=`${columns*100}% ${rows*100}%`;element.style.backgroundPosition=`${column/(columns-1)*100}% ${row/(rows-1)*100}%`}
 async function showResult(){if(!result)return;clearTimeout(revealTimer);window.sessionStorage.setItem('fortunePlayed','1');tone(784,.35);portraitStyle($('#fortunePortrait'),result.character.image);$('#fortunePortrait').setAttribute('aria-label',`Retrato ilustrado e fictício de ${result.character.name}`);$('#fortuneResultReveal').textContent=`“${result.revealLine}”`;$('#fortuneName').textContent=result.character.name;$('#fortuneArchetype').textContent=result.character.archetype;$('#fortuneTraits').replaceChildren(...result.traits.map(trait=>{const span=document.createElement('span');span.textContent=trait.replace('comunicacao','comunicação');return span}));$('#fortuneDescription').textContent=result.description;$('#fortuneWhere').textContent=result.where;$('#fortuneFirstSign').textContent=result.firstSign;$('#fortunePrediction').textContent=result.prediction;await Promise.all([drawCard($('#fortuneStoryCard'),false),drawCard($('#fortuneSquareCard'),true)]);shell.show('fortuneResult')}
 $('#fortuneSkipReveal').addEventListener('click',showResult);

 async function drawCard(canvas,square){
  const context=canvas.getContext('2d'),width=canvas.width,height=canvas.height;context.clearRect(0,0,width,height);const gradient=context.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#090722');gradient.addColorStop(.48,'#36125e');gradient.addColorStop(1,'#071b38');context.fillStyle=gradient;context.fillRect(0,0,width,height);
  context.fillStyle='#ffffff10';for(let i=0;i<42;i++){const x=(i*197)%width,y=(i*337)%height;context.beginPath();context.arc(x,y,i%3+1,0,Math.PI*2);context.fill()}
  context.textAlign='center';context.fillStyle='#ffd36b';context.font='900 34px system-ui';context.fillText('PICK OR PASS',width/2,square?70:92);context.fillStyle='#fff';context.font='900 49px Georgia';context.fillText('A VIDENTE LEU MEU DESTINO',width/2,square?128:154);
  const atlas=await shell.loadPortrait(result.character.image.src),atlasData=result.character.image.atlas,cellW=atlas.width/atlasData.columns,cellH=atlas.height/atlasData.rows,cx=width/2,cy=square?410:690,radius=square?225:320;context.save();context.beginPath();context.arc(cx,cy,radius,0,Math.PI*2);context.clip();context.drawImage(atlas,atlasData.column*cellW,atlasData.row*cellH,cellW,cellH,cx-radius,cy-radius,radius*2,radius*2);context.restore();context.strokeStyle='#d9b8ff';context.lineWidth=12;context.shadowColor='#b86cff';context.shadowBlur=36;context.beginPath();context.arc(cx,cy,radius+5,0,Math.PI*2);context.stroke();context.shadowBlur=0;
  const textY=square?690:1085;context.fillStyle='#fff';context.font='900 68px Georgia';context.fillText(result.character.name,width/2,textY);context.fillStyle='#ffd36b';context.font='800 34px system-ui';shell.wrap(context,result.character.archetype,width/2,textY+58,900,42);context.fillStyle='#dfd8f0';context.font='700 27px system-ui';context.fillText(result.traits.map(t=>t.toUpperCase()).join(' • '),width/2,textY+120);
  if(!square){context.fillStyle='#fff';context.font='600 31px system-ui';shell.wrap(context,result.prediction,width/2,textY+208,900,43);context.fillStyle='#cdbfe3';context.font='500 25px system-ui';context.fillText('pick-or-pass.onrender.com • Faça sua consulta',width/2,1775);context.font='20px system-ui';context.fillText('Resultado criado para entretenimento',width/2,1832)}else{context.fillStyle='#cdbfe3';context.font='500 23px system-ui';context.fillText('pick-or-pass.onrender.com • Resultado para entretenimento',width/2,1015)}
 }
 function blobFrom(canvas){return new Promise(resolve=>canvas.toBlob(resolve,'image/png'))}
 async function shareProphecy(){
  try{await api('/api/vidente/compartilhar',{characterId:result.character.id})}catch{}
  const blob=await blobFrom($('#fortuneStoryCard')),file=new window.File([blob],'a-vidente-leu-meu-destino.png',{type:'image/png'}),data={title:'A Vidente Leu Meu Destino',text:result.shareLine,url:location.href};if(navigator.canShare?.({files:[file]}))try{await navigator.share({...data,files:[file]});return}catch(error){if(error.name==='AbortError')return}await shell.share(result.shareLine,'A Vidente Leu Meu Destino')
 }
 $('#fortuneStart').addEventListener('click',start);$('#fortuneRestart').addEventListener('click',()=>{shell.show('fortuneIntro');restartIntro()});$('#fortuneShare').addEventListener('click',shareProphecy);$('#fortuneDownloadStory').addEventListener('click',()=>shell.downloadCanvas($('#fortuneStoryCard'),'a-vidente-leu-meu-destino-story.png'));$('#fortuneDownloadSquare').addEventListener('click',()=>shell.downloadCanvas($('#fortuneSquareCard'),'a-vidente-leu-meu-destino-quadrado.png'));
})();
