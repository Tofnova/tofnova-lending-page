gsap.registerPlugin(ScrollTrigger);
document.getElementById('yr').textContent = new Date().getFullYear();
const isTouch = matchMedia('(hover:none)').matches;

/* ---- Smooth mouse-wheel scrolling (Lenis) ---- */
let lenis;
if (window.Lenis) {
  lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  navLinks.classList.remove('open');
  lenis ? lenis.scrollTo(target, { offset: -70 }) : target.scrollIntoView({ behavior: 'smooth' });
}));

/* ---- Preloader -> Hero intro ---- */
const intro = gsap.timeline();
intro.to('.loader-word span', { y: 0, stagger: .07, duration: .7, ease: 'power4.out' })
     .to('.loader-bar i', { width: '100%', duration: .8, ease: 'power2.inOut' }, '-=.3')
     .to('.loader', { yPercent: -100, duration: .9, ease: 'power4.inOut' })
     .from('.hero h1 .line span', { yPercent: 110, stagger: .12, duration: 1, ease: 'power4.out' }, '-=.4')
     .from('.h-fade', { y: 30, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out' }, '-=.7')
     .from('.hero-logo', { scale: .4, opacity: 0, rotate: -20, duration: 1.2, ease: 'back.out(1.6)' }, '-=1')
     .from('.float-card', { scale: 0, opacity: 0, stagger: .15, duration: .6, ease: 'back.out(2)' }, '-=.6')
     .add(() => document.querySelectorAll('.hero-stats .count').forEach(runCounter), '-=.6');

/* Hero idle motion */
gsap.to('.orb-ring', { rotate: 360, duration: 14, repeat: -1, ease: 'none' });
gsap.to('.orb.o2', { rotate: -360, duration: 30, repeat: -1, ease: 'none' });
gsap.to('.hero-logo', { y: -18, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
gsap.utils.toArray('.float-card').forEach((c, i) => gsap.to(c, { y: i % 2 ? 14 : -14, duration: 2.4 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
gsap.to('.blob.b1', { x: -80, y: 60, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

/* Hero parallax on scroll */
gsap.to('.hero-content', { yPercent: 25, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.hero-visual', { yPercent: -15, scale: .9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

/* Hero mouse parallax */
if (!isTouch) {
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    gsap.to('.hero-logo', { x: x * 40, rotateY: x * 20, duration: 1, ease: 'power3.out' });
    gsap.to('.float-card', { x: x * -30, duration: 1.2, ease: 'power3.out' });
    gsap.to('.blob.b2', { x: x * 120, y: y * 120, duration: 2 });
  });
}

/* ---- Scroll progress + nav ---- */
gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
ScrollTrigger.create({ start: 80, end: 'max', onToggle: s => {
  document.getElementById('nav').classList.toggle('scrolled', s.isActive);
  document.getElementById('toTop').classList.toggle('show', s.isActive);
}});
document.getElementById('toTop').onclick = () => lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' });

/* ---- Marquee driven by scroll velocity ---- */
const mq = gsap.to('.marquee-track', { xPercent: -50, duration: 25, ease: 'none', repeat: -1 });
ScrollTrigger.create({ onUpdate: s => {
  const v = gsap.utils.clamp(-4, 4, s.getVelocity() / 300);
  gsap.to(mq, { timeScale: (s.direction === 1 ? 1 : -1) * (1 + Math.abs(v)), duration: .4, overwrite: true });
}});

/* ---- Word-by-word text reveal ---- */
document.querySelectorAll('.reveal-text').forEach(el => {
  el.innerHTML = el.textContent.split(' ').map(w => `<span class="word">${w}</span>`).join(' ');
  gsap.to(el.querySelectorAll('.word'), { opacity: 1, stagger: .1, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
});

/* ---- Generic reveals ---- */
gsap.utils.toArray('.section-head').forEach(h => gsap.from(h.children, { y: 50, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } }));
gsap.utils.toArray('.fade-up').forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
gsap.from('.slide-left', { x: 80, opacity: 0, stagger: .15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.mv-grid', start: 'top 80%' } });

gsap.from('.service', { y: 80, opacity: 0, rotateX: -15, stagger: { each: .1, grid: 'auto', from: 'start' }, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.services-grid', start: 'top 80%' } });

gsap.utils.toArray('.why-item').forEach(el => gsap.from(el, { x: 100, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

gsap.from('.counter-box', { scale: .9, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.counter-box', start: 'top 85%', onEnter: () => document.querySelectorAll('.counter-box .count').forEach(runCounter), once: true } });

gsap.to('.process-line i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process-wrap', start: 'top 75%', end: 'bottom 55%', scrub: true } });
gsap.from('.step', { y: 60, opacity: 0, stagger: .15, duration: .9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.process-grid', start: 'top 80%' } });

gsap.from('.tech-item', { scale: .5, opacity: 0, stagger: { each: .06, from: 'center' }, duration: .7, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.tech-grid', start: 'top 85%' } });

gsap.utils.toArray('.member').forEach((m, i) => {
  gsap.from(m, { y: 100, opacity: 0, duration: 1.1, delay: i * .15, ease: 'power3.out', scrollTrigger: { trigger: m, start: 'top 85%' } });
  gsap.fromTo(m.querySelector('img'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: m, scrub: true } });
});
gsap.from('.testi', { y: 60, opacity: 0, stagger: .15, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.testi-grid', start: 'top 85%' } });
gsap.from('.contact-info > *, form', { y: 50, opacity: 0, stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
gsap.from('.big-word', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: 'footer', start: 'top 85%' } });

/* ---- Counters ---- */
function runCounter(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const o = { v: 0 };
  gsap.to(o, { v: +el.dataset.to, duration: 2, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) });
}

/* ---- Custom cursor + magnetic buttons + 3D tilt ---- */
if (!isTouch) {
  const cur = document.querySelector('.cursor'), dot = document.querySelector('.cursor-dot');
  const cx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
  addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY); });
  document.querySelectorAll('a,button,.service,.tech-item,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
  });

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
  });

  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px');
      gsap.to(card, { rotateY: (x / r.width - .5) * 12, rotateX: (.5 - y / r.height) * 12, transformPerspective: 900, duration: .5, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'power3.out' }));
  });
}

/* ---- Mobile menu ---- */
const navLinks = document.getElementById('navLinks');
document.getElementById('burger').onclick = () => navLinks.classList.toggle('open');

/* ---- Contact form (client-side validation) ---- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, msg = document.getElementById('formMsg');
  if (f.website.value) return; // honeypot spam trap
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim());
  const missing = [...f.querySelectorAll('[required]')].filter(i => !i.value.trim());
  if (missing.length || !emailOk) {
    msg.className = 'form-msg err';
    msg.textContent = !emailOk && !missing.length ? 'Please enter a valid email address.' : 'Please fill in all required fields.';
    gsap.fromTo(f, { x: -10 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' });
    return;
  }
  msg.className = 'form-msg ok';
  msg.textContent = 'Thank you! Your message has been received. We will get back to you soon.';
  f.reset();
});

/* Missing team photo fallback */
document.querySelectorAll('.member img').forEach(img => img.addEventListener('error', () => { img.style.display = 'none'; }));