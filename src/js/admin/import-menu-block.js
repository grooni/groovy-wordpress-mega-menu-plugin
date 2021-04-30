import axios from 'axios';
import {showMessage} from './snackbar';

document.addEventListener('DOMContentLoaded', () => {
  let importMenuBlockBtn = document.querySelector('.gm-import-notice-btn');

  function importMenuBlockAction (e) {
    e.preventDefault();

    let wpMediaObj;

    if (wpMediaObj) {
      wpMediaObj.open();
      return;
    }

    wpMediaObj = wp.media({
      title: 'Upload Menu Block ZIP package',
      multiple: false,
      library: {type: 'application/octet-stream, application/zip'}
    });

    wpMediaObj.on('select', () => {
      let uploadedZIP = wpMediaObj
        .state()
        .get('selection')
        .first()
        .toJSON();

      // uploadedZIP.url;

      let actionValue = 'gm_import_menu_block_from_zip_url';
      let gmImportNonce = document.querySelector('#gm-nonce-import-menu-block-field');
      const data = {
        action: actionValue,
        zipUrl: uploadedZIP.url,
        gm_nonce: gmImportNonce.value
      };
      const params = new URLSearchParams(data);

      axios.post(ajaxurl, params)
        .then(() => window.location.reload(false))
        .catch(function (response) {
          showMessage(`Error Groovy Menu Block import: ${response.message}`);
        });

    });
    wpMediaObj.open();
    return false;
  }

  if (importMenuBlockBtn !== null) {
    importMenuBlockBtn.addEventListener('click', importMenuBlockAction);
  }

});
