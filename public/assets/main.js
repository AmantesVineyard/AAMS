(() => {
  const API_ENDPOINT = '/api/leads';

  const serializeForm = (form) => {
    const formData = new FormData(form);
    const payload = {};

    for (const [key, value] of formData.entries()) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      if (payload[key]) {
        if (!Array.isArray(payload[key])) {
          payload[key] = [payload[key]];
        }
        payload[key].push(value);
      } else {
        payload[key] = value;
      }
    }

    if (payload.state && typeof payload.state === 'string') {
      payload.state = payload.state.trim().toUpperCase();
    }

    return payload;
  };

  const ensureStatusEl = (form) => {
    let statusEl = form.querySelector('.form-status');
    if (!statusEl) {
      statusEl = document.createElement('p');
      statusEl.className = 'form-status';
      form.append(statusEl);
    }
    return statusEl;
  };

  const submitLead = async (form, { redirect = 'thank-you.html', extra = {} } = {}) => {
    const data = { ...serializeForm(form), ...extra };
    const submitButton = form.querySelector('button[type="submit"]');
    const statusEl = ensureStatusEl(form);
    statusEl.textContent = '';
    statusEl.classList.remove('error');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.dataset.originalText || submitButton.textContent;
      submitButton.textContent = 'Submitting...';
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.message || 'Unable to save your submission right now.');
      }

      sessionStorage.setItem('latestLead', JSON.stringify(data));
      if (redirect) {
        window.location.href = redirect;
      } else {
        statusEl.textContent = 'Thanks! A specialist will be in touch shortly.';
      }
    } catch (error) {
      console.error('Lead submission failed', error);
      statusEl.textContent = error.message || 'We could not send your details. Please try again.';
      statusEl.classList.add('error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Submit';
      }
    }
  };

  const attachFormHandler = (form, options) => {
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitLead(form, options);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const heroForm = document.getElementById('hero-lead-form');
    const intakeForm = document.getElementById('intake-form');

    attachFormHandler(heroForm, { redirect: 'thank-you.html' });
    attachFormHandler(intakeForm, { redirect: 'thank-you.html' });

    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
  });

  window.AAMLead = {
    submitLead
  };
})();

