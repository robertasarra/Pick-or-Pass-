(()=>{
 let prompt;
 const button=document.createElement('button');button.textContent='Instalar Pick or Pass';button.className='privacy-settings';button.hidden=true;
 document.body.append(button);
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;button.hidden=false});
 button.onclick=async()=>{if(!prompt)return;try{await prompt.prompt();await prompt.userChoice}finally{prompt=null;button.hidden=true}};
 window.addEventListener('appinstalled',()=>{prompt=null;button.hidden=true});
 const details=document.createElement('details');details.className='install-help';const summary=document.createElement('summary');summary.textContent='Como instalar no celular';
 const text=document.createElement('p');text.textContent='No iPhone, abra no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”. No Android, abra no Chrome e use “Instalar aplicativo” ou “Adicionar à tela inicial” no menu. A opção depende do navegador. É necessário acesso à internet para iniciar partidas.';
 details.append(summary,text);document.body.append(details);
})();
