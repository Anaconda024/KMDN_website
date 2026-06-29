// Contact modal — opens from the footer "Get in touch" button.
(function () {
  const modal = document.getElementById('contactModal');
  if (!modal) return;

  const openBtn = document.getElementById('footerContactBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('contact-modal-form');
  const success = modal.querySelector('.modal-success');

  function open() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) {
    openBtn.style.cursor = 'pointer';
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', close);

  // Click on the dimmed backdrop (outside the window) closes the modal.
  modal.addEventListener('click', function (e) {
    if (e.target === modal) close();
  });

  // Escape closes it.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });

  // Submit → show success message in place of the form.
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  }
})();
