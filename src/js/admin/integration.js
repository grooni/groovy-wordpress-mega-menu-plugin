import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  let integrationSaveBtn = document.querySelector('.gm-auto-integration-save');
  integrationSaveBtn.addEventListener('click', function () {
    let autoIntegrate = document.querySelector('.gm-auto-integration-switcher').checked;

    const data = {
      action: 'gm_save_auto_integration',
      data: autoIntegrate
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
});
