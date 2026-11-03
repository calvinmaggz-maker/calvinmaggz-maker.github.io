/* INVESTO KINGS - AI Trading simulation engine + shared store (SIMULATION ONLY, virtual funds)
   Runs inside the Admin page (the "server"). The client app reads state and sends commands.
   Store adapter: LocalStore (same browser) now; a remote store can replace it later without UI changes. */
(function(g){
'use strict';
var KEY='ik_ai_state_v1',CMD='ik_ai_cmd_v1';
var AI=g.IKAI={};
var DEF={minBalance:1000,riskStopPct:10,scalpRiskPct:8,commissionPerLot:7,closeRetries:3,retryGapS:2,guardianS:15,noEntryBeforeExpiryS:600,weekendCloseHour:23,weekendCloseMin:55};
AI.DEF=DEF;
var SPEC=AI.SPEC={
 XAUUSD:{name:'Gold',contract:100,dig:2,spread:.25,vol:.13,lev:500,p0:4018.35,tp:1.0,sl:.8,hold:90},
 GBPUSD:{name:'British Pound',contract:100000,dig:5,spread:.00012,vol:.000022,lev:500,p0:1.3042,tp:.00026,sl:.00022,hold:90},
 EURUSD:{name:'Euro',contract:100000,dig:5,spread:.0001,vol:.00002,lev:500,p0:1.0842,tp:.00024,sl:.0002,hold:90},
 BTCUSD:{name:'Bitcoin',contract:1,dig:2,spread:12,vol:9,lev:30,p0:68120,tp:38,sl:30,hold:120}};
AI.INSTRUMENTS=Object.keys(SPEC);
/* ---------- time (SAST) ---------- */
function sast(t){var d=new Date(t+2*3600000);return {dow:d.getUTCDay(),h:d.getUTCHours(),m:d.getUTCMinutes(),d:d}}
AI.instrumentOpen=function(sym,t){if(sym==='BTCUSD')return true;var s=sast(t),mins=s.h*60+s.m,cutoff=DEF.weekendCloseHour*60+DEF.weekendCloseMin;
 if(s.dow===6||s.dow===0)return false;if(s.dow===5&&mins>=cutoff)return false;if(s.dow===1&&mins<5)return false;return true};
AI.weekend=function(t){var s=sast(t),mins=s.h*60+s.m;return s.dow===6||s.dow===0||(s.dow===5&&mins>=DEF.weekendCloseHour*60+DEF.weekendCloseMin)||(s.dow===1&&mins<5)};
/* ---------- store ---------- */
var mem=null,saveT=0;
function fresh(){var now=Date.now(),px={};AI.INSTRUMENTS.forEach(function(s){px[s]={mid:SPEC[s].p0,drift:0}});
 var st={v:1,speed:1,simNow:now,realBase:now,master:{heartbeat:now,down:false},session:null,schedule:[],history:[],notices:[],seq:{n:1,sess:27,pos:1000,sig:1,scalp:1},
  px:px,usdzar:18.0,mood:'trending',settings:JSON.parse(JSON.stringify(DEF)),scen:{failClose:false,spreadMult:1},
  botsJoin:true,accounts:{},signals:[],log:[],pnlSeries:[]};
 [['A','Client A',500],['B','Client B',1000],['C','Client C',2500],['D','Client D',5000]].forEach(function(a){st.accounts[a[0]]=newAcc(a[0],a[1],a[2],true)});
 return st}
function newAcc(id,name,bal,bot){return {id:id,name:name,bot:!!bot,balance:bal,verified:true,agreement:true,status:'IDLE',instruments:['XAUUSD','GBPUSD','BTCUSD'],lot:.01,perScalp:2,target:Math.round(bal*1.2),startBalance:bal,positions:[],run:null,lastRun:null,closing:null,ranSession:null}}
AI.load=function(){try{var j=localStorage.getItem(KEY);if(j){var s=JSON.parse(j);if(s&&s.v===1){mem=s;return s}}}catch(e){}mem=fresh();return mem};
AI.read=function(){try{var j=localStorage.getItem(KEY);return j?JSON.parse(j):null}catch(e){return null}};
AI.state=function(){return mem||AI.load()};
AI.save=function(){try{mem.savedAt=Date.now();localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){}};
AI.reset=function(){mem=fresh();AI.save();try{localStorage.removeItem(CMD)}catch(e){}return mem};
/* client side: send a command */
AI.cmd=function(type,payload){var id=Date.now()+'-'+Math.random().toString(36).slice(2,6);try{var q=JSON.parse(localStorage.getItem(CMD)||'[]');q.push({id:id,type:type,p:payload||{}});localStorage.setItem(CMD,JSON.stringify(q.slice(-200)))}catch(e){}return id};
AI.use=function(s){mem=s};
function takeCmds(){try{var q=JSON.parse(localStorage.getItem(CMD)||'[]');if(q.length)localStorage.setItem(CMD,'[]');return q}catch(e){return[]}}
/* ---------- helpers ---------- */
function S(){return mem}
function logEv(m){var s=S();s.log.unshift({t:s.simNow,m:m});if(s.log.length>60)s.log.length=60}
function notice(to,type,title,body){var s=S();s.notices.push({id:s.seq.n++,to:to,type:type,title:title,body:body,ts:s.simNow});if(s.notices.length>150)s.notices.shift()}
function bid(sym){var s=S(),sp=SPEC[sym].spread*s.scen.spreadMult;return s.px[sym].mid-sp/2}
function ask(sym){var s=S(),sp=SPEC[sym].spread*s.scen.spreadMult;return s.px[sym].mid+sp/2}
function round(n,d){var f=Math.pow(10,d);return Math.round(n*f)/f}
function pnlUSD(p,exit){var d=p.side==='BUY'?exit-p.entry:p.entry-exit;return d*SPEC[p.sym].contract*p.lot}
function marginZAR(sym,lot,price){return price*SPEC[sym].contract*lot/SPEC[sym].lev*S().usdzar}
function floating(acc){var s=S(),t=0;acc.positions.forEach(function(p){var ex=p.side==='BUY'?bid(p.sym):ask(p.sym);t+=pnlUSD(p,ex)*s.usdzar});return t}
function marginUsed(acc){var t=0;acc.positions.forEach(function(p){t+=marginZAR(p.sym,p.lot,p.entry)});return t}
AI.metrics=function(acc){var fl=floating(acc),eq=acc.balance+fl,mu=marginUsed(acc);return {floating:fl,equity:eq,margin:mu,free:eq-mu,level:mu>0?eq/mu*100:null}};
AI.estMargin=function(sym,lot){var s=S();return marginZAR(sym,lot||.01,s.px[sym].mid)};
/* ---------- sessions ---------- */
AI.createSession=function(o){var s=S(),id='AI-'+('0000'+(s.seq.sess++)).slice(-4);var ses={id:id,name:o.name||'AI session',start:o.start,expiry:o.expiry,instruments:o.instruments.slice(),state:'SCHEDULED',reminded:{},createdAt:s.simNow};
 if(ses.start<=s.simNow&&ses.expiry>s.simNow){s.schedule.push(ses);AI.activate(ses.id)}else s.schedule.push(ses);AI.save();return ses};
AI.activateNow=function(o){var s=S();if(s.session&&s.session.state!=='ENDED')return null;var d=(o&&o.minutes)||120;var ses={id:'AI-'+('0000'+(s.seq.sess++)).slice(-4),name:(o&&o.name)||'Manual session',start:s.simNow,expiry:s.simNow+d*60000,instruments:((o&&o.instruments)||AI.INSTRUMENTS).slice(),state:'SCHEDULED',reminded:{},createdAt:s.simNow};s.schedule.push(ses);AI.activate(ses.id);AI.save();return ses};
AI.activate=function(id){var s=S();var ses=s.schedule.filter(function(x){return x.id===id})[0];if(!ses)return false;if(s.session&&s.session.state!=='ENDED')return false;
 ses.state='ACTIVE';ses.activatedAt=s.simNow;ses.stats={scalps:0,trades:0,wins:0,losses:0};s.session=ses;s.signals=[];s.pnlSeries=[];s.master.heartbeat=s.simNow;
 Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];a.run=null;a.ranSession=a.ranSession===ses.id?a.ranSession:null;if(['RUNNING','STOPPING'].indexOf(a.status)<0)a.status='IDLE'});
 logEv('Session '+ses.id+' ACTIVE');notice('all','session','AI session is live','AI Trading is live until '+hhmm(ses.expiry)+'. Press START AI to take part.');
 if(s.botsJoin)botsStart();return true};
