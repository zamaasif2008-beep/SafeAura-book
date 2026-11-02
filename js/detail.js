(()=>{
const D=$('#detail'),post=$('#post'),ms=[...D.querySelectorAll('.m>*')];
const EA='cubic-bezier(.76,0,.18,1)',EB='cubic-bezier(.2,.8,.2,1)',RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const dur=n=>RM?1:n,cir=[[150,330,0],[340,600,120],[250,120,220],[90,760,300],[400,250,360],[260,860,420],[230,470,180]];
let raf,closing=false;
const inset=r=>`inset(${r.top}px ${innerWidth-r.right}px ${innerHeight-r.bottom}px ${r.left}px round 3px)`;

function build(i){
  const f=SS.films[i];
  $('#d-sub').textContent=f.sub.toUpperCase();
  $('#d-title').textContent=f.title;
  $('#d-meta').textContent=`${f.g} Mode / Tool ${i+1} of 12 / 24/7 Availability`;
  $('#d-desc').textContent=f.desc;
  $('#d-note').textContent=f.note;
  $('#d-go').textContent='Launch Interactive Tool →';
  
  post.innerHTML=`<defs><filter id="ink" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="120" xChannelSelector="R" yChannelSelector="G"/></filter><mask id="im" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300"><g filter="url(#ink)" fill="#fff">${cir.map(c=>`<circle class="ink" cx="${c[0]}" cy="${c[1]}" r="0"/>`).join('')}</g></mask></defs><g mask="url(#im)">${SS.inner(i)}</g>`;
}

SS.openDetail=()=>{
  if(SS.open||closing)return;
  SS.snap();
  build(SS.active());
  const r=SS.coverRect();
  SS.open=true;
  D.style.visibility='visible';
  D.scrollTop=0;
  D.style.transformOrigin=`${r.left+r.width/2}px ${r.top+r.height/2}px`;
  D.animate([{clipPath:inset(r),transform:'rotate(-4.5deg)'},{clipPath:'inset(0 0 0 0 round 0)',transform:'rotate(0deg)'}],{duration:dur(1050),easing:EA,fill:'both'});
  ms.forEach((el,k)=>{el.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],{duration:dur(900),easing:EB,delay:RM?0:620+k*75,fill:'both'})});
  const t0=performance.now()+(RM?-5000:520),cs=post.querySelectorAll('circle.ink');
  cancelAnimationFrame(raf);
  const loop=now=>{
    const t=now-t0;
    cs.forEach((c,k)=>{
      const p=Math.min(1,Math.max(0,(t-cir[k][2])/1250));
      c.setAttribute('r',720*(1-Math.pow(1-p,3)));
    });
    if(t<2400)raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);
};

SS.closeDetail=()=>{
  if(!SS.open||closing)return;
  closing=true;
  cancelAnimationFrame(raf);
  const r=SS.coverRect();
  const a=D.animate([{clipPath:'inset(0 0 0 0 round 0)',transform:'rotate(0deg)'},{clipPath:inset(r),transform:'rotate(-4.5deg)'}],{duration:dur(850),easing:EA,fill:'both'});
  a.onfinish=()=>{
    D.style.visibility='hidden';
    D.getAnimations().forEach(x=>x.cancel());
    ms.forEach(el=>el.getAnimations().forEach(x=>x.cancel()));
    SS.open=false;
    closing=false;
  };
};

$('#close').addEventListener('click',SS.closeDetail);

// LAUNCH INTERACTIVE DEMO FROM DETAIL
$('#d-go').addEventListener('click',()=>{
  const activeTool = SS.films[SS.active()];
  SS.closeDetail();
  setTimeout(()=>{
    if(window.SS_DEMO && window.SS_DEMO.openTool){
      window.SS_DEMO.openTool(activeTool.id);
    }
  }, 400);
});
})();