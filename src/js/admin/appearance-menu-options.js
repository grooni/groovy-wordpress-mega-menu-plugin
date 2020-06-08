(function ($) {

  'use strict';
  $(function () {

    var $globalWrapper = $('.nav-menus-php');
    var $body = $('body');


    // Add second container for modal clones of options.
    $body.append('<div class="gm-walker-second-wrapper" style="display:none !important"></div>');

    // --- Open modal action -------------------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-menu-open-modal-button', function (event) {
      event.preventDefault();

      var $this = $(this);

      openModalArea($this);
    });


    // --- Close modal action ------------------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-walker-modal-close', function (event) {
      event.preventDefault();

      var $this = $(this);

      closeModalArea($this);
    });


    // --- Outside modal click action ----------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-walker-modal-overlay', function (event) {
      event.preventDefault();

      var $this = $(this);

      closeModalArea($this);
    });


    // --- SAVE modal action -------------------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-walker-modal-save', function (event) {
      event.preventDefault();
      var $this = $(this);

      var $secondWrapper = $('.gm-walker-second-wrapper');
      var $secondModalArea = $secondWrapper.find('.gm-walker-modal-settings-container');
      var $modalItemId = $secondModalArea.attr('data-item-id');
      var $targetModalArea = $('#post-body .gm-menu-options-container[data-item-id="' + $modalItemId + '"]');
      var gm_nonce = $(this)
        .attr('data-nonce');


      if ($this.hasClass('gm-button-disable')) {
        return;
      }

      if (!$modalItemId) {
        alert('Detect error. Try reload the page.');
        return;
      }

      $(this)
        .addClass('gm-button-disable gm-button-loading');

      var formData = {};
      $secondModalArea.find('input[name], select[name]')
        .each(function (index, node) {
          var ignore = false;
          var legalName = node.name;
          var legalValue = node.value;
          var legalId = node.id;

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

            //Get data for selectbox
            if (node.tagName.toUpperCase() === 'SELECT') {
              legalValue = node.options[node.selectedIndex].value;
              $targetModalArea.find('#' + legalId)
                .val(legalValue)
                .trigger('change');
            }
            //Get data from checkbox
            else if (node.type === 'checkbox') {
              if (node.checked === false) {
                legalValue = '';
                $targetModalArea.find('#' + legalId)
                  .prop('checked', false)
                  .trigger('change');
              } else {
                legalValue = (node.value == null ? 'on' : node.value);
                $targetModalArea.find('#' + legalId)
                  .prop('checked', true)
                  .trigger('change');
              }
            } else {
              $targetModalArea.find('#' + legalId)
                .val(legalValue)
                .trigger('change');
            }

            if ($(node)
              .hasClass('gm-option-type-iconpicker')) {
              $targetModalArea.find('#' + legalId)
                .parent()
                .find('.gm-icon-preview')
                .html(
                  $(node)
                    .parent()
                    .find('.gm-icon-preview')
                    .html()
                );
            }

            if ($(node)
              .hasClass('gm-option-type-media')) {
              $targetModalArea.find('#' + legalId)
                .parent()
                .find('.gm-option-image-preview')
                .html(
                  $(node)
                    .parent()
                    .find('.gm-option-image-preview')
                    .html()
                );
            }

            formData[legalName] = legalValue;

          }

        });

      $.ajax({
        type: 'POST',
        url: ajaxurl,
        dataType: 'json',
        data: {
          action: 'gm_save_menu_item_options',
          item_id: $modalItemId,
          gm_nonce: gm_nonce,
          options: JSON.stringify(formData)
        },
        error: function (result) {
          console.log('ajax error: gm_save_menu_item_options');
          $this.removeClass('gm-button-disable gm-button-loading');
          alert('ajax error');
        },
        success: function (result) {
          $this.removeClass('gm-button-disable gm-button-loading');

          if (result) {
            if (false === result.success) {
              alert(result.data); // TODO create UX\UI for error alert
            }
          }

          closeColorPicker();

          $secondModalArea.hide();

          closeModalArea($this);

        }.bind(this)
      });


    });


    function openModalArea(elem) {
      var $modalArea = elem.closest('.gm-menu-options-container')
        .find('.gm-walker-modal-settings-container');
      var $modalItemId = $modalArea.attr('data-item-id');
      var $modalOverlay = elem.closest('.gm-menu-options-container')
        .find('.gm-walker-modal-overlay');
      var $secondWrapper = $('.gm-walker-second-wrapper');

      var $cloneOverlay = $($modalOverlay)
        .clone(true, true);
      var $clone = $($modalArea)
        .clone(true, true);

      $secondWrapper.empty();
      $secondWrapper.append($cloneOverlay);
      $secondWrapper.append($clone);

      initSelectFields($secondWrapper);

      $.each(
        $secondWrapper.find('.gm-option-type-checkbox, .gm-option-field-select'),
        function (index, element) {
          $(element)
            .trigger('change');
        }
      );

      initColorPicker();

      $secondWrapper.show();
      $secondWrapper.find('.gm-walker-modal-overlay')
        .show();
      $secondWrapper.find('.gm-walker-modal-settings-container')
        .show();

      $('body')
        .addClass('gm_walker_page_no_scroll');

    }

    function initSelectFields(wrapper) {
      // Checkout all select field
      var $allSelects = wrapper.find('.gm-option-type-select, .gm-option-type-font');

      $allSelects.each(function () {
        var textValue = $(this)
          .val();
        $(this)
          .parent()
          .find('.gm-option-field-select')
          .val(textValue);
      });

    }

    function closeModalArea(elem) {
      var $secondWrapper = $('.gm-walker-second-wrapper');

      $('.gm-walker-modal-settings-container')
        .hide();
      $('.gm-walker-modal-overlay')
        .hide();

      $secondWrapper.empty()
        .hide();

      $('body')
        .removeClass('gm_walker_page_no_scroll');
    }


    function initColorPicker() {
      var $secondWrapper = $('.gm-walker-second-wrapper');
      var $modalArea = $secondWrapper.find('.gm-walker-modal-settings-container');

      var isColorPickerExists = $modalArea.find('.wp-picker-container').length;

      if (isColorPickerExists) {
        return;
      }

      var $colorPicker = $modalArea.find('.gm-appearance-colorpicker');

      $colorPicker.wpColorPicker(
        {palettes: true}
      );
    }

    function closeColorPicker() {
      var $secondWrapper = $('.gm-walker-second-wrapper');
      var $modalArea = $secondWrapper.find('.gm-walker-modal-settings-container');

      var $colorPickers = $modalArea.find('.wp-picker-container');

      if ($colorPickers.length) {
        $colorPickers.each(function () {
          if ($(this)
            .hasClass('wp-picker-active')) {
            $(this)
              .wpColorPicker('close');
          }
        });
      }
    }

  });
})(jQuery);