function hhmm(t){var d=new Date(t+2*3600000);return ('0'+d.getUTCHours()).slice(-2)+':'+('0'+d.getUTCMinutes()).slice(-2)}
function botsStart(){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(!a.bot)return;var r=AI.canStart(a);if(r.ok)AI.start(k,{instruments:a.instruments,lot:a.lot,perScalp:k==='C'?4:2,target:Math.round(a.balance*(k==='B'?1.12:1.2))})})}
AI.terminate=function(reason){var s=S(),ses=s.session;if(!ses||ses.state!=='ACTIVE')return false;ses.state='ENDING';ses.endedBy=reason||'TERMINATED';ses.endingAt=s.simNow;
 logEv('Session ending ('+ses.endedBy+'): closing all positions');notice('all','session','AI session ending','The AI session is ending. All AI positions are being closed.');
 Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(a.status==='RUNNING')beginClose(a,'expiry');else if(a.status==='STOPPING')a.closing='expiry'});AI.save();return true};
/* ---------- account actions ---------- */
AI.canStart=function(a){var s=S(),ses=s.session;
 if(!ses||ses.state!=='ACTIVE')return {ok:false,code:'NOSESSION',msg:'No AI session is live.'};
 if(a.ranSession===ses.id)return {ok:false,code:'RAN',msg:'You already used AI in this session.'};
 if(!a.verified)return {ok:false,code:'UNVERIFIED',msg:'Verify your identity first.'};
 if(!a.agreement)return {ok:false,code:'AGREEMENT',msg:'Sign the AI agreement first.'};
 if(a.balance<s.settings.minBalance)return {ok:false,code:'BALANCE',msg:'AI needs a balance of at least R '+s.settings.minBalance+'.'};
 if(simLeft()<s.settings.noEntryBeforeExpiryS*1000)return {ok:false,code:'LATE',msg:'Too close to the end of the session.'};
 return {ok:true}};
