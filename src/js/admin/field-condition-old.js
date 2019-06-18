import GmStyles from '../common/styles';
import { isRtl } from '../common/helpers';
import { showMessage } from './snackbar';

(function ($) {

  $(function () {
    let currentSubAction = 'save';
    let $navTabsItemAnchor = $('.gm-gui__nav-tabs__item__anchor');
    var $gmGuiContainer = $('.gm-gui-container [data-condition], .gm-dashboard-container [data-condition]');
    var $gmHoverStyleInput = $('.gm-hover-style-input');
    const $previewForm = $('.gm-form');
    const actionAttr = $previewForm.attr('action');

    function getAllUrlParams (url) {
      var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
      var obj = {};

      if (queryString) {

        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
          var a = arr[i].split('=');
          var paramNum = undefined;
          var paramName = a[0].replace(/\[\d*]/, function (v) {
            paramNum = v.slice(1, -1);
            return '';
          });
          var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

          paramName = paramName.toLowerCase();
          paramValue = paramValue.toLowerCase();

          if (obj[paramName]) {
            if (typeof obj[paramName] === 'string') {
              obj[paramName] = [obj[paramName]];
            }
            if (typeof paramNum === 'undefined') {
              obj[paramName].push(paramValue);
            }
            else {
              obj[paramName][paramNum] = paramValue;
            }
          }
          else {
            obj[paramName] = paramValue;
          }
        }
      }

      return obj;
    }

    function setTitle () {
      var pageQuery = getAllUrlParams().page;
      var actionQuery = getAllUrlParams().action;
      var $newTitle = $('.gm-gui__preset-name').text();
      if (pageQuery === 'groovy_menu_settings' && actionQuery === 'edit') {
        document.title = $newTitle;
      }
    }

    try {
      setTitle();
    } catch (e) {} // eslint-disable-line no-empty

    // tab init
    $navTabsItemAnchor.on('click', toggleTabs);

    function toggleTabs () {
      var tab;
      var tabId = $(this)
        .data('tab');

      $(this)
        .closest('ul')
        .find('li.active')
        .removeClass('active');
      $(this)
        .closest('li')
        .addClass('active');
      tab = $(this)
        .closest('li.active');
      $('.tab-pane.active')
        .removeClass('active');
      $('#' + tabId)
        .addClass('active');
      tab
        .find('.gm-gui__nav-tabs__sublevel__item__anchor')
        .first()
        .trigger('click');
      return false;
    }

    $('.gm-gui__nav-tabs__sublevel__item__anchor')
      .on('click', toggleTabItems);

    function toggleTabItems () {
      var sublevelName = $(this)
        .data('sublevel');
      var tabName = $(this)
        .closest('.gm-gui__nav-tabs__item')
        .find('.gm-gui__nav-tabs__item__anchor')
        .data('tab');

      $(this)
        .closest('ul')
        .find('.active')
        .removeClass('active');
      $(this)
        .closest('li')
        .addClass('active');
      $('.gm-sublevel.active')
        .removeClass('active');
      $('#gm-sublevel-' + tabName + '-' + sublevelName)
        .addClass('active');
      return false;
    }

    $navTabsItemAnchor
      .first()
      .trigger('click');

    // select gui
    function initSelect ($this) {
      var select = $('<div class="select">');
      var $list = $('<ul />', {
        'class': 'select-options'
      });
      var $listItems;
      var listHtml = '';
      var options = $this
        .children('option')
        .not('[disabled]');
      var $styledSelect;
      var itemChange;

      $this.addClass('select-hidden');
      select.append('<div class="select-styled"></div>');

      if (options.filter(':selected').length === 0) {
        options.eq(0)
          .attr('selected', true);
      }
      $styledSelect = select.find('div.select-styled');
      $styledSelect
        .text(options
          .filter(':selected')
          .eq(0)
          .text());
      select.append($list);
      $this.children('option:not([disabled])')
        .each(function () {
          listHtml += '<li rel="' + $(this)
            .val() + '">' + $(this)
            .text() + '</li>';
        });
      $list.html(listHtml);

      $listItems = $list.children('li');
      itemChange = function (e) {
        e.stopPropagation();
        $styledSelect
          .text($(this)
            .text())
          .removeClass('active');
        $this
          .val($(this)
            .attr('rel'))
          .change();
        $this
          .find('option')
          .attr('selected', null);
        $this
          .find('option[value="' + $(this)
            .attr('rel') + '"]')
          .attr('selected', 'selected');
        $list.hide();
      };

      $styledSelect.on('click', function (e) {
        e.stopPropagation();
        $('div.select-styled.active')
          .each(function () {
            $(this)
              .removeClass('active')
              .next('ul.select-options')
              .hide();
          });
        $(this)
          .toggleClass('active')
          .next('ul.select-options')
          .toggle();
      });

      $listItems.on('click', itemChange);

      $(document)
        .on('click', function () {
          $styledSelect.removeClass('active');
          $list.hide();
        });

      $this.after(select);
      select.append($this);
    }

    function handleSelectChanges () {
      const select2Names = [
        'google_font',
        'logo_txt_font',
        'item_text_weight',
        'mobile_item_text_weight',
        'mobile_subitem_text_weight',
        'item_text_subset',
        'sub_level_item_text_weight',
        'sub_level_item_text_subset',
        'megamenu_title_text_weight',
        'megamenu_title_text_subset',
        'logo_txt_weight',
        'logo_txt_subset',
        'sticky_logo_txt_weight',
        'sticky_logo_txt_subset'
      ];

      // select2 is used for this selects
      if (select2Names.includes($(this)
        .data('name'))) {
        return;
      }

      if ($(this)
        .parent()
        .is('.select')) {
        $(this)
          .parent()
          .find('.select-styled')
          .remove();
        $(this)
          .parent()
          .find('.select-options')
          .remove();
        $(this)
          .unwrap();
      }
      initSelect($(this));
    }

    $('.gm-gui__module__select-wrapper select')
      .on('change', handleSelectChanges)
      .trigger('change');

    // Post Types field
    $('.gm-gui__module__post_types')
      .each(function () {
        var self = $(this);

        self
          .find('.gm-gui__module__switch-wrapper input.switch')
          .on('change', function () {
            var collectTypes = [];

            self
              .find('.gm-gui__module__switch-wrapper input.switch')
              .each(function () {
                if ($(this)
                  .is(':checked')) {
                  collectTypes.push($(this)
                    .val());
                }
              });

            self
              .find('.gm-post_types')
              .val(collectTypes.join());
          });
      });

    // Taxonomy Preset field
    $('.gm-gui__module__taxonomy_preset')
      .each(function () {
        var self = $(this);

        self
          .find('.gm-gui__subselect-wrapper .gm-subselect')
          .on('change', function () {
            var collectValues = [];

            self
              .find('.gm-gui__subselect-wrapper')
              .each(function () {
                var presetField = $(this)
                  .find('.gm-subselect--preset');
                var menuField = $(this)
                  .find('.gm-subselect--navmenu');
                var taxonomy = presetField.attr('data-taxonomy');
                var valuePreset = presetField.val();
                var valueMenu = menuField.val();

                collectValues
                  .push(taxonomy + ':::' + valuePreset + '@' + valueMenu);
              });

            self
              .find('.gm-taxonomy_preset')
              .val(collectValues.join());
          });
      });

    // noUiSlider
    $('.gm-gui__module__range__input')
      .each(function () {
        var range = $(this)
          .closest('.gm-gui__module__range-wrapper')
          .find('.gm-gui__module__range__range')
          .first()[0];
        var input = $(this)
          .first()[0];
        var $input = $(this);
        var step = $input.data('step');

        function updateSlider (values, handle) {
          var value = values[handle];

          if (step === '1') {
            value = Math.round(value);
          }
          return value;
        }

        noUiSlider.create(range, {
          start: parseInt($input.val(), 10),
          step: step,
          connect: 'lower',
          range: {
            'min': $input.data('min'),
            'max': $input.data('max')
          },
          format: {
            to: function (value) {
              return value;
            },
            from: function (value) {
              return value;
            }
          }
        });

        range
          .noUiSlider
          .on('update', function (values, handle) {
            $input.val(updateSlider(values, handle));
          });
        range
          .noUiSlider
          .on('change', function (values, handle) {
            $input.val(updateSlider(values, handle))
              .trigger('change');
          });

        input.addEventListener('change', function () {
          range.noUiSlider.set([null, this.value]);
        });

        input.addEventListener('keydown', function (e) {
          var value = Number(range.noUiSlider.get());
          var sliderStep = sliderStep[0];

          // 13 is enter,
          // 38 is key up,
          // 40 is key down.
          switch (e.which) {
            case 13:
              range.noUiSlider.set(this.value);
              break;
            case 38:
              range.noUiSlider.set(value + sliderStep[1]);
              break;
            case 40:
              range.noUiSlider.set(value - sliderStep[0]);
              break;
          }
        });
      });

    // Header Styles
    function groovyHeaderSelector () {
      var input = $('#gm-gui__header-types__options');

      input.on('change.header',
        function () {
          var align = $(this)
            .data('align');
          var toolbar = $(this)
            .data('toolbar');
          var style = parseInt($(this)
            .data('style'), 10);
          var isHideAlignCenter = (style !== 1 && style !== 2);
          var styleName = $('.gm-gui__header-types__options__list select option[value="' + style + '"]')
            .text();

          $('.gm-gui__header-types__options__align--center')
            .toggle(!isHideAlignCenter);
          // set active align
          $('.gm-gui__header-types__options__align > span')
            .removeClass('active');
          $('.gm-gui__header-types__options__align > span[rel="' + align + '"]')
            .addClass('active');
          // set active style
          $('.gm-gui__header-types__options__list select')
            .closest('.select')
            .find('.select-styled')
            .text(styleName);
          // set toolbar switcher
          if (toolbar !== false && toolbar !== 'false') {
            $('#switch-toolbar-toggle')
              .attr('checked', true);
          }

          $('#gm-gui__header-types')
            .attr('class', '')
            .addClass('style-' + style + '-align-' + align + ' toolbar-' + toolbar);
          $(this)
            .val(JSON.stringify({
              'align': align,
              'style': style,
              'toolbar': toolbar.toString()
            }));
        });

      //change align
      $('.gm-gui__header-types__options__align span')
        .on('click', function () {
          input.data('align', $(this)
            .attr('rel'))
            .trigger('change.header')
            .trigger('change');
        });

      $('#switch-toolbar-toggle')
        .on('click', function () {
          input.data('toolbar', $(this)
            .is(':checked'))
            .trigger('change.header')
            .trigger('change');
        });

      //header type
      $('.gm-gui__header-types__options__list select')
        .on('change', function () {
          input.data('style', parseInt($(this)
            .val(), 10))
            .trigger('change.header')
            .trigger('change');
        });

      input
        .trigger('change.header')
        .trigger('change');
    }

    groovyHeaderSelector();

    function startListenerCreation ($field) {
      var condition = $field.data('condition');

      if ($.isArray(condition) && $.isArray(condition[0])) {
        $.each(condition, function (i, cond) {
          createFieldListener($field, cond);
        });
      } else {
        createFieldListener($field, condition);
      }
    }

    $gmGuiContainer
      .not('.gm-gui-module-wrapper')
      .each(function () {
        startListenerCreation($(this));
      });

    $gmGuiContainer
      .filter('.gm-gui-module-wrapper')
      .each(function () {
        startListenerCreation($(this));
      });

    function getFieldByCondition (condition) {
      var fieldName = condition[0].split('.')[0];

      return $('[data-name="' + fieldName + '"]');
    }

    function createFieldListener (field, condition) {
      getFieldByCondition(condition)
        .each(function () {
          $(this)
            .on('change', function () {
              checkFieldCondition(field);
            });
        });
      checkFieldCondition(field);
    }

    function checkFieldCondition (field) {
      var conditions = $(field)
        .data('condition');
      var conditionType = $(field)
        .data('condition_type');
      var show = true;

      function isMatch (cond) {
        var show = false;
        var relation = getFieldByCondition(cond);
        var field = cond[0].split('.');
        var value;

        if (cond[1] === '==') {
          if (relation.is('select')) {
            show = relation.val() === cond[2];
          }
          if (relation.attr('type') === 'checkbox') {
            show = relation.is(':checked');
            if (cond[2] === 'false') {
              show = !show;
            }
          }

          if (relation.attr('type') === 'radio') {
            show = relation
              .filter(':checked')
              .val() === cond[2];
          }
          if (field.length === 2) {
            value = relation.data(field[1]);
            show = value.toString() === cond[2];
          }
        }

        if (cond[1] === 'in') {
          show = $.inArray(relation.val()
            .toString(), cond[2]) !== -1;

          if (relation.attr('type') === 'checkbox') {
            show = relation.is(':checked');
          }

          if (relation.attr('type') === 'radio') {
            const relationValue = relation
              .filter(':checked')
              .val();

            show = cond[2].includes(relationValue);
          }

          if (field.length === 2) {
            value = relation.data(field[1]);
            show = $.inArray(value.toString(), cond[2]) !== -1;
          }
        }
        return show;
      }

      function isResultsMatched (type, results) {
        if (type === 'OR') {
          return _.includes(results, true);
        }

        if (type === 'NOT') {
          return !_.includes(results, true);
        }

        return !_.includes(results, false);
      }

      function isInlineFieldEmpty ($field) {
        var isFieldEmpty = true;
        var $modules = $field.find('.gm-gui__module');

        if (!$field.hasClass('gm-gui-module-wrapper')) {
          return false;
        }

        $modules.each(function () {
          if ($(this)
            .css('display') !== 'none') {
            isFieldEmpty = false;
          }
        });

        return isFieldEmpty;
      }

      if ($.isArray(conditions) && $.isArray(conditions[0])) {
        var matchResults = [];

        $.each(conditions, function (i, cond) {
          matchResults.push(isMatch(cond));
        });

        show = isResultsMatched(conditionType, matchResults);
      } else {
        show = isMatch(conditions);
      }

      if (isInlineFieldEmpty(field)) {
        show = false;
      }

      changeFieldVisibility(field, show);
    }

    function changeFieldVisibility (field, visibility) {
      if (field.is('option')) {
        field
          .attr('disabled', !visibility)
          .change();
      } else {
        if (visibility) {
          $(field)
            .css({'display': ''});
        } else {
          $(field)
            .css({'display': 'none'});
          if ($(field)
            .hasClass('gm-gui__module__hover-style__item')) {
            var clicked = false;

            $(field)
              .closest('.gm-gui__module__ui')
              .find('.gm-gui__module__hover-style__item')
              .each(function () {
                if (!clicked && $(this)
                  .css('display') !== 'none') {
                  clicked = true;
                  $(this)
                    .trigger('click');
                }
              });
          }

        }
      }
    }

    $('.gm-gui__module__hover-style__item')
      .on('click', function () {
        var styleId = $(this)
          .attr('rel');
        $(this)
          .closest('.gm-gui__module__hover-style-wrapper')
          .find('.gm-hover-style-input')
          .val(styleId)
          .trigger('change');
        return false;
      });

    $gmHoverStyleInput
      .on('change', function () {
        $(this)
          .closest('.gm-gui__module__hover-style-wrapper')
          .find('.gm-gui__module__hover-style__item.active')
          .removeClass('active');
        $(this)
          .closest('.gm-gui__module__hover-style-wrapper')
          .find('.gm-gui__module__hover-style__item[rel="' + $(this)
            .val() + '"]')
          .addClass('active');
      });
    $gmHoverStyleInput
      .trigger('change');

    function gmSaveStyles (presetId, css) {
      const ajaxData = {
        'action': 'gm_save_styles',
        'sub_action': currentSubAction,
        'data': css,
        'direction': isRtl() ? 'rtl' : 'ltr',
        'preset_id': presetId
      };

      $.post(ajaxurl, ajaxData, (response) => {
        if (response.success) {
          showMessage(response.data);
        } else {
          showMessage('Error: ' + response.data);
        }
      });
    }

    function gmGetSettings ($form) {
      const presetId = $form.data('id');
      const ajaxData = {
        'action': 'gm_get_setting',
        'preset_id': presetId
      };

      $.post(ajaxurl, ajaxData, (response) => {
        if (response.success) {
          const settings = response.data;
          const gmStyles = new GmStyles(settings);

          gmSaveStyles(presetId, gmStyles.get());
        } else {
          showMessage('Error: ' + response.data);
        }
      });
    }

    function gmSaveForm ($form) {
      var gmAjaxData = {
        'action': 'gm_save',
        'sub_action': currentSubAction,
        'data': $form.serialize()
      };

      $.post(ajaxurl, gmAjaxData, function (response) {
        if (response.success) {
          gmGetSettings($form);
        } else {
          showMessage('Error: ' + response.data);
        }
      });

      window.onbeforeunload = null;
    }

    $('.gm-gui-save-btn')
      .on('click', () => {
        currentSubAction = 'save';
      });

    $previewForm.on('submit', function () {
      if ($(this)
        .hasClass('gm-preview-form')) {
        return;
      }

      if ($('.gm-is-import')
        .val() === 'import') {} // eslint-disable-line no-empty
      else {
        gmSaveForm($previewForm);
        return false;
      }
    });

    $('.gm-gui-btn-group .gm-gui-btn')
      .on('click', function () {
        $('.gm-gui-btn-group .gm-gui-btn')
          .removeClass('gm-gui-btn-last-action');
        $(this)
          .addClass('gm-gui-btn-last-action');
      });

    $('.gm-gui-restore-section-btn')
      .on('click', function () {
        if (confirm('Restore current section to default settings?')) {
          currentSubAction = 'restore';
          restoreSettings($('.gm-form .gm-sublevel.active'));
        }
      });

    $('.gm-gui__module input[type="text"],.gm-gui__module input[type="number"]')
      .on('keypress', function (e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
          return false;
        }
      });

    $('.gm-gui-preview-btn')
      .on('click', function () {
        var clonedForm = $('.gm-form')
          .clone();
        var id = clonedForm.data('id');
        var url = groovyMenuLocalize.GroovyMenuSiteUrl + '/?groovy-menu-preset=1&gm_action_preview=1&from=edit&id=' + id + (isRtl() ? '&d=rtl' : '');
        var previewFrame = '<iframe frameborder="0" name="live-preview" id="live-preview" scrolling="no" width="100%" height="100%" src="' + url + '"></iframe>';
        var $previewModal = $('#preview-modal');

        clonedForm.addClass('gm-cloned-form');

        $previewModal
          .find('.modal-body-iframe')
          .html(previewFrame);

        $previewForm.attr('action', url);
        $previewForm.attr('target', 'live-preview');
        $previewForm.addClass('gm-preview-form');
        $previewForm.trigger('submit');
        $('#preview-modal .modal-preview-name')
          .html($('.gm-gui__preset-name')
            .text());
        $previewModal
          .gmModal('show');
        return false;
      });

    $('.close')
      .on('click', function () {
        $previewForm.attr('action', actionAttr);
        $previewForm.removeAttr('target');
        $previewForm.removeClass('gm-preview-form');
      });

    $('.gm-gui__restore-btn')
      .on('click', function () {
        if (confirm('Restore default settings?')) {
          currentSubAction = 'restore_all';
          restoreSettings($('.gm-form'));
        }
        return false;
      });

    function restoreSettings (form) {
      $(form)
        .find('.gm-select, .gm-colorpicker, .gm-gui__module__range__input, .gm-gui__module__number__input, .switch, .gm-header, .gm-hover-style-input, .gm-upload-input')
        .each(function () {
          var defaultValue = $(this)
            .data('default');

          if ($(this).data('reset') === false) {
            return;
          }

          if (typeof defaultValue === 'object') {
            $(this)
              .data(defaultValue);
          }

          if ($(this)
            .hasClass('gm-colorpicker')) {
            $(this)
              .closest('.wp-picker-container')
              .find('.wp-color-result')
              .addClass('wp-picker-open');
          }
          $(this)
            .val(defaultValue)
            .trigger('change');

          if ($(this)
            .hasClass('gm-colorpicker')) {
            $(this)
              .closest('.wp-picker-container')
              .find('.iris-slider-offset-alpha')
              .trigger('slidechange');
            $(this)
              .closest('.wp-picker-container')
              .find('.wp-color-result')
              .removeClass('wp-picker-open');
          }

          if (
            $(this)
              .hasClass('gm-select') &&
            !$(this)
              .hasClass('select2-hidden-accessible')
          ) {
            var option = $(this)
              .find('option:selected');
            var name = $(option)
              .text();

            $(this)
              .closest('.select')
              .find('.select-styled')
              .text(name);
          }

          if ($(this).hasClass('select2-hidden-accessible')) {
            const defaultValue = $(this).data('value');

            $(this)
              .val(defaultValue)
              .trigger('change');
          }

          if ($(this)
            .attr('type') === 'checkbox') {
            if ($(this)
              .data('default') === '1') {
              $(this)
                .attr('checked', true);
            }
            else {
              $(this)
                .attr('checked', false);
            }
          }

          if ($(this)
            .hasClass('gm-gui__module__range__input')) {
            var range = $(this)
              .closest('.gm-gui__module__range-wrapper')
              .find('.gm-gui__module__range__range')
              .first()[0];

            range
              .noUiSlider
              .set(parseInt($(this).val(), 10));
          }
        });

      if (currentSubAction === 'restore_all') {
        form.trigger('submit');
      }
    }

    $('.gm-upload-btn')
      .on('click', function (e) {
        e.preventDefault();
        var btn = $(this);
        var image;

        image = wp.media({
          title: 'Upload Image',
          multiple: false
        })
          .open()
          .on('select', function () {
            var uploadedImage = image
              .state()
              .get('selection')
              .first()
              .toJSON();

            var thumbImage = uploadedImage.url;

            if ('sizes' in uploadedImage) {
              if ('thumbnail' in uploadedImage.sizes) {
                if ('url' in uploadedImage.sizes.thumbnail) {
                  if (uploadedImage.sizes.thumbnail.url.length) {
                    thumbImage = uploadedImage.sizes.thumbnail.url;
                  }
                }
              }
            }

            btn
              .closest('.gm-gui__module__media')
              .find('.gm-upload-input')
              .val(uploadedImage.id)
              .attr('data-url', uploadedImage.url)
              .attr('data-thumbnail', thumbImage)
              .change();
          });
      });

    $('.gm-remove-btn')
      .on('click', function () {
        if (confirm('Remove image?')) {
          $(this)
            .closest('.gm-gui__module__media')
            .find('.gm-upload-input')
            .val('')
            .attr('data-url', '')
            .attr('data-thumbnail', '')
            .trigger('change');
        }
      });

    $('.gm-upload-input')
      .on('change', function () {
        if ($(this)
          .val() !== '') {
          $(this)
            .closest('.gm-gui__module__media')
            .addClass('gm-gui__module__media--selected')
            .find('.gm-media-preview')
            .html('<img src="' + $(this).attr('data-thumbnail') + '" />');
        }
        else {
          $(this)
            .closest('.gm-gui__module__media')
            .removeClass('gm-gui__module__media--selected')
            .find('.gm-media-preview')
            .html('');
        }
      })
      .trigger('change');

    $('.gm-gui__export-button')
      .on('click', function () {
        window.location = '?page=groovy_menu_settings&export=export';
        return false;
      });

    $('.gm-gui__import-button')
      .on('click', function () {
        $('.gm-is-import')
          .val('import');
        window.onbeforeunload = function () {

        };
        $(this)
          .closest('form')
          .trigger('submit');
        return false;
      });

    $('.gm-gui__logotype')
      .on('click', function () {
        $(this)
          .closest('.gm-gui__module__ui')
          .find('.gm-gui__logotype--selected')
          .removeClass('gm-gui__logotype--selected');
        $(this)
          .addClass('gm-gui__logotype--selected');
      });

    setTimeout(function () {
      $('.gm-form input')
        .on('change', function () {
          window.onbeforeunload = function () {
            var saveAlert = groovyMenuL10n['save_alert'];
            return saveAlert;
          };
        });
    }, 100);
  });

  $(window)
    .on('load', function () {
      setTimeout(function () {
        $('.gm-gui-container')
          .addClass('loaded');
      }, 1);

      setTimeout(function () {
        try {
          $('.gm-colorpicker')
            .wpColorPicker();
        }
        catch (e) {} // eslint-disable-line no-empty
      }, 500);

    });

})(jQuery);
