/* INVESTO KINGS - onboarding & auth screens */
(function(){
'use strict';
var IK=window.IK,$=IK.$,esc=IK.esc,I=IK.I,S=function(){return IK.S},C=function(){return IK.cfg};
var val=function(id){var e=$('#'+id);return e?(e.value||'').trim():''};
var setErr=function(id,msg){var e=$('#e_'+id),i=$('#'+id);if(e)e.textContent=msg||'';if(i)i.classList.toggle('bad',!!msg)};
var pwOk=function(p){return p.length>=8&&/\d/.test(p)&&/[^A-Za-z0-9]/.test(p)};
var normPhone=function(p){return String(p||'').replace(/\D/g,'').replace(/^27/,'').replace(/^0/,'')};
var maskPhone=function(p){return '+27 '+p.slice(0,2)+' *** '+p.slice(-4)};
var maskEmail=function(e){var a=e.split('@');return a[0].slice(0,2)+'***@'+(a[1]||'')};
IK.otpHtml=function(){var h='<div class="otp">';for(var i=0;i<6;i++)h+='<input inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Digit '+(i+1)+'">';return h+'</div>'};
IK.otpBind=function(root){var ins=root.querySelectorAll('.otp input');Array.prototype.forEach.call(ins,function(el,i){
 el.addEventListener('input',function(){el.value=el.value.replace(/\D/g,'').slice(-1);if(el.value&&ins[i+1])ins[i+1].focus()});
 el.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!el.value&&ins[i-1])ins[i-1].focus()});
 el.addEventListener('paste',function(e){var t=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);if(!t)return;e.preventDefault();Array.prototype.forEach.call(ins,function(x,j){x.value=t[j]||''});(ins[Math.min(t.length,5)]).focus()})});
 if(ins[0])ins[0].focus()};
IK.otpVal=function(root){return Array.prototype.map.call(root.querySelectorAll('.otp input'),function(x){return x.value}).join('')};
IK.pwField=function(id,label,ph){return '<div class="field"><label for="'+id+'">'+label+'</label><div class="iw"><input class="inp" id="'+id+'" type="password" placeholder="'+(ph||'')+'" autocomplete="new-password"><button type="button" class="eye" data-act="eye" data-arg="'+id+'">Show</button></div><div class="err" id="e_'+id+'"></div></div>'};
IK.acts.eye=function(id,btn){var i=$('#'+id);if(!i)return;var show=i.type==='password';i.type=show?'text':'password';btn.textContent=show?'Hide':'Show'};
IK.acts.chk=function(a,el){el.classList.toggle('on');el.querySelector('.bx').innerHTML=el.classList.contains('on')?'&#10003;':''};
var chk=function(id,html,on){return '<div class="chk'+(on?' on':'')+'" id="'+id+'" data-act="chk" role="checkbox"><div class="bx">'+(on?'&#10003;':'')+'</div><div>'+html+'</div></div>'};
var isOn=function(id){var e=$('#'+id);return e&&e.classList.contains('on')};

/* splash */
IK.screens.splash={flush:true,render:function(){return '<div class="splash">'+IK.crown(190)+'<div class="wm xl" style="margin-top:12px">INVESTO <span>KINGS</span></div><div class="tag">COPY. TRADE. GROW.</div><div class="bar"><i></i></div><p class="auth">We operate under an Authorised FSP</p></div>'},mount:function(){setTimeout(IK.entry,1900)}};

/* welcome */
var WI=0,SL=[['bolt','Get trade alerts','We send Gold and Silver trade setups straight to your phone.',''],['timer','Place trades in one tap','Every alert has a countdown. Tap Place trade before it ends.','o'],['shield','Your money stays separate','Client money is held in separate client accounts. Deposit and withdraw right in the app.','']];
IK.screens.welcome={flush:true,render:function(){var s=SL[WI],last=WI===2;
 return '<div class="wel"><button class="skip" data-act="welSkip">'+(last?'':'Skip')+'</button><div class="mid"><div class="big '+s[3]+'" style="color:'+(s[3]?'#ff9f1c':'#39ff14')+'">'+I(s[0],92)+'</div><h1 class="h1" style="margin-top:40px">'+s[1]+'</h1><p class="sub">'+s[2]+'</p></div><div class="dots">'+SL.map(function(x,i){return '<i class="'+(i===WI?'on':'')+'"></i>'}).join('')+'</div><a class="btn" style="margin-top:0" data-act="welNext">'+(last?'Get started':'Next')+'</a></div>'},
 mount:function(el){var x0=null;el.ontouchstart=function(e){x0=e.touches[0].clientX};el.ontouchend=function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(dx<-50)IK.acts.welNext();else if(dx>50&&WI>0){WI--;IK.refresh()}}}};
IK.acts.welNext=function(){if(WI<2){WI++;IK.refresh()}else IK.acts.welSkip()};
IK.acts.welSkip=function(){WI=0;S().seenWelcome=true;IK.save();IK.go('landing',{},{reset:true})};