function simLeft(){var s=S();return s.session?s.session.expiry-s.simNow:0}
AI.start=function(id,o){var s=S(),a=s.accounts[id];if(!a)return {ok:false,code:'NOACC',msg:'Unknown account.'};var r=AI.canStart(a);if(!r.ok)return r;
 var open=(o.instruments||[]).filter(function(x){return s.session.instruments.indexOf(x)>=0&&AI.instrumentOpen(x,s.simNow)});
 if(!open.length)return {ok:false,code:'INSTR',msg:'None of your instruments are open right now.'};
 var lot=Math.max(.01,Math.round((o.lot||.01)*100)/100);
 var can=open.filter(function(x){return marginZAR(x,.01,s.px[x].mid)*2<a.balance*.4});if(!can.length)return {ok:false,code:'MARGIN',msg:'Your balance cannot safely support the minimum position size.'};
 if(!(o.target>a.balance))return {ok:false,code:'TARGET',msg:'Your target must be above your balance.'};
 a.instruments=open;a.lot=lot;a.perScalp=o.perScalp===4?4:2;a.target=o.target;a.startBalance=a.balance;a.status='RUNNING';a.closing=null;a.ranSession=s.session.id;
 a.run={sessionId:s.session.id,startBalance:a.balance,target:a.target,startedAt:s.simNow,trades:[],scalps:0,wins:0,losses:0,pnl:0,series:[],endStatus:null};
 logEv(a.name+' started AI (target R'+Math.round(a.target)+')');return {ok:true}};
AI.stop=function(id){var a=S().accounts[id];if(!a||a.status!=='RUNNING')return false;beginClose(a,'client');return true};
function beginClose(a,reason){a.closing=reason;a.status=reason==='target'||reason==='risk'||reason==='expiry'||reason==='guardian'?a.status:'STOPPING';if(a.status==='RUNNING')a.status='STOPPING';
 a.positions.forEach(function(p){if(!p.closeReq)p.closeReq={reason:reason,attempts:0,nextAt:S().simNow}});logEv(a.name+': closing all positions ('+reason+')')}
