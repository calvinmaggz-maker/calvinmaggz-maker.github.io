/* INVESTO KINGS - core: state, router, overlays, engine (SIMULATED / TEST BUILD) */
(function(){
'use strict';
var IK=window.IK={screens:{},acts:{},cfg:{TEST:true,VERSION:'1.0.0',tagline:'Trade your future'}};
var KEY='ik_state_v1';
var $=function(s,r){return (r||document).querySelector(s)};
IK.$=$;
IK.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
IK.num=function(n,d){return Number(n).toLocaleString('en-US',{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d})};
IK.money=function(n,d){var neg=n<0;n=Math.abs(n);return (neg?'-':'')+'R '+IK.num(n,d==null?2:d)};
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var p2=function(n){return ('0'+n).slice(-2)};
IK.date=function(t){var d=new Date(t);return p2(d.getDate())+' '+MON[d.getMonth()]+' '+d.getFullYear()};
IK.time=function(t){var d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
IK.dt=function(t){var d=new Date(t);return p2(d.getDate())+' '+MON[d.getMonth()]+', '+IK.time(t)};
IK.mmss=function(ms){ms=Math.max(0,Math.ceil(ms/1000));return p2(Math.floor(ms/60))+':'+p2(ms%60)};
IK.fmtPhone=function(p){p=String(p||'');return '+27 '+p.slice(0,2)+' '+p.slice(2,5)+' '+p.slice(5)};
IK.uid=function(){return Math.random().toString(36).slice(2,9)};

/* ---------- icons ---------- */
var P={
back:'<path d="M15 5l-7 7 7 7"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
belloff:'<path d="M6 16V11a6 6 0 0 1 9-5.2M18 11v5l2 2H8"/><path d="M10 21h4M3 3l18 18"/>',
home:'<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>',trend:'<path d="M3 17l5-6 4 4 8-10"/><path d="M15 5h5v5"/>',
wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="15" r="1.2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>',check:'<path d="M5 12l5 5 9-10"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
warn:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',dl:'<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/>',
up:'<path d="M12 20V6"/><path d="M6 12l6-6 6 6"/>',down:'<path d="M12 4v14"/><path d="M6 12l6 6 6-6"/>',
hour:'<path d="M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9"/>',
wifi:'<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M3 3l18 18"/>',
tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
ticket:'<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 0 0-6V6H3z"/><path d="M13 6v12"/>',chev:'<path d="M9 6l6 6-6 6"/>',
camera:'<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',bank:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/>',
pct:'<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',flash:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',sparkle:'<path d="M11 3l1.9 5.6L18.5 10.5 12.9 12.4 11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'};
IK.I=function(n,s){return '<svg viewBox="0 0 24 24" width="'+(s||24)+'" height="'+(s||24)+'">'+(P[n]||'')+'</svg>'};
IK.crown=function(w){return '<svg class="crown" viewBox="0 0 120 80" width="'+w+'" height="'+Math.round(w*2/3)+'" style="stroke:#39ff14;stroke-width:'+(w>100?5:9)+';fill:none"><path d="M12 58 L8 22 L36 40 L60 10 L84 40 L112 22 L108 58 Z"/><path d="M16 68 Q60 76 104 68"/><circle cx="8" cy="18" r="5" style="fill:#39ff14;stroke:none"/><circle cx="60" cy="6" r="5" style="fill:#39ff14;stroke:none"/><circle cx="112" cy="18" r="5" style="fill:#39ff14;stroke:none"/></svg>'};
IK.flag=function(w){w=w||28;return '<svg class="flag" viewBox="0 0 900 600" width="'+w+'" height="'+Math.round(w*2/3)+'" role="img" aria-label="South Africa" style="stroke:none"><defs><clipPath id="zaf"><rect width="900" height="600" rx="50"/></clipPath></defs><g clip-path="url(#zaf)"><rect width="900" height="300" fill="#E03C31"/><rect y="300" width="900" height="300" fill="#001489"/><path d="M0 0L420 300H900M0 600L420 300" fill="none" stroke="#fff" stroke-width="230"/><path d="M0 0L420 300H900M0 600L420 300" fill="none" stroke="#007749" stroke-width="130"/><polygon points="0,60 0,540 330,300" fill="#FFB81C"/><polygon points="0,130 0,470 240,300" fill="#000"/></g></svg>'};
IK.mini=function(){return '<div class="mini">'+IK.crown(32)+'<div>INVESTO <span>KINGS</span></div></div>'};
IK.hdr=function(title,o){o=o||{};return '<div class="hd"><div class="back" data-back role="button" aria-label="Back">'+IK.I('back',22)+'</div><div class="ttl">'+IK.esc(title)+'</div>'+(o.right||'<div class="sp"></div>')+'</div>'};
IK.go_=function(name,p){return 'data-go="'+name+'"'+(p?' data-p="'+IK.esc(JSON.stringify(p))+'"':'')};
IK.chip=function(t,c){return '<span class="chip '+(c||'')+'">'+t+'</span>'};
IK.rows=function(list){return '<div class="card">'+list.map(function(r){return '<div class="row"><span>'+r[0]+'</span><b'+(r[2]?' class="'+r[2]+'"':'')+'>'+r[1]+'</b></div>'}).join('')+'</div>'};

/* ---------- state ---------- */
IK.defaults=function(){return{
 seenWelcome:false,user:null,loggedIn:false,
 verify:{mobile:false,agreement:null,kyc:{idFront:false,idBack:false,face:false,addr:false},status:'none',reason:'',decisionDue:0},
 balance:0,hasTraded:false,bank:null,deposits:[],withdrawals:[],trades:[],alerts:[],notifs:[],crowd:[],aiNotify:false,
 settings:{tradeAlerts:true,tradeResults:true,money:true,sound:true,uiSound:true,zoom:100,bg:'map',appLock:false,pin:'',lockAfter:60,notifAsked:false},
 fails:0,lockedUntil:0,seq:{trade:1,wd:1001,dep:1,alert:1},test:{autoApprove:true,autoConfirm:true,failNext:false},
 px:{XAUUSD:4018.35,XAGUSD:48.62}};};
function load(){var s=null;try{var j=localStorage.getItem(KEY);s=j?JSON.parse(j):null}catch(e){}
 if(!s||!s.seq||!s.verify){s=IK.defaults()}var d=IK.defaults();s.settings=Object.assign({},d.settings,s.settings||{});if(!s.crowd)s.crowd=[];IK.S=s;IK.px=s.px;return s}
IK.save=function(){try{IK.S.px=IK.px;localStorage.setItem(KEY,JSON.stringify(IK.S))}catch(e){}};
IK.wipe=function(){var seen=IK.S.seenWelcome;IK.S=IK.defaults();IK.S.seenWelcome=seen;IK.px=IK.S.px;IK.save()};
IK.SYM={XAUUSD:{name:'Gold',sl:8,vol:.45},XAGUSD:{name:'Silver',sl:.4,vol:.035}};
IK.verified=function(){return IK.S.verify.status==='approved'};
IK.running=function(){return IK.S.trades.filter(function(t){return t.status==='running'})};
IK.openAlerts=function(){return IK.S.alerts.filter(function(a){return a.state==='open'})};
IK.plOf=function(t){var p=IK.px[t.symbol],d=t.side==='BUY'?(p-t.entry)/(t.entry-t.sl):(t.entry-p)/(t.sl-t.entry);return d*t.risk};
IK.runPL=function(){return IK.running().reduce(function(a,t){return a+IK.plOf(t)},0)};
IK.unread=function(){return IK.S.notifs.filter(function(n){return !n.read}).length};

/* ---------- toast / copy ---------- */
IK.toast=function(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},1900)};
IK.copy=function(txt){try{navigator.clipboard.writeText(txt)}catch(e){var a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(x){}a.remove()}IK.toast('Copied')};

/* ---------- router ---------- */
var stack=[];IK.stack=stack;
IK.cur=function(){return stack[stack.length-1]||{name:'',params:{}}};
IK.go=function(name,params,opt){params=params||{};opt=opt||{};IK._dir=opt.reset?'tab':'fwd';
 if(opt.reset){stack.length=0;stack.push({name:name,params:params});history.replaceState({d:1},'')}
 else if(opt.replace){stack[stack.length-1]={name:name,params:params};history.replaceState({d:stack.length},'')}
 else{stack.push({name:name,params:params});history.pushState({d:stack.length},'')}
 render()};
IK.tab=function(name){IK.closeAll();IK.go(name,{},{reset:true})};
IK.back=function(){if(overlays.length){IK.closeTop();return}if(stack.length>1)history.back();else IK.exitDialog()};
function render(keepScroll){var top=IK.cur(),s=IK.screens[top.name];if(!s){console.error('no screen',top.name);return}
 var el=$('#screen'),sc=el.scrollTop,sa0=el.querySelector('.scrollarea'),sc2=sa0?sa0.scrollTop:0;el.className=s.flush?'flush':s.split?'split':'';el.innerHTML=s.render(top.params||{});
 el.scrollTop=keepScroll?sc:0;if(keepScroll){var sa1=el.querySelector('.scrollarea');if(sa1)sa1.scrollTop=sc2}
 if(!keepScroll){var d=IK._dir||'tab';void el.offsetWidth;el.classList.add('t-'+d);if(IK._lastScreen!==top.name||d==='back')IK.sound('swish');IK._lastScreen=top.name}
 var tabs=$('#tabs'),lb=$('#livebar');if(s.tab&&IK.S.loggedIn){tabs.className='show';Array.prototype.forEach.call(tabs.querySelectorAll('button'),function(b){b.classList.toggle('on',b.dataset.tab===s.tab)});$('#tabs .badge').style.display=IK.unread()?'block':'none'}else tabs.className='';
 if(s.bar&&IK.S.loggedIn){lb.className='show';lb.innerHTML=IK.barHtml()}else{lb.className='';lb.innerHTML=''}
 IK.applyDisplay();
 if(s.mount)s.mount(el,top.params||{});IK.liveUpdate()}
IK.refresh=function(){var a=document.activeElement;if(a&&/INPUT|TEXTAREA/.test(a.tagName)&&$('#screen').contains(a)){IK.liveUpdate();return}render(true)};
window.addEventListener('popstate',function(){
 if(overlays.length){IK.closeTop();history.pushState({d:stack.length},'');return}
 if(stack.length>1){IK._dir='back';stack.pop();render();return}
 history.pushState({d:stack.length},'');IK.exitDialog()});

/* ---------- overlays ---------- */
var overlays=[];IK.overlays=overlays;
function open(kind,html,opt){opt=opt||{};var el=document.createElement('div');el.className='ov';
 el.innerHTML='<div class="bd" data-bd></div><div class="pane '+kind+(opt.cls?' '+opt.cls:'')+'" role="dialog">'+(kind==='sheet'?'<div class="grab"></div>':'')+html+'</div>';
 $('#ovr').appendChild(el);var o={el:el,opt:opt};overlays.push(o);if(opt.mount)opt.mount(el);return o}
IK.sheet=function(html,opt){return open('sheet',html,opt)};
IK.dlg=function(html,opt){return open('dlg',html,opt)};
IK.closeTop=function(){var o=overlays.pop();if(!o)return;o.el.classList.add('out');o.el.style.pointerEvents='none';setTimeout(function(){o.el.remove()},260);if(o.opt.onClose)o.opt.onClose()};
IK.closeAll=function(){while(overlays.length)IK.closeTop()};
IK.full=function(html,opt){opt=opt||{};var el=document.createElement('div');el.className='ov';el.style.zIndex=90;el.innerHTML='<div class="fullscr '+(opt.cls||'')+'">'+html+'</div>';$('#ovr').appendChild(el);var o={el:el,opt:{modal:true,onClose:opt.onClose}};overlays.push(o);if(opt.mount)opt.mount(el);return o};
IK.shead=function(t){return '<div class="sh"><h2>'+IK.esc(t)+'</h2><div class="x" data-close role="button" aria-label="Close">'+IK.I('close',18)+'</div></div>'};
IK.csheet=function(icon,cls,title,inner,opt){return IK.sheet('<div class="ct"><div class="circ '+(cls||'')+'">'+IK.I(icon,42)+'</div><h2>'+IK.esc(title)+'</h2>'+(inner||'')+'</div>',opt)};
IK.msg=function(icon,cls,title,text,btn,opt){opt=opt||{};return IK.csheet(icon,cls,title,(text?'<p class="sub">'+text+'</p>':'')+'<a class="btn'+(opt.btnCls?' '+opt.btnCls:'')+'" data-close>'+(btn||'OK')+'</a>')};
IK.exitDialog=function(){if(overlays.some(function(o){return o.opt.exit}))return;
 IK.dlg('<h2>Exit Investo Kings?</h2><p class="sub mt8">You will not receive trade alerts while the app is closed.</p><a class="btn" data-close>Stay in the app</a><a class="btn red" data-act="exitApp">Exit</a>',{exit:true})};
IK.acts.exitApp=function(){IK.closeAll();try{window.close()}catch(e){}setTimeout(function(){history.go(-(history.length-1))},150)};

/* ---------- global events ---------- */
document.addEventListener('click',function(e){
 var t=e.target.closest('[data-bd],[data-close],[data-back],[data-tab],[data-copy],[data-go],[data-act]');if(!t)return;
 if(t.hasAttribute('data-bd')){var o=overlays[overlays.length-1];if(o&&!o.opt.modal)IK.closeTop();return}
 if(t.classList.contains('off')&&!t.hasAttribute('data-always'))return;
 if(t.hasAttribute('data-close')){IK.closeTop();return}
 if(t.hasAttribute('data-back')){IK.back();return}
 if(t.dataset.tab){IK.tab(t.dataset.tab);return}
 if(t.dataset.copy){IK.copy(t.dataset.copy);return}
 if(t.dataset.go){var p={};try{p=t.dataset.p?JSON.parse(t.dataset.p):{}}catch(x){}IK.closeAll();IK.go(t.dataset.go,p,{replace:t.hasAttribute('data-replace'),reset:t.hasAttribute('data-reset')});return}
 if(t.dataset.act){var f=IK.acts[t.dataset.act];if(f)f(t.dataset.arg,t,e);else console.error('no act',t.dataset.act)}});

/* ---------- notifications ---------- */
IK.notify=function(type,title,body,ref,chip){var s=IK.S;s.notifs.unshift({id:IK.uid(),type:type,title:title,body:body,ts:Date.now(),read:false,ref:ref||null,chip:chip||null});if(s.notifs.length>80)s.notifs.length=80;IK.save();if(type!=='trade')IK.sound('notify')};
IK.os=function(title,body,tag){try{if(!('Notification' in window)||Notification.permission!=='granted')return;if(!document.hidden)return;
 if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(r){r.showNotification(title,{body:body,icon:'icon-192.png',badge:'icon-192.png',tag:tag||'ik',vibrate:IK.S.settings.sound?[200,100,200]:undefined,data:{url:'./'}})})}}catch(e){}};

