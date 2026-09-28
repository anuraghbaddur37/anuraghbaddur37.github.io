(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.getElementById('motion-toggle');
  let motionOff = preference.matches;
  document.querySelectorAll('h2').forEach(heading => {
    let index = 0;
    const split = parent => {
      [...parent.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(word => {
            if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
            const span = document.createElement('span');
            span.className = 'motion-word';
            span.style.setProperty('--word-delay', `${Math.min(index++, 10) * 65}ms`);
            span.textContent = word;
            fragment.append(span);
          });
          node.replaceWith(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') split(node);
      });
    };
    split(heading);
  });
  document.querySelectorAll('.software-inner > span').forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${index * 60}ms`);
  });
  document.querySelectorAll('.work-grid .project').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${index % 2 * 110}ms`);
  });
  function setMotion(off) {
    motionOff = off;
    root.classList.toggle('motion-off', off);
    root.classList.toggle('motion-on', !off);
    button.setAttribute('aria-pressed', String(off));
    button.textContent = off ? 'Play motion' : 'Pause motion';
    button.setAttribute('aria-label', off ? 'Enable animations' : 'Disable animations');
  }
  if ('IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
        else if (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight) entry.target.classList.remove('visible');
      });
    }, { threshold: 0 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  setMotion(motionOff);
  button.addEventListener('click', () => setMotion(!motionOff));
  preference.addEventListener('change', event => setMotion(event.matches));
  document.getElementById('year').textContent = new Date().getFullYear();
})();
