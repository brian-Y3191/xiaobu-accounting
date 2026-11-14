'use strict';
(()=>{
const label=document.getElementById('updateStatus'),check=document.getElementById('checkUpdate'),apply=document.getElementById('applyUpdate');
let registration,reloading=false,checking=false;
const status=s=>label.textContent=s;
function ready(){if(registration?.waiting){status('新版已下載完成；儲存帳目後按「套用更新」。');apply.classList.remove('hidden')}}
function version(){const worker=navigator.serviceWorker.controller;if(!worker){status('目前執行 V23；離線版本尚未接管，請重新開啟確認。');return}const channel=new MessageChannel();const timer=setTimeout(()=>status('目前執行 V23；離線版本尚未回覆，請檢查更新。'),2500);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();status(e.data==='V23'?'已確認：畫面 V23／離線快取 V23。':'畫面 V23／離線快取 '+e.data+'，請檢查更新。');ready()};worker.postMessage({type:'VERSION'},[channel.port2])}
async function checkNow(){if(!registration||checking)return;checking=true;check.disabled=true;status('正在檢查 GitHub Pages 上的更新…');try{await registration.update();if(registration.waiting)ready();else if(registration.installing)status('正在下載新版，完成後會顯示套用按鈕。');else version()}catch(e){status('無法連線檢查更新；目前仍可使用已快取版本。')}finally{checking=false;check.disabled=false}}
check.onclick=checkNow;
apply.onclick=()=>{if(!registration?.waiting)return;reloading=true;status('正在切換版本…');registration.waiting.postMessage({type:'SKIP_WAITING'})};
if(!('serviceWorker' in navigator)||location.protocol==='file:'){status('請透過 HTTPS 網址開啟，才能使用離線安裝與更新。');check.disabled=true;return}
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)location.reload();else version()});
navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>{registration=r;version();ready();r.addEventListener('updatefound',()=>{const w=r.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'){if(navigator.serviceWorker.controller)ready();else status('V23 已可離線使用。')}})});checkNow()}).catch(()=>status('離線功能啟用失敗，請確認 HTTPS 與檔案部署完整。'));
let lastCheck=Date.now();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-lastCheck>60000){lastCheck=Date.now();checkNow()}});
// Prevent pinch zoom and horizontal document movement; preserve vertical scrolling.
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
})();
