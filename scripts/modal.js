/* ============================================
   KDMN STUDIO - CONTACT MODAL INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    const openBtn     = document.getElementById('openModalBtn');
    const modal       = document.getElementById('contactModal');
    const closeBtn    = document.getElementById('closeModalBtn');
    const form        = document.getElementById('contact-modal-form');
    const successMsg  = document.querySelector('.modal-success');

    // ── Open modal ────────────────────────────────
    if (openBtn) {
        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent background scroll
        });
    }

    // ── Close helpers ─────────────────────────────
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking the dim overlay (outside the window)
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ── Form submit ───────────────────────────────
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name    = form.querySelector('#modal-name').value.trim();
            const email   = form.querySelector('#modal-email').value.trim();
            const message = form.querySelector('#modal-message').value.trim();

            // Basic validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!name) {
                alert('Please enter your name.');
                return;
            }
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!message) {
                alert('Please enter a message.');
                return;
            }

            // Success state
            form.style.display = 'none';
            if (successMsg) {
                successMsg.classList.add('visible');
            }

            // Reset & close after 2.5 seconds
            setTimeout(function () {
                form.reset();
                form.style.display = '';
                if (successMsg) successMsg.classList.remove('visible');
                closeModal();
            }, 2500);

            // ----- Replace the block below with your actual API call -----
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, message })
            // });
        });
    }
});