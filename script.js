const progress = document.getElementById('progress');
const revealEls = document.querySelectorAll('.reveal');
const heroStack = document.querySelector('.hero-stack');
const bgName = document.getElementById('bgName');
const portrait = document.getElementById('heroPortrait');
const tiltCards = document.querySelectorAll('.card[data-tilt="true"]');
const themeToggle = document.getElementById('themeToggle');

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
};

const savedTheme = localStorage.getItem('themeMode');
if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('themeMode', next);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
};

const updateParallax = () => {
  if (!heroStack) return;
  const rect = heroStack.getBoundingClientRect();
  const center = window.innerHeight * 0.5;
  const delta = (center - rect.top) / window.innerHeight;
  const clamped = Math.max(-1, Math.min(1, delta));

  if (bgName) {
    bgName.style.transform = `translateX(-50%) translateY(${clamped * -38}px)`;
  }

  if (portrait) {
    const scale = 1 + Math.max(-0.03, Math.min(0.09, clamped * 0.08));
    portrait.style.transform = `translateX(-50%) translateZ(50px) scale(${scale})`;
  }
};

const addTilt = (element) => {
  element.addEventListener('mousemove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    element.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${y * -6}deg) translateY(-3px)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  });
};

tiltCards.forEach(addTilt);

window.addEventListener('scroll', () => {
  updateProgress();
  updateParallax();
}, { passive: true });

window.addEventListener('resize', () => {
  updateProgress();
  updateParallax();
});

if (heroStack) {
  heroStack.addEventListener('mousemove', (event) => {
    const rect = heroStack.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (portrait) {
      portrait.style.filter = `drop-shadow(${x * 8}px ${28 + y * 6}px 40px rgba(0,0,0,0.58))`;
    }

    if (bgName) {
      const current = parseFloat((bgName.dataset.baseShift || '0'));
      bgName.style.transform = `translateX(-50%) translateY(${current + y * -12}px) translateX(${x * 10}px)`;
    }
  });

  heroStack.addEventListener('mouseleave', () => {
    if (portrait) portrait.style.filter = 'drop-shadow(0 38px 44px rgba(0, 0, 0, 0.62))';
  });
}

updateProgress();
updateParallax();
