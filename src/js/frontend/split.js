import { isMobile, isRtl } from '../shared/helpers';
import _ from 'lodash';

var options;

export function splitMenu () {
  let items = document.querySelectorAll('.gm-main-menu-wrapper:not(.gm-second-nav-drawer) .gm-navbar-nav > li');
  let itemsCount = items.length;
  let left = document.createElement('ul');
  let right = document.createElement('ul');
  let gmMainMenu = document.querySelector('#gm-main-menu');

  left.className = 'gm-navbar-nav nav--left';
  right.className = 'gm-navbar-nav nav--right';


  if (gmMainMenu && items) {
    items.forEach(function (li, index) {
      if (index < itemsCount / 2) {
        left.append(li);
      } else {
        right.append(li);
      }
    });

    gmMainMenu.innerHTML = '';
    gmMainMenu.append(left);
    gmMainMenu.append(right);
  }
}

function setPaddingsAlignCenter () {
  const mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');

  if (!mainMenuWrapper) {
    return;
  }

  const logo = document.querySelector('.gm-navbar .gm-logo');
  const logoHalfWidth = logo.clientWidth / 2 || 0;
  const sideOffset = (options.logoType === 'no') ? 0 : 25;
  const logoHalfWidthWithPadding = logoHalfWidth + sideOffset;
  const navRight = document.querySelector('.nav--right');
  const navLeft = document.querySelector('.nav--left');
  const gmActions = document.querySelector('.gm-navbar .gm-main-menu-wrapper .gm-actions');
  const gmSecondSidebarBurger = document.querySelector('.gm-navbar .gm-menu-btn-second');

  var widthMenuActions = 0;
  var widthMiniCart = 0;
  var widthSearchIcon = 0;
  var widthDivider = 0;
  var actionsWidth = 0;
  var secondWidth = 0;

  if (options.showDivider) {
    widthDivider = 10 + 1 + 10;
  }

  if (options.searchForm !== 'disable') {
    const searchIconFontSize = options.searchFormIconSizeDesktop;
    widthSearchIcon = 13 + Number.parseInt(searchIconFontSize) + 13;
  }

  if (options.woocommerceCart) {
    const cartIconFontSize = options.woocommerceCartIconSizeDesktop;
    widthMiniCart = 17 + 15 + Number.parseInt(cartIconFontSize) + 15 + 17;
  }

  widthMenuActions = widthDivider + widthSearchIcon + widthMiniCart;
  widthMenuActions = Math.floor(widthMenuActions / 2);

  if (gmActions && options.forceLogoCentering) {
    actionsWidth = gmActions.offsetWidth + 30;
  }

  if (gmSecondSidebarBurger && !options.forceLogoCentering) {
    if (options.secondSidebarMenuSideIconPosition === 'main_bar_left') {
      widthMenuActions -= Math.floor(gmSecondSidebarBurger.offsetWidth / 2);
    }
    if (options.secondSidebarMenuSideIconPosition === 'main_bar_right') {
      widthMenuActions += Math.floor(gmSecondSidebarBurger.offsetWidth / 2);
    }
    if (options.secondSidebarMenuSideIconPosition === 'main_bar_before_action_button') {
      widthMenuActions += Math.floor(gmSecondSidebarBurger.offsetWidth / 2);
    }
  }

  if (gmSecondSidebarBurger && options.forceLogoCentering) {
    if (options.secondSidebarMenuSideIconPosition === 'main_bar_left') {
      secondWidth = gmSecondSidebarBurger.offsetWidth;
    }
  }

  if (isRtl()) {
    if (navRight) {
      navRight.style.paddingRight = `${logoHalfWidthWithPadding}px`;
      if (actionsWidth) {
        navRight.style.width = `calc(50% + ${actionsWidth - secondWidth}px)`;
      }
    }
    if (navLeft) {
      navLeft.style.paddingLeft = `${logoHalfWidthWithPadding}px`;
    }
    if (logo) {
      if (actionsWidth) {
        logo.style.right = `50%`;
      } else {
        logo.style.right = `calc(50% - ${widthMenuActions}px)`;
      }
    }
  } else {
    if (navRight) {
      navRight.style.paddingLeft = `${logoHalfWidthWithPadding}px`;
    }
    if (navLeft) {
      navLeft.style.paddingRight = `${logoHalfWidthWithPadding}px`;
      if (actionsWidth) {
        navLeft.style.width = `calc(50% + ${actionsWidth - secondWidth}px)`;
      }
    }
    if (logo) {
      if (actionsWidth) {
        logo.style.left = `50%`;
      } else {
        logo.style.left = `calc(50% - ${widthMenuActions}px)`;
      }
    }
  }

  if (mainMenuWrapper) {
    mainMenuWrapper.style.opacity = '1';
  }
}

function removePaddingsAlignCenter () {
  const navRight = document.querySelector('.nav--right');
  const navLeft = document.querySelector('.nav--left');

  if (navRight) {
    navRight.style.paddingRight = '';
    navRight.style.paddingLeft = '';
  }
  if (navLeft) {
    navLeft.style.paddingRight = '';
    navLeft.style.paddingLeft = '';
  }
}

export function recalculatePaddingsAlignCenter (args) {
  if (args && args.options) {
    options = args.options;
  }

  if (!isMobile(options.mobileWidth) && options.header.align === 'center') {
    setPaddingsAlignCenter();
  }

  if (isMobile(options.mobileWidth) && options.header.align === 'center') {
    removePaddingsAlignCenter();
  }
}

export function initPaddingsAlignCenter (args) {
  options = args.options;
  setPaddingsAlignCenter();
  window.addEventListener('resize', _.debounce(() => {
    recalculatePaddingsAlignCenter();
  }, 100));
}