/* ---------- signals & trades (SIMULATED) ---------- */
IK.sendSignal=function(o){var s=IK.S,sym=o.symbol,side=o.side,px=IK.px[sym],d=IK.SYM[sym].sl,mins=o.minutes||5;
 var sl=side==='BUY'?px-d:px+d,tp=side==='BUY'?px+3*d:px-3*d;
 var a={id:'A'+(s.seq.alert++),symbol:sym,side:side,entry:+px.toFixed(2),sl:+sl.toFixed(2),tp:+tp.toFixed(2),risk:Math.max((IK.cfg.limits&&IK.cfg.limits.minRisk)||300,o.risk||500),createdAt:Date.now(),windowMs:mins*60000,expiresAt:Date.now()+mins*60000,state:'open'};
 IK.crowdStart(a);if(!s.loggedIn||!IK.verified()){IK.save();IK.toast('Signal sent to other clients. Not delivered to you: you are not verified.');return null}
 s.alerts.unshift(a);
 IK.notify('trade','New '+IK.SYM[sym].name+' trade: '+side,'The trade window closes in '+mins+' minute'+(mins>1?'s':'')+'. Tap to view and place it.',{kind:'alert',id:a.id});
 IK.save();
 if(s.settings.tradeAlerts){IK.os('New '+IK.SYM[sym].name+' trade: '+side,'The trade window closes in '+mins+' minutes.','alert');IK.alertPopup(a)}
 IK.refresh();return a};
