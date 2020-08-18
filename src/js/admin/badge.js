(function ($) {

  'use strict';
  $(function () {
    var file_frame = [];

    var $globalWrapper = $('.nav-menus-php');


    // --- Show/Hide thumbs setting action -----------------------------------------------------------------------------
    $globalWrapper.on('change', '.edit-menu-item-gm-thumb-enable', toggleThumbSettingsVisibility);

    // --- Show/Hide Mega menu setting action --------------------------------------------------------------------------
    $globalWrapper.on('change', '.edit-menu-item-gm-megamenu', toggleMegaMenuOptionsVisibility);

    // --- Show/Hide badge setting action ------------------------------------------------------------------------------
    $globalWrapper.on('change', '.edit-menu-item-gm-use-html-as-icon', toggleHtmlIconSettingsVisibility);

    // --- Show/Hide badge setting action ------------------------------------------------------------------------------
    $globalWrapper.on('change', '.edit-menu-item-gm-badge-enable', toggleBadgeSettingsVisibility);

    // --- Show/Hide badge type setting action -------------------------------------------------------------------------
    $globalWrapper.on('change', '.groovy_menu_badge_type .gm-option-field-select', toggleBadgeTypeVisibility);

    // --- Work with font selects --------------------------------------------------------------------------------------
    $globalWrapper.on('change', '.groovy_menu_badge_text_font_family .gm-option-field-select', changeGoogleFontFamily);

    // --- Set selected value to the hidden field ----------------------------------------------------------------------
    $globalWrapper.on('change', '.gm-option-field-select', setSelectedValueToHiddenField);

    // --- Remove Image setting action ---------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-option-remove-img', removeImg);

    // --- Select Image setting action ---------------------------------------------------------------------------------
    $globalWrapper.on('click', '.gm-option-select-img', addBadgeImg);

    function addBadgeImg(e) {
      e.preventDefault();

      var $this = $(this);
      var id = $this.attr('data-item-id');
      var saveId = $this.attr('data-save-id');
      var frameId = id + saveId + '_gmbg';

      // If the media frame already exists, reopen it.
      if (file_frame[frameId]) {
        file_frame[frameId].open();

        return;
      }

      // Create the media frame.
      file_frame[frameId] = wp.media.frames.file_frame = wp.media({
        title: $this.data('uploader_title'),
        button: {
          text: $this.data('uploader_button_text')
        },
        multiple: false
      });

      // When an image is selected, run a callback.
      file_frame[frameId].on('select', function () {
        var attachment = file_frame[frameId].state()
          .get('selection')
          .first()
          .toJSON();
        var $parent = $('.gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId);

        if ($parent.find('.gm-option-img').hasClass('edit-menu-item-gm-megamenu-bg')) {
          $parent.find('.gm-option-img')
            .val(attachment.id)
            .trigger('change');
        } else {
          $parent.find('.gm-option-img')
            .val(attachment.url)
            .trigger('change');
        }
        $parent.find('.gm-option-img-width')
          .val(attachment.width);
        $parent.find('.gm-option-img-height')
          .val(attachment.height);

        var img = '<img src="' + attachment.url + '" alt="">';
        $parent.find('.gm-option-image-preview')
          .html(img);
      });

      file_frame[frameId].open();
    }

    function removeImg() {
      var id = $(this)
        .attr('data-item-id');
      var saveId = $(this)
        .attr('data-save-id');

      if (confirm('Remove image?')) {
        $(this)
          .closest('.gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId)
          .find('.gm-option-img')
          .each(function () {
            $(this)
              .val('')
              .trigger('change');
          });

        $(this)
          .closest('.gm-walker-modal-settings-container[data-item-id="' + id + '"] .' + saveId)
          .find('.gm-option-image-preview')
          .html('');
      }
      return false;
    }

    function toggleBadgeTypeVisibility() {
      var $option = $(this)
        .val();

      var $restFields = $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.gm-badge-field:not(.gm-badge-field--shared)');
      var isBadgeEnabled = $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.edit-menu-item-gm-badge-enable')
        .is(':checked');

      if (!isBadgeEnabled) {
        return;
      }

      if ($option === 'icon') {
        $restFields.hide();
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-badge-type--icon')
          .show();
      } else if ($option === 'image') {
        $restFields.hide();
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-badge-type--image')
          .show();
      } else if ($option === 'text') {
        $restFields.hide();
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-badge-type--text')
          .show();
      }
    }

    function toggleMegaMenuOptionsVisibility() {
      $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.megamenu-options-depend')
        .toggle($(this)
          .is(':checked'));
    }

    function toggleHtmlIconSettingsVisibility() {
      $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.gm-html-icon-depend')
        .toggle($(this)
          .is(':checked'));

      $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.gm-field-id-icon-class')
        .toggle(!$(this)
          .is(':checked'));
    }

    function toggleBadgeSettingsVisibility() {
      $(this)
        .closest('.gm-walker-modal-settings-container')
        .find('.gm-badge-field--shared')
        .toggle($(this)
          .is(':checked'));

      if ($(this)
        .is(':checked')) {
        var $badgeTypeSetting = $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.groovy_menu_badge_type');

        var $option = $badgeTypeSetting.find('.gm-option-type-select')
          .val();

        var $restFields = $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-badge-field:not(.gm-badge-field--shared)');

        if ($option === 'icon') {
          $restFields.hide();
          $(this)
            .closest('.gm-walker-modal-settings-container')
            .find('.gm-badge-type--icon')
            .show();
        } else if ($option === 'image') {
          $restFields.hide();
          $(this)
            .closest('.gm-walker-modal-settings-container')
            .find('.gm-badge-type--image')
            .show();
        } else if ($option === 'text') {
          $restFields.hide();
          $(this)
            .closest('.gm-walker-modal-settings-container')
            .find('.gm-badge-type--text')
            .show();
        }

      } else {
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-badge-field')
          .removeAttr('style');
      }
    }


    function toggleThumbSettingsVisibility() {
      if ($(this)
        .is(':checked')) {
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-thumb-field')
          .show();
      } else {
        $(this)
          .closest('.gm-walker-modal-settings-container')
          .find('.gm-thumb-field')
          .removeAttr('style');
      }
    }


    function changeGoogleFontFamily() {
      var itemId = $(this)
        .attr('data-item-id');
      var variants = $(this)
        .find('option:selected')
        .attr('data-variants')
        .split(';');
      var $parentWrapper = $(this)
        .closest('.gm-walker-modal-settings-container');

      var variantSelect = $parentWrapper.find('.groovy_menu_badge_text_font_variant .gm-option-field-select');

      variantSelect.find('.gm-opt-dynamic-variants')
        .remove();

      variants.forEach(function (variant) {
        var $option = $(
          '<option class="gm-opt-dynamic-variants" value="' + variant + '">' + getGoogleFontVariantText(variant) + '</option>'
        );

        variantSelect.append($option);
      });

      var savedVariantValue = variantSelect.parent()
        .find('.gm-option-field-select-hidden')
        .val();
      var newVariantValue = '';

      if (typeof savedVariantValue !== undefined) {
        if (variantSelect.find('option[value="' + savedVariantValue + '"]').length) {
          newVariantValue = savedVariantValue;
        }
      }

      variantSelect.val(newVariantValue)
        .change();
    }

    function setSelectedValueToHiddenField() {
      var $option = $(this)
        .val();

      // Put select chosen value to the hidden text field.
      $(this)
        .parent()
        .find('.gm-option-field-select-hidden')
        .val($option);
    }

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
})(jQuery);
