import * as THREE from './three.module.js';
import {makeEnv} from './env.js';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv=document.getElementById('rose');
let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){document.getElementById('nowebgl').hidden=false;throw e}
r.setPixelRatio(Math.min(devicePixelRatio,2));r.toneMapping=THREE.ACESFilmicToneMapping;r.outputColorSpace=THREE.SRGBColorSpace;
const sc=new THREE.Scene();sc.environment=makeEnv(THREE,r,{bg:0x120e08,lights:[[0xfff1d0,9],[0xffd890,5],[0xffffff,4]]});
const cam=new THREE.PerspectiveCamera(30,1,.1,50);cam.position.set(0,0,9);
const key=new THREE.DirectionalLight(0xfff0d0,1.8);key.position.set(3,4,6);sc.add(key);sc.add(new THREE.AmbientLight(0xffffff,.35));
const rose=new THREE.Group();sc.add(rose);
const parts=[];
function add(geo,th,x=0,y=0,z=0,rot=0){const m=new THREE.MeshStandardMaterial({color:0xe9e3d3,roughness:.88,metalness:0});const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);me.rotation.z=rot;rose.add(me);parts.push({m,th});return me}
/* lathe base mouldings */
const prof=(pts)=>new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),96);
const L=prof([[2.3,0],[2.3,.1],[2.22,.2],[2.12,.24],[2.02,.2],[1.95,.1],[1.95,0]]);L.rotateX(Math.PI/2);add(L,.0);
const L2=prof([[1.85,0],[1.85,.12],[1.78,.24],[1.62,.3],[1.5,.24],[1.45,.1],[1.45,0]]);L2.rotateX(Math.PI/2);add(L2,.15);
const L3=prof([[1.05,0],[1.05,.1],[.98,.22],[.88,.26],[.8,.2],[.78,.08],[.78,0]]);L3.rotateX(Math.PI/2);add(L3,.45);
/* bead ring */
for(let i=0;i<48;i++){const a=i/48*Math.PI*2;const s=new THREE.SphereGeometry(.075,12,10);add(s,.05+(i%12)/80,Math.cos(a)*2.07,Math.sin(a)*2.07,.2)}
/* outer acanthus-style leaves */
function leafShape(len,wd){const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(wd,len*.2,wd*.9,len*.75,0,len);s.bezierCurveTo(-wd*.9,len*.75,-wd,len*.2,0,0);return s}
const ex={depth:.12,bevelEnabled:true,bevelThickness:.06,bevelSize:.05,bevelSegments:3,curveSegments:16};
const big=new THREE.ExtrudeGeometry(leafShape(.85,.3),ex);
for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const m=add(big.clone(),.25+(i%2)*.03,Math.cos(a)*1.0,Math.sin(a)*1.0,.24);m.rotation.z=a-Math.PI/2;m.position.set(Math.cos(a)*1.0,Math.sin(a)*1.0,.24)}
const sml=new THREE.ExtrudeGeometry(leafShape(.5,.17),ex);
for(let i=0;i<32;i++){const a=(i+.5)/32*Math.PI*2;const m=add(sml.clone(),.38,Math.cos(a)*1.52,Math.sin(a)*1.52,.28);m.rotation.z=a-Math.PI/2}
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const m=add(new THREE.ExtrudeGeometry(leafShape(.7,.22),ex),.55,Math.cos(a)*.18,Math.sin(a)*.18,.28);m.rotation.z=a-Math.PI/2}
/* centre boss */
const boss=new THREE.SphereGeometry(.34,32,20);boss.scale(1,1,.6);add(boss,.75,0,0,.3);
const top=new THREE.SphereGeometry(.1,16,12);add(top,.85,0,0,.55);
const pal={gold:[0xd9aa3a,.28],silver:[0xd7dbe0,.22],copper:[0xc77b4d,.3]};
const plaster=new THREE.Color(0xe9e3d3),tmp=new THREE.Color();
let yaw=-.25,pitch=.18,ty=-.25,tp=.18,drag=null,vis=true,t=0;
const S=()=>window.ROSE||{g:0,c:'gold'};
function apply(){const s=S(),g=s.g/100,P=pal[s.c]||pal.gold;
  for(const p of parts){const k=Math.min(1,Math.max(0,(g*1.35-p.th)/.28));tmp.copy(plaster).lerp(new THREE.Color(P[0]),k);p.m.color.copy(tmp);p.m.metalness=k;p.m.roughness=.88+(P[1]-.88)*k}}
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(!w)return;r.setSize(w,h,false)}
function draw(){apply();rose.rotation.set(pitch,yaw,0);key.position.x=3+yaw*6;r.render(sc,cam)}
function loop(){if(vis){yaw+=(ty-yaw)*.07;pitch+=(tp-pitch)*.07;if(!RM){t+=.01;rose.rotation.z=Math.sin(t*.6)*.05}draw()}requestAnimationFrame(loop)}
window.ROSE=Object.assign(window.ROSE||{g:0,c:'gold'},{draw:()=>{if(RM)draw()}});
new ResizeObserver(()=>{size();draw()}).observe(cv);
new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cv);
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(drag){ty+=(e.clientX-drag.x)*.01;tp+=(e.clientY-drag.y)*.01;ty=Math.max(-.9,Math.min(.9,ty));tp=Math.max(-.7,Math.min(.8,tp));drag={x:e.clientX,y:e.clientY};if(RM)draw()}else if(!RM&&matchMedia('(pointer:fine)').matches){const b=cv.getBoundingClientRect();ty=((e.clientX-b.left)/b.width-.5)*.9;tp=((e.clientY-b.top)/b.height-.5)*.7}});
cv.addEventListener('pointerup',()=>drag=null);cv.addEventListener('pointercancel',()=>drag=null);
cv.tabIndex=0;cv.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')ty-=.15;if(e.key==='ArrowRight')ty+=.15;if(e.key==='ArrowUp')tp-=.15;if(e.key==='ArrowDown')tp+=.15;if(RM)draw()});
size();draw();loop();window.__rose=true;