IK.alertLoop=function(a){clearInterval(IK._at);IK.sound('alert');IK._at=setInterval(function(){var x=IK.S.alerts.filter(function(y){return y.id===a.id})[0];if(!x||x.state!=='open'||!overlays.some(function(o){return o.opt.alertPop})){clearInterval(IK._at);return}IK.sound('alert')},7000)};
IK.alertPopup=function(a){if(!IK.S.loggedIn||IK.lockOpen)return;IK.closeAll();IK.alertLoop(a);var open_=IK.openAlerts();
 if(open_.length>1){IK.sheet(IK.shead(open_.length+' trade alerts')+open_.map(function(x){return '<div class="card pad mt12" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b style="font-size:17px">'+IK.SYM[x.symbol].name+' '+x.side+'</b><div class="ora" style="font-size:13px" data-cd="'+x.id+'">'+IK.mmss(x.expiresAt-Date.now())+'</div></div><a class="btn sm" '+IK.go_('execution',{id:x.id})+'>Place</a></div>'}).join('')+'<p class="sub" style="font-size:13px">Place each trade before its countdown ends.</p>',{alertPop:true});return}
 IK.dlg('<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:23px">New trade alert</h2>'+IK.chip(IK.SYM[a.symbol].name,'o')+'</div>'
 +'<div style="display:flex;align-items:center;gap:12px;margin-top:14px">'+IK.chip(a.side,a.side==='BUY'?'buy':'sell')+'<b style="font-size:28px">'+a.symbol+'</b></div>'
 +'<div class="card mt12" style="text-align:left">'+[['Entry price',IK.num(a.entry)],['Stop loss',IK.num(a.sl),'neg'],['Take profit',IK.num(a.tp),'pos'],['Suggested risk',IK.money(a.risk)]].map(function(r){return '<div class="row"><span>'+r[0]+'</span><b class="'+(r[2]||'')+'">'+r[1]+'</b></div>'}).join('')+'</div>'
 +'<div style="display:flex;justify-content:space-between;margin-top:14px;font-size:15px;color:#d0d0d0"><span>Window closes in</span><b class="pos" style="font-size:20px" data-cd="'+a.id+'">'+IK.mmss(a.expiresAt-Date.now())+'</b></div>'
 +'<a class="btn" '+IK.go_('execution',{id:a.id})+'>View and place trade</a><a class="link" data-close>Not now</a>',{cls:'gr',alertPop:true})};
