import _ from 'lodash';
import { isMobile } from '../shared/helpers';
import { recalculatePaddingsAlignCenter } from './split';
import { dropdownCloseAll } from './dropdown';

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

  // Mobile width
  if (
    isMobile(options.mobileWidth) &&
    options.header &&
    (options.hideToolbarOnMobile ||
      (
        options.stickyToolbar &&
        options.stickyHeaderMobile === 'fixed-sticky'
      )
    )
  ) {
    toolbarHeight = 0;
  }

  // Desktop width
  if (
    !isMobile(options.mobileWidth) &&
    options.header &&
    (
      options.stickyToolbar &&
      options.stickyHeader === 'fixed-sticky'
    )
  ) {
    toolbarHeight = 0;
  }

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

  let toolbarHeight = toolbar === null ? 0 : toolbar.offsetHeight;
  let headerNormalHeight = isMobile(options.mobileWidth) ? options.mobileHeaderHeight : options.headerHeight;
  let headerStickyHeight = isMobile(options.mobileWidth) ? options.mobileHeaderStickyHeight : options.headerHeightSticky;
  let topOffsetWrapper = headerStickyHeight + toolbarHeight;
  let topOffsetNormalWrapper = headerNormalHeight + toolbarHeight;

  let maxOffset = Math.max(topOffsetWrapper, topOffsetNormalWrapper) + 40;

  if (window.pageYOffset < maxOffset && navbar) {
    navbar.classList.remove('gm-navbar-sticky-toggle');

    navbarWrapper.style.top = null;
    navbarWrapper.style.transform = null;

    if (navbarWrapper.getAttribute('style') === '') {
      navbarWrapper.removeAttribute('style');
    }

    recalculatePaddingsAlignCenter({options});
    dropdownCloseAll(0);
  } else if (window.pageYOffset >= stickyOffset && navbar) {
    if (
      toolbarHeight &&
      (!isMobile(options.mobileWidth) || !options.hideToolbarOnMobile) &&
      (options.header.style === 1 || options.header.style === 2) &&
      options.stickyToolbar
    ) {
      topOffsetWrapper = headerStickyHeight;
    }

    navbar.classList.add('gm-navbar-sticky-toggle');

    navbarWrapper.style.top = `-${topOffsetWrapper}px`;
    navbarWrapper.style.transform = `translateY(${headerStickyHeight + getStickyMenuOffset() + toolbarHeight}px)`;

    recalculatePaddingsAlignCenter({options});
    dropdownCloseAll(0);
  }

}

function handleFixedSticky () {
  if (window.pageYOffset > 0 && navbar) {
    navbar.classList.add('gm-navbar-sticky-toggle');
    navbarWrapper.style.transform = `translateY(${getStickyMenuOffset()}px)`;
    recalculatePaddingsAlignCenter({options});
    dropdownCloseAll(0);
  } else if (window.pageYOffset === 0 && navbar) {
    navbar.classList.remove('gm-navbar-sticky-toggle');
    navbarWrapper.style.transform = null;

    if (navbarWrapper.getAttribute('style') === '') {
      navbarWrapper.removeAttribute('style');
    }

    recalculatePaddingsAlignCenter({options});
    dropdownCloseAll(0);
  }
}

export function enableStickyNav () {
  const stickySettings = getStickySettings();

  adminbarHeight = wpAdminBar === null ? 0 : wpAdminBar.offsetHeight;

  let headerStickyHeight = isMobile(options.mobileWidth) ? options.mobileHeaderStickyHeight : options.headerHeightSticky;
  let toolbarHeight = toolbar === null ? 0 : toolbar.offsetHeight;
  let translateHeight = adminbarHeight;

  if (
    toolbarHeight &&
    (!isMobile(options.mobileWidth) || !options.hideToolbarOnMobile) &&
    (options.header.style === 1 || options.header.style === 2) &&
    options.stickyToolbar
  ) {
    translateHeight = adminbarHeight + headerStickyHeight;
  }


  if (stickySettings.type === 'slide-down' && navbar) {
    navbar.classList.add('gm-navbar-sticky');
    handleSlideDown({data: {options}});
    window.addEventListener('scroll', lodash.throttle(handleSlideDown, 50));
  } else if (stickySettings.type === 'fixed-sticky' && navbar) {
    navbar.classList.add('gm-navbar-fixed-sticky');
    navbarWrapper.style.transform = `translate3d(0,' + (${translateHeight}) + 'px,0)`;
    handleFixedSticky();
    window.addEventListener('scroll', lodash.throttle(handleFixedSticky, 50));
  }
}

export function disableStickyNav () {
  if (options.stickyHeader === 'slide-down' && navbar) {
    window.removeEventListener('scroll', handleSlideDown);
    navbar.classList.remove('gm-navbar-sticky', 'gm-navbar-sticky-toggle');
  }

  if (options.stickyHeader === 'fixed-sticky' && navbar) {
    window.removeEventListener('scroll', handleFixedSticky);
    navbar.classList.remove('gm-navbar-fixed-sticky', 'gm-navbar-sticky-toggle');
  }

  if (navbarWrapper) {
    navbarWrapper.style.transform = 'translate3d(0, 0, 0)';
  }
}

export function initStickyNav (args) {
  options = args.options;
  wpAdminBar = args.wpAdminBar;
  adminbarHeight = args.adminbarHeight;
  navbar = args.navbar;
  toolbar = args.toolbar;
  navbarWrapper = args.navbarWrapper;
}
