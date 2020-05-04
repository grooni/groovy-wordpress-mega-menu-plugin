import Choices from 'choices.js';
import { showMessage } from './snackbar';
import axios from 'axios';

const WebFont = require('webfontloader');

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gm-gui-container') === null) {
    return;
  }

  var fontItems;

  let setCurrValue = function () {
    let self = this;
    let currVal = this.passedElement.element.dataset.value;

    setTimeout(() => {
      self.setChoiceByValue(currVal);
      if (self.passedElement.element.dataset.name === 'logo_txt_font'
        || self.passedElement.element.dataset.name === 'google_font') {
        setTimeout(() => {
          setFontsPreview(self);
        }, 50);
      }

    }, 1000);
  };

  let commonSelectOptions = {
    itemSelectText: '',
    searchFields: ['label'],
    searchResultLimit: 5,
    shouldSort: false,
    callbackOnInit: setCurrValue
  };

  const logoFontSelect = new Choices('[data-name="logo_txt_font"]', commonSelectOptions);
  const logoVariantSelect = new Choices('[data-name$="logo_txt_weight"]', commonSelectOptions);
  const logoSubsetSelect = new Choices('[data-name$="logo_txt_subset"]', commonSelectOptions);
  const itemFontSelect = new Choices('[data-name="google_font"]', commonSelectOptions);
  const itemVariantSelect = new Choices('[data-name$="text_weight"]', commonSelectOptions);
  const itemSubsetSelect = new Choices('[data-name$="text_subset"]', commonSelectOptions);

  function initFonts () {
    const data = {
      action: 'gm_get_google_fonts'
    };
    const params = new URLSearchParams(data);

    axios.post(ajaxurl, params)
      .then((response) => {
        fontItems = response.data.data[0].items;
        fillFontsSelects(logoFontSelect, fontItems, logoSubsetSelect, logoVariantSelect);
        fillFontsSelects(itemFontSelect, fontItems, itemSubsetSelect, itemVariantSelect);
      })
      .catch(() => {
        let message = 'Error while loading Google Fonts has occurred';

        showMessage(message);
      });
  }

  initFonts();

  function handleSelectChanges (fontSelect, subsetSelect, variantSelect) {
    if (fontSelect.getValue(true) === 'none') {
      if (typeof subsetSelect.forEach === 'function') {
        subsetSelect.forEach((select) => {
          if (_.isEmpty(select)) {
            return;
          }
          resetValue(select);
          select.disable();
        });
      } else {
        if (_.isEmpty(subsetSelect)) {
          return;
        }
        resetValue(subsetSelect);
        subsetSelect.disable();
      }

      if (typeof variantSelect.forEach === 'function') {
        variantSelect.forEach((select) => {
          if (_.isEmpty(select)) {
            return;
          }
          resetValue(select);
          select.disable();
        });
      } else {
        if (_.isEmpty(variantSelect)) {
          return;
        }
        resetValue(variantSelect);
        variantSelect.disable();
      }

      return;
    }

    if (typeof subsetSelect.forEach === 'function') {
      subsetSelect.forEach((select) => {
        if (_.isEmpty(select)) {
          return;
        }
        select.enable();
      });
    } else {
      if (_.isEmpty(subsetSelect)) {
        return;
      }
      subsetSelect.enable();
    }

    if (typeof variantSelect.forEach === 'function') {
      variantSelect.forEach((select) => {
        if (_.isEmpty(select)) {
          return;
        }
        select.enable();
      });
    } else {
      if (_.isEmpty(variantSelect)) {
        return;
      }
      variantSelect.enable();
    }

    let font = fontSelect.getValue().customProperties;

    setValue(subsetSelect, font.subsets);
    setValue(variantSelect, font.variants);
  }

  function initSelectChanges (fontSelect, subsetSelect, variantSelect) {
    fontSelect.passedElement.element.addEventListener('change', () => {
      handleSelectChanges(fontSelect, subsetSelect, variantSelect);
      setFontsPreview(fontSelect);
    }, false);
  }

  initSelectChanges(logoFontSelect, logoSubsetSelect, logoVariantSelect);
  initSelectChanges(itemFontSelect, itemSubsetSelect, itemVariantSelect);

  function fillFontsSelects (select, fontItems, subsetSelect, variantSelect) {
    select.setChoices(getFontsValues(fontItems), 'value', 'label', false);

    select.passedElement.element.addEventListener('addItem', () => {
      handleSelectChanges(select, subsetSelect, variantSelect);
    }, false);

    let selectValue = select.passedElement.element.getAttribute('data-value');
    if (selectValue) {
      select.setChoiceByValue(selectValue);
    }

    if (typeof subsetSelect.forEach === 'function') {
      subsetSelect.forEach((selectIn) => {
        if (_.isEmpty(selectIn)) {
          return;
        }
        let subsetSelectValue = selectIn.passedElement.element.getAttribute('data-value');
        selectIn.setChoiceByValue(subsetSelectValue);
      });
    } else {
      if (_.isEmpty(subsetSelect)) {
        return;
      }
      let subsetSelectValue = subsetSelect.passedElement.element.getAttribute('data-value');
      subsetSelect.setChoiceByValue(subsetSelectValue);
    }

    if (typeof variantSelect.forEach === 'function') {
      variantSelect.forEach((selectIn) => {
        if (_.isEmpty(selectIn)) {
          return;
        }
        let variantSelectValue = selectIn.passedElement.element.getAttribute('data-value');
        selectIn.setChoiceByValue(variantSelectValue);
      });
    } else {
      if (_.isEmpty(variantSelect)) {
        return;
      }
      let variantSelectValue = variantSelect.passedElement.element.getAttribute('data-value');
      variantSelect.setChoiceByValue(variantSelectValue);
    }

  }

  function scrollToActivePosition (select) {
    select.passedElement.element.addEventListener('showDropdown', () => {
      const id = select.getValue().choiceId;
      const option = select.dropdown.element.querySelector(`[data-id="${id}"]`);

      if (!option) {
        return;
      }

      select.choiceList.scrollToChoice(option, 1);
      select._highlightChoice(option);
    }, false);
  }

  scrollToActivePosition(itemFontSelect);
  scrollToActivePosition(logoFontSelect);

  function getFontsValues (fontItems) {
    let fontsArr = [];

    fontItems.forEach((item, i) => {
      fontsArr[i] = {
        value: item.family,
        label: item.family,
        customProperties: {
          subsets: item.subsets,
          variants: item.variants
        }
      };
    });
    return fontsArr;
  }

  function getValue (items) {
    let values = [];

    items.forEach((item, i) => {
      values[i] = {
        value: normalizeFontWeight(item),
        label: normalizeFontWeight(item)
      };
    });

    return values;
  }

  function resetValue (select) {
    select.setChoices([{
      value: 'none',
      label: 'Select Value',
      selected: true
    }], 'value', 'label', true);
  }

  document.querySelector('.gm-gui__restore-btn').addEventListener('click', () => {
    document.querySelectorAll('.gm-gui__font-preview-wrapper').forEach((preview) => {
      preview.style.display = 'none';
    });
    logoFontSelect.setChoiceByValue('none');
    itemFontSelect.setChoiceByValue('none');
  });

  document.querySelector('.gm-gui-restore-section-btn').addEventListener('click', () => {
    document.querySelectorAll(`.${itemFontSelect.choiceList.element.className}`)
      .forEach((item) => {
        if (item.closest('.gm-sublevel').classList.contains('active')) {
          itemFontSelect.setChoiceByValue('none');
        }
      });

    document.querySelectorAll(`.${logoFontSelect.choiceList.element.className}`)
      .forEach((item) => {
        if (item.closest('.gm-sublevel').classList.contains('active')) {
          logoFontSelect.setChoiceByValue('none');
        }
      });
  });

  function setValue (selects, items) {
    if (typeof selects.forEach === 'function') {
      selects.forEach((select) => {
        resetValue(select);
        select.setChoices(getValue(items), 'value', 'label', true);
      });
    } else {
      resetValue(selects);
      selects.setChoices(getValue(items), 'value', 'label', true);
    }
  }

  function normalizeFontWeight (value) {
    if (value === 'regular') {
      return '400';
    }

    if (value === 'italic') {
      return '400italic';
    }

    return value;
  }

  function setFontsPreview (fontSelect) {
    let currentFont = fontSelect.getValue(true);
    let select = fontSelect.passedElement.element;
    if (!currentFont || currentFont === 'none') {
      return;
    }
    const closestModule = select.closest('.gm-gui__module__select-wrapper');
    document.querySelector('.gm-gui__font-preview-wrapper');
    let fontPreviewWrapper = document.createElement('div');
    fontPreviewWrapper.classList.add('gm-gui__font-preview-wrapper');

    let preview = document.createElement('div');
    preview.classList.add('gm-gui__font-preview');
    preview.innerHTML = 'Font family example';

    if (select.closest('.gm-gui__module__ui')
      .querySelector('.gm-gui__font-preview-wrapper') === null) {

      closestModule.prepend(fontPreviewWrapper);
      fontPreviewWrapper.append(preview);
    }

    WebFont.load({
      google: {
        families: [currentFont],
      },
      loading: () => {
        select.closest('.gm-gui__module__ui')
          .querySelector('.gm-gui__font-preview')
          .classList
          .add('gm-gui__font-preview--loading');
      },
      fontactive: () => {
        select.closest('.gm-gui__module__ui')
          .querySelector('.gm-gui__font-preview').style.fontFamily = currentFont;
        setTimeout(() => {
          select.closest('.gm-gui__module__ui')
            .querySelector('.gm-gui__font-preview')
            .classList
            .remove('gm-gui__font-preview--loading');
        }, 200);
      }
    });
  }
});
