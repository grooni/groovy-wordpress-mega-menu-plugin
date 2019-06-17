import { isMobile, isRtl } from '../shared/helpers';
import _ from 'lodash';

var options;

export function splitMenu () {
  let items = document.querySelectorAll('.gm-main-menu-wrapper .gm-navbar-nav > li');
  let itemsCount = items.length;
  let left = document.createElement('ul');
  let right = document.createElement('ul');
  let gmMainMenu = document.querySelector('#gm-main-menu');

  left.className = 'gm-navbar-nav nav--left';
  right.className = 'gm-navbar-nav nav--right';

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

function setPaddingsAlignCenter () {
  const mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');
  const logo = document.querySelector('.gm-navbar .gm-logo');
  const logoHalfWidth = logo.clientWidth / 2 || 0;
  const sideOffset = (options.logoType === 'no') ? 0 : 25;
  const logoHalfWidthWithPadding = logoHalfWidth + sideOffset;
  const navRight = document.querySelector('.nav--right');
  const navLeft = document.querySelector('.nav--left');

  if (isRtl()) {
    navRight.style.paddingRight = `${logoHalfWidthWithPadding}px`;
    navLeft.style.paddingLeft = `${logoHalfWidthWithPadding}px`;
  } else {
    navRight.style.paddingLeft = `${logoHalfWidthWithPadding}px`;
    navLeft.style.paddingRight = `${logoHalfWidthWithPadding}px`;
  }

  mainMenuWrapper.style.opacity = '1';
}

export function recalculatePaddingsAlignCenter (args) {
  if (args && args.options) {
    options = args.options;
  }

  if (!isMobile(options.mobileWidth) && options.header.align === 'center') {
    setPaddingsAlignCenter();
  }
}

export function initPaddingsAlignCenter (args) {
  options = args.options;
  setPaddingsAlignCenter();
  window.addEventListener('resize', _.debounce(() => {
    recalculatePaddingsAlignCenter();
  }, 100));
}