/* landing */
IK.screens.landing={render:function(){var c=C().company;
 return '<div class="center" style="margin-top:14px">'+IK.crown(110)+'<div class="wm lg" style="margin-top:6px">INVESTO <span>KINGS</span></div><div class="tag">COPY. TRADE. GROW.</div></div>'
 +'<h1 class="h1 center" style="font-size:26px;margin-top:28px">Gold and Silver trade setups, sent straight to your phone</h1><p class="sub center">Verify your account to receive trade alerts. Each alert gives you a short window to place the trade.</p>'
 +'<section class="risk"><h2>Risk disclosure</h2><p>Trading Gold and Silver carries a high level of risk and may not be suitable for everyone. You may lose some or all of your capital. Past performance is not a guarantee of future results.</p></section>'
 +'<a class="btn" style="margin-top:22px" data-go="register">Get started</a><p class="sub center mt16">Already have an account? <a class="link inl" data-go="login">Log in</a></p>'
 +'<footer class="foot"><div><b>Company Reg No:</b> '+esc(c.reg)+'<br><b>FSP License No:</b> '+esc(c.fsp)+'<br><b>VAT No:</b> '+esc(c.vat)+'</div><p style="margin-top:12px;color:#d0d0d0;font-weight:600">We operate under an Authorised FSP</p>'
 +'<div class="links"><a '+IK.go_('legal',{k:'terms'})+'>Terms of Service</a><a '+IK.go_('legal',{k:'privacy'})+'>Privacy Policy</a><a '+IK.go_('legal',{k:'paia'})+'>PAIA</a><a data-go="about">Contact</a></div><p>'+esc(c.address)+'</p><p style="margin-top:12px;font-size:11.5px">2026 Investo Kings. All rights reserved.</p></footer>'}};

/* register */
IK.screens.register={render:function(){
 return IK.hdr('')+'<div class="center mt8">'+IK.mini()+'</div><h1 class="h1">Create your account</h1><p class="sub">Step 1 of 2. Next you will verify your identity so you can receive trade alerts.</p>'
 +'<div class="field"><label for="r_name">Full name</label><input class="inp" id="r_name" autocomplete="name" placeholder="Name and surname"><div class="hint">Enter your name exactly as it appears on your SA ID.</div><div class="err" id="e_r_name"></div></div>'
 +'<div class="field"><label for="r_email">Email address</label><input class="inp" id="r_email" type="email" autocomplete="email" placeholder="name@example.com"><div class="err" id="e_r_email"></div></div>'
 +'<div class="field"><label for="r_phone">Mobile number</label><div class="phone"><div class="cc">+27</div><input class="inp" id="r_phone" type="tel" autocomplete="tel-national" placeholder="82 123 4567"></div><div class="err" id="e_r_phone"></div></div>'
 +IK.pwField('r_pw','Password','Create a password')+'<div class="hint" style="margin-top:-4px">At least 8 characters, with a number and a symbol.</div>'+IK.pwField('r_pw2','Confirm password','Repeat your password')
 +chk('c1','I am 18 or older.')+chk('c2','I accept the <span class="lk" '+IK.go_('legal',{k:'terms'})+'>Terms of Service</span> and <span class="lk" '+IK.go_('legal',{k:'privacy'})+'>Privacy Policy</span>, and I consent to my personal information being processed under POPIA.')+chk('c3','I understand that trading carries a high level of risk and I may lose some or all of my capital.')+'<div class="err" id="e_chk"></div>'
 +'<a class="btn" data-act="regSubmit">Create account</a><p class="sub center mt16">Already have an account? <a class="link inl" data-go="login">Log in</a></p><p class="sub center" style="font-size:12.5px">We will send a code to your mobile number to confirm it is yours.</p>'}};
