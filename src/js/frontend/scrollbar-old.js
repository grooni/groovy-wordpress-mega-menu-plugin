const $ = window.jQuery;
import PerfectScrollbar from 'perfect-scrollbar';
import _ from 'lodash';

//import {isMobile} from '../common/helpers';
import {getCoords, isMobile, wrap} from '../shared/helpers';

function getDropdownMaxHeight($currentDropdownMenu) {
  let windowHeight = $(window)
    .height();
  let topOffset = $currentDropdownMenu
    .offset()
    .top;
  var topViewportOffset = topOffset - $(document)
    .scrollTop();
  var transformValues = $currentDropdownMenu
    .css('transform')
    .replace(/[^0-9\-.,]/g, '')
    .split(',');
  var dropdownMenuTranslateY = Number(transformValues[5]) || 0;

  return windowHeight - topViewportOffset + dropdownMenuTranslateY;
}

function getFirstDropdownRect($menuItem, settings) {
  var $dropdownMenu = $('.gm-dropdown-menu');
  var $currentDropdownMenu = $menuItem
    .find($dropdownMenu)
    .first();
  var currentDropdownMenuWidth = $currentDropdownMenu.outerWidth();
  var top = $menuItem.outerHeight();
  var width = currentDropdownMenuWidth;

  if (settings.header.style === 2 || settings.header.style === 3) {
    top = 0;
  }

  return ({
    top: top,
    width: width
  });
}

function getSubmenuDropdownRect($menuItem, settings) {
  var $dropdownMenu = $('.gm-dropdown-menu');
  var dropdownMenuBorderWidth = $dropdownMenu.css('border-top-width') || 0;
  var menuItemPosition = $menuItem.position();
  var top = menuItemPosition.top - parseInt(dropdownMenuBorderWidth, 10);

  if (settings.header.style === 2 || settings.header.style === 3) {
    top = 0;
  }

  return ({
    top: top
  });
}

export default function initScrollbar(settings) {
  var $dropdownMenu = $('.gm-main-menu-wrapper .gm-dropdown-menu');
  var $dropdownMenuParent = $dropdownMenu
    .closest('.gm-dropdown')
    .not('.gm-minicart, gm-search');
  var $dropdownMenuItem = $dropdownMenuParent
    .find('.gm-dropdown-toggle');
  var isScrollbarEnabled = false;
  var scrollbars = [];
  var lodash = _.noConflict();

  function handleScrollbarMouseEnter() {
    var $menuItem = $(this)
      .closest('.gm-dropdown');
    var wrapperClass = 'gm-dropdown-menu-wrapper';
    var $currentDropdownMenu = $menuItem
      .find($dropdownMenu)
      .first();
    var isHandled = $currentDropdownMenu
      .parent()
      .hasClass(wrapperClass);
    var firstDropdownRect = getFirstDropdownRect($menuItem, settings);
    var currentDropdownMenuWidth = firstDropdownRect.width;
    var $dropdownMenuWrapper;

    if (!isHandled) {
      $currentDropdownMenu.wrap('<div class="' + wrapperClass + '"></div>');

      $currentDropdownMenu.on('transitionend', function () {
        if ($menuItem.hasClass('gm-open')) {
          $(this)
            .css({
              transform: 'none',
              maxHeight: getDropdownMaxHeight($currentDropdownMenu)
            });
        } else {
          $(this)
            .css('transform', '');
        }
      });
    }

    $dropdownMenuWrapper = $menuItem
      .find('.' + wrapperClass)
      .first();

    // Second and next dropdown levels
    if ($menuItem.hasClass('gm-dropdown-submenu')) {
      $dropdownMenuWrapper.css({
        top: getSubmenuDropdownRect($menuItem, settings).top,
        height: getSubmenuDropdownRect($menuItem, settings).height
      });

      if ($menuItem.hasClass('has-attachment-thumbnail')) {
        const $image = $menuItem.find('.attachment-menu-thumb');
        const imagePosition = $menuItem.position();

        $image.css('top', imagePosition.top);
      }

      $menuItem.css('position', 'static');

      $currentDropdownMenu.css({
        position: 'static',
        maxHeight: getDropdownMaxHeight($currentDropdownMenu)
      });

      if (!isHandled) {
        const ps = new PerfectScrollbar($currentDropdownMenu[0], {
          suppressScrollX: true
        });

        scrollbars.push(ps);
      }

      return;
    }

    // First dropdown level
    $dropdownMenuWrapper.css({
      top: getFirstDropdownRect($menuItem, settings).top,
      width: currentDropdownMenuWidth,
      height: getFirstDropdownRect($menuItem, settings).height
    });

    $currentDropdownMenu.css({
      position: 'static',
      maxHeight: getDropdownMaxHeight($currentDropdownMenu)
    });

    if (!isHandled) {
      const ps = new PerfectScrollbar($currentDropdownMenu[0], {
        suppressScrollX: true
      });
      scrollbars.push(ps);
    }
  }

  function handleScrollbarMouseLeave() {
    var $menuItem = $(this)
      .closest('.gm-dropdown');
    var $currentDropdownMenu = $menuItem
      .find($dropdownMenu)
      .first();

    $currentDropdownMenu.css({
      display: '',
      transform: ''
    });
  }

  function enableScrollbar() {
    if (isMobile(settings.mobileWidth)) {
      return;
    }

    $dropdownMenuItem.on('mouseenter', handleScrollbarMouseEnter);
    $dropdownMenuItem.on('mouseleave', handleScrollbarMouseLeave);

    isScrollbarEnabled = true;
  }

  function disableScrollbar() {
    $dropdownMenuItem.off('mouseenter', handleScrollbarMouseEnter);
    $dropdownMenuItem.off('mouseleave', handleScrollbarMouseLeave);
    $dropdownMenu.off('transitionend');
    $dropdownMenuParent.removeAttr('style');
    $dropdownMenu.removeAttr('style');

    $dropdownMenu.each(function () {
      if ($(this)
        .parent()
        .hasClass('gm-dropdown-menu-wrapper')) {
        $(this)
          .unwrap();
      }
    });

    if (scrollbars.length) {
      for (let item of scrollbars) {
        item.destroy();
      }

      scrollbars = [];
    }

    $('.ps__rail-x, .ps__rail-y')
      .remove();

    isScrollbarEnabled = false;
  }

  function handleResize() {
    if (window.gmIsResizeOnlyHorisontal) {
      return;
    }

    if (isMobile(settings.mobileWidth)) {
      disableScrollbar();
    }
    if (!isMobile(settings.mobileWidth) && !isScrollbarEnabled) {
      enableScrollbar();
    }
  }

  enableScrollbar();
  $(window)
    .on('resize', lodash.throttle(handleResize, 100));
}