IK.onAlertMissed=function(a){var n=IK.S.notifs.filter(function(x){return x.ref&&x.ref.id===a.id})[0];if(n){n.chip='Missed';n.body='The window closed before this trade was placed.'}
 var top=overlays[overlays.length-1];if(IK.cur().name==='execution'&&IK.cur().params.id===a.id){IK.closeAll();IK.windowClosed(a)}};
IK.windowClosed=function(a){IK.csheet('timer','x','Window closed','<p style="margin-top:8px">'+IK.chip('Missed','r')+'</p><p class="sub">The time to place this trade has ended. You will get a new alert as soon as the next setup is ready.</p><a class="btn line" '+IK.go_('dashboard',{})+' data-reset>Back to home</a>',{modal:false})};
IK.closeTrade=function(t,by){var s=IK.S;t.status='closed';t.closedAt=Date.now();t.closedBy=by==='tp'?'Take profit':by==='sl'?'Stop loss':'Closed';
 t.exit=by==='tp'?t.tp:t.sl;t.pnl=by==='tp'?3*t.risk:-t.risk;t.result=t.pnl>=0?'won':'lost';s.balance+=t.pnl;IK.sound(t.pnl>=0?'win':'loss');
 IK.notify('trade','Trade closed: '+IK.SYM[t.symbol].name+' '+t.side,(by==='tp'?'Take profit reached.':'Stop loss reached.'),{kind:'trade',id:t.id},(t.pnl>=0?'Won +':'Lost -')+IK.money(Math.abs(t.pnl)));
 if(s.settings.tradeResults){IK.toast('Trade closed: '+(t.pnl>=0?'Won ':'Lost ')+IK.money(Math.abs(t.pnl)));IK.os('Trade closed',IK.SYM[t.symbol].name+' '+t.side+' '+(t.pnl>=0?'won':'lost')+' '+IK.money(Math.abs(t.pnl)),'tr')}};
