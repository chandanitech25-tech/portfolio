/**
 * Sagun Tripathi - Data Analyst Portfolio
 * Interactive Script
 */

function initApp() {
  initNavbar();
  initMobileDrawer();
  initModals();
  initClipboard();
  initContactForm();
  initScrollSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Navbar scroll behavior
 */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile drawer navigation toggle
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/**
 * Lightbox modal system for dashboard screenshots
 */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('[data-close-modal]');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    targetModal.classList.add('active');
    targetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = targetModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  modalTriggers.forEach(trigger => {
    const handleTrigger = (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      if (targetId) openModal(targetId);
    };

    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleTrigger(e);
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentModal = btn.closest('.modal');
      if (parentModal) closeModal(parentModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) closeModal(activeModal);
    }
  });
}

/**
 * Toast notifications and clipboard copying
 */
function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${textToCopy}`);
      }
    });
  });
}

/**
 * Contact form handling with client-side validation
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-msg');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name Validation
    if (!nameInput.value.trim()) {
      nameError.classList.add('visible');
      isValid = false;
    } else {
      nameError.classList.remove('visible');
    }

    // Email Validation
    if (!validateEmail(emailInput.value.trim())) {
      emailError.classList.add('visible');
      isValid = false;
    } else {
      emailError.classList.remove('visible');
    }

    // Message Validation
    if (!messageInput.value.trim()) {
      messageError.classList.add('visible');
      isValid = false;
    } else {
      messageError.classList.remove('visible');
    }

    if (!isValid) return;

    // Simulate sending & launch mailto helper
    const mailtoSubject = encodeURIComponent(subjectInput.value.trim() || 'Data Analyst Inquiry');
    const mailtoBody = encodeURIComponent(
      `Hello Sagun,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()} (${emailInput.value.trim()})`
    );
    const mailtoUrl = `mailto:tiwarishagun2004@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('visible');
    }

    // Attempt to open email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  });
}

/**
 * Scroll spy for active navbar link
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
}
