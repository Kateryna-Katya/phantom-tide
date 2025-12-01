document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // 1. LENIS SMOOTH SCROLL (Плавный скролл)
  // =========================================
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false, // На мобильных лучше оставить нативный скролл
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // =========================================
  // 2. AOS INIT (Анимации при скролле)
  // =========================================
  AOS.init({
      duration: 800,  // Длительность анимации (ms)
      once: true,     // Анимация проигрывается только один раз
      offset: 50,     // Отступ от низа экрана до начала анимации
      easing: 'ease-out-cubic'
  });

  // =========================================
  // 3. UI LOGIC (Меню, Хедер, Год)
  // =========================================

  // --- Mobile Menu Toggle ---
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.header__link');

  if(navToggle) {
      navToggle.addEventListener('click', () => {
          navMenu.classList.add('active');
      });
  }

  if(navClose) {
      navClose.addEventListener('click', () => {
          navMenu.classList.remove('active');
      });
  }

  // Закрываем меню при клике на ссылку
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          navMenu.classList.remove('active');
      });
  });

  // --- Dynamic Year (Footer) ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

  // --- Header Shadow on Scroll ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
          header.style.background = "rgba(255, 255, 255, 0.95)";
      } else {
          header.style.boxShadow = "none";
          header.style.background = "rgba(255, 255, 255, 0.9)";
      }
  });

  // =========================================
  // 4. HERO SECTION ANIMATIONS (GSAP)
  // =========================================

  // Проверяем, есть ли Hero секция, чтобы избежать ошибок
  const heroTitleEl = document.getElementById('hero-title');

  if (heroTitleEl) {
      // A. Разбиваем текст заголовка на буквы
      const heroTitle = new SplitType('#hero-title', { types: 'chars' });

      // B. Timeline анимации появления
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from(heroTitle.chars, {
          y: 100,
          opacity: 0,
          stagger: 0.05, // Задержка между буквами
          duration: 1,
          delay: 0.2
      })
      .to('.hero__desc', {
          y: 0,
          opacity: 1,
          duration: 0.8
      }, "-=0.5") // Запускаем чуть раньше окончания предыдущей анимации
      .to('.hero__actions', {
          y: 0,
          opacity: 1,
          duration: 0.8
      }, "-=0.6")
      .to('.hero__stats', {
          opacity: 1,
          duration: 0.8
      }, "-=0.6")
      .fromTo('.hero__visual',
          { x: 50, opacity: 0 }, // Начальное состояние
          { x: 0, opacity: 1, duration: 1.2 }, "-=1"
      );

      // C. Parallax Effect on Mouse Move
      const heroSection = document.getElementById('hero');
      const heroVisual = document.getElementById('hero-visual');

      if (heroSection && heroVisual) {
          heroSection.addEventListener('mousemove', (e) => {
              // Работает только на десктопах (>900px) для производительности
              if(window.innerWidth > 900) {
                  const x = (window.innerWidth - e.pageX * 2) / 50;
                  const y = (window.innerHeight - e.pageY * 2) / 50;

                  gsap.to(heroVisual, {
                      x: x,
                      y: y,
                      duration: 0.5,
                      ease: 'power2.out'
                  });
              }
          });
      }
  }
});
