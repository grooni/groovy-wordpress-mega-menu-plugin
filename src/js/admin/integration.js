import axios from 'axios';
import tingle from 'tingle.js';

document.addEventListener('DOMContentLoaded', () => {

  // Save auto-integration button
  let integrationSaveBtn = document.querySelector('.gm-auto-integration-save');
  integrationSaveBtn.addEventListener('click', function () {
    let autoIntegrate = document.querySelector('.gm-auto-integration-switcher').checked;
    let gmNonce = document.querySelector('#gm-nonce-auto-integration-field');

    let locationIntegrate = document.querySelector('.gm-integration-location').value;
    if (autoIntegrate && locationIntegrate) {
      alert('Note: Only one of the above integrations can be active.');
      return;
    }

    const data = {
      action: 'gm_save_auto_integration',
      data: autoIntegrate,
      gm_nonce: gmNonce.value
    };
    const params = new URLSearchParams(data);

    axios.post(ajaxurl, params)
      .then(function (response) {
        alert(response.data.data);
      })
      .catch(function () {
        alert('Error occurred, please contact Groovy menu Support');
      });
  });


  // Save location integration button
  let integrationLocationSaveBtn = document.querySelector('.gm-integration-location-save');
  integrationLocationSaveBtn.addEventListener('click', function () {
    let locationIntegrate = document.querySelector('.gm-integration-location').value;
    let gmNonce = document.querySelector('#gm-nonce-auto-integration-field');

    let autoIntegrate = document.querySelector('.gm-auto-integration-switcher').checked;
    if (autoIntegrate && locationIntegrate) {
      alert('Note: Only one of the above integrations can be active.');
      return;
    }

    const data = {
      action: 'gm_save_single_location_integration',
      data: locationIntegrate,
      gm_nonce: gmNonce.value
    };
    const params = new URLSearchParams(data);

    axios.post(ajaxurl, params)
      .then(function (response) {
        alert(response.data.data);
      })
      .catch(function () {
        alert('Error occurred, please contact Groovy menu Support');
      });
  });


  function initGSModal() {
    let btn = document.querySelector('.gm-dashboard__global-settings-btn');
    let modalContent = document.querySelector('#global-settings-modal');
    let closeModalBtn = document.querySelector('#global-settings-modal .gm-modal-close');
    let tabs = document.querySelectorAll('.groovy-tabs');

    if (modalContent === null) {
      return;
    }

    let gsModal = new tingle.modal({
      footer: false,
      stickyFooter: false,
      closeMethods: ['overlay', 'escape'],
      cssClass: ['gm-modal--lg', 'gm-modal-overflow'],
      beforeOpen() {
        modalContent.classList.remove('gm-hidden');
      }
    });
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => gsModal.checkOverflow());
    });

    gsModal.setContent(modalContent);

    btn.addEventListener('click', () => {
      gsModal.open();
    });

    closeModalBtn.addEventListener('click', () => {
      gsModal.close();
    });
  }

  //initGSModal();

});