/* ---------- close pipeline ---------- */
function realize(a,p,exit,why){var s=S();var gross=pnlUSD(p,exit)*s.usdzar,cost=p.lot*s.settings.commissionPerLot*s.usdzar,net=gross-cost;a.balance+=net;
 a.positions=a.positions.filter(function(x){return x!==p});var tr={id:p.id,sym:p.sym,side:p.side,lot:p.lot,entry:p.entry,exit:exit,pnl:net,cost:cost,openedAt:p.openedAt,closedAt:s.simNow,why:why,scalp:p.scalp};
 if(a.run){a.run.trades.push(tr);if(a.run.trades.length>400)a.run.trades.shift();a.run.pnl+=net;if(net>0)a.run.wins++;else a.run.losses++}
 var st=s.session&&s.session.stats;if(st){st.trades++;if(net>0)st.wins++;else st.losses++}return tr}
function processCloses(){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];a.positions.slice().forEach(function(p){if(!p.closeReq||s.simNow<p.closeReq.nextAt)return;
 var fail=s.scen.failClose&&!p.manualOK;if(fail){p.closeReq.attempts++;if(p.closeReq.attempts>=s.settings.closeRetries){p.escalated=true;p.closeReq.nextAt=Infinity;if(!p.alerted){p.alerted=true;logEv('CLOSE FAILED '+a.name+' '+p.sym+' #'+p.id+' (3 retries): admin action needed');notice(a.id,'warn','We are finishing your close','One position could not be closed yet. Our team has been alerted and will close it for you.')}}else p.closeReq.nextAt=s.simNow+s.settings.retryGapS*1000;return}
 realize(a,p,p.side==='BUY'?bid(p.sym):ask(p.sym),p.closeReq.reason)})})}
AI.manualClose=function(posId){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];a.positions.forEach(function(p){if(String(p.id)===String(posId)){p.manualOK=true;p.escalated=false;p.alerted=false;p.closeReq={reason:p.closeReq?p.closeReq.reason:'admin',attempts:0,nextAt:s.simNow}}})});AI.save()};
AI.retryNow=function(posId){var s=S();Object.keys(s.accounts).forEach(function(k){s.accounts[k].positions.forEach(function(p){if(String(p.id)===String(posId)){p.escalated=false;p.alerted=false;p.closeReq={reason:p.closeReq?p.closeReq.reason:'admin',attempts:0,nextAt:s.simNow}}})});AI.save()};
function finalize(){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(!a.closing||a.positions.length)return;
 var map={client:'STOPPED',target:'TARGET_REACHED',risk:'RISK_STOPPED',expiry:'ENDED',guardian:'ENDED',admin:'STOPPED'};var why=a.closing;a.status=map[why]||'STOPPED';
 if(a.run){a.run.endStatus=a.status;a.run.endedAt=s.simNow;a.run.endBalance=a.balance;a.lastRun=a.run}
 var pn=a.run?a.run.pnl:0;logEv(a.name+' '+a.status+' ('+(pn>=0?'+':'')+'R'+pn.toFixed(2)+')');
 var T={TARGET_REACHED:['Target reached','AI has stopped and all positions are closed. Final balance R '+a.balance.toFixed(2)+'.'],STOPPED:['AI stopped','All your AI positions are closed.'],RISK_STOPPED:['AI stopped: risk limit','Your risk limit was reached. All positions are closed.'],ENDED:['AI session ended','The session has ended. All AI positions were closed and confirmed.']}[a.status];if(T)notice(a.id,a.status==='TARGET_REACHED'?'target':'result',T[0],T[1]);a.closing=null});
 var ses=s.session;if(ses&&ses.state==='ENDING'){var left=0;Object.keys(s.accounts).forEach(function(k){left+=s.accounts[k].positions.length});if(!left)endSession()}}
