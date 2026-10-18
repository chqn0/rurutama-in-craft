(() => {
  'use strict';

  /* ---- スクロールで順番にふわっと表示 ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- ナビ: 現在位置をハイライト ---- */
  const links = [...document.querySelectorAll('#nav a')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const i = targets.indexOf(e.target);
        links.forEach((a, n) => a.classList.toggle('is-active', n === i));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  targets.forEach((t) => t && spy.observe(t));

  /* ---- スライドショー（お知らせ・グッズ共通 / 矢印・スワイプ・自動送り） ---- */
  document.querySelectorAll('.js-slider').forEach((slider) => {
    const track = slider.querySelector('.slides');
    const count = track.children.length;
    const dots = slider.querySelector('.dots');
    let index = 0, timer = null;

    for (let i = 0; i < count; i++) dots.appendChild(document.createElement('i'));

    function go(n) {
      index = (n + count) % count;
      track.style.transform = `translateX(-${index * 100}%)`;
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === index));
    }
    function auto() {
      clearInterval(timer);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(index + 1), 4500);
    }
    slider.querySelector('.prev').addEventListener('click', () => { go(index - 1); auto(); });
    slider.querySelector('.next').addEventListener('click', () => { go(index + 1); auto(); });

    let startX = null;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); auto(); }
      startX = null;
    });
    go(0); auto();
  });
  
  /* ---- TOPへ戻る ---- */
  document.getElementById('toTop').addEventListener('click', () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
