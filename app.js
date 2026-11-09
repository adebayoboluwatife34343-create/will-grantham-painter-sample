(function(){
const {RM,$,$$}=K;
K.intro($('#intro'),2300);K.reveal();K.magnet('.mag');K.smooth();
const NUM='447789172787';
K.waLinks({num:NUM,greet:'Hello Will, I found your page online and would like to discuss a painting job.'});
const F=K.form($('#qf'),{num:NUM,biz:'Will Grantham House Painter',areaLabel:'Postcode or area',greet:'Hello Will, I found your page online and would like to discuss a job.'});window.__form=F;
$$('.row').forEach(b=>b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';$$('.row').forEach(x=>x.setAttribute('aria-expanded','false'));b.setAttribute('aria-expanded',String(!o))}));
$('.row').setAttribute('aria-expanded','true');
$$('.pick').forEach(b=>b.addEventListener('click',()=>{const s=$('#qf').elements.service;s.value=b.dataset.job;s.dispatchEvent(new Event('change',{bubbles:true}));$('#quote').scrollIntoView({behavior:RM?'auto':'smooth'});setTimeout(()=>$('#qf').elements.name.focus({preventScroll:true}),500)}));
const S=window.ROSE={g:0,c:'gold'};const sl=$('#gl'),out=$('#glo');
const set=v=>{S.g=Math.max(0,Math.min(100,v));sl.value=S.g;out.textContent=Math.round(S.g)+'%';S.draw&&S.draw()};
sl.addEventListener('input',()=>set(+sl.value));
$$('.leaf button').forEach(b=>b.onclick=()=>{S.c=b.dataset.c;$$('.leaf button').forEach(x=>x.setAttribute('aria-checked',x===b));if(S.g<20)set(60);S.draw&&S.draw()});
if(!RM){let v=0;const t0=performance.now()+2600;const run=n=>{if(n<t0){requestAnimationFrame(run);return}if(S.userTouched)return;v=Math.min(55,(n-t0)/18);set(v);if(v<55)requestAnimationFrame(run)};requestAnimationFrame(run);sl.addEventListener('pointerdown',()=>S.userTouched=true)}
else set(0);
})();
