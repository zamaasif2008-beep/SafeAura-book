(()=>{
const F=SS.films,N=F.length,stage=$('#stage'),shelf=$('#shelf'),cur=$('#cur'),play=$('#play'),capEl=$('#cap'),ind=$('.ind'),tabs=[...document.querySelectorAll('.tabs button')];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,E='cubic-bezier(.2,.8,.2,1)';
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

let H,ws,d,gap,W=innerWidth,VH=innerHeight,s=0,T=0,hover=-1,mx=W/2,my=VH/2,px=mx,py=my,tiltX=0,tiltY=0,active=-1,wt,down=null,dragged=false,btn=false,last=performance.now();
SS.open=false;

const sm=x=>x*x*(3-2*x),B=r=>Math.abs(r)<1?(r+Math.sin(Math.PI*r)/Math.PI)/2:Math.sign(r)*.5;
// Linear relative offset (no repeating duplicates)
const rel=v=>v-s;

const tapes=[];
for(let v=0;v<N;v++){
  const el=document.createElement('div');
  el.className='tape';
  el.innerHTML='<div class="face sp">'+SS.spine(v)+'</div><div class="face cv">'+SS.cover(v)+'</div>';
  stage.append(el);
  tapes.push({el,sp:el.firstChild,cv:el.lastChild,v,lift:0});
  el.addEventListener('pointerenter',()=>hover=v);
  el.addEventListener('pointerleave',()=>{if(hover===v)hover=-1});
  el.addEventListener('click',()=>{
    if(dragged||SS.open)return;
    const r=rel(v);
    if(Math.abs(r)<.5) SS.openDetail();
    else T=clamp(Math.round(T+r),0,N-1);
  });
}

SS.snap=()=>{T=Math.round(T)};
SS.active=()=>active;
SS.coverRect=()=>tapes[clamp(Math.round(s),0,N-1)].cv.getBoundingClientRect();

function measure(){
  W=innerWidth;VH=innerHeight;
  const p=document.createElement('div');
  p.style.cssText='position:absolute;visibility:hidden;height:var(--H)';
  document.body.append(p);
  H=p.offsetHeight;
  p.remove();
  ws=H*142/840;d=H*474/900;gap=H*.03;
  stage.style.setProperty('--ws',ws+'px');
  stage.style.setProperty('--d',d+'px');
  stage.style.setProperty('--hp',H+'px');
  play.style.left=(W/2-.5*d-6)+'px';
  play.style.top=(VH/2+.36*H)+'px';
  setInd();
}

function setInd(){
  const g=F[Math.max(active,0)].g,b=tabs.find(x=>x.dataset.g===g);
  tabs.forEach(x=>x.classList.toggle('on',x===b));
  if(b){
    ind.style.width=b.offsetWidth+'px';
    ind.style.transform=`translateX(${b.offsetLeft}px)`;
  }
}

function setActive(i,dir){
  const first=active<0;active=i;const f=F[i];
  const txt=[f.title,f.sub.toUpperCase(),f.g+' / Tool '+(i+1)+' of '+N];
  txt.forEach((t,j)=>{
    const ln=capEl.children[j],sp=document.createElement('span');
    sp.textContent=t;
    [...ln.children].filter(c=>!c.gone).forEach(o=>{
      o.gone=1;
      if(RM)return o.remove();
      const a=o.animate([{transform:getComputedStyle(o).transform},{transform:`translateY(${-dir*105}%)`}],{duration:650,easing:E,fill:'both'});
      a.onfinish=()=>o.remove();
    });
    ln.append(sp);
    if(!first&&!RM)sp.animate([{transform:`translateY(${dir*105}%)`},{transform:'translateY(0)'}],{duration:650,easing:E,fill:'both'});
  });
  setInd();
}

function frame(now){
  const dt=Math.min(.05,(now-last)/1000);
  last=now;
  s+=(T-s)*(1-Math.exp(-(RM?60:down&&dragged?18:5.2)*dt));
  if(Math.abs(T-s)<1e-4)s=T;

  const a=clamp(Math.round(s),0,N-1);
  if(a!==active)setActive(a,Math.sign(T-s)||1);

  const unsettled=Math.abs(T-s),cy0=VH/2;
  const onCover=!SS.open&&Math.abs(mx-W/2)<.55*d&&Math.abs(my-cy0)<.55*H&&unsettled<.3;
  const kt=1-Math.exp(-7*dt);
  tiltY+=((onCover?(mx-W/2)/(.55*d)*9:(mx-W/2)/W*5)-tiltY)*kt;
  tiltX+=((onCover?-(my-cy0)/(H/2)*6:0)-tiltX)*kt;
  const kl=RM?1:1-Math.exp(-12*dt);

  for(const t of tapes){
    const r=rel(t.v),x=r*(ws+gap)+(d-ws+1.6*gap)*B(r);
    if(Math.abs(x)>W/2+1.5*d){
      if(!t.hid){t.el.style.visibility='hidden';t.hid=1}
      continue;
    }
    if(t.hid){t.el.style.visibility='';t.hid=0}
    const o=sm(Math.max(0,1-Math.abs(r)));
    t.lift+=((hover===t.v&&Math.abs(r)>.5?1:0)-t.lift)*kl;
    t.el.style.transform=`translate3d(${x}px,${-o*.025*H-t.lift*.045*H}px,${o*.2*H}px) rotateZ(${-4.5*o}deg) rotateX(${tiltX*o}deg) rotateY(${-90*o+tiltY*o}deg)`;
    t.el.style.zIndex=Math.round(100-Math.abs(r)*4);
    t.sp.style.setProperty('--sh',o*.55);
    t.cv.style.setProperty('--sh',(1-o)*.5);
  }

  play.style.transform=`translate(-50%,-50%) scale(${SS.open?0:sm(Math.max(0,1-unsettled*3))})`;
  px+=(mx-px)*(1-Math.exp(-16*dt));
  py+=(my-py)*(1-Math.exp(-16*dt));
  cur.style.transform=`translate3d(${px}px,${py}px,0)`;
  cur.classList.toggle('open',onCover);
  cur.classList.toggle('spine',!SS.open&&!onCover&&hover>=0&&Math.abs(rel(hover))>.5);
  cur.classList.toggle('btn',btn);
  requestAnimationFrame(frame);
}

tabs.forEach(b=>b.addEventListener('click',()=>{
  const k=b.dataset.g==='all'?0:F.findIndex(f=>f.g===b.dataset.g);
  if(k>=0) T=k;
}));

$('#prev').addEventListener('click',()=>T=Math.max(0,Math.round(T)-1));
$('#next').addEventListener('click',()=>T=Math.min(N-1,Math.round(T)+1));
play.addEventListener('click',()=>SS.openDetail());

addEventListener('wheel',e=>{
  if(SS.open)return;
  const dl=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
  T=clamp(T+dl/(ws+gap)*.5, 0, N-1);
  clearTimeout(wt);
  wt=setTimeout(()=>T=Math.round(T),160);
},{passive:true});

shelf.addEventListener('pointerdown',e=>{
  if(SS.open)return;
  down={x:e.clientX,T0:T};
  dragged=false;
});

addEventListener('pointermove',e=>{
  mx=e.clientX;my=e.clientY;
  if(down){
    const dx=e.clientX-down.x;
    if(Math.abs(dx)>5)dragged=true;
    if(dragged)T=clamp(down.T0-dx/(ws+gap), 0, N-1);
  }
});

addEventListener('pointerup',()=>{
  if(down){
    if(dragged)T=Math.round(T);
    down=null;
    setTimeout(()=>dragged=false,0);
  }
});

addEventListener('mouseover',e=>{
  const el=e.target.closest&&e.target.closest('button,a');
  btn=!!el&&!el.closest('.shelf');
});

addEventListener('keydown',e=>{
  if(e.key==='Escape')SS.closeDetail();
  else if(SS.open)return;
  else if(e.key==='ArrowRight')T=Math.min(N-1,Math.round(T)+1);
  else if(e.key==='ArrowLeft')T=Math.max(0,Math.round(T)-1);
  else if(e.key==='Enter'&&document.activeElement===document.body)SS.openDetail();
});

addEventListener('resize',measure);
measure();
setActive(0,1);
requestAnimationFrame(frame);
})();