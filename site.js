const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  }));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const opayTransferLink = document.querySelector('[data-opay-transfer]');
if (opayTransferLink && /Android/i.test(navigator.userAgent)) {
  const fallbackUrl = encodeURIComponent('https://play.google.com/store/apps/details?id=team.opay.pay');
  opayTransferLink.href = `intent://#Intent;package=team.opay.pay;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;S.browser_fallback_url=${fallbackUrl};end`;
}

const whatsappLink = document.createElement('a');
whatsappLink.className = 'whatsapp-float';
whatsappLink.href = 'https://wa.me/2348036714868?text=Hello%20Jomeg%20Schools';
whatsappLink.target = '_blank';
whatsappLink.rel = 'noopener noreferrer';
whatsappLink.setAttribute('aria-label', 'Chat with Jomeg Schools on WhatsApp');
whatsappLink.textContent = 'Chat on WhatsApp';
document.body.append(whatsappLink);

const admissionDialog = document.querySelector('#admission-dialog');
if (admissionDialog) {
  document.querySelectorAll('[data-open-admissions]').forEach((button) => button.addEventListener('click', () => admissionDialog.showModal()));
  document.querySelector('.dialog-close')?.addEventListener('click', () => admissionDialog.close());
  admissionDialog.addEventListener('click', (event) => {
    if (event.target === admissionDialog) admissionDialog.close();
  });
}

function connectWhatsApp(form, createMessage) {
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const url = `https://wa.me/2348036714868?text=${encodeURIComponent(createMessage(values))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (form.id === 'admission-form' && admissionDialog) admissionDialog.close();
  });
}

connectWhatsApp(document.querySelector('#contact-form'), (values) =>
  `Hello Jomeg Schools, my name is ${values.name}. My phone number is ${values.phone}. I'm asking about ${values.topic}.${values.message ? ` ${values.message}` : ''}`
);

connectWhatsApp(document.querySelector('#admission-form'), (values) => {
  const enquiry = values.interest
    ? `I'd like to ask about ${values.interest}.`
    : `My child is ${values.class}. ${values.message || ''}`;
  return `Hello Jomeg Schools, my name is ${values.name}. My phone number is ${values.phone}. ${enquiry}`;
});

const revealGroups = document.querySelectorAll(
  'main > section:not(.hero):not(.page-hero), .value-item, .history-milestone, .admission-step, .contact-card, .contact-row, .footer-main'
);
const revealDelays = new Map();
revealGroups.forEach((item) => {
  item.classList.add('reveal');
  const siblings = revealDelays.get(item.parentElement) || 0;
  item.style.setProperty('--reveal-delay', `${Math.min(siblings * 110, 330)}ms`);
  revealDelays.set(item.parentElement, siblings + 1);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
