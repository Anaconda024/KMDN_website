// Contact modal trigger (stub — wires to modal markup if present)
(function () {
  const btn = document.getElementById('openModalBtn');
  const modal = document.getElementById('contactModal');
  if (btn && modal) {
    btn.addEventListener('click', () => { modal.style.display = 'flex'; });
  }
})();