function endSession(){var s=S(),ses=s.session;ses.state='ENDED';ses.endedAt=s.simNow;var parts=[],tg=0,tp=0;
 Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(a.run&&a.run.sessionId===ses.id){parts.push({id:a.id,name:a.name,start:a.run.startBalance,final:a.balance,pnl:a.run.pnl,trades:a.run.trades.length,wins:a.run.wins,losses:a.run.losses,scalps:a.run.scalps,target:a.run.target,status:a.run.endStatus});tp+=a.run.pnl;if(a.run.endStatus==='TARGET_REACHED')tg++}
  else if(a.status==='IDLE'&&a.balance<s.settings.minBalance)parts.push({id:a.id,name:a.name,start:a.balance,final:a.balance,pnl:0,trades:0,wins:0,losses:0,scalps:0,status:'NOT_ELIGIBLE',skip:true})});
 var real=parts.filter(function(p){return !p.skip}),st=ses.stats;var bySym={};Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(a.run&&a.run.sessionId===ses.id)a.run.trades.forEach(function(t){var b=bySym[t.sym]=bySym[t.sym]||{trades:0,wins:0,pnl:0};b.trades++;if(t.pnl>0)b.wins++;b.pnl+=t.pnl})});
 var rep={id:ses.id,name:ses.name,date:ses.start,start:ses.activatedAt||ses.start,end:s.simNow,duration:s.simNow-(ses.activatedAt||ses.start),endedBy:ses.endedBy||'EXPIRY',instruments:ses.instruments,customers:real.length,scalps:real.reduce(function(a,p){return a+p.scalps},0),trades:st.trades,wins:st.wins,losses:st.losses,winRate:st.trades?st.wins/st.trades*100:0,targets:tg,pnl:tp,open:0,parts:parts,bySym:bySym,series:s.pnlSeries.slice(),simulated:true};
 s.history.unshift(rep);if(s.history.length>60)s.history.length=60;ses.report=rep.id;logEv('Session '+ses.id+' ENDED');
 notice('all','session','AI session ended','The AI session has ended. See your results in AI Trading.');AI.save()}
/* ---------- master EA + execution ---------- */
function movePrices(){var s=S(),m=s.mood;s.usdzar=round(Math.max(16,Math.min(20,s.usdzar+(Math.random()-.5)*.0016)),4);
 AI.INSTRUMENTS.forEach(function(k){var p=s.px[k],sp=SPEC[k],phi=m==='trending'?.93:m==='ranging'?-.08:.8,vm=m==='volatile'?2.2:1;
  p.drift=phi*p.drift+(Math.random()-.5)*2*sp.vol*vm*(m==='trending'?.55:1);p.mid=p.mid+p.drift+(Math.random()-.5)*sp.vol*vm*.8;if(m==='ranging')p.mid+=(sp.p0-p.mid)*.002;
  if(s.scen.gap&&s.scen.gap===k){p.mid+=sp.sl*4*(s.scen.gapDir||-1);s.scen.gap=null}p.mid=round(p.mid,sp.dig+1)})}
function masterEA(){var s=S(),ses=s.session;if(!ses||ses.state!=='ACTIVE'||s.master.down)return;if(simLeft()<s.settings.noEntryBeforeExpiryS*1000)return;
 ses.instruments.forEach(function(sym){if(!AI.instrumentOpen(sym,s.simNow))return;var busy=s.signals.some(function(g){return g.sym===sym&&s.simNow<g.expireAt});if(busy||Math.random()>.03)return;
  var d=s.px[sym].drift,side=Math.abs(d)<SPEC[sym].vol*.15?(Math.random()>.5?'BUY':'SELL'):(d>0?'BUY':'SELL');var sp=SPEC[sym],e=side==='BUY'?ask(sym):bid(sym);
  var sig={id:s.seq.sig++,sym:sym,side:side,entry:e,tp:round(side==='BUY'?e+sp.tp:e-sp.tp,sp.dig+1),sl:round(side==='BUY'?e-sp.sl:e+sp.sl,sp.dig+1),at:s.simNow,expireAt:s.simNow+sp.hold*1000,scalp:s.seq.scalp++};
  s.signals.push(sig);if(s.signals.length>40)s.signals.shift();ses.stats.scalps++;logEv('Master: '+sym+' '+side+' @'+e.toFixed(sp.dig));executeSignal(sig)})}
