/**
 * ASE APTITUDE – Spoken English & Computer Institute
 * Master JavaScript (script.js)
 * Clean, modern vanilla JavaScript with zero console errors.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ================================================================
  // 1. MOBILE NAVIGATION & HAMBURGER MENU
  // ================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenuWrapper = document.getElementById('navMenuWrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenuWrapper) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.classList.toggle('active');
      navMenuWrapper.classList.toggle('is-open');
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenuWrapper.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenuWrapper.classList.contains('is-open') &&
          !navMenuWrapper.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenuWrapper.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ================================================================
  // 2. STICKY NAVBAR SCROLL BEHAVIOR & BACK TO TOP BUTTON
  // ================================================================
  const siteHeader = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header sticky shadow
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrollY > 450) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ================================================================
  // 3. ACTIVE NAVIGATION LINK HIGHLIGHTING
  // ================================================================
  const sections = document.querySelectorAll('section[id], header[id]');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ================================================================
  // 4. SMOOTH SCROLLING FOR ALL ANCHORS
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================================================
  // 5. AUTOMATIC STUDENT REVIEW SLIDER
  // Auto-slide every 4.5s, manual arrows, dots, pause on interact
  // ================================================================
  const sliderContainer = document.getElementById('reviewsSliderContainer');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (slides.length > 0) {
    let currentSlide = 0;
    let autoSlideTimer = null;
    const SLIDE_INTERVAL = 3000; // 3 seconds

    // Build pagination dots dynamically
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          restartAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };

    // Initialize first slide
    goToSlide(0);

    // Arrow button controls
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoSlide();
      });
    }

    // Auto-slide functionality
    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const restartAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    // Pause on hover or touch
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
      sliderContainer.addEventListener('touchstart', stopAutoSlide, { passive: true });
      sliderContainer.addEventListener('touchend', startAutoSlide, { passive: true });
    }

    // Start initial timer
    startAutoSlide();
  }

  // ================================================================
  // 6. COURSE SYLLABUS MODAL ("Learn More" action)
  // ================================================================
  const courseData = {
    'spoken-english': {
      badge: 'Communication Mastery Track',
      title: 'Spoken English & Communication Skills',
      courseVal: 'Spoken English',
      content: `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <p style="color: #cbd5e1; font-size: 0.98rem;">
            A rigorous and encouraging course designed to eliminate hesitation, master correct grammar rules, and develop fluent conversational English for interviews and professional life.
          </p>
          <div style="background: rgba(30, 58, 138, 0.25); border-left: 3px solid #38bdf8; padding: 1rem; border-radius: 6px;">
            <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Course Modules:</strong>
            <ul style="margin-left: 1.2rem; list-style-type: disc; color: #93c5fd; font-size: 0.92rem; display: flex; flex-direction: column; gap: 4px;">
              <li>Basic to Advanced Grammar & Sentence Structures</li>
              <li>Everyday Situational Conversations & Pronunciation Drill</li>
              <li>Vocabulary Enrichment & Idiomatic English</li>
              <li>Public Speaking, Extempore & Overcoming Stage Fear</li>
              <li>Group Discussions & Corporate Etiquette</li>
              <li>Professional Interview Skills & Resume Preparation</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; background: rgba(0,0,0,0.25); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.88rem; color: #cbd5e1;">
            <span><i class="fa-regular fa-clock" style="color: #38bdf8;"></i> Duration: 3 to 6 Months</span>
            <span><i class="fa-solid fa-users" style="color: #38bdf8;"></i> Batch Size: 12-15 Students</span>
            <span><i class="fa-solid fa-certificate" style="color: #f59e0b;"></i> Certificate upon Completion</span>
          </div>
        </div>
      `
    },
    'computer-courses': {
      badge: 'Diploma Programs',
      title: 'Computer Applications & IT Literacy (DCA / ADCA / DTP)',
      courseVal: 'Computer Courses (DCA / ADCA)',
      content: `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <p style="color: #cbd5e1; font-size: 0.98rem;">
            From fundamental computer literacy to advanced applications and desktop graphic design, this program builds strong technical competence for modern offices and digital enterprises.
          </p>
          <div style="background: rgba(255, 107, 0, 0.15); border-left: 3px solid #f97316; padding: 1rem; border-radius: 6px;">
            <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Curriculum Highlights:</strong>
            <ul style="margin-left: 1.2rem; list-style-type: disc; color: #fdba74; font-size: 0.92rem; display: flex; flex-direction: column; gap: 4px;">
              <li><strong>DCA (Diploma in Computer Applications):</strong> OS Fundamentals, MS Office (Word, Excel, PowerPoint), Internet & Emailing.</li>
              <li><strong>ADCA (Advance Diploma):</strong> DCA + Database, HTML, Visual FoxPro/Access, System Maintenance.</li>
              <li><strong>DTP (Desktop Publishing):</strong> PageMaker, CorelDraw, Photoshop fundamentals, Printing setups.</li>
              <li><strong>DIT & DFA:</strong> Information Technology concepts & Financial Accounting basics.</li>
              <li><strong>Bilingual Typing:</strong> English & Hindi typing speeds with touch-typing mastery.</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; background: rgba(0,0,0,0.25); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.88rem; color: #cbd5e1;">
            <span><i class="fa-regular fa-clock" style="color: #f97316;"></i> Duration: 6 to 12 Months</span>
            <span><i class="fa-solid fa-desktop" style="color: #f97316;"></i> 1:1 Individual Computer Access</span>
            <span><i class="fa-solid fa-certificate" style="color: #f59e0b;"></i> ISO Recognized Diploma</span>
          </div>
        </div>
      `
    },
    'professional-skills': {
      badge: 'Corporate Career Track',
      title: 'Professional Accounting & Skills (Tally Prime + Advanced Excel)',
      courseVal: 'Professional Skills (Tally Prime / Excel)',
      content: `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <p style="color: #cbd5e1; font-size: 0.98rem;">
            Designed for aspiring accountants, finance analysts, and office administrators. Master modern commercial software with real-time business ledgers, GST filings, and data dashboards.
          </p>
          <div style="background: rgba(13, 148, 136, 0.2); border-left: 3px solid #14b8a6; padding: 1rem; border-radius: 6px;">
            <strong style="color: #ffffff; display: block; margin-bottom: 4px;">Key Learning Modules:</strong>
            <ul style="margin-left: 1.2rem; list-style-type: disc; color: #5eead4; font-size: 0.92rem; display: flex; flex-direction: column; gap: 4px;">
              <li><strong>Tally Prime Fundamentals:</strong> Company creation, ledger groups, vouchers, inventory management.</li>
              <li><strong>Taxation & Compliance:</strong> GST invoicing, CGST/SGST/IGST calculation, E-way billing & returns.</li>
              <li><strong>Advanced Excel:</strong> VLOOKUP, HLOOKUP, XLOOKUP, INDEX-MATCH, nested IF conditions.</li>
              <li><strong>Data Analysis:</strong> Pivot tables, slicing, dynamic charts, MIS report generation.</li>
              <li><strong>Practical Projects:</strong> Live business financial statements and balance sheet audits.</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; background: rgba(0,0,0,0.25); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.88rem; color: #cbd5e1;">
            <span><i class="fa-regular fa-clock" style="color: #14b8a6;"></i> Duration: 2 to 4 Months</span>
            <span><i class="fa-solid fa-briefcase" style="color: #14b8a6;"></i> 100% Practical Accounting</span>
            <span><i class="fa-solid fa-certificate" style="color: #f59e0b;"></i> Recognized Certification</span>
          </div>
        </div>
      `
    }
  };

  const courseModal = document.getElementById('courseModal');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
  const modalEnrollBtn = document.getElementById('modalEnrollBtn');
  const courseSelect = document.getElementById('courseSelect');

  let activeCourseKey = null;

  const openCourseModal = (courseKey) => {
    const data = courseData[courseKey];
    if (!data || !courseModal) return;

    activeCourseKey = courseKey;
    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;

    courseModal.classList.add('is-open');
    courseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCourseModal = () => {
    if (!courseModal) return;
    courseModal.classList.remove('is-open');
    courseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.btn-course-learn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.getAttribute('data-course-id');
      openCourseModal(courseId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCourseModal);
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeCourseModal);

  if (modalEnrollBtn) {
    modalEnrollBtn.addEventListener('click', (e) => {
      closeCourseModal();
      if (activeCourseKey && courseData[activeCourseKey] && courseSelect) {
        courseSelect.value = courseData[activeCourseKey].courseVal;
      }
    });
  }

  if (courseModal) {
    courseModal.addEventListener('click', (e) => {
      if (e.target === courseModal) closeCourseModal();
    });
  }

  // ================================================================
  // 7. EVENTS & ACTIVITIES / GALLERY SLIDER CAROUSEL & LIGHTBOX
  // Single Large Image Horizontal Slider with Smooth Transition & Controls
  // ================================================================
  const gallerySliderTrack = document.getElementById('gallerySliderTrack');
  const galleryCarousel = document.getElementById('galleryCarousel');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  const galleryDotsBox = document.getElementById('galleryDots');

  let currentGalleryIndex = 0;
  let galleryAutoSlideTimer = null;
  const GALLERY_INTERVAL_MS = 3000; // 3 seconds

  const getGallerySlides = () => {
    return gallerySliderTrack ? Array.from(gallerySliderTrack.querySelectorAll('.gallery-slide')) : [];
  };

  const getGalleryDots = () => {
    return galleryDotsBox ? Array.from(galleryDotsBox.querySelectorAll('.gallery-dot')) : [];
  };

  const goToGallerySlide = (index) => {
    const slides = getGallerySlides();
    const dots = getGalleryDots();
    if (!slides.length || !gallerySliderTrack) return;

    // Infinite wrap-around
    currentGalleryIndex = (index + slides.length) % slides.length;

    // Smooth horizontal slide
    gallerySliderTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;

    // Update active class on slides
    slides.forEach((slide, idx) => {
      if (idx === currentGalleryIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Update active dot
    dots.forEach((dot, idx) => {
      if (idx === currentGalleryIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  };

  const nextGallerySlide = () => {
    goToGallerySlide(currentGalleryIndex + 1);
  };

  const prevGallerySlide = () => {
    goToGallerySlide(currentGalleryIndex - 1);
  };

  const startGalleryAutoSlide = () => {
    stopGalleryAutoSlide();
    galleryAutoSlideTimer = setInterval(() => {
      nextGallerySlide();
    }, GALLERY_INTERVAL_MS);
  };

  const stopGalleryAutoSlide = () => {
    if (galleryAutoSlideTimer) {
      clearInterval(galleryAutoSlideTimer);
      galleryAutoSlideTimer = null;
    }
  };

  const resetGalleryAutoSlide = () => {
    startGalleryAutoSlide();
  };

  // Attach Arrow Button Listeners
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextGallerySlide();
      resetGalleryAutoSlide();
    });
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevGallerySlide();
      resetGalleryAutoSlide();
    });
  }

  // Attach Dot Indicators Listeners
  if (galleryDotsBox) {
    galleryDotsBox.addEventListener('click', (e) => {
      const dot = e.target.closest('.gallery-dot');
      if (!dot) return;
      const index = parseInt(dot.getAttribute('data-slide-index'), 10);
      if (!isNaN(index)) {
        goToGallerySlide(index);
        resetGalleryAutoSlide();
      }
    });
  }

  // Hover Pause & Resume
  if (galleryCarousel) {
    galleryCarousel.addEventListener('mouseenter', stopGalleryAutoSlide);
    galleryCarousel.addEventListener('mouseleave', startGalleryAutoSlide);

    // Keyboard navigation when focused
    galleryCarousel.setAttribute('tabindex', '0');
    galleryCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevGallerySlide();
        resetGalleryAutoSlide();
      } else if (e.key === 'ArrowRight') {
        nextGallerySlide();
        resetGalleryAutoSlide();
      }
    });
  }

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (galleryCarousel) {
    galleryCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopGalleryAutoSlide();
    }, { passive: true });

    galleryCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      startGalleryAutoSlide();
      handleSwipe();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextGallerySlide();
      resetGalleryAutoSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevGallerySlide();
      resetGalleryAutoSlide();
    }
  };

  // Start auto-sliding initially
  startGalleryAutoSlide();

  // ================================================================
  // 7B. IMAGE LIGHTBOX VIEWER (Floating Window Modal)
  // ================================================================
  const imageLightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let galleryItemsList = [];
  let currentLightboxIndex = 0;

  const refreshGalleryItems = () => {
    galleryItemsList = [];
    document.querySelectorAll('.gallery-zoom-btn').forEach((btn) => {
      galleryItemsList.push({
        src: btn.getAttribute('data-img-src'),
        caption: btn.getAttribute('data-img-caption') || 'ASE Aptitude Learning Campus'
      });
    });
  };

  const updateLightboxDisplay = () => {
    if (!galleryItemsList.length) refreshGalleryItems();
    if (!galleryItemsList[currentLightboxIndex]) return;

    const item = galleryItemsList[currentLightboxIndex];
    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryItemsList.length}`;
  };

  const openLightbox = (imgSrc, caption) => {
    if (!imageLightbox || !lightboxImg) return;
    refreshGalleryItems();

    const foundIdx = galleryItemsList.findIndex(item => item.src === imgSrc);
    currentLightboxIndex = foundIdx !== -1 ? foundIdx : 0;

    updateLightboxDisplay();
    imageLightbox.classList.add('is-open');
    imageLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!imageLightbox) return;
    imageLightbox.classList.remove('is-open');
    imageLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const nextLightboxImg = () => {
    if (!galleryItemsList.length) refreshGalleryItems();
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryItemsList.length;
    updateLightboxDisplay();
  };

  const prevLightboxImg = () => {
    if (!galleryItemsList.length) refreshGalleryItems();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryItemsList.length) % galleryItemsList.length;
    updateLightboxDisplay();
  };

  // Attach click listeners to zoom buttons
  document.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = btn.getAttribute('data-img-src');
      const caption = btn.getAttribute('data-img-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextLightboxImg(); });
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevLightboxImg(); });

  if (imageLightbox) {
    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightbox) closeLightbox();
    });
  }

  // Keyboard navigation for floating window (ArrowLeft, ArrowRight, Escape)
  document.addEventListener('keydown', (e) => {
    if (imageLightbox && imageLightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') nextLightboxImg();
      if (e.key === 'ArrowLeft') prevLightboxImg();
      if (e.key === 'Escape') closeLightbox();
    }
  });

  // ================================================================
  // 9. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ================================================================
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ================================================================
  // 10. GRACEFUL IMAGE FALLBACK HANDLING
  // ================================================================
  const handleImgFallback = (imgId, fallbackSrc) => {
    const img = document.getElementById(imgId);
    if (img) {
      img.addEventListener('error', () => {
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        }
      });
    }
  };

  handleImgFallback('mainLogo', 'images/logo.png');
  handleImgFallback('heroBgImg', 'images/hero.jpeg');
  handleImgFallback('galleryBuildingImg', 'images/building.jpg');
  handleImgFallback('aboutBuildingImg', 'images/building.jpg');
  handleImgFallback('galleryDirectorImg', 'images/event.jpeg');

  // ================================================================
  // 11. DYNAMIC ADMIN SYNC (Announcements & Course Options)
  // ================================================================
  const syncWithAdminData = () => {
    // 1. Sync live announcement bar
    try {
      const storedNotices = JSON.parse(localStorage.getItem('ase_announcements') || '[]');
      const liveNotice = storedNotices.find(n => n.live);
      if (liveNotice) {
        const badgeEl = document.getElementById('announcementBadge');
        const textEl = document.getElementById('announcementText');
        if (badgeEl && liveNotice.badge) {
          badgeEl.innerHTML = `<i class="fa-solid fa-bell"></i> ${liveNotice.badge}`;
        }
        if (textEl && liveNotice.text) {
          textEl.textContent = liveNotice.text;
        }
      }
    } catch (e) {
      console.warn('Notice sync notice error:', e);
    }

    // 2. Sync Course Select dropdown in contact form
    try {
      const storedCourses = JSON.parse(localStorage.getItem('ase_courses') || '[]');
      const courseDropdown = document.getElementById('courseSelect');
      if (storedCourses.length > 0 && courseDropdown) {
        const selectedVal = courseDropdown.value;
        courseDropdown.innerHTML = '<option value="" disabled selected>Select a Course</option>';
        storedCourses.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.name;
          opt.textContent = `${c.name} (${c.duration || 'Flexible'})`;
          if (c.name === selectedVal) opt.selected = true;
          courseDropdown.appendChild(opt);
        });
      }
    } catch (e) {
      console.warn('Course dropdown sync error:', e);
    }
  };

  syncWithAdminData();


  // ================================================================
  // 12. DUAL FORM TAB SWITCHER (Demo vs Contact)
  // ================================================================
  const tabBtnDemo = document.getElementById('tabBtnDemo');
  const tabBtnContact = document.getElementById('tabBtnContact');
  const paneDemo = document.getElementById('paneDemo');
  const paneContact = document.getElementById('paneContact');

  if (tabBtnDemo && tabBtnContact && paneDemo && paneContact) {
    tabBtnDemo.addEventListener('click', () => {
      tabBtnDemo.classList.add('active');
      tabBtnContact.classList.remove('active');
      paneDemo.style.display = 'block';
      paneContact.style.display = 'none';
    });

    tabBtnContact.addEventListener('click', () => {
      tabBtnContact.classList.add('active');
      tabBtnDemo.classList.remove('active');
      paneContact.style.display = 'block';
      paneDemo.style.display = 'none';
    });
  }

  // ================================================================
  // 13. REAL BACKEND API INTEGRATION (Courses, Reviews, Gallery, Forms)
  // ================================================================
  const API_ENDPOINT = '/api';

  // A. Fetch & Render Dynamic Active Courses from GET /api/courses
  const fetchActiveCourses = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/courses`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) return;

      const coursesGrid = document.getElementById('coursesGrid');
      const courseSelect = document.getElementById('courseSelect');

      // Update dropdown options
      if (courseSelect) {
        courseSelect.innerHTML = '<option value="" disabled selected>Select a Course</option>';
        data.data.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.title;
          opt.textContent = `${c.title} (${c.duration || 'Flexible'})`;
          courseSelect.appendChild(opt);
        });
        const otherOpt = document.createElement('option');
        otherOpt.value = 'Other';
        otherOpt.textContent = 'Other / Customized Learning';
        courseSelect.appendChild(otherOpt);
      }

      // If coursesGrid exists, update dynamic courses
      if (coursesGrid) {
        coursesGrid.innerHTML = data.data.map(c => {
          const curriculumItems = (c.courseDetails || []).map(item => `
            <li><i class="fa-solid fa-check"></i> <span>${item}</span></li>
          `).join('');

          const iconClass = c.icon || (c.theme === 'theme-orange' ? 'fa-laptop-code' : (c.theme === 'theme-teal' ? 'fa-chart-line' : 'fa-microphone-lines'));

          return `
            <div class="course-card ${c.theme || 'theme-blue'} reveal-item is-revealed" id="course-${c.slug || c._id}">
              <div class="card-glow"></div>
              <div class="course-header">
                <div class="course-icon-box">
                  <i class="fa-solid ${iconClass}"></i>
                </div>
                <span class="course-badge">${c.badge || 'Active Course'}</span>
              </div>
              <h3 class="course-title">${c.title}</h3>
              <p class="course-desc">${c.shortDescription}</p>
              <div class="course-curriculum">
                <h4 class="curriculum-title"><i class="fa-solid fa-list-check"></i> Key Curriculum:</h4>
                <ul class="course-list">${curriculumItems}</ul>
              </div>
              <div class="course-meta">
                <span><i class="fa-regular fa-clock text-teal"></i> ${c.duration || 'Flexible'}</span>
                <span><i class="fa-solid fa-indian-rupee-sign text-gold"></i> ${c.fee || 'Affordable'}</span>
              </div>
              <div class="course-footer">
                <button type="button" class="btn-course-learn dynamic-learn-btn" data-title="${c.title}" data-desc="${c.shortDescription}" data-details="${(c.courseDetails || []).join('|')}">
                  <span>Learn More / Syllabus</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');

        // Attach modal listeners to dynamic course learn buttons
        coursesGrid.querySelectorAll('.dynamic-learn-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            const details = (btn.getAttribute('data-details') || '').split('|').filter(Boolean);

            if (modalTitle) modalTitle.textContent = title;
            if (modalBadge) modalBadge.textContent = 'Active Course';
            if (modalDesc) modalDesc.textContent = desc;
            if (modalSyllabusList) {
              modalSyllabusList.innerHTML = details.map(d => `<li><i class="fa-solid fa-circle-check"></i> <span>${d}</span></li>`).join('');
            }
            if (modalDuration) modalDuration.textContent = '3 to 6 Months';
            if (modalAudience) modalAudience.textContent = 'Beginners, Students & Working Professionals';

            if (courseModal) {
              courseModal.classList.add('is-open');
              courseModal.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
            }
          });
        });
      }
    } catch (e) {
      console.warn('Live courses API offline or unavailable; retaining static HTML fallback.', e);
    }
  };

  // B. Fetch & Render Dynamic Active Reviews from GET /api/reviews
  const fetchActiveReviews = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) return;

      const track = document.getElementById('reviewsTrack');
      const dotsBox = document.getElementById('sliderDots');
      if (!track) return;

      const avatarColors = ['avatar-blue', 'avatar-orange', 'avatar-teal', 'avatar-purple'];

      track.innerHTML = data.data.map((r, idx) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          stars += `<i class="fa-solid fa-star" style="color: ${i <= r.rating ? '#f59e0b' : '#475569'}; margin-right: 2px;"></i>`;
        }

        const initials = r.studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const colorClass = avatarColors[idx % avatarColors.length];
        const hasPhoto = !!r.studentPhoto;
        const avatarHtml = hasPhoto 
          ? `<div class="author-avatar has-photo"><img src="${r.studentPhoto}" alt="${r.studentName}" class="author-photo-img" onerror="this.onerror=null; this.src='images/ujala-madhesia.jpg';"></div>`
          : `<div class="author-avatar ${colorClass}"><span>${initials}</span></div>`;

        const videoActionHtml = r.videoUrl ? `
          <div class="review-video-action">
            <a href="${r.videoUrl}" target="_blank" rel="noopener noreferrer" class="btn-review-video" aria-label="Watch ${r.studentName}'s Video Review on Instagram">
              <span class="video-play-pulse"><i class="fa-solid fa-play"></i></span>
              <span>Watch Video Review on Instagram</span>
              <i class="fa-brands fa-instagram"></i>
            </a>
          </div>
        ` : '';

        return `
          <div class="review-slide ${idx === 0 ? 'active' : ''}" role="group" aria-roledescription="slide" aria-label="Review ${idx + 1} of ${data.data.length}">
            <div class="review-card ${hasPhoto ? 'featured-review-card' : ''}">
              ${hasPhoto ? '<div class="review-badge-featured"><i class="fa-solid fa-circle-check"></i> Verified Student &bull; Video Review Available</div>' : ''}
              <div class="review-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
              <div class="review-rating" aria-label="${r.rating} out of 5 stars">${stars}</div>
              <p class="review-text">“${r.reviewText}”</p>
              <div class="review-author">
                ${avatarHtml}
                <div class="author-info">
                  <h4 class="author-name">${r.studentName} ${hasPhoto ? '<i class="fa-solid fa-circle-check text-blue" title="Verified Student"></i>' : ''}</h4>
                  <span class="author-role">${r.role || 'Student'}</span>
                </div>
              </div>
              ${videoActionHtml}
            </div>
          </div>
        `;
      }).join('');

      // Rebuild dots
      if (dotsBox) {
        dotsBox.innerHTML = '';
        data.data.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.classList.add('slider-dot');
          if (idx === 0) dot.classList.add('active');
          dotsBox.appendChild(dot);
        });
      }

      // Re-initialize slider index
      const newSlides = track.querySelectorAll('.review-slide');
      const newDots = dotsBox ? dotsBox.querySelectorAll('.slider-dot') : [];
      let slideIndex = 0;

      const setSlide = (index) => {
        newSlides[slideIndex].classList.remove('active');
        if (newDots[slideIndex]) newDots[slideIndex].classList.remove('active');
        slideIndex = (index + newSlides.length) % newSlides.length;
        newSlides[slideIndex].classList.add('active');
        if (newDots[slideIndex]) newDots[slideIndex].classList.add('active');
      };

      newDots.forEach((d, idx) => {
        d.addEventListener('click', () => setSlide(idx));
      });

      const nextBtn = document.getElementById('sliderNextBtn');
      const prevBtn = document.getElementById('sliderPrevBtn');
      if (nextBtn) nextBtn.onclick = () => setSlide(slideIndex + 1);
      if (prevBtn) prevBtn.onclick = () => setSlide(slideIndex - 1);

    } catch (e) {
      console.warn('Live reviews API offline or unavailable; retaining static HTML fallback.', e);
    }
  };

  // C. Fetch & Render Dynamic Gallery Images from GET /api/gallery
  const fetchActiveGallery = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/gallery`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.data || data.data.length === 0) return;

      const track = document.getElementById('gallerySliderTrack');
      const dotsBox = document.getElementById('galleryDots');
      if (!track || !dotsBox) return;

      // Render all active gallery images into the horizontal slider
      track.innerHTML = data.data.map((img, idx) => {
        const imgSrc = img.imageUrl.startsWith('/') ? img.imageUrl.slice(1) : img.imageUrl;
        const categoryBadge = (img.category || 'CAMPUS EVENT').toUpperCase();
        return `
          <div class="gallery-slide ${idx === 0 ? 'active' : ''}" role="group" aria-roledescription="slide" aria-label="Slide ${idx + 1} of ${data.data.length}">
            <div class="gallery-slide-inner">
              <img src="${imgSrc}" alt="${img.title}" class="gallery-slide-img" onerror="this.onerror=null; this.src='images/building.jpeg';">
              <div class="gallery-slide-overlay">
                <span class="gallery-slide-badge"><i class="fa-solid fa-camera"></i> ${categoryBadge}</span>
                <h3 class="gallery-slide-title">${img.title}</h3>
                <p class="gallery-slide-desc">${img.description || 'ASE Aptitude Learning Campus & Events'}</p>
                <button type="button" class="btn btn-gallery-zoom gallery-zoom-btn" data-img-src="${imgSrc}" data-img-caption="${img.title}" aria-label="View full image">
                  <i class="fa-solid fa-expand"></i> <span>View Full Image</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Render dots
      dotsBox.innerHTML = data.data.map((_, idx) => `
        <button type="button" class="gallery-dot ${idx === 0 ? 'active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" aria-label="Slide ${idx + 1}" data-slide-index="${idx}"></button>
      `).join('');

      // Re-attach lightbox listeners
      track.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const src = btn.getAttribute('data-img-src');
          const caption = btn.getAttribute('data-img-caption');
          openLightbox(src, caption);
        });
      });

      // Reset carousel position to slide 0
      goToGallerySlide(0);
      resetGalleryAutoSlide();
    } catch (e) {
      console.warn('Live gallery API offline or unavailable; retaining static HTML slider fallback.', e);
    }
  };

  // D. Free Demo Class Form Submission (POST /api/demo-applications)
  const setupDemoFormSubmission = () => {
    const demoForm = document.getElementById('demoClassForm');
    const nameInput = document.getElementById('studentName');
    const phoneInput = document.getElementById('studentPhone');
    const emailInput = document.getElementById('studentEmail');
    const courseInput = document.getElementById('courseSelect');
    const timeInput = document.getElementById('batchTime');
    const messageInput = document.getElementById('studentMessage');
    const submitBtn = document.getElementById('demoSubmitBtn');
    const feedbackBox = document.getElementById('formFeedback');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const courseError = document.getElementById('courseError');

    if (!demoForm) return;

    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      if (nameError) nameError.textContent = '';
      if (phoneError) phoneError.textContent = '';
      if (courseError) courseError.textContent = '';

      const fullName = nameInput ? nameInput.value.trim() : '';
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const email = emailInput ? emailInput.value.trim() : '';
      const courseInterested = courseInput ? courseInput.value : '';
      const preferredTime = timeInput ? timeInput.value : 'Morning Batch (8:00 AM - 11:00 AM)';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!fullName || fullName.length < 2) {
        if (nameError) nameError.textContent = 'Please enter your full name (minimum 2 characters).';
        isValid = false;
      }

      if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        if (phoneError) phoneError.textContent = 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
        isValid = false;
      }

      if (!courseInterested) {
        if (courseError) courseError.textContent = 'Please select a course you are interested in.';
        isValid = false;
      }

      if (!isValid) return;

      // Loading state
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner spinner-icon"></i> <span>Submitting Application...</span>';
      feedbackBox.style.display = 'none';

      try {
        const response = await fetch(`${API_ENDPOINT}/demo-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            phone: cleanPhone,
            email,
            courseInterested,
            preferredTime,
            message
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success State
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'form-feedback-box success';

          const waMsg = encodeURIComponent(
            `*New Free Demo Class Registration - ASE APTITUDE*

` +
            `👤 *Name:* ${fullName}
` +
            `📞 *Phone:* +91 ${cleanPhone}
` +
            `📚 *Course:* ${courseInterested}
` +
            `⏰ *Batch:* ${preferredTime}
` +
            (message ? `💬 *Notes:* ${message}
` : '') +
            `
Please confirm my free demo class slot.`
          );
          const waUrl = `https://wa.me/919525301743?text=${waMsg}`;

          feedbackBox.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.85rem;">
              <i class="fa-solid fa-circle-check" style="font-size: 1.4rem; color: #4ade80; margin-top: 2px;"></i>
              <div>
                <strong style="color: #ffffff; font-size: 1.05rem;">Thank you! Your Free Demo Class request has been submitted successfully. We will contact you soon.</strong>
                <p style="margin: 0.4rem 0 0.8rem; font-size: 0.88rem; color: #cbd5e1;">
                  We have saved your registration for <strong>${courseInterested}</strong>. You can also send this confirmation directly to our counselors on WhatsApp:
                </p>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display: inline-flex;">
                  <i class="fa-brands fa-whatsapp"></i> Click to Send Confirmation on WhatsApp
                </a>
              </div>
            </div>
          `;

          demoForm.reset();
        } else {
          // Server validation error
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'form-feedback-box error';
          feedbackBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.message || 'Submission failed. Please check your inputs.'}`;
        }
      } catch (err) {
        // Network fallback
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'form-feedback-box error';
        feedbackBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Could not connect to backend server. Please call or WhatsApp us directly at <strong>+91 95253 01743</strong>.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  };

  // E. Contact Form Submission (POST /api/contact)
  const setupContactFormSubmission = () => {
    const contactForm = document.getElementById('contactEnquiryForm');
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const feedbackBox = document.getElementById('contactFeedback');

    const nameError = document.getElementById('contactNameError');
    const msgError = document.getElementById('contactMsgError');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      if (nameError) nameError.textContent = '';
      if (msgError) msgError.textContent = '';

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'General Enquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!message) {
        if (msgError) msgError.textContent = 'Please enter your message.';
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner spinner-icon"></i> <span>Sending Message...</span>';
      feedbackBox.style.display = 'none';

      try {
        const response = await fetch(`${API_ENDPOINT}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, subject, message })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'form-feedback-box success';
          feedbackBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <i class="fa-solid fa-circle-check" style="font-size: 1.3rem; color: #4ade80;"></i>
              <strong style="color: #ffffff;">Thank you for contacting ASE APTITUDE. We will get back to you soon.</strong>
            </div>
          `;
          contactForm.reset();
        } else {
          feedbackBox.style.display = 'block';
          feedbackBox.className = 'form-feedback-box error';
          feedbackBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${result.message || 'Could not send message.'}`;
        }
      } catch (err) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'form-feedback-box error';
        feedbackBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network error. Please call +91 95253 01743.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  };

  // Run Backend Integration
  fetchActiveCourses();
  fetchActiveReviews();
  fetchActiveGallery();
  setupDemoFormSubmission();
  setupContactFormSubmission();

    console.log('ASE Aptitude Portal Initialized Successfully.');
});
