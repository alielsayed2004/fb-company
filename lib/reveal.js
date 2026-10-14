// Inline script (runs before first paint) that enables scroll reveals for elements with [data-reveal].
// Content is visible by default. Only elements that start below the first screen are hidden-then-revealed,
// and only when JS runs, IntersectionObserver exists and the visitor has not asked for reduced motion.
// Anything on screen at load (heroes, LCP text) is never hidden. A 3 s safety timer reveals anything still hidden.
export const revealScript = `(function(){try{
var d=document.documentElement;
if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.setAttribute('data-reveal-ready','');
var show=function(el){el.setAttribute('data-shown','');};
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
var queued=false;
var vh=window.innerHeight;
var scan=function(){queued=false;var els=document.querySelectorAll('[data-reveal]:not([data-shown]):not([data-observed])');for(var i=0;i<els.length;i++){var el=els[i];el.setAttribute('data-observed','');if(el.getBoundingClientRect().top<vh*0.9){show(el);continue;}el.setAttribute('data-pending','');io.observe(el);}};
var queue=function(){if(!queued){queued=true;requestAnimationFrame(scan);}};
new MutationObserver(queue).observe(d,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',scan);
window.addEventListener('load',function(){setTimeout(function(){var els=document.querySelectorAll('[data-reveal]:not([data-shown])');for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.top<window.innerHeight)show(els[i]);}},3000);});
}catch(e){document.documentElement.removeAttribute('data-reveal-ready');}})();`;
