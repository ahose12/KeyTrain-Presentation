(() => {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const progress = document.getElementById('reading-progress');
  const presentButton = document.getElementById('present-button');
  const presentLabel = document.getElementById('present-label');
  const notes = document.getElementById('meeting-notes');
  const clearNotes = document.getElementById('clear-notes');

  document.getElementById('year').textContent = new Date().getFullYear();

  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  links.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('bar-chart')) {
        entry.target.classList.add('animated');
      }
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .16 });

  document.querySelectorAll('.reveal, .bar-chart').forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const decimals = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: .55 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  function updateScrollState() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    progress.style.width = `${pct}%`;

    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * .4) current = section;
    });
    const id = current.id;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    if (presentLabel) presentLabel.textContent = current.dataset.section || current.id;
  }
  addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  function setPresentationMode(enabled) {
    body.classList.toggle('presentation-mode', enabled);
    presentButton.textContent = enabled ? 'Exit' : 'Present';
    if (enabled) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      const nearest = sections.reduce((best, section) => {
        return Math.abs(section.getBoundingClientRect().top) < Math.abs(best.getBoundingClientRect().top) ? section : best;
      }, sections[0]);
      nearest.scrollIntoView({ behavior: 'smooth' });
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }

  presentButton?.addEventListener('click', () => setPresentationMode(!body.classList.contains('presentation-mode')));

  document.addEventListener('keydown', (event) => {
    if (!body.classList.contains('presentation-mode')) return;
    if (event.target.matches('textarea, input')) return;

    if (event.key === 'Escape') {
      setPresentationMode(false);
      return;
    }
    const nextKeys = ['ArrowDown', 'ArrowRight', 'PageDown', ' '];
    const prevKeys = ['ArrowUp', 'ArrowLeft', 'PageUp'];
    if (![...nextKeys, ...prevKeys].includes(event.key)) return;
    event.preventDefault();

    let currentIndex = 0;
    let smallest = Infinity;
    sections.forEach((section, index) => {
      const distance = Math.abs(section.getBoundingClientRect().top);
      if (distance < smallest) { smallest = distance; currentIndex = index; }
    });
    if (nextKeys.includes(event.key)) currentIndex = Math.min(sections.length - 1, currentIndex + 1);
    if (prevKeys.includes(event.key)) currentIndex = Math.max(0, currentIndex - 1);
    sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
  });

  if (notes) {
    notes.value = localStorage.getItem('keytrainMeetingNotes') || '';
    notes.addEventListener('input', () => localStorage.setItem('keytrainMeetingNotes', notes.value));
    clearNotes?.addEventListener('click', () => {
      if (confirm('Clear the meeting notes saved in this browser?')) {
        notes.value = '';
        localStorage.removeItem('keytrainMeetingNotes');
      }
    });
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && body.classList.contains('presentation-mode')) {
      setPresentationMode(false);
    }
  });
})();
