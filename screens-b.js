/* INVESTO KINGS - main tabs, trade flow */
(function(){
'use strict';
var IK=window.IK,$=IK.$,esc=IK.esc,I=IK.I,S=function(){return IK.S};
var sym=function(s){return IK.SYM[s].name};
var sideChip=function(x){return IK.chip(x,x==='BUY'?'buy':'sell')};
IK.verifyRequired=function(){IK.csheet('lock','o','Verification required','<p class="sub">Verify your identity to deposit, trade or withdraw.</p><a class="btn" data-go="kyc" data-reset>Continue verification</a><a class="link" data-close>Not now</a>')};
IK.guard=function(){if(IK.verified())return true;IK.verifyRequired();return false};

/* ---------- dashboard ---------- */
IK.screens.dashboard={tab:'dashboard',render:function(){var s=S(),u=s.user||{name:''},v=s.verify,run=IK.running(),al=IK.openAlerts();
 var live=function(x){return run.some(function(t){return t.symbol===x})||al.some(function(a){return a.symbol===x})};
 var px=function(x,side){return '<div class="px'+(live(x)?' live':'')+'" data-act="pxTap" data-arg="'+x+'">'+(live(x)?'<div class="badge">TRADE LIVE</div>':'')+'<div class="sym">'+x+'</div><div class="nm">'+sym(x)+'</div><div class="val" data-px="'+x+'">'+IK.num(IK.px[x])+'</div><div class="chg">Live price (simulated)</div></div>'};
 var banner='';if(v.status==='none')banner='<div class="banner o"><div class="ic o">'+I('shield')+'</div><div style="flex:1"><b>Verify your identity</b>Finish verification to receive trade alerts.</div><a class="btn org sm" data-go="kyc">Continue</a></div>';
 else if(v.status==='submitted')banner='<div class="banner o"><div class="ic o">'+I('hour')+'</div><div><b>Verification in progress</b>We are checking your documents. We will notify you when the result is ready.</div></div>';
 else if(v.status==='rejected')banner='<div class="banner o"><div class="ic r">'+I('warn')+'</div><div style="flex:1"><b>Verification not approved</b>Tap to see why and fix it.</div><a class="btn org sm" data-act="rejOpen">View</a></div>';
 if(IK.verified()&&('Notification' in window)&&Notification.permission==='denied'&&s.settings.tradeAlerts)banner+='<div class="banner o"><div class="ic o">'+I('belloff')+'</div><div style="flex:1"><b>Alerts are off</b>Turn on notifications in your phone settings.</div><a class="btn org sm" data-act="notifBlockedOpen">Fix</a></div>';
 var closed=s.trades.filter(function(t){return t.status==='closed'}),won=closed.filter(function(t){return t.result==='won'}).length,lost=closed.length-won;
 return '<div class="hd"><div class="mini">'+IK.crown(34)+'<div>INVESTO <span>KINGS</span></div></div><div class="bell" data-go="notifications">'+I('bell',22)+(IK.unread()?'<i class="dot"></i>':'')+'</div></div>'
 +'<div class="sub" style="margin-top:18px">Welcome back</div><div style="font-size:26px;font-weight:800">'+esc(u.name)+'</div>'+banner
 +'<div class="prices">'+px('XAGUSD')+px('XAUUSD')+'</div>'
 +'<div class="bal"><div class="l">Main balance</div><div class="big2">'+IK.money(s.balance)+'</div><div class="run"><div><div class="l">Running profit</div><div class="l" style="font-size:12.5px">'+(run.length?run.length+' open trade'+(run.length>1?'s':''):'No open trades')+'</div></div><div style="font-size:22px;font-weight:800" data-pltotal>R 0.00</div></div></div>'
 +'<div class="grid2"><div class="stat" data-tab="history"><div class="l">Total trades</div><div class="v">'+(closed.length+run.length)+'</div></div><div class="stat" data-tab="history"><div class="l">Won</div><div class="v pos">'+won+'</div></div><div class="stat" data-tab="history"><div class="l">Lost</div><div class="v neg">'+lost+'</div></div><div class="stat" data-tab="wallet"><div class="l">Withdrawn so far</div><div class="v">'+IK.money(s.withdrawnTotal||0,0)+'</div></div></div>'}};
IK.acts.pxTap=function(x){var a=IK.openAlerts().filter(function(a){return a.symbol===x})[0];if(a){IK.go('execution',{id:a.id});return}if(IK.running().some(function(t){return t.symbol===x}))IK.tab('live');else IK.toast(sym(x)+': no trade right now')};
IK.acts.rejOpen=function(){IK.rejectedSheet()};
IK.acts.notifBlockedOpen=function(){IK.notifBlocked()};

/* ---------- live trades ---------- */
function tradeCard(t,live){var closed=t.status==='closed';
 return '<div class="tc '+(live?'live':closed?(t.result==='won'?'w':'l'):'')+'" data-act="tradeOpen" data-arg="'+t.id+'"><div class="h"><div class="l1">'+sideChip(t.side)+'<b>'+sym(t.symbol)+'</b></div>'+(live?IK.chip('Running','g'):IK.chip(t.result==='won'?'Won':'Lost',t.result==='won'?'g':'r'))+'</div>'
 +(live?'<div class="pl" data-pl="'+t.id+'">+R 0.00</div>':'<div class="pl '+(t.pnl>=0?'pos':'neg')+'">'+(t.pnl>=0?'+':'-')+IK.money(Math.abs(t.pnl))+'</div>')
 +'<div class="gd"><div><small>Entry price</small><b>'+IK.num(t.entry)+'</b></div>'+(live?'<div><small>Current price</small><b data-px="'+t.symbol+'">'+IK.num(IK.px[t.symbol])+'</b></div>':'<div><small>Exit price</small><b>'+IK.num(t.exit)+'</b></div>')
 +'<div><small>Stop loss</small><b class="neg">'+IK.num(t.sl)+'</b></div><div><small>Take profit</small><b class="pos">'+IK.num(t.tp)+'</b></div><div><small>Risk amount</small><b>'+IK.money(t.risk)+'</b></div>'+(live?'<div><small>Opened</small><b>'+IK.dt(t.openedAt)+'</b></div>':'<div><small>Closed by</small><b>'+esc(t.closedBy)+'</b></div><div><small>Opened</small><b>'+IK.dt(t.openedAt)+'</b></div><div><small>Closed</small><b>'+IK.dt(t.closedAt)+'</b></div>')+'</div><div class="id">Trade ID '+t.id+'</div></div>'}
IK.screens.live={tab:'live',render:function(){var run=IK.running(),al=IK.openAlerts();
 var h='<div class="hd"><div class="mini">'+IK.crown(34)+'<div>INVESTO <span>KINGS</span></div></div></div><h1 class="h1">Live trades</h1>';
 if(al.length)h+='<div class="sec">Open trade alerts</div>'+al.map(function(a){return '<div class="card pad mt8" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b style="font-size:17px">'+sym(a.symbol)+' '+a.side+'</b><div class="ora" style="font-size:13px">Closes in <span data-cd="'+a.id+'">'+IK.mmss(a.expiresAt-Date.now())+'</span></div></div><a class="btn sm" '+IK.go_('execution',{id:a.id})+'>Place</a></div>'}).join('');
 if(!run.length&&!al.length)return h+'<div class="empty"><div class="ci">'+I('trend')+'</div><h2>No live trades</h2><p class="sub">When you place a trade it will appear here.</p></div>';
 if(run.length)h+='<div class="card pad mt16" style="display:flex;justify-content:space-between;align-items:center"><div><div class="sub" style="margin:0">Running profit</div><div class="sub" style="margin:2px 0 0;font-size:12.5px">'+run.length+' open trade'+(run.length>1?'s':'')+'</div></div><div style="font-size:26px;font-weight:800" data-pltotal>R 0.00</div></div>'+run.map(function(t){return tradeCard(t,true)}).join('')+'<p class="sub center" style="font-size:13px;margin-top:14px">Trades close automatically at stop loss or take profit.</p>';
 return h}};
IK.acts.tradeOpen=function(id){var t=S().trades.filter(function(x){return x.id===id})[0];if(!t)return;var live=t.status==='running';
 var rows=[['Trade ID',t.id],['Entry price',IK.num(t.entry)]];
 if(live)rows.push(['Current price','<span data-px="'+t.symbol+'">'+IK.num(IK.px[t.symbol])+'</span>']);else rows.push(['Exit price',IK.num(t.exit)]);
 rows.push(['Stop loss',IK.num(t.sl),'neg'],['Take profit',IK.num(t.tp),'pos'],['Risk amount',IK.money(t.risk)]);
 if(live)rows.push(['Opened',IK.dt(t.openedAt)]);else rows.push(['Closed by',esc(t.closedBy)],['Opened',IK.dt(t.openedAt)],['Closed',IK.dt(t.closedAt)]);
 IK.sheet(IK.shead(sym(t.symbol)+' '+t.side)+'<div class="mt8">'+(live?IK.chip('Running','g'):IK.chip(t.result==='won'?'Won':'Lost',t.result==='won'?'g':'r'))+'</div>'+(live?'<div style="font-size:30px;font-weight:800;margin-top:10px" data-pl="'+t.id+'">+R 0.00</div>':'<div class="'+(t.pnl>=0?'pos':'neg')+'" style="font-size:30px;font-weight:800;margin-top:10px">'+(t.pnl>=0?'+':'-')+IK.money(Math.abs(t.pnl))+'</div>')
 +'<div class="mt12">'+IK.rows(rows)+'</div>'+(live?'<p class="sub" style="font-size:13px;color:#8a8a8a">Trades close automatically at stop loss or take profit.</p>':'')+'<a class="btn line" data-close>Close</a>');IK.liveUpdate()};

/* ---------- history ---------- */
var HF='all';
IK.screens.history={tab:'history',render:function(){var closed=S().trades.filter(function(t){return t.status==='closed'}).sort(function(a,b){return b.closedAt-a.closedAt}),won=closed.filter(function(t){return t.result==='won'}).length;
 var list=closed.filter(function(t){return HF==='all'||t.result===HF});
 var h='<div class="hd"><div class="mini">'+IK.crown(34)+'<div>INVESTO <span>KINGS</span></div></div></div><h1 class="h1">Transaction history</h1>'
 +'<div class="sum3"><div><small>Closed</small><b>'+closed.length+'</b></div><div><small>Won</small><b class="pos">'+won+'</b></div><div><small>Lost</small><b class="neg">'+(closed.length-won)+'</b></div></div>'
 +'<div class="chips mt12">'+[['all','All'],['won','Won'],['lost','Lost']].map(function(f){return '<button class="'+(HF===f[0]?'on':'')+'" data-act="histF" data-arg="'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>';
 if(!closed.length)return h+'<div class="empty" style="margin-top:60px"><div class="ci">'+I('clock')+'</div><h2>No closed trades yet</h2><p class="sub">Your closed trades will appear here.</p></div>';
 return h+(list.length?list.map(function(t){return tradeCard(t,false)}).join(''):'<p class="sub center mt24">No '+HF+' trades.</p>')}};
IK.acts.histF=function(f){HF=f;IK.refresh()};

/* ---------- profile ---------- */
IK.screens.profile={tab:'profile',render:function(){var s=S(),u=s.user,v=s.verify,k=v.kyc,ok=IK.verified(),sub=v.status==='submitted',rej=v.status==='rejected';
 var st=function(flag,labelOk){return ok?IK.chip('Verified','g'):sub&&flag?IK.chip('Under review','o'):flag?IK.chip('Added','x'):IK.chip(rej&&labelOk?'Action needed':'Not added','r')};
 var row=function(l,val,chip,lock,why){return '<div class="row"><span style="color:#fff"><small style="margin:0 0 2px">'+l+'</small><b style="display:block;text-align:left;font-size:16px">'+val+(lock?' &#128274;':'')+'</b>'+(why?'<small style="color:#ff8a8a">'+why+'</small>':'')+'</span>'+chip+'</div>'};
 var ini=u.name.split(' ').map(function(x){return x[0]}).slice(0,2).join('').toUpperCase();
 var alert=ok?'<div class="banner g"><div><b>Fully verified</b>Your identity is confirmed. You will receive trade alerts.</div></div>':sub?'<div class="banner o"><div class="ic o">'+I('hour')+'</div><div><b>Verification in progress</b>We are checking your documents.</div></div>':'<div class="banner o"><div style="flex:1"><b>Verification needed</b>'+(rej?esc(v.reason):'Finish verification to start receiving trade alerts.')+'</div><a class="btn org sm" data-act="'+(rej?'rejUpload':'kycGo')+'">'+(rej?'Upload again':'Continue')+'</a></div>';
 return '<div class="hd"><div class="mini">'+IK.crown(34)+'<div>INVESTO <span>KINGS</span></div></div></div><h1 class="h1">Profile</h1>'
 +'<div style="display:flex;align-items:center;gap:14px;margin-top:14px"><div class="av">'+esc(ini)+'</div><div><b style="font-size:21px;display:block">'+esc(u.name)+'</b><div class="mt8">'+(ok?'<span class="chip buy">&#10003; Verified</span>':IK.chip('Not verified','r'))+'</div></div></div>'+alert
 +'<div class="sec">Personal details</div><div class="card">'+row('Full name',esc(u.name),st(true),true)+row('Mobile number',IK.fmtPhone(u.phone),ok?IK.chip('Verified','g'):IK.chip(v.mobile?'Verified':'Not verified',v.mobile?'g':'r'))+row('Email address',esc(u.email),IK.chip('Verified','g'))+row('SA ID',k.idFront&&k.idBack?'Smart Card added':'Not added',st(k.idFront&&k.idBack),true)+row('Face scan',k.face?'Completed':'Not done',st(k.face),true)+row('Proof of address',k.addr?'Document added':'Not added',st(k.addr,true),ok,rej?'Statement is older than 3 months':'')+'</div>'
 +'<div class="sec">Account</div><div class="card">'
 +'<div class="row tap" data-act="bankSheet"><span>Bank details<small>'+(s.bank?esc(s.bank.bank)+', account ending '+esc(s.bank.number.slice(-4)):'Not added')+'</small></span><b class="ora">'+(s.bank?'Edit':'Add')+'</b></div>'
 +'<div class="row tap" data-act="contactSheet"><span>Email and mobile<small>Change contact details</small></span><b class="ora">Edit</b></div>'
 +'<div class="row tap" data-go="agreementview"><span>Client Agreement<small>'+(v.agreement?'Accepted '+IK.date(v.agreement.at)+', version '+v.agreement.v:'Not accepted')+'</small></span><b class="ora">View</b></div>'
 +'<div class="row tap" data-go="statements"><span>Statements</span>'+I('chev',20)+'</div><div class="row tap" data-go="settings"><span>Settings</span>'+I('chev',20)+'</div><div class="row tap" data-go="help"><span>Help and Support</span>'+I('chev',20)+'</div><div class="row tap" data-go="about"><span>About &amp; Contact</span>'+I('chev',20)+'</div>'
 +'<div class="row tap" data-act="logoutAsk"><span class="neg" style="font-weight:700">Log out</span></div></div><p class="sub center" style="font-size:12.5px;margin-top:18px">Investo Kings test build '+IK.cfg.VERSION+'</p>'}};
IK.acts.kycGo=function(){IK.go('kyc')};
IK.screens.agreementview={render:function(){var a=S().verify.agreement;return IK.hdr('Client Agreement')+'<div class="banner g"><div>'+(a?'Accepted on <b>'+IK.date(a.at)+'</b>, version '+a.v:'Not accepted yet')+'</div></div><div class="mt8">'+IK.screens.agreementfull.render().replace(/^.*?<h1/,'<h1')+'</div>'}};
IK.acts.logoutAsk=function(){IK.dlg('<h2>Log out?</h2><p class="sub mt8">You will not receive trade alerts until you log in again.</p><a class="btn red" data-act="logout">Log out</a><a class="btn" data-close>Stay logged in</a>')};
IK.acts.logout=function(){IK.closeAll();S().loggedIn=false;IK.save();IK.go('login',{},{reset:true})};

/* ---------- notifications ---------- */
var NF='all';
IK.screens.notifications={render:function(){var s=S(),ls=s.notifs.filter(function(n){return NF==='all'||(NF==='trades'?n.type==='trade':n.type!=='trade')});
 var ic={trade:['bolt','g'],money:['down','g'],account:['shield','g']};
 var grp=function(n){var d=new Date(n.ts),t=new Date(),y=new Date(Date.now()-864e5);return d.toDateString()===t.toDateString()?'Today':d.toDateString()===y.toDateString()?'Yesterday':'Earlier'};
 var h=IK.hdr('Notifications',{right:'<div class="ora" style="font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap" data-act="readAll">Mark all read</div>'})+'<div class="chips mt12">'+[['all','All'],['trades','Trades'],['account','Account']].map(function(f){return '<button class="'+(NF===f[0]?'on':'')+'" data-act="notifF" data-arg="'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>';
 if(!ls.length)return h+'<div class="empty"><div class="ci">'+I('bell')+'</div><h2>No notifications yet</h2><p class="sub">Trade alerts and account updates will appear here.</p></div>';
 var last='';ls.forEach(function(n){var g=grp(n);if(g!==last){h+='<div class="sec">'+g+'</div>';last=g}var m=n.type==='money'?(/Withdrawal/.test(n.title)?['up','o']:['down','g']):ic[n.type]||ic.account;if(n.chip==='Missed')m=['bolt','r'];
  h+='<div class="nt'+(n.read?'':' un')+'" data-act="notifOpen" data-arg="'+n.id+'"><div class="ic '+m[1]+'">'+I(m[0])+'</div><div class="tx"><b>'+esc(n.title)+'</b><p>'+esc(n.body)+'</p>'+(n.chip?'<span class="chip '+(n.chip==='Missed'?'r':'g')+'" style="margin-top:5px">'+esc(n.chip)+'</span>':'')+'</div><div class="tm">'+(g==='Today'?IK.time(n.ts):IK.date(n.ts).slice(0,6))+'</div>'+(n.read?'':'<i class="dot"></i>')+'</div>'});
 return h}};
IK.acts.notifF=function(f){NF=f;IK.refresh()};
IK.acts.readAll=function(){S().notifs.forEach(function(n){n.read=true});IK.save();IK.refresh()};
IK.acts.notifOpen=function(id){var n=S().notifs.filter(function(x){return x.id===id})[0];if(!n)return;n.read=true;IK.save();var r=n.ref;
 if(!r){IK.refresh();return}
 if(r.kind==='alert'){var a=S().alerts.filter(function(x){return x.id===r.id})[0];if(!a)return;if(a.state==='open')IK.go('execution',{id:a.id});else if(a.state==='placed')IK.csheet('check','','Trade already placed','<p class="sub">You have already placed this trade.</p><a class="btn" data-tab="live">View live trades</a><a class="link" data-close>Close</a>');else IK.windowClosed(a)}
 else if(r.kind==='trade')IK.acts.tradeOpen(r.id);else if(r.kind==='wd')IK.acts.wdOpen(r.id);else if(r.kind==='deposit')IK.acts.depOpen(r.id);else if(r.kind==='profile')IK.tab('profile');else IK.refresh()};

/* ---------- trade execution ---------- */
IK.screens.execution={render:function(p){var a=S().alerts.filter(function(x){return x.id===p.id})[0];if(!a)return IK.hdr('Place trade')+'<div class="empty"><h2>Trade not found</h2></div>';
 var f=Math.max(0,(a.expiresAt-Date.now())/a.windowMs);
 return '<div class="hd"><div class="back" data-act="execBack" data-arg="'+a.id+'">'+I('back',22)+'</div><div class="ttl">Place trade</div><div class="sp"></div></div>'
 +'<div class="ring"><svg viewBox="0 0 210 210"><circle cx="105" cy="105" r="92" fill="none" stroke="#2b2b2b" stroke-width="12"/><circle data-ring="'+a.id+'" cx="105" cy="105" r="92" fill="none" stroke="#39ff14" stroke-width="12" stroke-linecap="round" stroke-dasharray="578" stroke-dashoffset="'+(578*(1-f)).toFixed(1)+'" style="filter:drop-shadow(0 0 8px #39ff14)"/></svg><div class="t"><span>Window closes in</span><b data-cd="'+a.id+'">'+IK.mmss(a.expiresAt-Date.now())+'</b></div></div>'
 +'<div class="center mt12">'+sideChip(a.side)+' <b style="font-size:22px;margin-left:8px">'+sym(a.symbol)+' ('+a.symbol+')</b></div>'
 +'<div class="riskbox"><div class="l">Risk amount</div><div class="v">'+IK.money(a.risk)+'</div><p>This is the most you can lose on this trade.</p></div>'
 +'<div class="mt12">'+IK.rows([['Entry price',IK.num(a.entry)],['Stop loss',IK.num(a.sl),'neg'],['Take profit',IK.num(a.tp),'pos']])+'</div>'
 +'<a class="btn" data-act="placeTrade" data-arg="'+a.id+'" style="font-size:19px;padding:18px">Place trade</a><p class="sub center" style="font-size:12.5px">Trading carries a high level of risk. You may lose some or all of the risk amount.</p><a class="link" data-act="execSkip" data-arg="'+a.id+'">Skip this trade</a>'},
 mount:function(el,p){if(p.shown)return;p.shown=true;var a=S().alerts.filter(function(x){return x.id===p.id})[0];if(!a)return;if(a.state==='placed')setTimeout(function(){IK.csheet('check','','Trade already placed','<p class="sub">You have already placed this trade.</p><a class="btn" data-tab="live">View live trades</a><a class="link" data-close>Close</a>')},50);else if(a.state!=='open')setTimeout(function(){IK.windowClosed(a)},50)}};
IK.acts.execBack=function(id){var a=S().alerts.filter(function(x){return x.id===id})[0];if(a&&a.state==='open'){IK.dlg('<h2>Leave this trade?</h2><p class="sub mt8">The window is still open for <b data-cd="'+id+'">'+IK.mmss(a.expiresAt-Date.now())+'</b>. You can come back until it ends.</p><a class="btn" data-close>Stay and place trade</a><a class="btn line" data-act="execLeave">Leave</a>',{cls:'or'})}else IK.back()};
IK.acts.execLeave=function(){IK.closeTop();IK.back()};
IK.acts.execSkip=function(id){var a=S().alerts.filter(function(x){return x.id===id})[0];if(a&&a.state==='open'){a.state='skipped';IK.save()}IK.tab('dashboard');IK.toast('Trade skipped')};
IK.acts.placeTrade=function(id){var s=S(),a=s.alerts.filter(function(x){return x.id===id})[0];if(!a)return;
 if(a.state==='placed'){IK.csheet('check','','Trade already placed','<p class="sub">You have already placed this trade.</p><a class="btn" data-tab="live">View live trades</a><a class="link" data-close>Close</a>');return}
 if(a.state!=='open'||Date.now()>=a.expiresAt){IK.windowClosed(a);return}
 if(!IK.guard())return;
 if(s.balance<a.risk){IK.csheet('warn','o','Not enough balance','<p class="sub">Your balance is too low for the risk amount of '+IK.money(a.risk)+'. Deposit to place trades.</p><a class="btn" data-act="goDeposit">Deposit</a><a class="link" data-close>Close</a>');return}
 if(s.test.failNext){s.test.failNext=false;IK.save();IK.csheet('warn','r','Trade could not be placed','<p class="sub">Something went wrong. Please try again while the window is still open.</p><p style="margin-top:10px;color:#d0d0d0">Window closes in <b class="pos" data-cd="'+a.id+'">'+IK.mmss(a.expiresAt-Date.now())+'</b></p><a class="btn" data-act="placeTrade" data-arg="'+a.id+'">Try again</a><a class="link" data-close>Close</a>');return}
 var t={id:'IK-T'+(100+s.seq.trade++),symbol:a.symbol,side:a.side,entry:a.entry,sl:a.sl,tp:a.tp,risk:a.risk,openedAt:Date.now(),status:'running'};s.trades.unshift(t);a.state='placed';s.hasTraded=true;IK.save();
 IK.closeAll();IK.csheet('check','','Trade placed',IK.rows([['Trade',sym(t.symbol)+' '+t.side],['Entry price',IK.num(t.entry)],['Risk amount',IK.money(t.risk)],['Placed at',IK.time(t.openedAt)]])+'<a class="btn" data-tab="live">View live trades</a><a class="link" data-tab="dashboard">Close</a>',{modal:true})};
})();
