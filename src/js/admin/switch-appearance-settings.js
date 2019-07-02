import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  let settingsSwitchBtn = document.querySelector('.gm-admin-walker-priority--button');

  function switchAppearanceSettings (e) {
    e.preventDefault();

    let btn = this;
    if (btn.classList.contains('disabled')) {
      return;
    }
    let btnDo = btn.dataset.do;
    let gmNonce = btn.dataset.gm_nonce;
    const data = {
      action: 'gm_admin_walker_priority_change',
      do: btnDo,
      gm_nonce: gmNonce
    };
    const params = new URLSearchParams(data);

    btn.classList.add('disabled');

    axios.post(ajaxurl, params)
      .then(function () {
        window.location.reload();
      })
      .catch(function () {
        btn.classList.remove('disabled');
      });
  }

  if (settingsSwitchBtn !== null) {
    settingsSwitchBtn.addEventListener('click', switchAppearanceSettings);
  }
});