IK.acts.regSubmit=function(){var name=val('r_name'),email=val('r_email').toLowerCase(),ph=normPhone(val('r_phone')),pw=$('#r_pw').value,pw2=$('#r_pw2').value,bad=false;
 var e=function(id,m){setErr(id,m);if(m)bad=true};
 e('r_name',name.length<3||name.indexOf(' ')<0?'Enter your full name (name and surname).':'');
 e('r_email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)?'':'Enter a valid email address.');
 e('r_phone',ph.length===9?'':'Enter a 9-digit mobile number, for example 82 123 4567.');
 e('r_pw',pwOk(pw)?'':'Use at least 8 characters, with a number and a symbol.');
 e('r_pw2',pw&&pw===pw2?'':'The passwords do not match.');
 var cks=isOn('c1')&&isOn('c2')&&isOn('c3');$('#e_chk').textContent=cks?'':'Please tick all three boxes to continue.';if(!cks)bad=true;
 if(bad){var f=document.querySelector('.inp.bad');if(f)f.scrollIntoView({block:'center'});return}
 var u=S().user;if(u&&u.email===email){IK.dlg('<h2>Email already used</h2><p class="sub mt8">An account with this email already exists on this device. Log in instead.</p><a class="btn" data-go="login" data-reset>Log in</a><a class="link" data-close>Cancel</a>',{cls:'or'});return}
 IK.wipe();var s=S();s.user={name:name,email:email,phone:ph,password:pw,account:'IK-00'+(10000+Math.floor(Math.random()*89999))};s.loggedIn=true;IK.save();
 IK.go('verifycode',{},{replace:true})};

/* verify code (mobile) */
IK.screens.verifycode={render:function(){var u=S().user;return IK.hdr('')+'<h1 class="h1">Verify your mobile number</h1><p class="sub">We sent a 6-digit code to <b>'+maskPhone(u.phone)+'</b>. It expires in 10 minutes.</p>'+IK.otpHtml()
 +'<div class="banner o" style="margin-top:16px"><div>Test mode: use the code <b>'+C().testCode+'</b></div></div><p class="sub center mt16">Did not get it? <a class="link inl" data-act="vcResend">Send a new code</a></p><a class="btn" data-act="vcVerify">Verify code</a><a class="link" data-act="vcChange">Change number</a>'},
 mount:function(el){IK.otpBind(el)}};
IK.acts.vcResend=function(){IK.toast('New code sent. Test code: '+C().testCode)};
IK.acts.vcVerify=function(){var code=IK.otpVal($('#screen'));if(code===C().testCode){S().verify.mobile=true;IK.save();IK.go('agreement',{},{replace:true})}
 else IK.dlg('<h2>Wrong code</h2><p class="sub mt8">The code is incorrect or has expired. Check it and try again, or ask for a new code.</p><a class="btn" data-close>Try again</a><a class="link" data-act="vcResend2">Send a new code</a>',{cls:'or'})};
IK.acts.vcResend2=function(){IK.closeTop();IK.acts.vcResend()};
IK.acts.vcChange=function(){IK.sheet(IK.shead('Change mobile number')+'<div class="field"><label for="n_phone">Mobile number</label><div class="phone"><div class="cc">+27</div><input class="inp" id="n_phone" type="tel" placeholder="82 123 4567"></div><div class="err" id="e_n_phone"></div><div class="hint">We will send a new code to this number.</div></div><a class="btn" data-act="vcChangeSave">Send new code</a>')};
IK.acts.vcChangeSave=function(){var p=normPhone(val('n_phone'));if(p.length!==9){$('#e_n_phone').textContent='Enter a 9-digit mobile number.';return}S().user.phone=p;IK.save();IK.closeTop();IK.refresh();IK.toast('New code sent. Test code: '+C().testCode)};

/* agreement */
var kp=function(ic,t,p,o){return '<div class="kp"><div class="ic '+(o||'')+'">'+I(ic)+'</div><div><b>'+t+'</b><p>'+p+'</p></div></div>'};
IK.screens.agreement={render:function(){return IK.hdr('')+'<h1 class="h1">Client Agreement</h1><p class="sub">Please read this before you continue. It explains how Investo Kings works with your money.</p>'
 +kp('shield','Your money is kept separate','It is held in a separate client account, not in the company\'s account.')+kp('bolt','You place your own trades','Each alert has a countdown. Once it ends, the trade can no longer be placed.')
 +kp('pct','Company fee: 30%','Once you have placed a trade with your deposited funds, the company keeps 30% of each withdrawal. No fee if you withdraw before trading.','o')+kp('up','Withdrawals','You request a withdrawal in the app and we process it to your bank account.')
 +kp('warn','Trading is risky','You may lose some or all of your capital. Past results do not guarantee future results.','o')+kp('lock','Your information','Your documents are used only for identity verification and handled under POPIA.')
 +'<a class="link" data-go="agreementfull">Read the full agreement</a>'+chk('a1','I have read and agree to the Client Agreement.')+chk('a2','I understand and accept the 30% company fee once I have placed a trade.')+'<div class="err" id="e_chk"></div><a class="btn" data-act="agrAccept">I agree and continue</a>'}};
IK.acts.agrAccept=function(){if(!(isOn('a1')&&isOn('a2'))){$('#e_chk').textContent='Please tick both boxes to continue.';return}S().verify.agreement={v:'1.0',at:Date.now()};IK.save();IK.go('kyc',{},{replace:true})};
var AGR=['Who this agreement is between','How your money is held','Trade alerts and placing trades','Risk','Fees','Withdrawals','Your information','Ending this agreement'];
var AGRS=['You, the client, and '+'[company name]'+', an authorised FSP, licence no. [FSP number].','Client money is kept in a separate client account, apart from the company\'s own money.','How alerts are sent, the countdown window, and what happens when a window closes.','Trading Gold and Silver carries a high level of risk and you may lose some or all of your capital.','The 30% company fee, when it applies (after a trade is placed with deposited funds), with a worked example.','How to request a withdrawal and how it is paid.','How your personal information and documents are used and protected under POPIA.','How you or the company can close the account.'];
IK.screens.agreementfull={render:function(){return IK.hdr('Full agreement')+'<h1 class="h1" style="font-size:24px">Investo Kings Client Agreement</h1><p class="sub" style="font-size:13.5px">Version 1.0 &middot; [effective date]</p><div class="legal">'+AGR.map(function(t,i){return '<div class="sec2"><b>'+(i+1)+'. '+t+'</b><div style="font-size:13.5px;color:#c4c4c4;margin-top:4px;line-height:1.5">'+AGRS[i]+'</div><p>[Legal wording to be added]</p></div>'}).join('')+'</div><a class="btn line" data-act="agrDownload">Download</a>'}};
IK.acts.agrDownload=function(){var t='INVESTO KINGS CLIENT AGREEMENT (draft, version 1.0)\n\n'+AGR.map(function(x,i){return (i+1)+'. '+x+'\n'+AGRS[i]+'\n[Legal wording to be added]\n'}).join('\n');IK.download('Investo-Kings-Client-Agreement.txt',t,'text/plain')};
IK.download=function(name,text,type){try{var b=new Blob([text],{type:type||'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(a.href)},500);IK.toast('Download started')}catch(e){IK.toast('Download not available')}};

/* KYC */
var KS=0;IK.photos={};
function kycInit(){var k=S().verify.kyc;KS=!(k.idFront&&k.idBack)?1:!k.face?2:!k.addr?3:4}
IK.screens.kyc={render:function(){if(!KS)kycInit();var k=S().verify.kyc,names=['ID','Selfie','Address','Review'],ttl=['Verify your identity','Face scan','Proof of address','Review and submit'],sub=['Follow the steps to secure your account and access trade alerts.','Take a quick scan so we can match you to your ID.','Add a document that shows where you live.','Check everything before you send it for verification.'];
 var h='<div class="hd">'+(KS>1?'<div class="back" data-act="kycPrev">'+I('back',22)+'</div>':'<div class="sp"></div>')+'<div class="center" style="flex:1">'+IK.mini()+'</div><div class="sp"></div></div><h1 class="h1 center" style="margin-top:14px">'+ttl[KS-1]+'</h1><p class="sub center">'+sub[KS-1]+'</p>';
 h+='<div class="steps">'+names.map(function(n,i){var c=(i+1)<KS?'done':(i+1)===KS?'cur':'';return '<div class="st '+c+'"><div class="n">'+((i+1)<KS?'&#10003;':(i+1))+'</div>'+n+'</div>'}).join('')+'</div>';
 var slot=function(kind,t,hint,ok,act){return '<div class="slot '+(ok?'ok':act?'act':'')+'" data-act="kycPhoto" data-arg="'+kind+'"><div class="cam">'+I(ok?'check':'camera')+'</div><div><b>'+t+'</b><div class="h">'+(ok?'Added. Tap to replace.':hint)+'</div></div></div>'};
 if(KS===1){h+='<div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">Upload your SA ID</div>'+slot('idFront','Front of SA ID Smart Card','Hint: Place your ID flat in a well-lit area.',k.idFront,!k.idFront)+slot('idBack','Back of SA ID Smart Card','Hint: Keep the barcode and all four edges in the frame.',k.idBack,k.idFront&&!k.idBack)+'</div><div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">Instructions</div><ul class="ins"><li>Only the SA ID Smart Card is accepted.</li><li>The photo must be clear and all text readable.</li><li>The card must be valid and not expired.</li></ul></div><a class="btn'+(k.idFront&&k.idBack?'':' off')+'" data-act="kycNext">Continue</a>'}
 if(KS===2){h+='<div class="center mt16"><div style="width:230px;height:290px;margin:0 auto"><svg viewBox="0 0 230 290" width="230" height="290" style="overflow:visible"><ellipse cx="115" cy="145" rx="104" ry="134" fill="'+(k.face?'#14261a':'#14261a')+'" stroke="#39ff14" stroke-width="4" stroke-dasharray="'+(k.face?'0':'12 9')+'" style="filter:drop-shadow(0 0 10px rgba(57,255,20,.5))"/>'+(k.face?'<path d="M75 150l28 28 55-62" stroke="#39ff14" stroke-width="10"/>':'<circle cx="115" cy="112" r="38" stroke="#3d5a44" stroke-width="5"/><path d="M48 238 C58 186 172 186 182 238" stroke="#3d5a44" stroke-width="5"/>')+'</svg></div></div><div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">Before you start</div><ul class="ins"><li>Face the camera in good light.</li><li>Remove your glasses, cap or mask.</li><li>Follow the on-screen prompts and turn your head slowly when asked.</li></ul></div>'
  +(k.face?'<a class="btn" data-act="kycNext">Continue</a><a class="link" data-act="faceStart">Scan again</a>':'<a class="btn" data-act="faceStart">Start face scan</a>')}
 if(KS===3){h+='<div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">Upload your proof of address</div>'+slot('addr','Proof of address','Tap to take a photo or choose a file.',k.addr,!k.addr)+'</div><div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">What we accept</div><ul class="ins"><li>Bank statement, utility bill, municipal rates bill or signed lease.</li><li>Dated within the last 3 months.</li><li>Your full name and street address must be visible and match your ID.</li><li>PDF, JPG or PNG.</li></ul></div><a class="btn'+(k.addr?'':' off')+'" data-act="kycNext">Continue</a>'}
 if(KS===4){h+='<div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">Check your details</div>'+[['SA ID (front and back)','Both sides captured'],['Face scan','Completed'],['Proof of address','Document added']].map(function(r){return '<div class="row"><span style="color:#fff">'+r[0]+'<small>'+r[1]+'</small></span>'+IK.chip('Ready','g')+'</div>'}).join('')+'</div><div class="card pad mt16"><div style="font-size:18px;font-weight:700;color:#cfcfcf">What happens next</div><ul class="ins"><li>We check your documents against your details.</li><li>We notify you when the result is ready.</li><li>Once approved, you start receiving trade alerts.</li></ul></div>'+chk('k1','I confirm these documents are mine and genuine, and I consent to Investo Kings storing them for FICA verification.')+'<div class="err" id="e_chk"></div><a class="btn" data-act="kycSubmit">Submit for verification</a><p class="sub center" style="font-size:12.5px">Your documents are encrypted and used only for identity verification.</p>'}
 if(KS<4)h+='<button class="link" data-act="kycSkip">Skip for now</button>'+(KS<4?'<p class="sub center" style="font-size:12.5px">You will not receive trade alerts until your identity is verified.</p>':'');
 return h}};
IK.acts.kycPrev=function(){KS=Math.max(1,KS-1);IK.refresh()};
IK.acts.kycNext=function(){KS=Math.min(4,KS+1);IK.refresh()};
IK.acts.kycSkip=function(){IK.dlg('<h2>Skip for now?</h2><p class="sub mt8">You will not receive trade alerts or be able to deposit, trade or withdraw until you are verified.</p><a class="btn" data-close>Continue verification</a><a class="link" data-act="kycSkipGo">Skip for now</a>',{cls:'or'})};
IK.acts.kycSkipGo=function(){IK.closeAll();KS=0;IK.go('dashboard',{},{reset:true})};
IK.acts.kycSubmit=function(){if(!isOn('k1')){$('#e_chk').textContent='Please confirm to continue.';return}var v=S().verify;v.status='submitted';v.decisionDue=S().test.autoApprove?Date.now()+12000:0;IK.save();KS=0;
 IK.csheet('hour','o','Documents submitted','<p class="sub">We are checking your documents. We will notify you as soon as the result is ready.</p><p class="sub" style="font-size:13px;color:#8a8a8a">You will not receive trade alerts until you are verified.</p><a class="btn" data-go="dashboard" data-reset>Back to home</a>',{modal:true})};
/* photo capture (real camera on Android via file input) */
IK.acts.kycPhoto=function(kind){var ttl=kind==='addr'?'Add your document':kind==='idBack'?'Back of ID':'Front of ID';
 IK.sheet(IK.shead(ttl)+'<p class="sub">'+(kind==='addr'?'Take a photo of your bank statement or utility bill, or choose a file.':'Place your card flat in a well-lit area. Keep all four edges in the photo.')+'</p>'
 +'<label class="btn" for="capcam" style="margin-top:18px">Take a photo</label><label class="btn line" for="capgal">Choose from gallery or files</label><a class="link" data-act="kycSample" data-arg="'+kind+'">Use a sample photo (test)</a>'
 +'<input type="file" id="capcam" accept="image/*" capture="environment" hidden><input type="file" id="capgal" accept="image/*'+(kind==='addr'?',application/pdf':'')+'" hidden>',
 {mount:function(el){['capcam','capgal'].forEach(function(id){el.querySelector('#'+id).addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f)return;IK.photoReview(kind,/pdf/i.test(f.type)?null:URL.createObjectURL(f),f.name)})})}})};
IK.acts.kycSample=function(kind){var c=document.createElement('canvas');c.width=600;c.height=380;var x=c.getContext('2d');x.fillStyle='#2a2f2a';x.fillRect(0,0,600,380);x.fillStyle='#3d4a3d';x.fillRect(30,50,140,170);x.fillStyle='#4a564a';for(var i=0;i<5;i++)x.fillRect(200,60+i*40,330-i*20,18);x.fillStyle='#39ff14';x.font='bold 22px sans-serif';x.fillText('SAMPLE (TEST)',30,330);IK.photoReview(kind,c.toDataURL('image/jpeg',.7),'sample.jpg')};
IK.photoReview=function(kind,url,name){IK.closeTop();IK._pend={kind:kind,url:url,name:name};
 IK.sheet(IK.shead('Check your photo')+'<div class="mt12" style="height:170px;border-radius:14px;background:#171717;border:1.5px solid var(--line);overflow:hidden;display:grid;place-items:center">'+(url?'<img src="'+url+'" alt="Preview" style="max-width:100%;max-height:100%;object-fit:contain">':'<div class="center">'+I('file',48)+'<div class="sub">'+esc(name||'Document')+'</div></div>')+'</div><p class="sub">Make sure all text is clear and the whole document is in the photo.</p><a class="btn" data-act="kycUse">Use this photo</a><a class="btn line" data-act="kycPhoto" data-arg="'+kind+'">Retake</a>')};
IK.acts.kycUse=function(){var p=IK._pend;if(!p)return;var k=S().verify.kyc;k[p.kind]=true;IK.photos[p.kind]=p.url;IK.save();IK.closeAll();IK.refresh();IK.toast('Photo added')};
/* face scan */
IK.acts.faceStart=function(){var timers=[],stream=null;
 IK.full('<div class="faceov" style="display:flex;flex-direction:column;flex:1;position:relative;min-height:100%"><video id="fv" autoplay playsinline muted></video><div style="position:relative;display:flex;justify-content:space-between;align-items:center"><div class="x" data-close>'+I('close',18)+'</div><b>Face scan</b><div class="sp" style="width:36px"></div></div>'
 +'<div class="pill" id="fp" style="position:relative;margin-top:34px;background:rgba(0,0,0,.6);border:1px solid #333;border-radius:14px;padding:13px 16px;font-size:19px;font-weight:700">Look straight at the camera</div>'
 +'<div class="oval"><svg viewBox="0 0 260 330"><ellipse cx="130" cy="165" rx="124" ry="160" fill="none" stroke="#2b2b2b" stroke-width="8"/><ellipse id="fr" cx="130" cy="165" rx="124" ry="160" fill="none" stroke="#39ff14" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 1000" style="filter:drop-shadow(0 0 8px #39ff14);transition:stroke-dasharray 1.2s linear"/></svg></div><p class="sub" id="fs" style="position:relative">Step 1 of 4</p></div>',
 {cls:'cam2',onClose:function(){timers.forEach(clearTimeout);if(stream)stream.getTracks().forEach(function(t){t.stop()})},mount:function(el){
  try{navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}}).then(function(s){stream=s;var v=el.querySelector('#fv');if(v)v.srcObject=s}).catch(function(){})}catch(e){}
  var P=['Look straight at the camera','Turn your head slowly to the left','Turn your head slowly to the right','Blink twice'],i=0;
  function step(){if(!document.body.contains(el))return;el.querySelector('#fp').textContent=P[i];el.querySelector('#fs').textContent='Step '+(i+1)+' of 4';el.querySelector('#fr').setAttribute('stroke-dasharray',Math.round(((i+1)/4)*1000*0.6)+' 1000');i++;
   if(i<4)timers.push(setTimeout(step,1500));else timers.push(setTimeout(function(){if(S().test.failFace){S().test.failFace=false;IK.save();IK.closeTop();IK.csheet('warn','r','We could not scan your face','<p class="sub">Move to a well-lit place, take off glasses or a cap, and keep your face inside the oval.</p><a class="btn" data-act="faceStart">Try again</a><a class="link" data-close>Cancel</a>');return}
    S().verify.kyc.face=true;IK.save();IK.closeTop();IK.refresh();IK.toast('Face scan complete')},1600))}
  timers.push(setTimeout(step,500))}})};

