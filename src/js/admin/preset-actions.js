import { showMessage } from './snackbar';
import GmStyles from '../shared/styles';
import { isRtl } from '../shared/helpers';
import axios from 'axios/index';

export function gmSaveForm (form, subAction) {
  let formData = new FormData(document.forms.preset);
  let presetObj = {};
  formData.forEach((value, key) => {presetObj[key] = value;});
  let presetData = JSON.stringify(presetObj);
  let data = {
    'action': 'gm_save',
    'sub_action': subAction,
    'data': presetData
  };
  const params = new URLSearchParams(data);

  axios.post(ajaxurl, params)
    .then(function () {
      gmGetSettings(form, subAction);
    })
    .catch(function (response) {
      showMessage(`Error: ${response.data.data}`);
    });
}

function gmGetSettings (form, subAction) {
  let presetId = parseInt(form.dataset.id, 10);
  const data = {
    'action': 'gm_get_setting',
    'preset_id': presetId
  };
  const params = new URLSearchParams(data);
  axios.post(ajaxurl, params)
    .then(function (response) {
      const settings = response.data.data;
      const gmStyles = new GmStyles(settings);
      gmSaveStyles(presetId, gmStyles.get(), subAction);
    })
    .catch(function (response) {
      showMessage(`Error: ${response.data.data}`);
    });
}

function gmSaveStyles (presetId, css, subAction) {
  const data = {
    'action': 'gm_save_styles',
    'sub_action': subAction,
    'data': css,
    'direction': isRtl() ? 'rtl' : 'ltr',
    'preset_id': presetId
  };
  const params = new URLSearchParams(data);

  window.onbeforeunload = null;

  axios.post(ajaxurl, params)
    .then(function (response) {
      showMessage(response.data.data);
    })
    .catch(function (response) {
      showMessage(`Error: ${response.data.data}`);
    });
}

export function restoreSettings (form, subAction) {
  let fields = form.querySelectorAll('.gm-select, .gm-colorpicker, .gm-gui__module__number__input, .switch, .gm-header, .gm-hover-style-input, .gm-upload-input');
  let changeEvent = new Event('change');

  fields.forEach(function (field) {
    if (field.dataset.reset === 'undefined') {
      return;
    }

    if (field.classList.contains('gm-header')) {
      field.dataset.align = 'left';
      field.dataset.toolbar = 'false';
      field.dataset.style = '1';
      field
        .closest('.gm-gui__header-types__options')
        .querySelector('.gm-gui__header-types__options__align--left')
        .click();
    }

    if (subAction === 'restore') {
      if (field.classList.contains('gm-colorpicker')) {
        field.value = field.dataset.default;
        field
          .closest('.gm-gui__module__colorpicker')
          .querySelector('.pcr-button')
          .click();
        document
          .querySelector('.pcr-app.visible .pcr-clear')
          .click();
      }
    }

    if (field.classList.contains('select-hidden')) {
      if (field.dataset.default === undefined) {
        field.options[0].selected = true;
      }
    }

    if (field.dataset.default !== undefined) {
      field.value = field.dataset.default;
    }

    field.dispatchEvent(changeEvent);

    if (field.getAttribute('type') === 'checkbox') {
      if (field.dataset.default === '1') {
        field.checked = true;
      } else {
        field.checked = false;
      }
    }
  });

  if (subAction === 'restore_all') {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
}

