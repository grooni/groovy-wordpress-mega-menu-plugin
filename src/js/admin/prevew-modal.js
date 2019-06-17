document.addEventListener('DOMContentLoaded', () => {

  let colorChangeBtns = document.querySelectorAll('.preview-color-change__tabs > a');
  let sizeChangeBtns = document.querySelectorAll('.preview-size-change__tabs a');
  let toggleDefaultStickyBtns = document.querySelectorAll('.preview-sticky-change__tabs a');

  function toggleSize (e) {
    e.preventDefault();
    let curr = this
      .closest('.preview-size-change__tabs')
      .querySelector('.active');
    let currentSize = curr.dataset.size;
    let size = this.dataset.size;
    let modalBody = this.closest('.gm-modal-body');
    let modalBodyIframe = document.querySelector('.gm-modal-body-iframe');

    curr.classList.remove('active');
    this.classList.add('active');
    modalBody.classList.remove('iframe--size-' + currentSize);
    modalBody.classList.add('iframe--size-' + size);

    if (size === 'tablet') {
      modalBodyIframe.style.width = `${previewMobileWidth}px`;
    } else {
      modalBodyIframe.style.width = null;
    }
    return false;
  }

  sizeChangeBtns.forEach((btn) => {
    btn.addEventListener('click', toggleSize);
  });

  function colorChange (event) {
    event.preventDefault();
    let curr = this
      .closest('.preview-color-change__tabs')
      .querySelector('.active');
    let color = this.dataset.color;

    curr.classList.remove('active');
    this.classList.add('active');
    previewChangeBgColor(color);
  }

  colorChangeBtns.forEach((btn) => {
    btn.addEventListener('click', colorChange);
  });

  function toggleDefaultSticky (e) {
    e.preventDefault();
    let curr = this
      .closest('.preview-sticky-change__tabs')
      .querySelector('.active');
    let sticky = JSON.parse(this.dataset.sticky);

    curr.classList.remove('active');
    this.classList.add('active');
    previewChangeSticky(sticky);
    return false;
  }

  toggleDefaultStickyBtns.forEach((btn) => {
    btn.addEventListener('click', toggleDefaultSticky);
  });
});