IK.force=function(kind){var r=IK.running(),c=IK.S.crowd.filter(function(x){return x.status==='running'});if(!r.length&&!c.length){IK.toast('No running trade');return}r.forEach(function(t){IK.px[t.symbol]=kind==='tp'?t.tp:t.sl});if(!r.length)IK.px[c[0].symbol]=kind==='tp'?c[0].tp:c[0].sl;IK.tick()};

/* ---------- due items (auto progress) ---------- */
IK.processDue=function(t){var s=IK.S,ch=false;
 if(s.verify.status==='submitted'&&s.test.autoApprove&&s.verify.decisionDue&&t>=s.verify.decisionDue){IK.decideVerify(true);ch=true}
 if(s.test.autoConfirm){s.deposits.forEach(function(d){if(d.status==='checking'&&d.dueAt&&t>=d.dueAt){IK.confirmDeposit(d);ch=true}});
  s.withdrawals.forEach(function(w){if(w.status==='pending'&&w.dueAt&&t>=w.dueAt){IK.payWithdrawal(w);ch=true}})}
 return ch};
IK.decideVerify=function(ok,reason){var s=IK.S;s.verify.decisionDue=0;
 if(ok){s.verify.status='approved';IK.notify('account','Verification approved','Your identity is verified. You will now receive trade alerts.',{kind:'profile'});
  IK.os('Verification approved','You will now receive trade alerts.','v');IK.save();if(IK.S.loggedIn&&!IK.lockOpen){IK.closeAll();IK.approvedSheet()}}
 else{s.verify.status='rejected';s.verify.reason=reason||'Proof of address: the statement is older than 3 months.';IK.notify('account','Verification not approved',s.verify.reason,{kind:'profile'});IK.save();if(IK.S.loggedIn&&!IK.lockOpen){IK.closeAll();IK.rejectedSheet()}}
 IK.refresh()};
IK.confirmDeposit=function(d){d.status='received';IK.S.balance+=d.amount;IK.notify('money','Deposit received',IK.money(d.amount)+' has been added to your balance.',{kind:'deposit',id:d.id});IK.save();IK.toast('Deposit received: '+IK.money(d.amount))};
IK.payWithdrawal=function(w){w.status='paid';w.paidAt=Date.now();IK.S.withdrawnTotal=(IK.S.withdrawnTotal||0)+w.net;IK.notify('money','Withdrawal paid',IK.money(w.net)+' was paid to your bank account.',{kind:'wd',id:w.id});IK.save();IK.toast('Withdrawal paid: '+IK.money(w.net))};