/* approved / rejected */
IK.approvedSheet=function(){IK.csheet('check','','You are verified','<p class="sub">Your identity is confirmed. You can now receive trade alerts.</p><a class="btn" data-act="approvedGo">Continue</a>',{modal:true})};
IK.acts.approvedGo=function(){IK.closeAll();if(!S().settings.notifAsked)IK.askNotif()};
IK.rejectedSheet=function(){var k=S().verify;IK.csheet('warn','r','Verification not approved','<p class="sub">We could not approve one of your documents.</p>'+IK.rows([['SA ID','<span class="chip g">Approved</span>'],['Face scan','<span class="chip g">Approved</span>'],['Proof of address','<span class="chip r">Not approved</span>']])+'<p class="sub" style="color:#ffb3b3;margin-top:10px">'+esc(k.reason)+'</p><a class="btn" data-act="rejUpload">Upload again</a><a class="link" data-go="help">Contact support</a>')};
IK.acts.rejUpload=function(){var v=S().verify;v.kyc.addr=false;v.status='none';IK.save();IK.closeAll();KS=3;IK.go('kyc',{},{})};
IK.askNotif=function(){var s=S();s.settings.notifAsked=true;IK.save();if(!('Notification' in window)||Notification.permission!=='default')return;
 IK.csheet('bell','','Never miss a trade','<p class="sub">Trade windows are short. Turn on notifications so we can alert you the moment a setup is ready.</p><a class="btn" data-act="notifOn">Turn on notifications</a><a class="link" data-close>Maybe later</a>')};
