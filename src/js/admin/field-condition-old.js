(function ($) {

  $(function () {
    var $gmGuiContainer = $('.gm-gui-container [data-condition], .gm-dashboard-container [data-condition]');

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
  });

})(jQuery);