/* ---------- ticking ---------- */
IK.tick=function(){var s=IK.S;if(!s)return;var t=Date.now(),ch=false;
 for(var k in IK.px){var v=IK.SYM[k].vol;IK.px[k]=+(IK.px[k]+(Math.random()-.5)*2*v).toFixed(2)}
 s.trades.forEach(function(tr){if(tr.status!=='running')return;var p=IK.px[tr.symbol],tp=tr.side==='BUY'?p>=tr.tp:p<=tr.tp,sl=tr.side==='BUY'?p<=tr.sl:p>=tr.sl;if(tp||sl){IK.closeTrade(tr,tp?'tp':'sl');ch=true}});
 s.alerts.forEach(function(a){if(a.state==='open'&&t>=a.expiresAt){a.state='missed';IK.onAlertMissed(a);ch=true}});
 s.crowd.forEach(function(c){if(c.status!=='running')return;var p=IK.px[c.symbol],tp=c.side==='BUY'?p>=c.tp:p<=c.tp,sl=c.side==='BUY'?p<=c.sl:p>=c.sl;if(tp||sl){c.status='closed';ch=true}});
 if(IK.processDue(t))ch=true;
 if(ch){IK.save();IK.refresh()}else IK.liveUpdate()};
IK.liveUpdate=function(){
 Array.prototype.forEach.call(document.querySelectorAll('[data-px]'),function(el){el.textContent=IK.num(IK.px[el.dataset.px])});
 Array.prototype.forEach.call(document.querySelectorAll('[data-pl]'),function(el){var t=IK.S.trades.filter(function(x){return x.id===el.dataset.pl})[0];if(!t)return;var v=IK.plOf(t);el.textContent=(v>=0?'+':'')+IK.money(v);el.classList.toggle('pos',v>=0);el.classList.toggle('neg',v<0)});
 Array.prototype.forEach.call(document.querySelectorAll('[data-pltotal]'),function(el){var v=IK.runPL(),n=IK.running().length;el.textContent=n?((v>=0?'+':'')+IK.money(v)):'R 0.00';el.classList.toggle('pos',n>0&&v>=0);el.classList.toggle('neg',n>0&&v<0)});
 Array.prototype.forEach.call(document.querySelectorAll('[data-cd]'),function(el){var a=IK.S.alerts.filter(function(x){return x.id===el.dataset.cd})[0];if(a)el.textContent=IK.mmss(a.expiresAt-Date.now())});
 Array.prototype.forEach.call(document.querySelectorAll('[data-ring]'),function(el){var a=IK.S.alerts.filter(function(x){return x.id===el.dataset.ring})[0];if(a){var f=Math.max(0,(a.expiresAt-Date.now())/a.windowMs);el.setAttribute('stroke-dashoffset',(578*(1-f)).toFixed(1))}});IK.crowdUpdate()};

/* ---------- app lock ---------- */
IK.lockOpen=false;
IK.pinPad=function(root,onDone,opt){opt=opt||{};var code='';var dots=root.querySelector('.pin');
 function paint(bad){dots.className='pin'+(bad?' bad':'');dots.innerHTML=[0,1,2,3].map(function(i){return '<i class="'+(i<code.length?'on':'')+'"></i>'}).join('')}
 paint();root.querySelector('.keys').addEventListener('click',function(e){var k=e.target.closest('[data-k]');if(!k)return;var v=k.dataset.k;if(v==='del'){code=code.slice(0,-1);paint();return}if(code.length>=4)return;code+=v;paint();if(code.length===4){var c=code;setTimeout(function(){var r=onDone(c);if(r===false){IK.sound('wrong');code='';paint(true);setTimeout(function(){paint()},500)}else code=''},120)}})};
IK.padHtml=function(){return '<div class="pin"></div><div class="keys">'+'123456789'.split('').map(function(n){return '<div class="k" data-k="'+n+'">'+n+'</div>'}).join('')+'<div class="k z"></div><div class="k" data-k="0">0</div><div class="k z" data-k="del">&#9003;</div></div>'};
IK.showLock=function(){if(IK.lockOpen)return;IK.lockOpen=true;var tries=0;
 IK.full('<div class="center" style="margin-top:50px">'+IK.crown(84)+'<div class="wm md" style="margin-top:8px">INVESTO <span>KINGS</span></div></div><h1 class="h1 center" id="lktt" style="font-size:26px;margin-top:30px">Enter your PIN</h1><p class="sub center" id="lksub" style="min-height:24px"></p>'+IK.padHtml()+'<button class="link" data-act="lockBio">Use face or fingerprint</button><button class="link" data-act="lockForgot" style="margin-top:8px">Forgot PIN?</button>',
 {mount:function(el){IK.pinPad(el,function(c){if(c===IK.S.settings.pin){IK.lockOpen=false;IK.closeTop();IK.refresh();return true}tries++;var sub=el.querySelector('#lksub');if(tries>=3){sub.textContent='Too many tries. Log in with your password.';sub.className='sub center err';IK.acts.lockForgot();return false}sub.textContent='Incorrect PIN. You have '+(3-tries)+' tries left.';sub.className='sub center err';return false})}})};