IK.acts.notifOn=function(){IK.closeTop();try{Notification.requestPermission().then(function(r){if(r==='granted')IK.toast('Notifications are on');else IK.notifBlocked()})}catch(e){}};
IK.notifBlocked=function(){IK.csheet('belloff','o','Alerts are turned off','<p class="sub">Notifications are off in your phone settings. Turn them on so you do not miss trade windows.</p><a class="btn" data-act="openPhoneSettings">Open phone settings</a><a class="link" data-close>Not now</a>')};
IK.acts.openPhoneSettings=function(){IK.toast('Open Android Settings > Apps > Investo Kings > Notifications');IK.closeTop()};

/* login */
IK.screens.login={render:function(){IK.resetForgot();return IK.hdr('')+'<div class="center mt8">'+IK.crown(92)+'<div class="wm md" style="margin-top:4px">INVESTO <span>KINGS</span></div><div class="tag">COPY. TRADE. GROW.</div></div><h1 class="h1">Welcome back</h1><p class="sub">Log in to see your trades and receive new alerts.</p>'
 +'<div class="field"><label for="l_id">Email or mobile number</label><input class="inp" id="l_id" autocomplete="username" placeholder="name@example.com or 82 123 4567"></div>'
 +'<div class="field"><label for="l_pw">Password</label><div class="iw"><input class="inp" id="l_pw" type="password" autocomplete="current-password" placeholder="Enter your password"><button type="button" class="eye" data-act="eye" data-arg="l_pw">Show</button></div></div>'
 +'<div style="text-align:right;margin-top:12px"><a class="link inl" data-go="forgot">Forgot password?</a></div><a class="btn" data-act="loginSubmit">Log in</a>'
 +'<div class="center sub" style="margin:18px 0 0">or</div><a class="btn line" data-act="loginBio" style="margin-top:12px">Log in with face or fingerprint</a><p class="sub center mt24">New to Investo Kings? <a class="link inl" data-go="register">Get started</a></p><p class="sub center" style="font-size:12.5px">If your identity is not verified yet, you can finish verification after you log in. You will not receive trade alerts until it is complete.</p>'}};
