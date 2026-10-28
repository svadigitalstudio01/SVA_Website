/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SVA DIGITAL STUDIO — CORE JAVASCRIPT
 * Thoughtful Design. Modern Websites.
 * Pure Vanilla JavaScript (ES6+), zero external dependencies.
 */

(function () {
  'use strict';

  // Wait for DOM content to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicYear();
    initStickyHeader();
    initMobileNavigation();
    initSmoothScrolling();
    initActiveNavScrollSpy();
    initFaqAccordion();
    initContactForm();
    initScrollReveal();
    initBackToTop();
    initProjectModals();
  });

  /* --------------------------------------------------------------------------
     1. DYNAMIC CURRENT YEAR
     -------------------------------------------------------------------------- */
  function initDynamicYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }

  /* --------------------------------------------------------------------------
     2. STICKY HEADER SCROLL STATE
     -------------------------------------------------------------------------- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  function initMobileNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

    if (!menuToggle || !mobileDrawer) return;

    const openMenu = () => {
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when any mobile navigation link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. SMOOTH SCROLLING FOR INTERNAL ANCHORS
     -------------------------------------------------------------------------- */
  function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    internalLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. ACTIVE NAVIGATION SCROLL SPY
     -------------------------------------------------------------------------- */
  function initActiveNavScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  /* --------------------------------------------------------------------------
     6. ACCESSIBLE FAQ ACCORDION
     -------------------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question-btn');

    faqButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const parentItem = btn.closest('.faq-item');
        const answerPane = parentItem.querySelector('.faq-answer-pane');

        // Optional: close other FAQ items for clean single-view accordion
        document.querySelectorAll('.faq-item').forEach((item) => {
          if (item !== parentItem && item.classList.contains('is-open')) {
            item.classList.remove('is-open');
            const otherBtn = item.querySelector('.faq-question-btn');
            const otherPane = item.querySelector('.faq-answer-pane');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPane) otherPane.style.maxHeight = null;
          }
        });

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          parentItem.classList.remove('is-open');
          answerPane.style.maxHeight = null;
        } else {
          btn.setAttribute('aria-expanded', 'true');
          parentItem.classList.add('is-open');
          answerPane.style.maxHeight = `${answerPane.scrollHeight}px`;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & MAILTO FALLBACK
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('form-feedback');
    const mailtoButtonContainer = document.getElementById('mailto-fallback-container');

    if (!form || !feedbackBox) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const projectTypeInput = document.getElementById('contact-type');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const projectType = projectTypeInput.value;
      const message = messageInput.value.trim();

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        showFeedback('Please enter your full name.', 'error');
        nameInput.focus();
        return;
      }

      if (!email || !emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!projectType) {
        showFeedback('Please select a project type.', 'error');
        projectTypeInput.focus();
        return;
      }

      if (!message || message.length < 10) {
        showFeedback('Please share a few more details about your project (at least 10 characters).', 'error');
        messageInput.focus();
        return;
      }

      // Successful Client-side Validation Notice
      showFeedback(
        `Thank you, ${name}! Your inquiry for a "${projectType}" has been validated. Because this static website does not connect to a server database, you can send these exact details to my inbox directly using the email button below, or reach out at sva.digitalstudio01@gmail.com.`,
        'success'
      );

      // Create pre-filled Gmail compose link for seamless 1-click email sending
      if (mailtoButtonContainer) {
        const subject = encodeURIComponent(`Project Inquiry: ${projectType} — from ${name}`);
        const body = encodeURIComponent(
          `Hi SVA Digital Studio,\n\n` +
          `My name is ${name} (${email}).\n` +
          `Project Type: ${projectType}\n\n` +
          `Project Details:\n${message}\n\n` +
          `Looking forward to hearing from you!`
        );
        const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=sva.digitalstudio01@gmail.com&su=${subject}&body=${body}`;
        const mailtoHref = `mailto:sva.digitalstudio01@gmail.com?subject=${subject}&body=${body}`;

        mailtoButtonContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem;">
            <a href="${gmailComposeHref}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="width: 100%; text-align: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
              Compose on Gmail (Opens in New Tab)
            </a>
            <a href="${mailtoHref}" class="btn btn-secondary btn-sm" style="width: 100%; text-align: center; font-size: 0.8125rem;">
              Or Open in Default Desktop Mail App
            </a>
          </div>
        `;
      }

      // Reset form fields
      form.reset();
    });

    function showFeedback(text, type) {
      feedbackBox.textContent = text;
      feedbackBox.className = `form-feedback-message ${type}`;
      feedbackBox.style.display = 'block';
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* --------------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-fade-up').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const revealElements = document.querySelectorAll('.reveal-fade-up');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     9. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 350) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. ACCESSIBLE PROJECT DETAILS MODAL
     -------------------------------------------------------------------------- */
  function initProjectModals() {
    const modalBackdrop = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalDescription = document.getElementById('modal-project-desc');
    const modalTechContainer = document.getElementById('modal-project-tech');
    const modalExternalLink = document.getElementById('modal-external-link');

    if (!modalBackdrop || !modalCloseBtn) return;

    // Detailed project data dictionary
    const projectsData = {
      cyber: {
        title: 'Cyber Attack Prediction Application',
        category: 'Personal Cybersecurity Project',
        description:
          'A cybersecurity project focused on predicting potential cyber threats and presenting relevant telemetry through an interactive dashboard. Features predictive threat risk scoring, log querying, attack vector classification, and defensive pattern metrics.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'MySQL'],
        url: '#YOUR_PROJECT_URL_1',
      },
      chatbot: {
        title: 'Medical Chatbot',
        category: 'Personal AI & Conversational UX Project',
        description:
          'An interactive conversational project exploring how language-model technology and semantic search can support a friendly user experience for health-related questions. Designed with structured prompt templates, quick question suggestions, and conversational UI best practices.\n\nDisclaimer: This is an educational demonstration project. It is not intended for medical diagnosis, clinical treatment, or professional health advice.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'LLM Concepts'],
        url: '#YOUR_PROJECT_URL_2',
      },
      portfolio: {
        title: 'Personal Portfolio Website',
        category: 'Personal Web Development Project',
        description:
          'A responsive portfolio website crafted to present professional information, technical skill badges, personal learning projects, and direct contact avenues with deep midnight aesthetics and electric purple accents.',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        url: '#YOUR_PROJECT_URL_3',
      },
    };

    const triggers = document.querySelectorAll('[data-project-target]');

    triggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-project-target');
        const data = projectsData[key];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDescription.textContent = data.description;

        modalTechContainer.innerHTML = '';
        data.technologies.forEach((tech) => {
          const span = document.createElement('span');
          span.className = 'tech-badge';
          span.textContent = tech;
          modalTechContainer.appendChild(span);
        });

        if (modalExternalLink) {
          modalExternalLink.setAttribute('href', data.url);
        }

        modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        modalCloseBtn.focus();
      });
    });

    const closeModal = () => {
      modalBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
        closeModal();
      }
    });
  }
})();
