const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress=document.querySelector('.progress');
const cursor=document.querySelector('.cursor');
const preloaderNumber=document.querySelector('.preloader-number');
let pointer={x:innerWidth/2,y:innerHeight/2};

window.addEventListener('mousemove',(event)=>{
  pointer={x:event.clientX,y:event.clientY};
  if(cursor){cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`}
});
document.querySelectorAll('a,.project-link,.arrow-link').forEach((el)=>{
  el.addEventListener('mouseenter',()=>cursor?.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursor?.classList.remove('hover'));
  el.addEventListener('click',()=>{cursor?.classList.add('click');setTimeout(()=>cursor?.classList.remove('click'),160)});
});
document.querySelectorAll('.magnetic').forEach((el)=>{
  el.addEventListener('mousemove',(event)=>{const box=el.getBoundingClientRect();const x=(event.clientX-box.left-box.width/2)*.12;const y=(event.clientY-box.top-box.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
});
const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=`${max?window.scrollY/max*100:0}%`};
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

if(preloaderNumber){let n=0;const tick=setInterval(()=>{n+=10;preloaderNumber.textContent=String(Math.min(n,100)).padStart(3,'0');if(n>=100)clearInterval(tick)},18)}

const revealObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('is-in');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.feature-project,.elsewhere-card,.intro-grid,.profile-strip,.statement h2').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(38px)';el.style.transition=`opacity .9s ${i%4*80}ms cubic-bezier(.16,1,.3,1), transform .9s ${i%4*80}ms cubic-bezier(.16,1,.3,1)`;revealObserver.observe(el)});
const style=document.createElement('style');style.textContent='.is-in{opacity:1!important;transform:none!important}';document.head.appendChild(style);
const palette=document.querySelector('.command-palette');const commandInput=document.querySelector('.command-search input');const openPalette=()=>{palette?.classList.add('open');palette?.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),80)};const closePalette=()=>{palette?.classList.remove('open');palette?.setAttribute('aria-hidden','true');if(commandInput)commandInput.value=''};document.querySelector('.command-trigger')?.addEventListener('click',openPalette);document.querySelector('.command-close')?.addEventListener('click',closePalette);document.querySelector('.command-backdrop')?.addEventListener('click',closePalette);window.addEventListener('keydown',(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openPalette()}if(event.key==='Escape')closePalette()});commandInput?.addEventListener('input',()=>{const query=commandInput.value.toLowerCase();document.querySelectorAll('.command-list a').forEach((item)=>item.style.display=item.textContent.toLowerCase().includes(query)?'flex':'none')});document.querySelectorAll('.command-list a').forEach((item)=>item.addEventListener('click',closePalette));

const canvas=document.querySelector('.field');const ctx=canvas?.getContext('2d');let dots=[];
const resizeCanvas=()=>{if(!canvas||!ctx)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dots=Array.from({length:Math.min(85,Math.floor(innerWidth/16))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.3,v:(Math.random()-.5)*.12}))};
const drawField=()=>{if(!ctx||reduceMotion)return;ctx.clearRect(0,0,innerWidth,innerHeight);dots.forEach((dot)=>{dot.x+=dot.v;if(dot.x<0||dot.x>innerWidth)dot.v*=-1;const dx=dot.x-pointer.x,dy=dot.y-pointer.y;const dist=Math.sqrt(dx*dx+dy*dy);const glow=Math.max(0,1-dist/220);ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r+glow*1.5,0,Math.PI*2);ctx.fillStyle=`rgba(213,255,101,${.16+glow*.5})`;ctx.fill()});requestAnimationFrame(drawField)};
resizeCanvas();window.addEventListener('resize',resizeCanvas);drawField();

const hero=document.querySelector('.hero-stage');
if(hero&&!reduceMotion){window.addEventListener('scroll',()=>{const y=window.scrollY;const orb=hero.querySelector('.hero-orbit');const copy=hero.querySelector('.hero-copy');if(orb)orb.style.transform=`translateY(${y*.12}px) rotate(${y*.03}deg)`;if(copy)copy.style.transform=`translateY(${y*.08}px)`},{passive:true})}