function executeSignal(sig){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(a.status!=='RUNNING'||a.closing||a.positions.length)return;if(a.instruments.indexOf(sig.sym)<0)return;
 var m=AI.metrics(a),mid=s.px[sig.sym].mid,sp=SPEC[sig.sym];
 function safe(n,lot){var req=marginZAR(sig.sym,lot,mid)*n;var risk=sp.sl*sp.contract*lot*n*s.usdzar;return req<=m.free*.4&&risk<=a.balance*s.settings.scalpRiskPct/100}
 var n=a.perScalp,lot=a.lot;if(!safe(n,lot)){n=2;if(!safe(n,lot)){lot=.01;if(!safe(n,lot)){logEv(a.name+': skipped '+sig.sym+' (margin/risk)');return}}}
 for(var i=0;i<n;i++){a.positions.push({id:s.seq.pos++,sym:sig.sym,side:sig.side,lot:lot,entry:sig.entry,tp:sig.tp,sl:sig.sl,openedAt:s.simNow,scalp:sig.scalp,maxHold:sig.expireAt})}
 a.run.scalps++})}
function monitor(){var s=S();Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];
 if(a.status==='RUNNING'&&!a.closing){var m=AI.metrics(a);if(m.equity>=a.target)beginClose(a,'target');else if(m.equity<=a.startBalance*(1-s.settings.riskStopPct/100))beginClose(a,'risk')}
 a.positions.forEach(function(p){if(p.closeReq)return;var ex=p.side==='BUY'?bid(p.sym):ask(p.sym),hit=p.side==='BUY'?(ex>=p.tp||ex<=p.sl):(ex<=p.tp||ex>=p.sl),old=s.simNow>=p.maxHold;
  if(hit||old)p.closeReq={reason:hit?'tpsl':'time',attempts:0,nextAt:s.simNow};
  if(!AI.instrumentOpen(p.sym,s.simNow))p.closeReq=p.closeReq||{reason:'market',attempts:0,nextAt:s.simNow}})})}
/* ---------- main step ---------- */
AI.step=function(){var s=S();s.simNow+=1000;movePrices();var t=s.simNow;
 if(!s.master.down)s.master.heartbeat=t;
 s.schedule.forEach(function(x){if(x.state==='SCHEDULED'){var before=x.start-t;[[86400000,'24h'],[3600000,'1h'],[600000,'10m']].forEach(function(r){if(before<=r[0]&&before>0&&!x.reminded[r[1]]){x.reminded[r[1]]=1;notice('all','reminder','AI session reminder','AI session "'+x.name+'" starts in '+r[1].replace('h',' hour').replace('m',' minutes')+' (at '+hhmm(x.start)+').')}});
   if(t>=x.start&&(!s.session||s.session.state==='ENDED')&&t<x.expiry)AI.activate(x.id);else if(t>=x.expiry)x.state='MISSED'}});
 var ses=s.session;
 if(ses&&ses.state==='ACTIVE'){if(!ses.warned&&ses.expiry-t<=15*60000){ses.warned=1;notice('all','reminder','AI session ending soon','The AI session ends in 15 minutes. No new trades will start in the last 10 minutes.')}
  if(t>=ses.expiry)AI.terminate('EXPIRY');
  if(t-s.master.heartbeat>s.settings.guardianS*1000&&ses.state==='ACTIVE'){logEv('GUARDIAN: master EA silent for '+s.settings.guardianS+'s. Closing everything.');notice('all','warn','Safety stop','The AI engine lost its connection. All positions are being closed.');AI.terminate('GUARDIAN');s.master.down=false}}
 masterEA();monitor();processCloses();finalize();
 if(ses&&(ses.state==='ACTIVE'||ses.state==='ENDING')&&t%30000<1000){var tp=0;Object.keys(s.accounts).forEach(function(k){var a=s.accounts[k];if(a.run&&a.run.sessionId===ses.id)tp+=a.run.pnl+AI.metrics(a).floating});s.pnlSeries.push([t,tp])}};