IK.afterLogin=function(){var s=S();s.fails=0;s.lockedUntil=0;s.loggedIn=true;IK.save();
 if(!s.verify.mobile)IK.go('verifycode',{},{reset:true});else if(!s.verify.agreement)IK.go('agreement',{},{reset:true});else{IK.go('dashboard',{},{reset:true});if(IK.verified()&&!s.settings.notifAsked)setTimeout(IK.askNotif,500)}};
IK.lockedDlg=function(){IK.dlg('<h2>Too many attempts</h2><p class="sub mt8">For your safety your account is locked for 15 minutes. You can wait, or reset your password now.</p><a class="btn" data-go="forgot">Reset password</a><a class="btn line" data-close>OK</a>')};
IK.acts.loginSubmit=function(){var s=S(),id=val('l_id'),pw=$('#l_pw').value;if(s.lockedUntil>Date.now()){IK.lockedDlg();return}
 var u=s.user,okId=u&&(id.toLowerCase()===u.email||(normPhone(id)&&normPhone(id)===u.phone));
 if(u&&okId&&pw===u.password){IK.afterLogin();return}
 s.fails++;if(s.fails>=3){s.lockedUntil=Date.now()+15*60000;s.fails=0;IK.save();IK.lockedDlg();return}IK.save();
 IK.dlg('<h2>Incorrect details</h2><p class="sub mt8">The email, mobile number or password is wrong. You have '+(3-s.fails)+' tr'+(3-s.fails===1?'y':'ies')+' left before your account is locked for 15 minutes.</p><a class="btn" data-close>Try again</a><a class="link" data-go="forgot">Forgot password?</a>',{cls:'or'})};
