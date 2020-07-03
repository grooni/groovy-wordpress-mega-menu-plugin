let isMessageAppended = false;

export function showMessage (message) {
  let snackbar = document.createElement('div');

  snackbar.className = 'gm-snackbar';
  snackbar.innerHTML = `<span>${message}</span>`;

  if (!isMessageAppended) {
    document.body.appendChild(snackbar);
    isMessageAppended = true;
  }

  getComputedStyle(snackbar)['transition'];
  snackbar.classList.add('gm-snackbar--visible');

  setTimeout(() => {
    snackbar.addEventListener('transitionend', function () {
      this.remove();
      isMessageAppended = false;
    });
    snackbar.classList.remove('gm-snackbar--visible');
  }, 5100);
}
