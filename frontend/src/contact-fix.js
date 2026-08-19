/* Contact form reliability layer: use the API when available, then fall back to a pre-filled Gmail draft instead of showing a dead-end error. */
const CONTACT_EMAIL = 'na.engineeringsolutions2023@gmail.com';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function getField(form, name) {
  return form.elements.namedItem(name)?.value?.trim() || '';
}

function showContactMessage(form, text, ok = true) {
  let box = form.querySelector('[data-contact-fallback-message]');
  if (!box) {
    box = document.createElement('p');
    box.dataset.contactFallbackMessage = 'true';
    box.style.marginTop = '12px';
    box.style.fontSize = '13px';
    form.appendChild(box);
  }
  box.textContent = text;
  box.style.color = ok ? '#166534' : '#7f1d1d';
}

function openEmailDraft(form) {
  const fullName = getField(form, 'full_name');
  const company = getField(form, 'company_name');
  const email = getField(form, 'email');
  const phone = getField(form, 'phone');
  const service = getField(form, 'service_required');
  const message = getField(form, 'message');
  const attachment = form.elements.namedItem('attachment')?.files?.[0]?.name || 'None';

  const subject = `Quote Request - ${service || 'Website Enquiry'}`;
  const body = [
    'New Quote Request - NA Engineering Solutions',
    '',
    `Name: ${fullName}`,
    `Company: ${company || '-'}`,
    `Email: ${email}`,
    `Phone: ${phone || '-'}`,
    `Service: ${service}`,
    `Attachment: ${attachment}`,
    '',
    'Message:',
    message,
    '',
    'Sent from the NA Engineering Solutions website.'
  ].join('\n');

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const popup = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.href = gmailUrl;
  showContactMessage(form, 'Your email draft has been opened. Please press Send to complete the request.', true);
}

function handleQuoteSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('.quote-form')) return;

  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) event.stopImmediatePropagation();

  const submitButton = form.querySelector('[data-testid="quote-submit"]');
  if (submitButton?.disabled) return;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request...';
  }

  const data = new FormData(form);
  fetch(`${BACKEND_URL}/api/quote`, { method: 'POST', body: data })
    .then(async response => {
      if (!response.ok) throw new Error(`Quote API returned ${response.status}`);
      return response.json();
    })
    .then(() => {
      if (submitButton) submitButton.textContent = 'Request sent';
      showContactMessage(form, 'Thank you — your request has been received and our team will respond soon.', true);
      form.reset();
    })
    .catch(() => {
      if (submitButton) submitButton.textContent = 'Open Email Draft';
      openEmailDraft(form);
    })
    .finally(() => {
      if (submitButton) submitButton.disabled = false;
    });
}

document.addEventListener('submit', handleQuoteSubmit, true);
