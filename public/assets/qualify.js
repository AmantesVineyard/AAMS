document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qualify-form');
  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-bar-fill');

  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  let currentStep = 0;

  const updateProgress = () => {
    const total = steps.length;
    const stepNumber = currentStep + 1;
    const percent = Math.round((stepNumber / total) * 100);

    if (progressText) {
      progressText.textContent = `Step ${stepNumber} of ${total}`;
    }
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
  };

  const showStep = (index) => {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === index);
    });
    currentStep = index;
    updateProgress();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep = (index) => {
    const step = steps[index];
    if (!step) return false;

    const inputs = Array.from(step.querySelectorAll('input, select, textarea'));
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    return true;
  };

  form.querySelectorAll('[data-next]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      const targetIndex = Math.min(currentStep + 1, steps.length - 1);
      showStep(targetIndex);
    });
  });

  form.querySelectorAll('[data-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetIndex = Math.max(currentStep - 1, 0);
      showStep(targetIndex);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep(currentStep)) return;

    if (window.AAMLead && typeof window.AAMLead.submitLead === 'function') {
      window.AAMLead.submitLead(form, { redirect: 'thank-you.html' });
    }
  });

  showStep(currentStep);
});

