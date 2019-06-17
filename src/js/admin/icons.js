import tingle from 'tingle.js';

document.addEventListener('DOMContentLoaded', () => {
  let iconField;
  let icons = document.querySelectorAll('#gm-icon-settings-modal .groovy-icon');
  let selectIconBtns = document.querySelectorAll('.gm-icons-modal');
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

  function openIconsModal () {
    if (document.querySelector('.gm-dashboard-container')) {
      iconField = this.closest('.gm-gui__module__icon-wrapper')
        .querySelector('input');
    }

    if (document.querySelector('.menu-item-settings')) {
      iconField = this.closest('.description')
        .querySelector('.gm-icon-field');
    }

    iconsModal.open();
  }

  function setIcon () {
    iconField.value = this.dataset.class;

    if (document.querySelector('.gm-dashboard-container')) {
      iconField
        .closest('.gm-gui__module__icon-wrapper')
        .querySelector('.gm-icon-preview span')
        .setAttribute('class', this.dataset.class);
    }

    if (document.querySelector('.menu-item-settings')) {
      iconField
        .closest('.description')
        .querySelector('.gm-icon-preview span')
        .setAttribute('class', this.dataset.class);
    }

    iconsModal.close();
  }

  selectIconBtns.forEach((btn) => {
    btn.addEventListener('click', openIconsModal);
  });

  closeModalBtn.addEventListener('click', () => {
    iconsModal.close();
  });

  icons.forEach((icon) => {
    icon.addEventListener('click', setIcon);
  });
});