IK.acts.loginBio=function(){if(!S().user){IK.dlg('<h2>No account on this device</h2><p class="sub mt8">Create an account first, or log in with your email and password.</p><a class="btn" data-go="register">Get started</a><a class="link" data-close>Cancel</a>',{cls:'or'});return}
 IK.sheet(IK.shead('Biometric login')+'<p class="sub">Simulated for this test build. In the live app your phone asks for your face or fingerprint.</p><a class="btn" data-act="bioOk">Authenticate</a>')};
IK.acts.bioOk=function(){IK.closeTop();IK.afterLogin()};

/* forgot password */
var FS=1;
IK.screens.forgot={render:function(){var u=S().user;var h=IK.hdr('');
 if(FS===1)h+='<h1 class="h1">Forgot your password?</h1><p class="sub">Enter your email or mobile number and we will send you a code to reset it.</p><div class="field"><label for="f_id">Email or mobile number</label><input class="inp" id="f_id" placeholder="name@example.com"><div class="err" id="e_f_id"></div></div><a class="btn" data-act="fpSend">Send code</a><a class="link" data-go="login" data-reset>Back to log in</a>';
 if(FS===2)h+='<h1 class="h1">Enter the code</h1><p class="sub">We sent a 6-digit code to <b>'+esc(maskEmail((u&&u.email)||'x@x'))+'</b>. It expires in 10 minutes.</p>'+IK.otpHtml()+'<div class="banner o" style="margin-top:16px"><div>Test mode: use the code <b>'+C().testCode+'</b></div></div><a class="btn" data-act="fpVerify">Verify code</a><a class="link" data-act="fpBack">Use a different email or number</a>';
 if(FS===3)h+='<h1 class="h1">Create a new password</h1><p class="sub">Choose a strong password that you do not use anywhere else.</p>'+IK.pwField('f_pw','New password','')+'<div class="rules" id="rules"><div id="rl1"><i>&#10003;</i>At least 8 characters</div><div id="rl2"><i>&#10003;</i>Contains a number</div><div id="rl3"><i>&#10003;</i>Contains a symbol, such as ! or @</div></div>'+IK.pwField('f_pw2','Confirm new password','Repeat your new password')+'<a class="btn" data-act="fpReset">Reset password</a>';
 if(FS===4)h+='<div class="center" style="margin-top:90px"><div class="circ" style="width:120px;height:120px">'+I('check',64)+'</div><h1 class="h1">Password changed</h1><p class="sub">You can now log in with your new password.</p><p class="sub" style="font-size:14px;margin-top:20px">If you did not make this change, contact support straight away.</p></div><a class="btn" data-go="login" data-reset>Log in</a>';
 return h},
 mount:function(el){if(FS===2)IK.otpBind(el);if(FS===3){var i=el.querySelector('#f_pw');i.addEventListener('input',function(){var v=i.value;el.querySelector('#rl1').className=v.length>=8?'ok':'';el.querySelector('#rl2').className=/\d/.test(v)?'ok':'';el.querySelector('#rl3').className=/[^A-Za-z0-9]/.test(v)?'ok':''})}}};
