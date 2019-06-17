import _ from 'lodash';
import { isMobile } from '../shared/helpers';
import { recalculatePaddingsAlignCenter } from './split';

var options;
var wpAdminBar;
var adminbarHeight;
var navbar;
var toolbar;
var lodash = _.noConflict();
var navbarWrapper;

function getStickySettings () {
  let type = options.stickyHeader;
  let offset = options.stickyOffset;
  const {stickyHeaderMobile, stickyOffsetMobile} = options;

  if (isMobile(options.mobileWidth) && stickyHeaderMobile) {
    type = options.stickyHeaderMobile;
  }

  if (isMobile(options.mobileWidth) &&
    (stickyOffsetMobile || stickyOffsetMobile === '')) {
    offset = options.stickyOffsetMobile;
  }

  return {type, offset};
}

function getStickyMenuOffset () {
  let adminbarHeight = wpAdminBar === null ? 0 : wpAdminBar.offsetHeight;
  let toolbarHeight = toolbar === null ? 0 : toolbar.offsetHeight;
  let stickyMenuOffset;

  if (isMobile(options.mobileWidth) &&
    options.header &&
    options.hideToolbarOnMobile) {
    toolbarHeight = 0;
  }

  stickyMenuOffset = adminbarHeight - toolbarHeight;
  return stickyMenuOffset;
}

function handleSlideDown () {
  var stickyOffset = navbarWrapper.offsetHeight;
  const stickySettings = getStickySettings();

  if (stickySettings.offset !== '') {
    const optionsStickyOffset = parseInt(stickySettings.offset, 10);

    stickyOffset = window.innerHeight / 100 * optionsStickyOffset;
  }

  if (window.pageYOffset >= stickyOffset) {
    let toolbarHeight = toolbar === null ? 0 : toolbar.offsetHeight;
    let headerStickyHeight = isMobile(options.mobileWidth) ? options.mobileHeaderStickyHeight : options.headerHeightSticky;

    navbar.classList.add('gm-navbar-sticky-toggle');

    navbarWrapper.style.top = `-${headerStickyHeight + toolbarHeight}px`;
    navbarWrapper.style.transform = `translateY(${headerStickyHeight + getStickyMenuOffset() + toolbarHeight}px)`;

    recalculatePaddingsAlignCenter({options});
  } else if (window.pageYOffset === 0) {
    navbar.classList.remove('gm-navbar-sticky-toggle');

    navbarWrapper.style.top = null;
    navbarWrapper.style.transform = null;

    if (navbarWrapper.getAttribute('style') === '') {
      navbarWrapper.removeAttribute('style');
    }

    recalculatePaddingsAlignCenter({options});
  }
}

function handleFixedSticky () {
  if (window.pageYOffset > 0) {
    navbar.classList.add('gm-navbar-sticky-toggle');
    navbarWrapper.style.transform = `translateY(${getStickyMenuOffset()}px)`;
    recalculatePaddingsAlignCenter({options});
  } else if (window.pageYOffset === 0) {
    navbar.classList.remove('gm-navbar-sticky-toggle');
    navbarWrapper.style.transform = null;

    if (navbarWrapper.getAttribute('style') === '') {
      navbarWrapper.removeAttribute('style');
    }

    recalculatePaddingsAlignCenter({options});
  }
}

export function enableStickyNav () {
  const stickySettings = getStickySettings();

  adminbarHeight = wpAdminBar === null ? 0 : wpAdminBar.offsetHeight;

  if (stickySettings.type === 'slide-down') {
    navbar.classList.add('gm-navbar-sticky');
    handleSlideDown({data: {options}});
    window.addEventListener('scroll', lodash.throttle(handleSlideDown, 50));
  } else if (stickySettings.type === 'fixed-sticky') {
    navbar.classList.add('gm-navbar-fixed-sticky');
    navbarWrapper.style.transform = `translate3d(0,' + (${adminbarHeight}) + 'px,0)`;
    handleFixedSticky();
    window.addEventListener('scroll', lodash.throttle(handleFixedSticky, 50));
  }
}

export function disableStickyNav () {
  if (options.stickyHeader === 'slide-down') {
    window.removeEventListener('scroll', handleSlideDown);
    navbar.classList.remove('gm-navbar-sticky', 'gm-navbar-sticky-toggle');
  }

  if (options.stickyHeader === 'fixed-sticky') {
    window.removeEventListener('scroll', handleFixedSticky);
    navbar.classList.remove('gm-navbar-fixed-sticky', 'gm-navbar-sticky-toggle');
  }

  navbarWrapper.style.transform = 'translate3d(0, 0, 0)';
}

export function initStickyNav (args) {
  options = args.options;
  wpAdminBar = args.wpAdminBar;
  adminbarHeight = args.adminbarHeight;
  navbar = args.navbar;
  toolbar = args.toolbar;
  navbarWrapper = args.navbarWrapper;
}
