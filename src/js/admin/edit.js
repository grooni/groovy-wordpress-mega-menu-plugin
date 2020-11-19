import { initTabs } from './tab';
import { handleSelectChanges } from './simple-select';
import { initChangeHeader } from './header-options';
import { setTitle } from './helpers';
import { startListenerCreation } from './field-condition';
import { initPreviewModal } from './modal';
import { uploadMedia, removeMedia, changeMedia } from './media';
import { gmSaveForm, restoreSettings } from './preset-actions';
import Pickr from '@simonwep/pickr';
import _ from 'lodash';

document.addEventListener('DOMContentLoaded', () => {

  let currentSubAction = 'save';
  let dependantBlocks1 = document.querySelectorAll('[data-condition]:not(.gm-gui-module-wrapper)');
  let dependantBlocks2 = document.querySelectorAll('.gm-gui-module-wrapper[data-condition]');
  const previewForm = document.querySelector('.gm-form');

  const changeEvent = new Event('change');
  const changeHeader = new Event('changeHeader');

  const logoTypes = document.querySelectorAll('.gm-gui__logotype');
  const hoverStyleItems = document.querySelectorAll('.gm-gui__module__hover-style__item');
  let simpleSelects = document.querySelectorAll('.gm-gui__module__select-wrapper select');

  const gmHoverStyleInput = document.querySelector('.gm-hover-style-input');
  const textNumberInputs = document.querySelectorAll('.gm-gui__module input[type="text"], .gm-gui__module input[type="number"]');
  const uploadMediaInputs = document.querySelectorAll('.gm-upload-input');

  const restoreAllBtn = document.querySelector('.gm-gui__restore-btn');
  const uploadMediaBtns = document.querySelectorAll('.gm-upload-btn');
  const removeMediaBtns = document.querySelectorAll('.gm-remove-btn');
  const saveBtn = document.querySelector('.gm-gui-save-btn');
  const restoreSectionBtn = document.querySelector('.gm-gui-restore-section-btn');

  const colorPickers = document.querySelectorAll('.gm-picker');
  let colorPickerInstances = [];

  setTitle();
  initTabs();

  simpleSelects.forEach((select) => {
    select.addEventListener('change', handleSelectChanges);
    select.dispatchEvent(changeEvent);
  });

  function groovyHeaderSelector () {
    const headerInput = document.querySelector('#gm-gui__header-types__options');
    const alignTypes = document.querySelectorAll('.gm-gui__header-types__options__align > span');
    const switcher = document.querySelector('#switch-toolbar-toggle');
    const headerOptionsSelect = document.querySelector('.gm-gui__header-types__options__list select');

    headerInput.addEventListener('changeHeader', initChangeHeader);

    alignTypes.forEach((align) => {
      align.addEventListener('click', function () {
        headerInput.dataset.align = this.getAttribute('rel');
        headerInput.dispatchEvent(changeEvent);
        headerInput.dispatchEvent(changeHeader);
      });
    });

    //change align
    switcher.addEventListener('change', function () {
      let isChecked = this.checked ? true : false;

      headerInput.dataset.toolbar = `${isChecked}`;
      headerInput.dispatchEvent(changeEvent);
      headerInput.dispatchEvent(changeHeader);
    });

    //header type
    headerOptionsSelect.addEventListener('change', function () {
      headerInput.dataset.style = `${parseInt(this.value, 10)}`;
      headerInput.dispatchEvent(changeEvent);
      headerInput.dispatchEvent(changeHeader);
    });

    headerInput.dispatchEvent(changeEvent);
    headerInput.dispatchEvent(changeHeader);
  }

  groovyHeaderSelector();

  dependantBlocks1.forEach((block) => {
    startListenerCreation(block);
  });

  dependantBlocks2.forEach((block) => {
    startListenerCreation(block);
  });

  function toggleHoverStyles () {
    let styleId = this.getAttribute('rel');
    let gmHoverStyleInput = document.querySelector('.gm-hover-style-input');

    gmHoverStyleInput.value = styleId;
    gmHoverStyleInput.dispatchEvent(changeEvent);

  }

  hoverStyleItems.forEach((item) => {
    item.addEventListener('click', toggleHoverStyles);
  });

  function toggleHoverType () {
    hoverStyleItems.forEach((item) => {
      item.classList.remove('active');
    });

    this.closest('.gm-gui__module__hover-style-wrapper')
      .querySelector(`.gm-gui__module__hover-style__item[rel="${this.value}"]`)
      .classList
      .add('active');
  }

  gmHoverStyleInput.addEventListener('change', toggleHoverType);

  gmHoverStyleInput.dispatchEvent(changeEvent);

  function toggleLogotypeActiveClass () {
    logoTypes.forEach((logoType) => {
      logoType.classList.remove('gm-gui__logotype--selected');
    });
    this.classList.add('gm-gui__logotype--selected');
  }

  logoTypes.forEach((logoType) => {
    logoType.addEventListener('click', toggleLogotypeActiveClass);
  });

  saveBtn.addEventListener('click', () => {
    currentSubAction = 'save';
  });

  previewForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (this.classList.contains('gm-preview-form')) {
      return;
    }

    gmSaveForm(previewForm, currentSubAction);
  });

  restoreSectionBtn.addEventListener('click', function () {
    let activeSublevel = document.querySelector('.gm-form .gm-sublevel.active');

    if (confirm('Restore current section to default settings?')) {
      currentSubAction = 'restore';
      restoreSettings(activeSublevel, currentSubAction);
    }
  });

  textNumberInputs.forEach(function (input) {
    input.addEventListener('keypress', function (e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        return false;
      }
    });
  });

  initPreviewModal(previewForm);

  restoreAllBtn.addEventListener('click', function () {
    if (confirm('Restore default settings?')) {
      currentSubAction = 'restore_all';
      restoreSettings(previewForm, currentSubAction);
      colorPickerInstances.forEach((picker) => {
        let defaultColor = picker
          .getRoot()
          .button
          .closest('.gm-gui__module__colorpicker')
          .querySelector('.gm-colorpicker')
          .dataset
          .default;

        picker.setColor(defaultColor);
      });
    }
  });
  uploadMediaBtns.forEach((btn) => {
    btn.addEventListener('click', uploadMedia);
  });

  removeMediaBtns.forEach((btn) => {
    btn.addEventListener('click', removeMedia);
  });

  uploadMediaInputs.forEach((input) => {
    input.addEventListener('change', changeMedia);
    input.dispatchEvent(changeEvent);
  });

  setTimeout(() => {
    let formInputs = document.querySelectorAll('.gm-form input');

    formInputs.forEach((input) => {
      input.addEventListener('change', () => {
        window.onbeforeunload = () => {
          let saveAlert = groovyMenuL10n['save_alert'];

          return saveAlert;
        };
      });
    });
  }, 1200);

  function initColorPickers() {
    colorPickers.forEach((gmPicker) => {
      const colorInput = gmPicker
        .closest('.gm-gui__module__colorpicker')
        .querySelector('.gm-colorpicker');
      let savedColor = colorInput.value;
      let defaultColor = colorInput.dataset.default;
      let options = {
        el: gmPicker,
        comparison: false,
        theme: 'monolith', // or 'classic', or 'monolith', or 'nano'
        default: defaultColor,
        position: 'bottom-start',
        appClass: 'gm-pickr-container',
        components: {
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true
          },
        },
        i18n: {
          'btn:clear': 'Reset'
        }
      };
      const pickr = new Pickr(options);

      colorPickerInstances.push(pickr);

      pickr.on('init', () => {
        if (savedColor === '') {
          pickr.setColor(null, true);
          pickr.getRoot().interaction.result.value = '';
          return;
        }

        pickr.setColor(savedColor);
      });

      pickr.on('save', () => {
        if (colorInput.value === '') {
          pickr.getRoot().interaction.result.value = '';
          return;
        }

        colorInput.value = pickr.getColor()
          .toRGBA()
          .toString(0);

        let isClearBtn = pickr.getRoot()
          .button
          .classList
          .contains('clear');

        if (isClearBtn) {
          colorInput.value = '';
          pickr.getRoot().interaction.result.value = '';
          pickr.setColor(null, true);
          return;
        }

        if (pickr.getRoot().interaction.result.value === '') {
          colorInput.value = '';
          pickr.setColor(null, true);
          return;
        }

        pickr.hide();
      });

      pickr.on('change', _.debounce(() => {
        colorInput.value = pickr.getColor()
          .toRGBA()
          .toString(0);
      }),50);
    });
  }

  initColorPickers();
});

window.addEventListener('load',  () => {
  let container = document.querySelector('.gm-gui-container');
  container.classList.add('loaded');
});