IK.acts.fpBack=function(){FS=1;IK.refresh()};
IK.acts.fpSend=function(){var id=val('f_id'),u=S().user;if(!u||!(id.toLowerCase()===u.email||(normPhone(id)&&normPhone(id)===u.phone))){setErr('f_id','We could not find an account with these details.');return}FS=2;IK.refresh();IK.toast('Code sent. Test code: '+C().testCode)};
IK.acts.fpVerify=function(){if(IK.otpVal($('#screen'))===C().testCode){FS=3;IK.refresh()}else IK.dlg('<h2>Wrong code</h2><p class="sub mt8">The code is incorrect or has expired. Check it and try again.</p><a class="btn" data-close>Try again</a>',{cls:'or'})};
IK.acts.fpReset=function(){var p=$('#f_pw').value,p2=$('#f_pw2').value,bad=false;if(!pwOk(p)){setErr('f_pw','Use at least 8 characters, with a number and a symbol.');bad=true}else setErr('f_pw','');if(p!==p2){setErr('f_pw2','The passwords do not match.');bad=true}else setErr('f_pw2','');if(bad)return;S().user.password=p;S().fails=0;S().lockedUntil=0;IK.save();FS=4;IK.refresh()};
IK.resetForgot=function(){FS=1};

/* legal + about */
var LEG={terms:['Terms of Service',['About these terms','Using the app','Your account','Trade alerts','Fees','Risk','Changes to these terms','Contact']],privacy:['Privacy Policy',['What information we collect','How we use your information','Who we share it with','How long we keep it','Your rights under POPIA','Information Officer and contact']],paia:['PAIA Manual',['About this manual','About Investo Kings','How to request information','Fees','Information Officer and contact']]};
IK.screens.legal={render:function(p){var l=LEG[p.k]||LEG.terms;return IK.hdr(l[0])+'<p class="sub" style="font-size:13.5px">Version 1.0 &middot; [effective date]</p><div class="legal">'+l[1].map(function(t,i){return '<div class="sec2"><b>'+(i+1)+'. '+t+'</b><p>[Legal wording to be added]</p></div>'}).join('')+'</div>'}};
IK.screens.about={render:function(){var c=C().company;return IK.hdr('About and Contact')+'<div class="center" style="margin-top:20px">'+IK.crown(100)+'<div class="wm md" style="margin-top:6px">INVESTO <span>KINGS</span></div><div class="tag">COPY. TRADE. GROW.</div></div><p class="sub center">'+esc(c.desc)+'</p>'
 +'<div class="sec">Company details</div>'+IK.rows([['Registered name',esc(c.name)],['Company Reg No',esc(c.reg)],['FSP License No',esc(c.fsp)],['VAT No',esc(c.vat)],['Address',esc(c.address)]])+'<p style="margin-top:10px;font-size:13px;color:#d0d0d0;font-weight:600">We operate under an Authorised FSP</p>'
 +'<div class="sec">Contact us</div>'+IK.rows([['Email',esc(c.email)],['Phone',esc(c.phone)],['Hours',esc(c.hours)]])
 +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><a class="btn" data-act="callUs">Call us</a><a class="btn line" data-act="emailUs">Email us</a></div>'
 +'<div class="links" style="margin-top:20px"><a '+IK.go_('legal',{k:'terms'})+'>Terms of Service</a><a '+IK.go_('legal',{k:'privacy'})+'>Privacy Policy</a><a '+IK.go_('legal',{k:'paia'})+'>PAIA</a></div><p class="sub center" style="font-size:12px">2026 Investo Kings. All rights reserved.</p>'}};
IK.acts.callUs=function(){location.href='tel:'+C().company.phone.replace(/\s/g,'')};
IK.acts.emailUs=function(){location.href='mailto:'+C().company.email};
})();
