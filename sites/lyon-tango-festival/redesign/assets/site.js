(function(){
  var header = document.querySelector('header.site');
  var hero = document.getElementById('hero');
  if(!header || !hero || !('IntersectionObserver' in window)){ if(header) header.classList.add('past-hero'); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      header.classList.toggle('past-hero', !entry.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '-45% 0px 0px 0px' });
  io.observe(hero);
})();

var siteLang = document.getElementById('site-lang');
function applyLang(lang){
  document.querySelectorAll('[data-lang]').forEach(function(block){ block.hidden = block.getAttribute('data-lang') !== lang; });
  document.documentElement.setAttribute('lang', lang);
}
if(siteLang){
  siteLang.addEventListener('change', function(){ applyLang(siteLang.value); });
  applyLang(siteLang.value);
}

function positionDropPanel(drop){
  var trigger = drop.querySelector('.nav-drop-trigger');
  var panel = drop.querySelector('.drop-panel');
  if(!trigger || !panel) return;
  var rect = trigger.getBoundingClientRect();
  panel.style.top = (rect.bottom + 6) + 'px';
  var left = Math.min(rect.left, window.innerWidth - panel.offsetWidth - 8);
  panel.style.left = Math.max(8, left) + 'px';
}
var navDrops = document.querySelectorAll('.nav-drop');
navDrops.forEach(function(drop){
  drop.addEventListener('mouseenter', function(){ positionDropPanel(drop); });
  drop.addEventListener('focusin', function(){ positionDropPanel(drop); });
});
window.addEventListener('resize', function(){
  navDrops.forEach(positionDropPanel);
});
