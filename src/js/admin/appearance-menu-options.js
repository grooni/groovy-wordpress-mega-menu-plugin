import axios from 'axios';
import Pickr from '@simonwep/pickr';

document.addEventListener('DOMContentLoaded', () => {

  // Create a new 'change' event
  const changeEvent = new Event('change');

  let file_frame = [];
  let $globalWrapper = document.querySelector('.nav-menus-php');
  let $body = document.querySelector('body');
  let colorPickerInstances = [];

  // Add second container for modal clones of options.
  $body.insertAdjacentHTML('beforeend', '<div class="gm-walker-second-wrapper" style="display:none !important"></div>');


  // -------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------==[ EVENTs ]==---------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------


  // --- Show/Hide thumbs setting action -------------------------------------------------------------------------------
  let toggleThumbSettingsVisibility = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('edit-menu-item-gm-thumb-enable')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
      .querySelectorAll('.gm-thumb-field');

    if (allSearchedBlocks.length > 0) {
      allSearchedBlocks.forEach((el) => {
        el.style.display = (elem.checked) ? 'block' : 'none';
      });
    }

  };

  //$globalWrapper.addEventListener('change', toggleThumbSettingsVisibility);


  // --- Show/Hide Mega menu setting action ----------------------------------------------------------------------------
  let toggleMegaMenuOptionsVisibility = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('edit-menu-item-gm-megamenu')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
      .querySelectorAll('.megamenu-options-depend');

    if (allSearchedBlocks.length > 0) {
      allSearchedBlocks.forEach((el) => {
        el.style.display = (elem.checked) ? 'block' : 'none';
      });
    }

  };

  //$globalWrapper.addEventListener('change', toggleMegaMenuOptionsVisibility);


  // --- Show/Hide Use HTML as icon fields -----------------------------------------------------------------------------
  let toggleHtmlIconSettingsVisibility = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('edit-menu-item-gm-use-html-as-icon')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
      .querySelectorAll('.gm-html-icon-depend');

    if (allSearchedBlocks.length > 0) {
      allSearchedBlocks.forEach((el) => {
        el.style.display = (elem.checked) ? 'block' : 'none';
      });
    }

    allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
      .querySelectorAll('.gm-field-id-icon-class');

    if (allSearchedBlocks.length > 0) {
      allSearchedBlocks.forEach((el) => {
        el.style.display = (elem.checked) ? 'none' : 'block';
      });
    }
  };

  //$globalWrapper.addEventListener('change', toggleHtmlIconSettingsVisibility);


  // --- Show/Hide badge setting action ------------------------------------------------------------------------------
  let toggleBadgeSettingsVisibility = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('edit-menu-item-gm-badge-enable')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    if (elem.checked) {

      let $badgeTypeSetting = elem
        .closest('.gm-walker-modal-settings-container')
        .querySelector('.groovy_menu_badge_type');

      if (!$badgeTypeSetting) {
        return;
      }

      let $option = $badgeTypeSetting.querySelector('.gm-option-type-select').value;

      var $restFields = elem.closest('.gm-walker-modal-settings-container')
        .querySelectorAll('.gm-badge-field:not(.gm-badge-field--shared)');

      if ($option === 'icon' || $option === 'image' || $option === 'text') {
        if ($restFields.length > 0) {
          $restFields.forEach((el) => {
            el.style.display = 'none';
          });
        }

        let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
          .querySelectorAll('.gm-badge-type--' + $option);
        if (allSearchedBlocks.length > 0) {
          allSearchedBlocks.forEach((el) => {
            el.style.display = 'block';
          });
        }
      }

      let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
        .querySelectorAll('.gm-badge-field--shared');

      if (allSearchedBlocks.length > 0) {
        allSearchedBlocks.forEach((el) => {
          el.style.display = 'block';
        });
      }

    } else {
      let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
        .querySelectorAll('.gm-badge-field');
      if (allSearchedBlocks.length > 0) {
        allSearchedBlocks.forEach((el) => {
          el.removeAttribute('style');
        });
      }
    }

  };

  //$globalWrapper.addEventListener('change', toggleBadgeSettingsVisibility);


  // --- Show/Hide badge type setting action -------------------------------------------------------------------------
  let toggleBadgeTypeVisibility = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-option-field-select')) {
      if (elem.closest('.groovy_menu_badge_type')) {
        legalTargetExist = true;
      }
    }

    if (!legalTargetExist) {
      return;
    }

    let $option = elem.value;

    let $restFields = elem.closest('.gm-walker-modal-settings-container')
      .querySelectorAll('.gm-badge-field:not(.gm-badge-field--shared)');

    let isBadgeEnabled = elem.closest('.gm-walker-modal-settings-container')
      .querySelector('.edit-menu-item-gm-badge-enable').checked;

    if (!isBadgeEnabled) {
      return;
    }


    if ($option === 'icon' || $option === 'image' || $option === 'text') {
      if ($restFields.length > 0) {
        $restFields.forEach((el) => {
          el.style.display = 'none';
        });
      }

      let allSearchedBlocks = elem.closest('.gm-walker-modal-settings-container')
        .querySelectorAll('.gm-badge-type--' + $option);
      if (allSearchedBlocks.length > 0) {
        allSearchedBlocks.forEach((el) => {
          el.style.display = 'block';
        });
      }
    }

  };

  //$globalWrapper.addEventListener('change', toggleBadgeTypeVisibility);


  // --- Work with font selects --------------------------------------------------------------------------------------
  let changeGoogleFontFamily = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-option-field-select')) {
      if (elem.closest('.groovy_menu_badge_text_font_family')) {
        legalTargetExist = true;
      }
    }

    if (!legalTargetExist) {
      return;
    }

    let itemId = elem.getAttribute('data-item-id');
    let variants = elem.querySelector('option:checked')
      .getAttribute('data-variants')
      .split(';');

    let $parentWrapper = elem.closest('.gm-walker-modal-settings-container');

    let variantSelect = $parentWrapper.querySelector('.groovy_menu_badge_text_font_variant .gm-option-field-select');

    // Remove all dynamic options.
    let dynamicVariants = variantSelect.querySelectorAll('.gm-opt-dynamic-variants');
    if (dynamicVariants.length > 0) {
      dynamicVariants.forEach((el) => {
        el.outerHTML = '';
      });
    }

    variants.forEach((variant) => {
      let opt = document.createElement('option');
      opt.value = variant;
      opt.classList.add('gm-opt-dynamic-variants');
      opt.innerHTML = getGoogleFontVariantText(variant);

      variantSelect.appendChild(opt);
    });

    var savedVariantValue = variantSelect.parentNode.querySelector('.gm-option-field-select-hidden').value;
    var newVariantValue = '';

    if (typeof savedVariantValue !== undefined) {
      if (variantSelect.querySelectorAll('option[value="' + savedVariantValue + '"]').length) {
        newVariantValue = savedVariantValue;
      }
    }

    variantSelect.value = newVariantValue;
  };

  //$globalWrapper.addEventListener('change', changeGoogleFontFamily);


  // --- Set selected value to the hidden field ----------------------------------------------------------------------
  let setSelectedValueToHiddenField = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-option-field-select')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    // Put select chosen value to the hidden text field.
    elem.parentNode.querySelector('.gm-option-field-select-hidden').value = elem.value;
  };

  //$globalWrapper.addEventListener('change', setSelectedValueToHiddenField);


  // --- Remove Image setting action ---------------------------------------------------------------------------------
  let removeImg = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-option-remove-img')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    let id = elem.getAttribute('data-item-id');
    let saveId = elem.getAttribute('data-save-id');

    if (confirm('Remove image?')) {

      let optionImages = elem.closest('.gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId)
        .querySelectorAll('.gm-option-img');

      if (optionImages.length > 0) {
        optionImages.forEach((el) => {
          el.value = '';
          // Trigger for change event.
          el.dispatchEvent(changeEvent);
        });
      }

      let previewImages = elem.closest('.gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId)
        .querySelectorAll('.gm-option-image-preview');

      if (previewImages.length > 0) {
        previewImages.forEach((el) => {
          el.innerHTML = '';
        });
      }

    }
    return false;
  };

  $globalWrapper.addEventListener('click', removeImg);


  // --- Select Image setting action ---------------------------------------------------------------------------------
  function addBadgeImg(e) {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-option-select-img')) {
      legalTargetExist = true;
    }

    if (!legalTargetExist) {
      return;
    }

    e.preventDefault();

    let id = elem.getAttribute('data-item-id');
    let saveId = elem.getAttribute('data-save-id');
    let frameId = id + saveId + '_gmbg';

    // If the media frame already exists, reopen it.
    if (file_frame[frameId]) {
      file_frame[frameId].open();

      return;
    }

    file_frame[frameId] = wp.media({
      title: elem.dataset.uploader_title,
      button: {
        text: elem.dataset.uploader_button_text
      },
      multiple: false
    })
      .open()
      .on('select', function () {
        var uploadedImage = file_frame[frameId]
          .state()
          .get('selection')
          .first()
          .toJSON();

        let $parent = document.querySelector('.gm-walker-second-wrapper .gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId);

        let optionImg = $parent.querySelector('.gm-option-img');

        if (optionImg.classList && optionImg.classList.contains('edit-menu-item-gm-megamenu-bg')) {
          optionImg.value = uploadedImage.id;
        } else {
          optionImg.value = uploadedImage.url;
        }

        optionImg.dispatchEvent(changeEvent);

        $parent.querySelector('.gm-option-img-width').value = uploadedImage.width;

        $parent.querySelector('.gm-option-img-height').value = uploadedImage.height;

        $parent.querySelector('.gm-option-image-preview').innerHTML = '<img src="' + uploadedImage.url + '" alt="">';

      });

  }


  $globalWrapper.addEventListener('click', addBadgeImg);


  // -------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------==[ MODAL Actions ]==-----------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------


  // --- Open modal action -------------------------------------------------------------------------------------------
  let openModalActionClick = (e) => {
    let elem = e.target;

    if (elem.classList && elem.classList.contains('gm-menu-open-modal-button')) {
      e.preventDefault();
      openModalArea(elem);
    }
  };

  $globalWrapper.addEventListener('click', openModalActionClick);

  // --- Close modal action ------------------------------------------------------------------------------------------
  // --- Outside modal click action ----------------------------------------------------------------------------------
  let closeModalActionClick = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && (elem.classList.contains('gm-walker-modal-close') || elem.classList.contains('gm-walker-modal-overlay'))) {
      legalTargetExist = true;
    }

    // Check target's parent for classes.
    if (!legalTargetExist) {
      let parentElem = elem.parentNode;

      if (parentElem.classList && parentElem.classList.contains('gm-walker-modal-close')) {
        legalTargetExist = true;
      }
    }

    if (legalTargetExist) {
      e.preventDefault();
      closeModalArea();
    }

  };

  $globalWrapper.addEventListener('click', closeModalActionClick);


  // --- SAVE modal action -------------------------------------------------------------------------------------------
  let saveModalActionClick = (e) => {
    let elem = e.target;
    let legalTargetExist = false;

    // Check target for classes.
    if (elem.classList && elem.classList.contains('gm-walker-modal-save')) {
      legalTargetExist = true;
    }

    // Check target's parent for classes.
    if (!legalTargetExist) {
      let parentElem = elem.parentNode;

      if (parentElem.classList && parentElem.classList.contains('gm-walker-modal-save')) {
        legalTargetExist = true;
        elem = parentElem;
      }
    }

    if (legalTargetExist) {
      e.preventDefault();

      var $secondWrapper = document.querySelector('.gm-walker-second-wrapper');
      var $secondModalArea = $secondWrapper.querySelector('.gm-walker-modal-settings-container');
      var $modalItemId = $secondModalArea.getAttribute('data-item-id');
      var $targetModalArea = document.querySelector('#post-body .gm-menu-options-container[data-item-id="' + $modalItemId + '"]');
      var gm_nonce = elem.getAttribute('data-nonce');


      if (elem.classList.contains('gm-button-disable')) {
        return;
      }

      if (!$modalItemId) {
        alert('Detect error. Try reload the page.');
        return;
      }

      elem.classList.add('gm-button-disable');
      elem.classList.add('gm-button-loading');

      let formData = {};

      let formFieldsToSave = $secondModalArea.querySelectorAll('input[name], select[name], textarea[name]');

      if (formFieldsToSave.length > 0) {
        formFieldsToSave.forEach((node) => {

          let ignore = false;
          let legalName = node.name;
          let legalValue = node.value;
          let legalId = node.id;

          //Ignore elements that are not supposed to be sent
          if (
            node.disabled !== null &&
            node.disabled !== false ||
            node.type === 'button' ||
            node.name == null
          ) {
            ignore = true;
          }

          if (!ignore) {

            // find master element
            let masterElem = $targetModalArea.querySelector('#' + legalId);

            //Get data for selectbox
            if (node.tagName.toUpperCase() === 'SELECT') {
              legalValue = node.options[node.selectedIndex].value;
              masterElem.value = legalValue;
            }
            //Get data from checkbox
            else if (node.type === 'checkbox') {
              if (node.checked === false) {
                legalValue = '';
                masterElem.checked = false;
              } else {
                legalValue = (node.value == null ? 'on' : node.value);
                masterElem.checked = true;
              }

            } else if (node.tagName.toUpperCase() === 'INPUT') {
              if (node.classList && node.classList.contains('gm-option-field-select-hidden')) {
                let selectMasterElem = masterElem.parentNode.querySelector('.gm-option-field-select');

                if (selectMasterElem) {
                  //selectMasterElem.options[selectMasterElem.options.selectedIndex].selected = false;
                  //selectMasterElem.value = legalValue;
                  let checkedOption = selectMasterElem.querySelector('option:checked');
                  if (checkedOption) {
                    checkedOption.removeAttribute('selected');
                  }

                  let newCheckedOption = selectMasterElem.querySelector('option[value="' + legalValue + '"]');
                  if (newCheckedOption) {
                    newCheckedOption.setAttribute('selected', true);
                  }

                  selectMasterElem.dispatchEvent(changeEvent);
                }
              }
              masterElem.value = legalValue;
            } else {
              masterElem.value = legalValue;
            }

            // Trigger for change event.
            masterElem.dispatchEvent(changeEvent);

            if (node.classList && node.classList.contains('gm-option-type-iconpicker')) {
              masterElem.parentNode.querySelector('.gm-icon-preview').innerHTML = node.parentNode.querySelector('.gm-icon-preview').innerHTML;
            }

            if (node.classList && node.classList.contains('gm-option-type-media')) {
              masterElem.parentNode.querySelector('.gm-option-image-preview').innerHTML = node.parentNode.querySelector('.gm-option-image-preview').innerHTML;
            }

            formData[legalName] = legalValue;

          }

        });
      }

      // Prepare AJAX data.
      const data = {
        action: 'gm_save_menu_item_options',
        item_id: $modalItemId,
        gm_nonce: gm_nonce,
        options: JSON.stringify(formData)
      };

      const params = new URLSearchParams(data);

      // AJAX
      axios.post(ajaxurl, params)
        .then((response) => {
          elem.classList.remove('gm-button-disable');
          elem.classList.remove('gm-button-loading');

          if (response) {
            if (false === response.success) {
              alert(response.data); // TODO create UX\UI for error alert
            }
          }

          $secondModalArea.style.display = 'none';

          closeModalArea();
        })
        .catch(() => {
          elem.classList.remove('gm-button-disable');
          elem.classList.remove('gm-button-loading');
          alert('ajax error');
          console.log('ajax error: gm_save_menu_item_options');
        });

    }
  };

  $globalWrapper.addEventListener('click', saveModalActionClick);


  // OPEN Modal --------------------------------------------------------------------------------------------------------
  function openModalArea(elem) {
    let $modalArea = elem.closest('.gm-menu-options-container').querySelector('.gm-walker-modal-settings-container');
    let $modalOverlay = elem.closest('.gm-menu-options-container').querySelector('.gm-walker-modal-overlay');

    let $secondWrapper = document.querySelector('.gm-walker-second-wrapper');

    let $cloneOverlay = $modalOverlay.cloneNode(true);
    let $clone = $modalArea.cloneNode(true);

    $secondWrapper.innerHTML = '';
    $secondWrapper.append($cloneOverlay, $clone);

    initSelectFields($secondWrapper);

    let triggeredOptionsFields = $secondWrapper.querySelectorAll('.gm-option-type-checkbox, .gm-option-field-select');

    if (triggeredOptionsFields.length > 0) {
      triggeredOptionsFields.forEach((element) => {
        element.addEventListener('change', toggleThumbSettingsVisibility);
        element.addEventListener('change', toggleMegaMenuOptionsVisibility);
        element.addEventListener('change', toggleHtmlIconSettingsVisibility);
        element.addEventListener('change', toggleBadgeSettingsVisibility);
        element.addEventListener('change', toggleBadgeTypeVisibility);
        element.addEventListener('change', changeGoogleFontFamily);
        element.addEventListener('change', setSelectedValueToHiddenField);

        // Dispatch inputs.
        element.dispatchEvent(changeEvent);
      });
    }

    initColorPicker();

    $secondWrapper.style.display = 'block';
    $secondWrapper.querySelector('.gm-walker-modal-overlay').style.display = 'block';
    $secondWrapper.querySelector('.gm-walker-modal-settings-container').style.display = 'block';

    document.querySelector('body').classList.add('gm_walker_page_no_scroll');

  }

  function initSelectFields(wrapper) {
    // Checkout all select field
    let $allSelects = wrapper.querySelectorAll('.gm-option-type-select, .gm-option-type-font');

    if ($allSelects.length > 0) {
      $allSelects.forEach((element) => {
        if (element.options) {
          let textValue = element.options[element.selectedIndex].value;
          element.parentNode.querySelector('.gm-option-field-select').value = textValue;
        }
      });
    }
  }


  // CLOSE Modal -------------------------------------------------------------------------------------------------------
  function closeModalArea() {

    closeColorPicker();

    var $secondWrapper = document.querySelector('.gm-walker-second-wrapper');

    document.querySelector('.gm-walker-modal-settings-container').style.display = 'none';
    document.querySelector('.gm-walker-modal-overlay').style.display = 'none';

    $secondWrapper.innerHTML = '';
    $secondWrapper.style.display = 'none';

    document.querySelector('body').classList.remove('gm_walker_page_no_scroll');
  }


  function initColorPicker() {
    var $secondWrapper = document.querySelector('.gm-walker-second-wrapper');
    var $modalArea = $secondWrapper.querySelector('.gm-walker-modal-settings-container');

    var isColorPickerExists = $modalArea.querySelector('.wp-picker-container');

    if (isColorPickerExists) {
      return;
    }

    var $colorPicker = $modalArea.querySelectorAll('.gm-picker');

    if ($colorPicker.length > 0) {
      $colorPicker.forEach((gmPicker) => {
        const colorInput = gmPicker
          .closest('.gm-walker-option-container')
          .querySelector('.gm-colorpicker');
        let savedColor = colorInput.value;
        let defaultColor = colorInput.dataset.default;
        let options = {
          el: gmPicker,
          comparison: false,
          default: defaultColor,
          position: 'middle',
          components: {
            preview: false,
            opacity: true,
            hue: true,
            interaction: {
              hex: true,
              rgba: true,
              hsla: false,
              hsva: false,
              cmyk: false,
              input: true,
              clear: true,
              save: true
            },
          },
          strings: {
            clear: 'Reset'
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
            .toString();

          let isClearBtn = pickr.getRoot()
            .button
            .classList
            .contains('clear');

          if (isClearBtn) {
            if (defaultColor === '') {
              colorInput.value = '';
              pickr.getRoot().interaction.result.value = '';
              pickr.setColor(null, true);
              return;
            } else {
              pickr.setColor(defaultColor);
              return;
            }
          }

          if (pickr.getRoot().interaction.result.value === '') {
            colorInput.value = '';
            pickr.setColor(null, true);
            return;
          }
        });

        pickr.on('change', _.debounce(() => {
          colorInput.value = pickr.getColor()
            .toRGBA()
            .toString();
        }), 50);
      });
    }

  }

  function closeColorPicker() {
    if (colorPickerInstances.length) {
      colorPickerInstances.forEach((instanse) => {
        instanse.destroyAndRemove();
      });

      colorPickerInstances = [];
    }
  }



  // --- Helper font function ------------------------------------------------------------------------------------------
  function getGoogleFontVariantText(variant) {
    if (variant === '100italic') {
      return '100 (Italic)';
    }

    if (variant === '300') {
      return '300 (Light)';
    }

    if (variant === '300italic') {
      return '300 (Light Italic)';
    }

    if (variant === 'regular') {
      return '400 (Normal)';
    }

    if (variant === 'italic') {
      return '400 (Normal Italic)';
    }

    if (variant === '500italic') {
      return '500 (Italic)';
    }

    if (variant === '600italic') {
      return '600 (Italic)';
    }

    if (variant === '700') {
      return '700 (Bold)';
    }

    if (variant === '700italic') {
      return '700 (Bold Italic)';
    }

    if (variant === '900italic') {
      return '900 (Italic)';
    }

    return variant;
  }


});