AI.tick=function(){var s=S();if(!s)return;var now=Date.now(),dt=Math.min(now-(AI._last||now),2000);AI._last=now;
 takeCmds().forEach(handleCmd);
 var steps=Math.max(0,Math.round(dt/1000*s.speed));if(s.speed<1){AI._acc=(AI._acc||0)+dt/1000*s.speed;steps=Math.floor(AI._acc);AI._acc-=steps}
 for(var i=0;i<steps;i++)AI.step();AI.save()};
function handleCmd(c){var s=S(),p=c.p;
 if(c.type==='register'){var a=s.accounts[p.id];if(!a){a=s.accounts[p.id]=newAcc(p.id,p.name||p.id,p.balance||0,false);a.target=Math.round(a.balance*1.2)}a.verified=!!p.verified;a.agreement=!!p.agreement;if(p.control)a.bot=false;if(p.name&&!a.bot)a.name=p.name;if(['RUNNING','STOPPING'].indexOf(a.status)<0&&!a.positions.length&&typeof p.balance==='number'&&!p.skipBalance)a.balance=p.balance;return}
 if(c.type==='release'){if(s.accounts[p.id])s.accounts[p.id].bot=true;return}
 if(c.type==='start'){var r=AI.start(p.id,p);s.accounts[p.id]&&(s.accounts[p.id].lastResult=r);s.results=s.results||{};s.results[c.id]=r;return}
 if(c.type==='stop'){AI.stop(p.id);return}
 if(c.type==='signal'){s.extSignals=s.extSignals||[];s.extSignals.push({id:c.id,p:p,ts:s.simNow})}}
AI.retryAll=function(){var s=S();Object.keys(s.accounts).forEach(function(k){s.accounts[k].positions.forEach(function(p){if(p.escalated){p.escalated=false;p.alerted=false;p.closeReq={reason:p.closeReq?p.closeReq.reason:'admin',attempts:0,nextAt:s.simNow}}})});AI.save()};
AI.adminStop=function(id){var a=S().accounts[id];if(!a||a.status!=='RUNNING')return false;beginClose(a,'admin');AI.save();return true};
AI.forceScalp=function(sym,side){var s=S(),ses=s.session;if(!ses||ses.state!=='ACTIVE')return false;var sp=SPEC[sym],e=side==='BUY'?ask(sym):bid(sym);var sig={id:s.seq.sig++,sym:sym,side:side,entry:e,tp:round(side==='BUY'?e+sp.tp:e-sp.tp,sp.dig+1),sl:round(side==='BUY'?e-sp.sl:e+sp.sl,sp.dig+1),at:s.simNow,expireAt:s.simNow+sp.hold*1000,scalp:s.seq.scalp++};s.signals.push(sig);ses.stats.scalps++;logEv('Test Lab: '+sym+' '+side+' scalp generated');executeSignal(sig);AI.save();return true};
AI.sendSignal=function(p){var s=S();s.extSignals=s.extSignals||[];var id='X'+(s.seq.n++);s.extSignals.push({id:id,p:p,ts:s.simNow});if(s.extSignals.length>60)s.extSignals.shift();AI.save();return id};
AI.notify=function(to,title,body){notice(to,'info',title,body);AI.save()};
AI.addTestAccount=function(name,bal){var s=S(),id='T'+(s.seq.n++);s.accounts[id]=newAcc(id,name||('Test '+id),bal,true);AI.save();return id};
AI.resetAccount=function(id){var s=S(),a=s.accounts[id];if(!a||a.positions.length)return false;var base={A:500,B:1000,C:2500,D:5000}[id]||a.startBalance;a.balance=base;a.status='IDLE';a.run=null;a.ranSession=null;a.closing=null;AI.save();return true};
AI.setSpeed=function(x){var s=S();s.speed=x;AI.save()};
AI.setSimTime=function(ts){var s=S();s.simNow=ts;AI.save()};
AI.fmtClock=function(t){var d=new Date(t+2*3600000),D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];return D[d.getUTCDay()]+' '+hhmm(t)};
})(typeof window!=='undefined'?window:globalThis);
