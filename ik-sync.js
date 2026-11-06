/* INVESTO KINGS online sync (TEST). Connects the Admin (engine) and the Client apps through a Firebase Realtime Database
   using its plain web (REST) interface. No account login yet: access is protected by a long private "room code" only. */
(function(){
'use strict';
var AI=window.IKAI;if(!AI)return;
var role=/admin/i.test(location.pathname)?'admin':'client',CFGK='ik_sync_cfg',CMDK='ik_ai_cmd_v1';
var DEV=localStorage.getItem('ik_dev')||(function(){var d='d'+Math.random().toString(36).slice(2,9);try{localStorage.setItem('ik_dev',d)}catch(e){}return d})();
var SY=window.IKSYNC={role:role,dev:DEV,cfg:null,status:'off',msg:'Not connected',blocked:false,lastOk:0,acts:{},onChange:null};
function validUrl(u){return /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(u)||/^http:\/\/localhost:\d+\/?$/.test(u)}
function validRoom(r){return /^[a-z0-9]{10,40}$/.test(r)}
function loadCfg(){try{var c=JSON.parse(localStorage.getItem(CFGK)||'null');return c&&validUrl(c.url)&&validRoom(c.room)?c:null}catch(e){return null}}
try{var q=new URLSearchParams(location.search),u=q.get('db'),r=q.get('room');if(u&&r&&validUrl(u)&&validRoom(r)){localStorage.setItem(CFGK,JSON.stringify({url:u,room:r}));history.replaceState(null,'',location.pathname)}}catch(e){}
SY.cfg=loadCfg();
function setStatus(s,m){SY.status=s;SY.msg=m;if(SY.onChange)SY.onChange();var el=document.getElementById('sy_stat');if(el)el.textContent=label()}
function label(){return ({off:'Not connected',connecting:'Connecting…',online:'Online',error:'Problem',blocked:'Another device is running the engine'})[SY.status]+(SY.msg&&SY.status!=='online'&&SY.status!=='off'?': '+SY.msg:'')}
SY.label=label;
function base(){return SY.cfg.url.replace(/\/+$/,'')+'/ik_'+SY.cfg.room}
function req(method,path,body,cfg){var b=cfg?cfg.url.replace(/\/+$/,'')+'/ik_'+cfg.room:base();var ac=typeof AbortController!=='undefined'?new AbortController():null,tm=ac?setTimeout(function(){ac.abort()},8000):0;
 return fetch(b+'/'+path+'.json'+(method==='GET'?'':'?print=silent'),{method:method,body:body===undefined?undefined:JSON.stringify(body),signal:ac?ac.signal:undefined}).then(function(r){clearTimeout(tm);if(!r.ok)throw new Error(r.status===401||r.status===403?'Permission denied. Check the database rules.':'HTTP '+r.status);return method==='GET'?r.json():null},function(e){clearTimeout(tm);throw (e&&e.name==='AbortError')?new Error('Connection timed out'):e})}
/* timers that keep running when the tab is in the background */
var W=null,subs=[];function ensureW(){if(W!==null)return;try{W=new Worker(URL.createObjectURL(new Blob(['setInterval(function(){postMessage(0)},200)'],{type:'text/javascript'})));W.onmessage=function(){var n=Date.now();subs.forEach(function(x){if(n-x.last>=x.ms){x.last=n;try{x.fn()}catch(e){}}})}}catch(e){W=false}}
SY.every=function(fn,ms){ensureW();if(W===false){setInterval(fn,ms);return}subs.push({fn:fn,ms:ms,last:0})};
function ok(){SY.lastOk=Date.now();if(SY.status!=='blocked')setStatus('online','')}
function fail(e){setStatus('error',(e&&e.message)||'No connection')}
function wire(){var n=0;return n}
/* ================= ADMIN: the engine owner ================= */
var pushed={meta:'',acc:{}},metaRev=0,accRev={},okRev={meta:0,acc:{}},busyD=false,busyL=false,busyF=false,leaseN=0,lastFull=0,seenLease={n:null,at:0};
function trimRes(r){var k=Object.keys(r||{}),o={};k.slice(-40).forEach(function(x){o[x]=r[x]});return o}
function pushData(){if(role!=='admin'||SY.blocked||!SY.cfg||busyD)return;var s=AI.state();if(!s)return;busyD=true;var jobs=[];
 var meta={history:s.history||[],schedule:s.schedule||[],notices:(s.notices||[]).slice(-60),extSignals:(s.extSignals||[]).slice(-40),results:trimRes(s.results),comp:s.comp||null},mj=JSON.stringify(meta);
 if(mj!==pushed.meta){var mr=metaRev+1;jobs.push(req('PUT','meta',{s:mj,r:mr}).then(function(){pushed.meta=mj;metaRev=mr;okRev.meta=mr}))}
 var ch={},info={};Object.keys(s.accounts).forEach(function(id){var a=JSON.parse(JSON.stringify(s.accounts[id]));if(a.run&&a.run.trades)a.run.trades=a.run.trades.slice(-8);if(a.hold)a.hold={ref:a.hold.ref,at:a.hold.at};var j=JSON.stringify(a);if(pushed.acc[id]!==j){var r=(accRev[id]||0)+1;ch[id]={s:j,r:r};info[id]={j:j,r:r}}});
 Object.keys(pushed.acc).forEach(function(id){if(!s.accounts[id]){ch[id]=null;info[id]=null}});
 if(Object.keys(ch).length)jobs.push(req('PATCH','acc',ch).then(function(){Object.keys(info).forEach(function(id){var ci=info[id];if(ci){pushed.acc[id]=ci.j;accRev[id]=ci.r;okRev.acc[id]=ci.r}else{delete pushed.acc[id];delete accRev[id];delete okRev.acc[id]}})}));
 Promise.all(jobs).then(ok,fail).then(function(){busyD=false})}
function pushLive(){if(role!=='admin'||SY.blocked||!SY.cfg||busyL)return;var s=AI.state();if(!s)return;busyL=true;
 var live={savedAt:Date.now(),simNow:s.simNow,speed:s.speed,px:s.px,usdzar:s.usdzar,mood:s.mood,session:s.session,master:s.master,scen:s.scen,settings:s.settings,metaRev:okRev.meta,accRev:okRev.acc,v:1};
 req('PUT','live',{s:JSON.stringify(live)}).then(ok,fail).then(function(){busyL=false})}
function pushFull(force){if(role!=='admin'||SY.blocked||!SY.cfg||busyF)return;var now=Date.now();if(!force&&now-lastFull<20000)return;busyF=true;lastFull=now;req('PUT','full',{s:JSON.stringify(AI.state())}).catch(fail).then(function(){busyF=false})}
function pushState(force){pushData();pushLive();pushFull(force)}
function pullCmds(){if(role!=='admin'||SY.blocked||!SY.cfg)return;req('GET','cmd').then(function(o){if(!o)return;var ks=Object.keys(o),qq=[],del={};try{qq=JSON.parse(localStorage.getItem(CMDK)||'[]')}catch(e){}ks.forEach(function(k){try{qq.push(JSON.parse(o[k].s))}catch(e){}del[k]=null});localStorage.setItem(CMDK,JSON.stringify(qq.slice(-200)));return req('PATCH','cmd',del)}).catch(fail)}
function checkLease(){if(role!=='admin'||!SY.cfg)return;req('GET','lease').then(function(l){if(!l)return;
 if(l.owner===DEV){seenLease={n:l.n,at:Date.now()};if(SY.blocked){}return}
 if(!SY.blocked){return}
 else{if(seenLease.n!==l.n){seenLease={n:l.n,at:Date.now()}}else if(Date.now()-seenLease.at>9000){/* other engine silent: free to take over */setStatus('blocked','Other device stopped. You can take over.')}}}).catch(fail)}
function block(){SY.blocked=true;setStatus('blocked','');if(SY.onChange)SY.onChange()}
function startAdmin(){setStatus('connecting','');
 req('GET','lease').then(function(l){
  if(l&&l.owner!==DEV){seenLease={n:l.n,at:Date.now()};return new Promise(function(res){setTimeout(function(){req('GET','lease').then(function(l2){res(l2&&l2.owner!==DEV&&l2.n!==l.n?'busy':'free')}).catch(function(){res('free')})},4500)})}
  return 'free'}).then(function(st){
   if(st==='busy'){block();return}
   return takeOver(false)}).catch(fail);
 SY.every(pullCmds,400);SY.every(pushData,700);SY.every(pushLive,1000);SY.every(function(){pushFull()},5000);SY.every(checkLease,3000);SY.every(function(){if(SY.blocked||leaseN<1)return;req('GET','lease').then(function(l){if(l&&l.owner!==DEV){block();return}return req('PUT','lease',{owner:DEV,n:++leaseN})}).catch(fail)},1500)}
function takeOver(){return req('GET','full').then(function(f){try{if(f&&f.s){var rs=JSON.parse(f.s),ls=AI.state();if(rs&&rs.v===1&&(!ls||(rs.savedAt||0)>(ls.savedAt||0)||!ls.history||rs.history.length>ls.history.length)){AI.use(rs);AI.save()}}}catch(e){}
  leaseN=0;SY.blocked=false;pushed={meta:'',acc:{}};setStatus('online','');return req('PUT','lease',{owner:DEV,n:++leaseN}).then(function(){pushState(true)})})}
SY.acts.syncTakeover=function(){takeOver().catch(fail)};
/* ================= CLIENT: reads the engine, sends commands ================= */
var remote=null,cache={meta:null,acc:{}},got={meta:-1,acc:{}},lastRemoteSaved=0,recvAt=0,pulling=false;
function myId(){return(window.IK&&IK.S&&IK.S.aiAcc)||'ME'}
function pull(){if(pulling)return;pulling=true;
 req('GET','live').then(function(o){if(!o||!o.s){remote=null;setStatus('online','');return}var L=JSON.parse(o.s);if(L.savedAt!==lastRemoteSaved){lastRemoteSaved=L.savedAt;recvAt=Date.now()}
  var jobs=[],id=myId(),want=L.accRev&&L.accRev[id];
  if(got.meta!==L.metaRev)jobs.push(req('GET','meta').then(function(m){if(m&&m.s){cache.meta=JSON.parse(m.s);got.meta=m.r}}));
  if(want!=null&&got.acc[id]!==want)jobs.push(req('GET','acc/'+id).then(function(a){if(a&&a.s){cache.acc[id]=JSON.parse(a.s);got.acc[id]=a.r}}));
  return Promise.all(jobs).then(function(){var m=cache.meta||{},r={v:1,savedAt:recvAt};for(var k in L)r[k]=L[k];r.savedAt=recvAt;r.history=m.history||[];r.schedule=m.schedule||[];r.notices=m.notices||[];r.extSignals=m.extSignals||[];r.results=m.results||{};r.comp=m.comp||null;r.accounts={};if(cache.acc[id]&&(!L.accRev||L.accRev[id]!=null))r.accounts[id]=cache.acc[id];remote=r;ok()})}).catch(fail).then(function(){pulling=false})}
function startClient(){setStatus('connecting','');
 AI.read=function(){return remote};
 AI.cmd=function(type,p){var id=Date.now()+'-'+Math.random().toString(36).slice(2,6);req('POST','cmd',{s:JSON.stringify({id:id,type:type,p:p||{}})}).catch(fail);return id};
 SY.every(pull,600);pull()}
/* ================= connect / disconnect (both apps) ================= */
function rndRoom(){var a='abcdefghijklmnopqrstuvwxyz0123456789',s='';for(var i=0;i<14;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
SY.connect=function(url,room){url=(url||'').trim().replace(/\/+$/,'');room=(room||'').trim().toLowerCase();
 if(!validUrl(url))return Promise.reject(new Error('That does not look like a Firebase database address. It should look like https://yourproject-default-rtdb.firebaseio.com'));
 if(!validRoom(room))return Promise.reject(new Error('The room code must be 10 to 40 letters and numbers, no spaces.'));
 return req('GET','live',undefined,{url:url,room:room}).then(function(){localStorage.setItem(CFGK,JSON.stringify({url:url,room:room}));return true})};
SY.disconnect=function(){localStorage.removeItem(CFGK);SY.cfg=null};
SY.newRoom=rndRoom;
function form(prefix){var c=SY.cfg||{url:'',room:''};return '<div class="lbl" style="margin:10px 0 4px">Database address</div><input id="'+prefix+'url" style="width:100%" placeholder="https://yourproject-default-rtdb.firebaseio.com" value="'+c.url+'"><div class="lbl" style="margin:10px 0 4px">Room code (private, same on every device)</div><input id="'+prefix+'room" style="width:100%" value="'+(c.room||rndRoom())+'"><div class="err" id="'+prefix+'err" style="margin-top:6px"></div>'}
SY.card=function(){var c=SY.cfg;return '<div class="card" style="margin-top:12px"><h3>Online database</h3><div class="row"><span>Status</span><b id="sy_stat">'+label()+'</b></div>'+form('sy_')+'<div style="display:flex;gap:8px;margin-top:10px"><div class="btn" data-act="syncConnect">'+(c?'Save and reconnect':'Connect')+'</div>'+(c?'<div class="btn" data-act="syncOff" style="background:transparent;border:1px solid #6b5a22;color:#e3b73f">Disconnect</div>':'')+'</div><div class="lbl" style="margin-top:8px">Use the same address and room code on the phone and the PC. Test setup only: the room code is the only protection.</div></div>'}
function doConnect(pre,done){var e=document.getElementById(pre+'err');if(e)e.textContent='Checking…';SY.connect(document.getElementById(pre+'url').value,document.getElementById(pre+'room').value).then(function(){location.reload()}).catch(function(x){if(e)e.textContent=x.message||'Could not connect.'})}
SY.acts.syncConnect=function(){doConnect('sy_')};SY.acts.syncOff=function(){SY.disconnect();location.reload()};
if(window.IK&&IK.acts){IK.acts.syncOpen=function(){IK.sheet(IK.shead('Online database')+'<div class="card mt12"><div class="row"><span>Status</span><b id="sy_stat">'+label()+'</b></div><div class="field"><label>Database address</label><input class="inp" id="sc_url" placeholder="https://yourproject-default-rtdb.firebaseio.com" value="'+(SY.cfg?SY.cfg.url:'')+'"></div><div class="field"><label>Room code</label><input class="inp" id="sc_room" value="'+(SY.cfg?SY.cfg.room:'')+'"><div class="err" id="sc_err"></div></div></div><p class="sub" style="font-size:12.5px">Use the same address and room code as the Admin page. Test setup only.</p><a class="btn" data-act="syncGo">'+(SY.cfg?'Save and reconnect':'Connect')+'</a>'+(SY.cfg?'<a class="link" data-act="syncOffC">Disconnect (use this device only)</a>':'')+'<a class="link" data-close>Close</a>')};
 IK.acts.syncGo=function(){doConnect('sc_')};IK.acts.syncOffC=function(){SY.disconnect();location.reload()}}
if(role==='admin'){var wl=function(){try{navigator.wakeLock.request('screen').catch(function(){})}catch(e){}};document.addEventListener('visibilitychange',function(){if(!document.hidden)wl()});wl()}
if(SY.cfg){if(role==='admin')startAdmin();else startClient()}
})();
