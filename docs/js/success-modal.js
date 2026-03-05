/*==============================================================*/
// Success Modal Handler
/*==============================================================*/

// Show success modal
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
}

// Close success modal
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    // Re-enable body scroll
    document.body.style.overflow = '';
  }
}

// Show error modal
function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const errorText = document.getElementById('errorModalText');
  if (modal && errorText) {
    errorText.textContent = message;
    modal.classList.add('active');
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
}

// Close error modal
function closeErrorModal() {
  const modal = document.getElementById('errorModal');
  if (modal) {
    modal.classList.remove('active');
    // Re-enable body scroll
    document.body.style.overflow = '';
  }
}

// Close modal when clicking on overlay or close button
document.addEventListener('DOMContentLoaded', function() {
  const successModal = document.getElementById('successModal');
  const errorModal = document.getElementById('errorModal');
  const successOverlay = successModal?.querySelector('.success-modal-overlay');
  const errorOverlay = errorModal?.querySelector('.success-modal-overlay');
  const closeBtn = document.getElementById('closeModalBtn');
  const closeErrorBtn = document.getElementById('closeErrorModalBtn');

  if (successOverlay) {
    successOverlay.addEventListener('click', closeSuccessModal);
  }

  if (errorOverlay) {
    errorOverlay.addEventListener('click', closeErrorModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSuccessModal);
  }

  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', closeErrorModal);
  }

  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (successModal?.classList.contains('active')) {
        closeSuccessModal();
      }
      if (errorModal?.classList.contains('active')) {
        closeErrorModal();
      }
    }
  });
  
  // Sanitize input to prevent XSS attacks
  function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    // Create a temporary div element to use browser's built-in HTML escaping
    const temp = document.createElement('div');
    temp.textContent = input;

    // Get the escaped HTML and also remove any potentially dangerous characters
    return temp.innerHTML
      .replace(/[<>]/g, '') // Remove any remaining angle brackets
      .trim();
  }

  // Validate form security
  function validateFormSecurity(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Detectar patrones de spam comunes
    const spamPatterns = /viagra|casino|crypto|bitcoin|loan|dating|sex|porn|pills|pharmacy|weight.?loss|miracle|guarantee|win.?prize/i;
    if (spamPatterns.test(message) || spamPatterns.test(name)) {
      return { valid: false, error: 'El mensaje contiene contenido no permitido.' };
    }

    // Validar longitud razonable
    if (message.length > 5000) {
      return { valid: false, error: 'El mensaje es demasiado largo (máximo 5000 caracteres).' };
    }

    if (name.length > 100) {
      return { valid: false, error: 'El nombre es demasiado largo (máximo 100 caracteres).' };
    }

    if (message.length < 10) {
      return { valid: false, error: 'El mensaje es demasiado corto (mínimo 10 caracteres).' };
    }

    // Detectar múltiples URLs (posible spam)
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 2) {
      return { valid: false, error: 'El mensaje contiene demasiados enlaces.' };
    }

    // Detectar caracteres repetidos excesivamente (spam pattern)
    if (/(.)\1{10,}/.test(message)) {
      return { valid: false, error: 'El mensaje contiene patrones sospechosos.' };
    }

    return { valid: true };
  }

  // Check rate limiting
  function checkRateLimit() {
    const lastSubmitTime = localStorage.getItem('lastFormSubmit');
    const submitCount = parseInt(localStorage.getItem('submitCount') || '0');
    const now = Date.now();
    const oneHour = 3600000; // 1 hora en milisegundos

    if (lastSubmitTime) {
      const timeSinceLastSubmit = now - parseInt(lastSubmitTime);

      // Si ha pasado más de 1 hora, reiniciar contador
      if (timeSinceLastSubmit > oneHour) {
        localStorage.setItem('submitCount', '0');
        localStorage.setItem('lastFormSubmit', now.toString());
        return { allowed: true };
      }

      // Si no ha pasado 1 hora y ya se enviaron 3 mensajes
      if (submitCount >= 3) {
        const minutesRemaining = Math.ceil((oneHour - timeSinceLastSubmit) / 60000);
        return {
          allowed: false,
          error: `Has alcanzado el límite de 3 mensajes por hora. Intenta nuevamente en ${minutesRemaining} minutos.`
        };
      }
    }

    return { allowed: true };
  }

  // Update rate limit counter
  function updateRateLimit() {
    const submitCount = parseInt(localStorage.getItem('submitCount') || '0');
    localStorage.setItem('submitCount', (submitCount + 1).toString());
    localStorage.setItem('lastFormSubmit', Date.now().toString());
  }

  // Handle form submission using hidden iframe to avoid CORS issues
  const form = document.getElementById('contactForm');

  if (form) {
    // Create hidden iframe for form submission
    let iframe = document.getElementById('formsubmit-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'formsubmit-iframe';
      iframe.name = 'formsubmit-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission

      // Get form data
      const formData = new FormData(form);

      // Validar seguridad del formulario
      const securityCheck = validateFormSecurity(formData);
      if (!securityCheck.valid) {
        showErrorModal(securityCheck.error);
        return;
      }

      // Verificar rate limiting
      const rateLimitCheck = checkRateLimit();
      if (!rateLimitCheck.allowed) {
        showErrorModal(rateLimitCheck.error);
        return;
      }

      // Sanitize inputs before submission
      const nameInput = form.querySelector('[name="name"]');
      const subjectInput = form.querySelector('[name="_subject"]');
      const messageInput = form.querySelector('[name="message"]');

      const originalName = nameInput.value;
      const originalSubject = subjectInput.value;
      const originalMessage = messageInput.value;

      // Apply sanitization
      nameInput.value = sanitizeInput(originalName);
      subjectInput.value = sanitizeInput(originalSubject);
      messageInput.value = sanitizeInput(originalMessage);

      // Set form target to iframe
      form.target = 'formsubmit-iframe';

      // Submit form
      form.submit();

      // Wait a moment to ensure submission, then show success
      setTimeout(() => {
        // Update rate limit
        updateRateLimit();

        // Clear the form
        form.reset();

        // Show success modal
        showSuccessModal();

        // Reset form target
        form.target = '';
      }, 1000);
    });
  }
});
