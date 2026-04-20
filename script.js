// ── LOADER ──
const loaderMsgs = ['LOADING ASSETS...','DECRYPTING FILES...','ESTABLISHING LINK...','SYSTEM READY.'];
let lmIdx = 0;
const lmEl = document.getElementById('loader-msg');
const lmInt = setInterval(()=>{ lmEl.textContent = loaderMsgs[++lmIdx]; if(lmIdx>=loaderMsgs.length-1)clearInterval(lmInt); },500);
setTimeout(()=>{
  document.getElementById('loader').style.opacity='0';
  document.getElementById('loader').style.transition='opacity .5s';
  setTimeout(()=>document.getElementById('loader').remove(),500);
},2200);

// ── CURSOR ──
const cur = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
const cross = document.getElementById('cursor-crosshair');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
  cross.style.left=mx+'px'; cross.style.top=my+'px';
});

const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
if(navToggle){
  navToggle.addEventListener('click',()=> nav.classList.toggle('nav-open'));
  navLinks.forEach(link=> link.addEventListener('click',()=> nav.classList.remove('nav-open')));
}
(function animCur(){
  cx += (mx-cx)*.15; cy += (my-cy)*.15;
  cur.style.left=cx+'px'; cur.style.top=cy+'px';
  requestAnimationFrame(animCur);
})();
document.querySelectorAll('a,button,.skill-card,.tech-card,.cert-card,.project-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cur.style.width='36px'; cur.style.height='36px'; cur.style.borderColor='var(--amber)'; });
  el.addEventListener('mouseleave',()=>{ cur.style.width='20px'; cur.style.height='20px'; cur.style.borderColor='var(--green)'; });
});

// ── CANVAS BACKGROUND ─
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
resize();
window.addEventListener('resize',resize);

class Particle {
  constructor(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.size=Math.random()*1.5+.5;
    this.speed=Math.random()*.4+.1;
    this.opacity=Math.random()*.5+.1;
    this.char = Math.random()>.7 ? ['0','1','<','>','/','{','}','#'][Math.floor(Math.random()*8)] : null;
  }
  update(){ this.y-=this.speed; if(this.y<-10){this.y=H+10; this.x=Math.random()*W;} }
  draw(){
    ctx.save();
    if(this.char){
      ctx.font=`${this.size*8}px monospace`;
      ctx.fillStyle=`rgba(0,255,65,${this.opacity*.6})`;
      ctx.fillText(this.char,this.x,this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,65,${this.opacity})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

for(let i=0;i<120;i++) particles.push(new Particle());

// Mouse interaction
let mouseX=W/2, mouseY=H/2;
document.addEventListener('mousemove',e=>{ mouseX=e.clientX; mouseY=e.clientY; });

function drawCanvas(){
  ctx.clearRect(0,0,W,H);
  // Connection lines near mouse
  particles.forEach(p=>{
    const dx=p.x-mouseX, dy=p.y-mouseY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<120){
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(mouseX,mouseY);
      ctx.strokeStyle=`rgba(0,255,65,${.15*(1-dist/120)})`;
      ctx.lineWidth=.5;
      ctx.stroke();
    }
    p.update(); p.draw();
  });
  // Grid lines
  ctx.strokeStyle='rgba(0,255,65,0.03)';
  ctx.lineWidth=1;
  for(let x=0;x<W;x+=80){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
  for(let y=0;y<H;y+=80){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ── TYPING EFFECT ──
const phrases = [
  'Executing mission_code.py...',
  'Deploying tactical web systems...',
  'Securing perimeter: firewall active...',
  'Intel analysis: data processed...',
  'Standby for next operation...'
];
let pIdx=0,cIdx=0,typing=true;
const tEl=document.getElementById('typing-text');
function typeLoop(){
  if(typing){
    tEl.textContent=phrases[pIdx].slice(0,++cIdx);
    if(cIdx>=phrases[pIdx].length){ typing=false; setTimeout(typeLoop,2000); return; }
  } else {
    tEl.textContent=phrases[pIdx].slice(0,--cIdx);
    if(cIdx<=0){ typing=true; pIdx=(pIdx+1)%phrases.length; setTimeout(typeLoop,400); return; }
  }
  setTimeout(typeLoop,typing?80:40);
}
setTimeout(typeLoop,2500);

// ── REVEAL ON SCROLL ──
const reveals=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'),i*80); } });
},{threshold:.15});
reveals.forEach(el=>obs.observe(el));

// ── COUNT UP NUMBERS ──
const counters=document.querySelectorAll('[data-target]');
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const target=+e.target.dataset.target;
      let cur=0;
      const step=target/40;
      const timer=setInterval(()=>{
        cur+=step; e.target.textContent=Math.min(Math.floor(cur),target);
        if(cur>=target){ e.target.textContent=target; clearInterval(timer); }
      },40);
      countObs.unobserve(e.target);
    }
  });
},{threshold:.5});
counters.forEach(c=>countObs.observe(c));
