import tingle from 'tingle.js';

document.addEventListener('DOMContentLoaded', () => {
  let iconField;
  let globalWrapper = document.querySelector('body.wp-admin');
  let icons = document.querySelectorAll('#gm-icon-settings-modal .groovy-icon');
  const iconModalContent = document.querySelector('#gm-icon-settings-modal');
  let closeModalBtn = document.querySelector('#gm-icon-settings-modal .gm-modal-close');
  let iconModalOptions = {
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'escape'],
    cssClass: ['gm-modal--lg', 'gm-modal--icons'],
    beforeOpen () {
      iconModalContent.classList.remove('gm-hidden');
    }
  };
  let iconsModal = new tingle.modal(iconModalOptions);

  iconsModal.setContent(iconModalContent);

  function openIconsModal(event) {
    let openApproved = false;

    if (event.target && event.target.classList && event.target.classList.contains('gm-icons-modal')) {
      openApproved = true;
    }

    if (openApproved) {
      if (document.querySelector('.gm-dashboard-container')) {
        iconField = event.target.closest('.gm-gui__module__icon-wrapper')
          .querySelector('input');
      }

      if (document.querySelector('.menu-item-settings')) {
        iconField = event.target.closest('.description')
          .querySelector('.gm-icon-field');
      }

      iconsModal.open();
    }
  }

  function setIcon(event) {
    iconField.value = event.target.dataset.class;

    if (document.querySelector('.gm-dashboard-container')) {
      iconField
        .closest('.gm-gui__module__icon-wrapper')
        .querySelector('.gm-icon-preview span')
        .setAttribute('class', event.target.dataset.class);
    }

    if (document.querySelector('.menu-item-settings')) {
      iconField
        .closest('.description')
        .querySelector('.gm-icon-preview span')
        .setAttribute('class', event.target.dataset.class);
    }

    iconsModal.close();
  }

  if (globalWrapper) {
    globalWrapper.addEventListener('click', openIconsModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      iconsModal.close();
    });
  }

  if (icons) {
    icons.forEach((icon) => {
      icon.addEventListener('click', setIcon);
    });
  }
});
