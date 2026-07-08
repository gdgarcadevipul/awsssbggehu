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
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-open');
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('mobile-open') && !navLinks.contains(e.target) && e.target !== menuToggle) {
      navLinks.classList.remove('mobile-open');
    }
  });

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // ---- Animated Counters ----
  const statNums = document.querySelectorAll('.stat-box .num');
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target') || entry.target.innerText);
        let count = 0;
        const inc = Math.max(1, Math.ceil(target / 40)); // speed
        const updateCount = () => {
          count += inc;
          if (count < target) {
            entry.target.innerText = count + '+';
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = (entry.target.getAttribute('data-suffix') ? target + entry.target.getAttribute('data-suffix') : target + '+');
          }
        };
        updateCount();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(num => statObserver.observe(num));

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
  
  const openLightbox = (src) => {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
  };
  
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
  };

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (img.classList.contains('broken')) return;
      openLightbox(img.src);
    });
  });
  
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  
  // Escape key for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ---- Filter Logic (Events & Gallery) ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from siblings
      const container = btn.closest('.filter-tabs');
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const itemsContainer = document.querySelector(btn.getAttribute('data-target-container'));
      if (!itemsContainer) return;

      const items = itemsContainer.querySelectorAll('.filter-item');
      items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('filtered-out');
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });

  // ---- Toast for Coming Soon links ----
  const createToast = () => {
    let toast = document.getElementById('sbg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sbg-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    return toast;
  };

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const toast = createToast();
      toast.textContent = 'Coming Soon! Stay tuned.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    });
  });

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