const root = document.documentElement;

const nav = document.querySelector('.site-nav');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 12);
});

menuBtn?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('mobile-open');
  menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('mobile-open');
  menuBtn?.setAttribute('aria-expanded','false');
}));

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

const workspaceData = {
  detention: {
    title:'DETENTION',
    subtitle:'The Negativity Curse',
    description:'A psychological horror action adventure where a living school feeds on fear, pressure, regret and failure.',
    href:'/projects/detention/'
  },
  build: {
    title:'BUILD MODE',
    subtitle:'AI · CODE · AUTOMATION · SAAS',
    description:'A practical learning system designed to move from understanding technology to actually shipping with it.',
    href:'/projects/build-mode/'
  },
  neuronix: {
    title:'NEURONIX',
    subtitle:'PERSONAL INTELLIGENCE',
    description:'A private intelligence layer exploring how personal AI can become a long-term thinking and building partner.',
    href:'/projects/neuronix/'
  }
};

document.querySelectorAll('[data-workspace]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-workspace]').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const key = button.dataset.workspace;
    const data = workspaceData[key];
    document.querySelector('[data-workspace-title]').textContent = data.title;
    document.querySelector('[data-workspace-subtitle]').textContent = data.subtitle;
    document.querySelector('[data-workspace-description]').textContent = data.description;
    document.querySelector('[data-workspace-link]').href = data.href;
    document.querySelector('[data-workspace-mark]').textContent = data.title === 'BUILD MODE' ? 'B' : data.title === 'NEURONIX' ? 'N' : 'D';
  });
});
