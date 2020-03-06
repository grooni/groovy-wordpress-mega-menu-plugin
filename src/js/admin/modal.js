import { isRtl } from '../shared/helpers';
import tingle from 'tingle.js';

export function resetPreviewModalState () {
  let modal = this.modal;

  if (!modal) {
    return;
  }

  let links = modal.querySelectorAll('.preview-size-change a');

  links.forEach((link) => {
    link.classList.remove('active');
  });
  // reset sticky setting
  modal.querySelector('.preview-sticky-change__tabs [data-sticky="false"]')
    .classList
    .add('active');
  // reset bg color setting
  modal.querySelector('.preview-color-change__tabs [data-color="transparent"]')
    .classList
    .add('active');
  // reset size setting
  modal.querySelector('.preview-size-change__tabs [data-size="desktop"]')
    .classList
    .add('active');
  modal.querySelector('.gm-modal-body')
    .classList
    .remove('iframe--size-tablet');
  modal.querySelector('.gm-modal-body')
    .classList
    .add('iframe--size-desktop');
  modal.querySelector('.gm-modal-body-iframe').style.width = null;
}

export function initPreviewModal (previewForm) {
  const previewBtn = document.querySelector('.gm-gui-preview-btn');
  const presetPreview = document.querySelector('#preview-modal');
  let actionAttr = previewForm.getAttribute('action');

  let presetPreviewModal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    cssClass: ['gm-modal--fullscreen', 'gm-modal--preview'],
    beforeOpen () {
      let id = previewForm.dataset.id;
      let rtl = isRtl() ? '&d=rtl' : '';
      let url = groovyMenuLocalize.GroovyMenuSiteUrl + '/?groovy-menu-preset=1&gm_action_preview=1&from=edit&id=' + id + rtl;
      let previewFrame = document.createElement('iframe');

      previewFrame.setAttribute('name', 'live-preview');
      previewFrame.setAttribute('id', 'live-preview');
      previewFrame.setAttribute('src', url);

      previewFrame.style.width = '100%';
      previewFrame.style.height = '100%';

      previewForm.classList.add('gm-preview-form');

      presetPreview
        .querySelector('.gm-modal-body-iframe')
        .append(previewFrame);

      previewForm.setAttribute('action', url);
      previewForm.setAttribute('target', 'live-preview');

      let presetName = document.querySelector('.gm-gui__preset-name').textContent;
      let modalPreviewName = document.querySelector('#preview-modal .modal-preview-name');

      modalPreviewName.innerHTML = presetName;
      presetPreviewModal.setContent(presetPreview);
      presetPreview.classList.remove('gm-hidden');
      previewForm.submit();
    },
    onClose () {
      let initResetModalState = resetPreviewModalState.bind(this);
      let livePreview = document.querySelector('#live-preview');

      initResetModalState();

      previewForm.setAttribute('action', actionAttr);
      previewForm.removeAttribute('target');
      previewForm.classList.remove('gm-preview-form');

      presetPreview
        .querySelector('.gm-modal-body-iframe')
        .removeChild(livePreview);
    }
  });

  presetPreviewModal.setContent(presetPreview);

  previewBtn.addEventListener('click', () => {
    presetPreviewModal.open();
  });
}
