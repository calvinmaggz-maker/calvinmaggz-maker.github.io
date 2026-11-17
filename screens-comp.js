/* INVESTO KINGS client: account levels, limits, own-name checks and activity reporting (TEST). */
(function(){
'use strict';
var IK=window.IK,AIE=window.IKAI,S=function(){return IK.S},$=IK.$,esc=IK.esc,money=IK.money;
var DEFT={1:{name:'Tier 1',dep:20000,voucher:5000,wd:50000,hold:72},2:{name:'Tier 2',dep:100000,voucher:10000,wd:200000,hold:48},3:{name:'Tier 3',dep:1000000,voucher:10000,wd:200000,hold:24}};
var D=864e5,H=36e5;
function st(){return AIE.read&&AIE.read()}
function myAcc(){var r=st();return r&&r.accounts&&r.accounts[S().aiAcc||'ME']||null}
function tier(){var r=st(),T=(r&&r.comp&&r.comp.tiers)||DEFT,a=myAcc();return T[(a&&a.tier)||1]||T[1]}
function num(id){var el=$('#'+id);return el?parseFloat((el.value||'').replace(/[^0-9.]/g,''))||0:0}
function norm(n){return (n||'').toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean)}
function nameMatch(a,b){var x=norm(a),y=norm(b);if(!x.length||!y.length)return false;var sh=x.length<=y.length?x:y,lo=x.length<=y.length?y:x;return sh.every(function(t){return lo.some(function(u){return u===t||(t.length===1&&u[0]===t)||(u.length===1&&t[0]===u)})})}
function sum(list,since,f){return list.filter(function(d){return d.date>=since&&(!f||f(d))}).reduce(function(t,d){return t+d.amount},0)}
function devId(){return localStorage.getItem('ik_dev')||'local'}
function limitMsg(title,body){IK.csheet('lock','o',title,'<p class="sub" style="line-height:1.55">'+body+'</p><a class="btn" data-go="help">Contact support</a><a class="link" data-close>Close</a>')}
/* ---- deposits: own-name rule and monthly limits ---- */
var oPay=IK.acts.payMade;IK.acts.payMade=function(){oPay.apply(this,arguments);var f=document.querySelector('.ov:last-child #p_amt');if(f&&!document.getElementById('p_name')){var fld=f.closest('.field');if(fld)fld.insertAdjacentHTML('afterend','<div class="field"><label for="p_name">Name on the account you paid from</label><input class="inp" id="p_name" value="'+esc(S().user.name)+'"><div class="hint" style="color:#a8a8a8">Payments must come from a bank account in your own name.</div><div class="err" id="e_p_name"></div></div>')}};
var oSub=IK.acts.paySubmit;IK.acts.paySubmit=function(){var s=S(),a=num('p_amt'),nm=($('#p_name')||{}).value;if(a>0){
  if(nm!=null&&!nameMatch(nm,s.user.name)){s.thirdParty=(s.thirdParty||[]).concat([{a:a,payer:nm,t:Date.now()}]).slice(-10);IK.save();IK.closeTop();IK.csheet('warn','r','Payment must come from your own account','<p class="sub" style="line-height:1.55">For your safety and ours, we only accept payments from a bank account in your own name. A payment from another person\'s account is returned to the sender and is not credited.</p><a class="btn" data-close>I understand</a>');return}
  var T=tier(),used=sum(s.deposits||[],Date.now()-30*D);if(used+a>T.dep){IK.closeTop();limitMsg('Deposit limit reached','Your account level allows deposits of up to '+money(T.dep,0)+' in 30 days. You have '+money(Math.max(0,T.dep-used),0)+' left. To raise your limit, contact support with proof of address or source of funds.');return}}
 var n=(s.deposits||[]).length;oSub.apply(this,arguments);if(S().deposits.length>n){S().deposits[0].payer=nm||s.user.name;IK.save()}};
var oV=IK.acts.voucherGo;IK.acts.voucherGo=function(){var s=S(),T=tier(),used=sum(s.deposits||[],Date.now()-30*D,function(d){return d.method==='1Voucher'});if(used>=T.voucher){limitMsg('1Voucher limit reached','Your account level allows 1Voucher deposits of up to '+money(T.voucher,0)+' in 30 days. For larger amounts, please deposit by bank transfer from your own account.');return}return oV.apply(this,arguments)};
/* ---- withdrawals: clearing period and level limit ---- */
var oW=IK.acts.wdRequest;IK.acts.wdRequest=function(){var s=S(),a=num('w_amt'),T=tier(),now=Date.now();
 if(a>0){var locked=(s.deposits||[]).filter(function(d){return (d.status==='received'||d.status==='checking')&&now<d.date+T.hold*H}),lk=locked.reduce(function(t,d){return t+d.amount},0),can=Math.max(0,s.balance-lk);
  if(a>can&&lk>0){var rel=Math.min.apply(null,locked.map(function(d){return d.date+T.hold*H})),dt=new Date(rel);IK.csheet('hour','o','Part of your balance is still clearing','<p class="sub" style="line-height:1.55">New deposits are held for '+T.hold+' hours before they can be withdrawn. You can withdraw up to <b>'+money(can)+'</b> now. The rest is available from '+dt.toLocaleDateString('en-ZA',{day:'numeric',month:'short'})+' at '+dt.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'})+'.</p><a class="btn" data-close>OK</a>');return}
  if(a>T.wd){IK.csheet('warn','o','Above your withdrawal limit','<p class="sub" style="line-height:1.55">Your account level allows withdrawals of up to '+money(T.wd,0)+' at a time. To raise your limit, contact support.</p><a class="btn" data-go="help">Contact support</a><a class="link" data-close>Close</a>');return}}
 return oW.apply(this,arguments)};
/* ---- bank account must be in the client's own name ---- */
var oB=IK.acts.bankSheet;IK.acts.bankSheet=function(){oB.apply(this,arguments);var f=document.querySelector('.ov:last-child #b_no');if(f&&!document.getElementById('b_hold')){var fld=f.closest('.field');if(fld)fld.insertAdjacentHTML('beforebegin','<div class="field"><label for="b_hold">Account holder name</label><input class="inp" id="b_hold" value="'+esc((S().bank&&S().bank.holder)||S().user.name)+'"><div class="hint" style="color:#a8a8a8">The account must be in your own name.</div><div class="err" id="e_b_hold"></div></div>')}};
var oBS=IK.acts.bankSave;IK.acts.bankSave=function(){var h=($('#b_hold')||{}).value,s=S();if(h!=null&&!nameMatch(h,s.user.name)){s.bankAttempt={holder:h,t:Date.now()};IK.save();var e=$('#e_b_hold');if(e)e.textContent='This account is not in your name. Use a bank account held in the name '+s.user.name+'.';return}
 var before=s.bank;oBS.apply(this,arguments);if(S().bank&&S().bank!==before){S().bank.holder=h||s.user.name;S().bank.at=Date.now();IK.save()}};
/* ---- report activity to the compliance rules ---- */
var last='',lastAt=0;
function profile(){var s=S();if(!s.user)return null;if(!s.user.created){s.user.created=Date.now();IK.save()}return {id:s.aiAcc||'ME',dep:(s.deposits||[]).slice(0,40).map(function(d){return {a:d.amount,m:d.method,p:d.payer||null,t:d.date}}),wd:(s.withdrawals||[]).slice(0,30).map(function(w){return {a:w.amount,t:w.date}}),trades:(s.trades||[]).length,hasTraded:!!s.hasTraded,bank:s.bank?{holder:s.bank.holder||'',at:s.bank.at||0}:null,attempt:s.bankAttempt||null,third:s.thirdParty||[],created:s.user.created,device:devId()}}
setInterval(function(){var s=S();if(!s||!s.loggedIn||!myAcc())return;var p=profile();if(!p)return;var j=JSON.stringify(p);if(j!==last||Date.now()-lastAt>30000){last=j;lastAt=Date.now();AIE.cmd('profile',p)}},3000);
/* ---- test helpers ---- */
IK.acts.compDemo=function(k){var s=S(),now=Date.now();IK.closeAll();
 if(k==='struct'){[[20000,30],[19000,20],[15000,10]].forEach(function(x){s.deposits.unshift({id:'D'+(s.seq.dep++),date:now-x[1]*60000,method:'Bank transfer',amount:x[0],ref:s.user.account,status:'received',payer:s.user.name});s.balance+=x[0]})}
 if(k==='notrade'){s.deposits.unshift({id:'D'+(s.seq.dep++),date:now-2*H,method:'Bank transfer',amount:8000,ref:s.user.account,status:'received',payer:s.user.name});s.balance+=8000;s.withdrawals.unshift({id:'WD-'+(s.seq.wd++),date:now,amount:5000,fee:0,net:5000,status:'pending',dueAt:now+20000,bank:'0000'});s.balance-=5000;s.hasTraded=false;s.trades=[]}
 if(k==='third'){s.thirdParty=(s.thirdParty||[]).concat([{a:10000,payer:'J Mokoena',t:now}])}
 if(k==='bank'){s.bankAttempt={holder:'T Nkosi',t:now}}
 if(k==='fresh'){s.deposits.unshift({id:'D'+(s.seq.dep++),date:now,method:'Bank transfer',amount:10000,ref:s.user.account,status:'received',payer:s.user.name});s.balance+=10000}
 IK.save();IK.toast('Test activity added');IK.go('dashboard',{},{reset:true})};
var tOld=IK.acts.testControls;IK.acts.testControls=function(){tOld();var el=document.querySelector('.ov:last-child .sheet');if(!el)return;el.insertAdjacentHTML('beforeend','<div class="sec">Compliance tests</div>'+[['fresh','Add a fresh R10,000 deposit','Tests the clearing period on withdrawals'],['notrade','Deposit then withdraw, no trades','Triggers two alerts'],['struct','Three deposits in one hour','Triggers the structuring alert'],['third','Payment from another person','Triggers the own-name alert'],['bank','Bank account in another name','Triggers the bank alert']].map(function(x){return '<a class="tcbtn" data-act="compDemo" data-arg="'+x[0]+'">'+x[1]+'<small>'+x[2]+'</small></a>'}).join(''))};
})();
