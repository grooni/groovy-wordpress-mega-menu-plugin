import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  let debugBtn = document.querySelectorAll('.gm-migrate-debug-action-btn');

  debugBtn.forEach((btn) => {
    btn.addEventListener('click', function () {
      let actionValue = this.dataset.action;
      let versionValue = this.dataset.version;
      let gmNonce = document.querySelector('#_gm_nonce_migrations');

      const data = {
        action: actionValue,
        version: versionValue,
        gm_nonce: gmNonce.value
      };
      const params = new URLSearchParams(data);

      axios.post(ajaxurl, params)
        .then((response) => {
          if (actionValue === 'gm_migrate_log') {
            let debugLogWrapper = document.querySelector('.gm-debug-log-block-wrapper');
            let debugLogVersion = document.querySelector('.gm-debug-log-block-version');
            let debugLogResult = document.querySelector('.gm-debug-log-block-content');

            debugLogWrapper.classList.remove('gm-debug-log-hidden');
            debugLogVersion.innerHTML = versionValue;
            debugLogResult.innerHTML = response.data.message;
          } else {
            window.location.reload(false);
          }
        })
        .catch(() => {
          alert('ajax error');
        });
    });
  });
});