IK.acts.lockBio=function(){IK.lockOpen=false;IK.closeAll();IK.toast('Unlocked (simulated biometrics)')};
IK.acts.lockForgot=function(){IK.dlg('<h2>Forgot your PIN?</h2><p class="sub mt8">Log in with your password to set a new PIN.</p><a class="btn" data-act="lockToLogin">Log in with password</a><a class="link" data-close>Cancel</a>',{cls:'or'})};
IK.acts.lockToLogin=function(){IK.lockOpen=false;IK.S.settings.appLock=false;IK.S.settings.pin='';IK.S.loggedIn=false;IK.save();IK.closeAll();IK.go('login',{},{reset:true})};
var hiddenAt=0;
document.addEventListener('visibilitychange',function(){if(document.hidden){hiddenAt=Date.now()}else if(IK.S&&IK.S.loggedIn&&IK.S.settings.appLock&&IK.S.settings.pin&&hiddenAt&&Date.now()-hiddenAt>=IK.S.settings.lockAfter*1000){IK.showLock()}});
window.addEventListener('offline',function(){IK.noInternet()});
IK.noInternet=function(){if(IK._off)return;IK._off=true;IK.full('<div class="state"><div class="mid"><div class="big x" style="background:#1e1e1e;border-color:#444;box-shadow:none;color:#9a9a9a;width:190px;height:190px;border-radius:50%;display:grid;place-items:center;border:3px solid #444">'+IK.I('wifi',90)+'</div><h1 class="h1" style="margin-top:36px">No internet connection</h1><p class="sub">Check your connection and try again. You need to be online to receive trade alerts and place trades.</p></div><a class="btn" data-act="retryNet">Try again</a></div>',{onClose:function(){IK._off=false}})};
IK.acts.retryNet=function(){if(navigator.onLine){IK.closeTop()}else IK.toast('Still offline')};
window.addEventListener('online',function(){if(IK._off){IK.closeTop();IK.toast('Back online')}});


/* ---------- crowd (simulated community stats) ---------- */
IK.crowdStart=function(a){var n=40+Math.floor(Math.random()*110),cl=[],pool=[300,300,500,500,500,1000,1000,2000,5000];
 for(var i=0;i<n;i++)cl.push({risk:pool[Math.floor(Math.random()*pool.length)],joinAt:a.createdAt+Math.pow(Math.random(),2.2)*a.windowMs*.9});
 var c=IK.S.crowd;c.push({id:a.id,symbol:a.symbol,side:a.side,entry:a.entry,sl:a.sl,tp:a.tp,status:'running',clients:cl});if(c.length>8)c.shift()};
