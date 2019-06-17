import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  let migrateButton = document.querySelector('.gm-theme-migrate__button');
  let noticeWrapper = document.querySelector('.gm-theme-migrate__notice-wrapper');
  let noticeDismissBtn = document.querySelector('.gm-theme-migrate__notice-info .notice-dismiss');

  if (migrateButton !== null) {
    migrateButton.addEventListener('click', function (e) {
      e.preventDefault();
      if (this.classList.contains('disabled')) {
        return;
      }

      const data = {
        action: 'gm_ajax_start_migrate'
      };
      const params = new URLSearchParams(data);

      this.classList.add('disabled');

      axios.post(ajaxurl, params)
        .then((response) => {
          if (response.data.code === 'none') {
            noticeWrapper.remove();
            alert(response.data.message);
          }

          if (response.data.code === 'background') {
            noticeWrapper.innerHTML = response.data.message;
          }
        })
        .catch((response) => {
          this.classList.remove('disabled');
          noticeWrapper.append(response.data.message);
        });

    });
  }

  if (noticeDismissBtn !== null) {
    noticeDismissBtn.addEventListener('click', function () {
      const data = {
        action: 'gm_dismissed_migration_notice_info'
      };
      const params = new URLSearchParams(data);

      axios.post(ajaxurl, params)
        .then(() => {})
        .catch(() => {});
    });
  }
});
