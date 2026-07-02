document.addEventListener('DOMContentLoaded', () => {

  // ---- Theme toggle (light/dark) ----
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('sbg-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', current);
    localStorage.setItem('sbg-theme', current);
    themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
  });
  if (themeToggle) themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';

  // ---- Mobile nav toggle ----
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle?.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // ---- Team/Gallery image fallback placeholders ----
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('broken');
      const placeholder = document.createElement('div');
      placeholder.className = 'photo-placeholder';
      placeholder.innerHTML = `<span class="cam">📷</span><span>${img.dataset.fallback}</span>`;
      img.parentElement.appendChild(placeholder);
    });
  });

  // ---- Lightbox for gallery ----
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (img.classList.contains('broken')) return;
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });

  // ---- Contact form ----
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const messageBox = document.getElementById('message');
  const charCount = document.getElementById('char-count');

  messageBox?.addEventListener('input', () => {
    charCount.textContent = `${messageBox.value.length}/5000`;
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    status.className = 'form-status';
    status.textContent = 'Sending...';
    status.style.display = 'block';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      status.className = 'form-status ' + (result.ok ? 'success' : 'error');
      status.textContent = result.ok ? '✔ ' + result.message : '✖ ' + result.error;
      if (result.ok) form.reset();
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = '✖ Something went wrong. Please email us directly.';
    }
  });

});