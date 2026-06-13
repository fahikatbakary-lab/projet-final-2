// main.js — lightweight behaviors: loader hide, stats on view, nav active, back-to-top
(function(){
  'use strict';

  // Hide loader when page fully loaded
  window.addEventListener('load', function(){
    var loader = document.getElementById('page-loader');
    if(loader){
      loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      loader.setAttribute('aria-hidden','true');
      setTimeout(function(){ if(loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
    }
  });

  // Back to top visibility + smooth scroll
  var back = document.querySelector('.back-to-top');
  if(back){
    back.style.opacity = '0';
    back.style.pointerEvents = 'none';
    back.style.transform = 'translateY(8px)';

    window.addEventListener('scroll', function(){
      if(window.scrollY > 300){
        back.style.opacity = '0.95';
        back.style.pointerEvents = 'auto';
        back.style.transform = 'translateY(0)';
      } else {
        back.style.opacity = '0';
        back.style.pointerEvents = 'none';
        back.style.transform = 'translateY(8px)';
      }
    }, {passive:true});

    back.addEventListener('click', function(ev){
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // IntersectionObserver for stats counters
  var statSection = document.querySelector('.stats');
  if(statSection){
    var statsObserved = false;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !statsObserved){
          statsObserved = true;
          var cards = statSection.querySelectorAll('.stat-card');
          cards.forEach(function(card, idx){
            var count = card.querySelector('.count');
            if(!count) return;
            var totalHeight = 0;
            for(var i=0;i<count.children.length;i++){
              totalHeight += count.children[i].offsetHeight || 42;
            }
            var steps = Math.max(1, count.children.length - 1);
            var duration = Math.max(0.8, 1.0 + (idx * 0.12));
            count.style.transition = 'transform ' + duration + 's steps(' + Math.max(1,steps) + ')';
            // final translateY value: move up by totalHeight - single child height
            var single = count.children[0] ? count.children[0].offsetHeight || 42 : 42;
            var final = totalHeight - single;
            // trigger reflow then set final translate
            void count.offsetWidth;
            count.style.transform = 'translateY(-' + final + 'px)';
          });
          io.disconnect();
        }
      });
    }, { root: null, threshold: 0.3 });
    io.observe(statSection);
  }

  // Highlight active nav link on scroll
  var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  var sections = [];
  navLinks.forEach(function(link){
    var id = link.getAttribute('href').split('#')[1];
    if(id){
      var el = document.getElementById(id);
      if(el) sections.push({ id: id, el: el, link: link });
    }
  });

  function onScrollNav(){
    var middle = window.scrollY + (window.innerHeight/2);
    var current = sections.find(function(s){
      var top = s.el.offsetTop;
      var bottom = top + s.el.offsetHeight;
      return middle >= top && middle < bottom;
    });
    navLinks.forEach(function(a){ a.classList.remove('active'); });
    if(current && current.link){ current.link.classList.add('active'); }
  }
  window.addEventListener('scroll', onScrollNav, {passive:true});
  // run once
  onScrollNav();

})();
