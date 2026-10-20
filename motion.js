// Page motion: headline word reveals, fade-up sections, portrait zoom. No libraries.
// Respects "reduce motion" settings.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-motion');

  // 1. Split headlines into words (keeps <em> and <br>)
  function split(el) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el); el.classList.add('split');
    el.querySelectorAll('.wi').forEach((wi, i) => wi.style.transitionDelay = (0.15 + i * 0.06) + 's');
  }
  document.querySelectorAll('.statement, .collab-intro, .contact-statement, .case-title').forEach(split);

  // 2. Things that rise into view
  const rise = [
    '.lander-hero-text > p:not(.hello)', '.collab-section .logo-tile', '.testimonial',
    '.case-lead', '.case-body', '.case-media', '.slideshow', '.contact-actions', '.project-card'
  ];
  document.querySelectorAll(rise.join(',')).forEach(el => el.classList.add('reveal'));

  // stagger siblings
  const stagger = (sel, step) => document.querySelectorAll(sel).forEach((el, i) => el.style.transitionDelay = (i * step) + 's');
  stagger('.collab-section .logo-tile', 0.04);
  stagger('.testimonial', 0.12);
  stagger('.project-card', 0.08);
  document.querySelectorAll('.lander-hero-text > p:not(.hello)').forEach((el, i) => el.style.transitionDelay = (0.7 + i * 0.12) + 's');

  const targets = document.querySelectorAll('.split, .reveal, .hello, .sea-label, .lander-hero-photo');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(t => io.observe(t));

  // 3. Gentle parallax zoom on the portrait while scrolling
  const photo = document.querySelector('.lander-hero-photo');
  if (photo) {
    setTimeout(() => photo.classList.add('settled'), 2000);
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking || !photo.classList.contains('settled')) return;
      ticking = true;
      requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, scrollY / innerHeight));
        photo.style.setProperty('--parallax', (1 + p * 0.08).toFixed(3));
        ticking = false;
      });
    }, { passive: true });
  }
})();
