import axios from 'axios';
import { changeMedia, removeMedia } from './media';
import { handleSelectChanges } from './simple-select';

document.addEventListener('DOMContentLoaded', () => {
  let gsTabs = document.querySelectorAll('.groovy-tab');
  let gsTabPanes = document.querySelectorAll('.groovy-tab-pane');
  let gsForm = document.querySelector('#global-settings-form');
  let permissionPostTypes = document.querySelectorAll('.gm-gui__module__post_types input.switch');
  let taxonomyPresets = document.querySelectorAll('.gm-gui__module__taxonomy_preset .gm-subselect');
  let uploadIconPackBtn = document.querySelector('.gm-upload-icon-pack');
  let deleteIconPackBtns = document.querySelectorAll('.groovy-delete-font');
  let installDefaultIconPackBtn = document.querySelector('.gm-install-default-icon-pack');
  const uploadMediaInputs = document.querySelectorAll('.gm-upload-input');
  const removeMediaBtns = document.querySelectorAll('.gm-remove-btn');
  let simpleSelects = document.querySelectorAll('.gm-gui__module__select-wrapper select');
  let changeEvent = new Event('change');

  function submitGlobalSettings () {
    let formData = new FormData(this);
    let url = this.getAttribute('action');

    axios.post(url, formData)
      .then(() => {
        window.location.reload();
      });

    return false;
  }

  gsForm.addEventListener('submit', submitGlobalSettings);

  gsTabs.forEach((tab) => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      this
        .closest('.groovy-tabs')
        .querySelector('.groovy-tab-active')
        .classList
        .remove('groovy-tab-active');
      this.classList.add('groovy-tab-active');
      gsTabPanes.forEach((tabPane) => {
        tabPane.classList.remove('groovy-tab-pane-active');
      });

      document.querySelector(`#groovy-tab-${this.dataset.tab}`)
        .classList
        .add('groovy-tab-pane-active');
    });
  });

  function collectPostTypes () {
    let collectTypes = [];

    permissionPostTypes.forEach((type) => {
      if (type.checked) {
        collectTypes.push(type.value);
      }
    });

    document.querySelector('.gm-post_types').value = collectTypes.join();
  }

  function installDefaultIconPacks () {
    let actionValue = 'gm_install_default_icon_packs';
    const data = {
      action: actionValue
    };
    const params = new URLSearchParams(data);

    axios.post(ajaxurl, params)
      .then(() => window.location.reload(false))
      .catch(() => alert('Ajax error'));
  }

  if (installDefaultIconPackBtn !== null) {
    installDefaultIconPackBtn.addEventListener('click', installDefaultIconPacks);
  }

  permissionPostTypes.forEach((postType) => {
    postType.addEventListener('change', collectPostTypes);
  });

  // Taxonomy Preset field
  taxonomyPresets.forEach((taxonomyPreset) => {
    taxonomyPreset.addEventListener('change', () => {
      let collectValues = [];

      document.querySelectorAll('.gm-gui__subselect-wrapper')
        .forEach((wrapper) => {
          let presetField = wrapper.querySelector('.gm-subselect--preset');
          let menuField = wrapper.querySelector('.gm-subselect--navmenu');
          let taxonomy = presetField.dataset.taxonomy;
          let valuePreset = presetField[presetField.selectedIndex].value;
          let valueMenu = menuField.value;

          collectValues.push(taxonomy + ':::' + valuePreset + '@' + valueMenu);
        });

      document.querySelector('.gm-taxonomy_preset').value = collectValues.join();
    });
  });

  function uploadIconPack (e) {
    e.preventDefault();

    let image;

    if (image) {
      image.open();
      return;
    }

    image = wp.media({
      title: 'Upload font',
      multiple: false,
      library: {type: 'application/octet-stream, application/zip'}
    });

    image.on('select', () => {
      let uploadedImage = image
        .state()
        .get('selection')
        .first()
        .toJSON();
      let uploadIconInput = document.querySelector('.groovy-upload-icon');

      uploadIconInput.value = uploadedImage.id;
      this.closest('form')
        .submit();
    });
    image.open();
    return false;
  }

  function deleteIconPack () {
    let iconPack = this.closest('.groovy-iconset');
    let url = `?page=groovy_menu_settings&action=deleteFont&name=${iconPack.dataset.name}`;

    axios.get(url);
    iconPack.remove();
  }

  if (uploadIconPackBtn !== null) {
    uploadIconPackBtn.addEventListener('click', uploadIconPack);
  }

  deleteIconPackBtns.forEach((btn) => {
    btn.addEventListener('click', deleteIconPack);
  });

  uploadMediaInputs.forEach((input) => {
    input.addEventListener('change', changeMedia);
    input.dispatchEvent(changeEvent);
  });

  removeMediaBtns.forEach(function (btn) {
    btn.addEventListener('click', removeMedia);
  });

  simpleSelects.forEach(function (select) {
    select.addEventListener('change', handleSelectChanges);
    select.dispatchEvent(changeEvent);
  });
});
