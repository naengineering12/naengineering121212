/* Reliable contact submission with a Gmail fallback when the API is unavailable. */
const CONTACT_EMAIL = 'na.engineeringsolutions2023@gmail.com';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function fieldValue(form, name) {
  const field = form.elements.namedItem(name);
  return field && typeof field.value === 'string' ? field.value.trim() : '';
}

function showContactMessage(form, text) {
  let box = form.querySelector('[data-contact-fallback-message]');
  if (!box) {
    box = document.createElement('p');
    box.setAttribute('data-contact-fallback-message', 'true');
    box.style.marginTop = '12px';
    box.style.fontSize = '13px';
    form.appendChild(box);
  }
  box.textContent = text;
  box.style.color = '#166534';
}

function openEmailDraft(form) {
  const attachmentField = form.elements.namedItem('attachment');
  const attachment = attachmentField && attachmentField.files && attachmentField.files[0] ? attachmentField.files[0].name : 'None';
  const service = fieldValue(form, 'service_required') || 'Website Enquiry';
  const subject = 'Quote Request - ' + service;
  const body = [
    'New Quote Request - NA Engineering Solutions',
    '',
    'Name: ' + fieldValue(form, 'full_name'),
    'Company: ' + (fieldValue(form, 'company_name') || '-'),
    'Email: ' + fieldValue(form, 'email'),
    'Phone: ' + (fieldValue(form, 'phone') || '-'),
    'Service: ' + service,
    'Attachment: ' + attachment,
    '',
    'Message:',
    fieldValue(form, 'message'),
    '',
    'Sent from the NA Engineering Solutions website.'
  ].join('\n');

  const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CONTACT_EMAIL) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  const popup = window.open(gmailUrl, '_blank');
  if (!popup) window.location.href = gmailUrl;
  showContactMessage(form, 'Your email draft has been opened. Please press Send to complete the request.');
}

function handleQuoteSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('.quote-form')) return;

  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) event.stopImmediatePropagation();

  const submitButton = form.querySelector('[data-testid="quote-submit"]');
  if (submitButton && submitButton.disabled) return;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request...';
  }

  fetch(BACKEND_URL + '/api/quote', { method: 'POST', body: new FormData(form) })
    .then(function(response) {
      if (!response.ok) throw new Error('Quote API returned ' + response.status);
      return response.json();
    })
    .then(function() {
      if (submitButton) submitButton.textContent = 'Request sent';
      showContactMessage(form, 'Thank you — your request has been received and our team will respond soon.');
      form.reset();
    })
    .catch(function() {
      if (submitButton) submitButton.textContent = 'Open Email Draft';
      openEmailDraft(form);
    })
    .finally(function() {
      if (submitButton) submitButton.disabled = false;
    });
}

document.addEventListener('submit', handleQuoteSubmit, true);
