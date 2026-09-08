(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const progress = document.getElementById('reading-progress');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  links.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  function updateScrollState() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * .42) current = section;
    });
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current?.id}`));
  }
  addEventListener('scroll', updateScrollState, { passive:true });
  updateScrollState();
})();