IK.crowd=function(){var now=Date.now(),live=0,fl=0;IK.S.crowd.forEach(function(c){if(c.status!=='running')return;var p=IK.px[c.symbol],r=c.side==='BUY'?(p-c.entry)/(c.entry-c.sl):(c.entry-p)/(c.sl-c.entry);c.clients.forEach(function(x){if(x.joinAt<=now){live++;fl+=r*x.risk}})});IK.running().forEach(function(t){live++;fl+=IK.plOf(t)});return{live:live,fl:fl}};
IK.crowdUpdate=function(){var els=document.querySelectorAll('[data-crowd]');if(!els.length)return;var c=IK.crowd();Array.prototype.forEach.call(els,function(el){if(el.dataset.crowd==='live')el.textContent=c.live;else{el.textContent=(c.fl>0.004?'+':'')+IK.money(Math.abs(c.fl)<0.005?0:c.fl);el.classList.toggle('pos',c.fl>0.004);el.classList.toggle('neg',c.fl<-0.004)}})};
IK.barHtml=function(){return '<div class="c"><small><i class="pulse"></i>Live traders now</small><b data-crowd="live">0</b></div><div class="c" style="text-align:right"><small>Floating profit (all clients)</small><b data-crowd="fl">R 0.00</b></div>'};
/* ---------- display ---------- */
IK.applyDisplay=function(){var st=IK.S&&IK.S.settings,app=$('#app');if(!st||!app)return;app.style.setProperty('--z',(st.zoom||100)/100);var c=(app.className||'').replace(/\bbg-\w+\b/g,'').trim();app.className=(c+' bg-'+(st.bg||'map')).trim()};
/* ---------- sounds (synthesised, no files) ---------- */
IK.snd=(function(){var ctx=null;
 function C(){if(!ctx){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{ctx=new AC()}catch(e){return null}}if(ctx.state==='suspended')ctx.resume();return ctx}
 function env(g,t,a,d,v){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
 function tone(f,t,d,type,v,dest){var o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);env(g,t,.01,d,v);o.connect(g);g.connect(dest||ctx.destination);o.start(t);o.stop(t+d+.06)}
 function noise(t,d,v,f0,f1){var n=Math.floor(ctx.sampleRate*d),b=ctx.createBuffer(1,n,ctx.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=Math.random()*2-1;var s=ctx.createBufferSource();s.buffer=b;var fl=ctx.createBiquadFilter();fl.type='bandpass';fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+d);fl.Q.value=1.1;var g=ctx.createGain();env(g,t,.03,d-.03,v);s.connect(fl);fl.connect(g);g.connect(ctx.destination);s.start(t)}
 function bus(){var b=ctx.createGain(),d=ctx.createDelay(1),fb=ctx.createGain(),w=ctx.createGain();d.delayTime.value=.19;fb.gain.value=.35;w.gain.value=.55;b.connect(ctx.destination);b.connect(d);d.connect(fb);fb.connect(d);d.connect(w);w.connect(ctx.destination);return b}
 var lib={
  notify:function(t){tone(880,t,.2,'sine',.2);tone(1318.5,t+.13,.3,'sine',.18)},
  swish:function(t){noise(t,.14,.05,500,2400)},
  placed:function(t){[523.25,659.25,783.99,1046.5].forEach(function(f,i){tone(f,t+i*.07,.24,'triangle',.2)})},
  win:function(t){[659.25,783.99,987.77,1318.5].forEach(function(f,i){tone(f,t+i*.09,.3,'sine',.22);tone(f*2,t+i*.09,.18,'sine',.05)})},
  loss:function(t){tone(392,t,.22,'sine',.2);tone(293.66,t+.17,.38,'sine',.2)},
  wrong:function(t){tone(190,t,.14,'square',.1);tone(190,t+.2,.14,'square',.1)},
  alert:function(t){var b=bus();for(var r=0;r<2;r++){var t0=t+r*1.2;[784,1047,1319].forEach(function(f,i){tone(f,t0+i*.1,.2,'triangle',.26,b);tone(f*2,t0+i*.1,.12,'sine',.06,b)});[1047,1319,1568].forEach(function(f){tone(f,t0+.34,.6,'sine',.16,b)});tone(523.25,t0+.34,.6,'triangle',.18,b)}}
 };
 return {play:function(n){var c=C();if(!c||!lib[n])return;try{lib[n](c.currentTime+.02)}catch(e){}},unlock:function(){C()}}})();
IK.sound=function(n){var st=IK.S&&IK.S.settings;if(!st)return;
 if(n==='alert'){if(!st.sound)return;IK.snd.play('alert');try{navigator.vibrate&&navigator.vibrate([300,120,300,120,500])}catch(e){}return}
 if(!st.uiSound)return;IK.snd.play(n);if(n==='wrong'){try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(e){}}};
document.addEventListener('pointerdown',function(){IK.snd.unlock()},{once:true});

/* ---------- boot ---------- */
IK.entry=function(){var s=IK.S;
 if(IK.cur().name!=='splash')return;
 if(s.loggedIn&&s.user){var h=(location.hash||'').replace('#/','');var tabs={wallet:1,live:1,history:1,profile:1,dashboard:1,ai:1};IK.go(tabs[h]?h:'dashboard',{},{reset:true});if(s.settings.appLock&&s.settings.pin)IK.showLock();else if(IK.verified()&&!s.settings.notifAsked)setTimeout(IK.askNotif,600)}
 else if(!s.seenWelcome)IK.go('welcome',{},{reset:true});
 else IK.go(s.user?'login':'landing',{},{reset:true})};
IK.boot=function(){load();
 document.body.innerHTML='<div id="app"><div id="testbar" data-act="testControls">TEST MODE &middot; virtual funds &middot; tap for test controls</div><main id="screen"></main><div id="livebar"></div><nav id="tabs"><button data-tab="dashboard">'+IK.I('home')+'Home</button><button data-tab="live">'+IK.I('trend')+'Live</button><button data-tab="wallet">'+IK.I('wallet')+'Wallet</button><button data-tab="history">'+IK.I('clock')+'History</button><button data-tab="ai">'+IK.I('sparkle')+'AI</button><button data-tab="profile">'+IK.I('user')+'Profile<i class="badge" style="display:none"></i></button></nav><div id="ovr"></div><div id="toast"></div></div>';
 if(!IK.cfg.TEST)$('#testbar').classList.add('hide');
 history.replaceState({d:1},'');history.pushState({d:1},'');
 IK.go('splash',{},{reset:true});
 setInterval(IK.tick,1000);
 if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(function(){})}
 if(!navigator.onLine)setTimeout(IK.noInternet,100)};
})();
