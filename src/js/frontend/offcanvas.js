import {getCoords, isMobile, unwrapInner, wrapInner} from '../shared/helpers';
import _ from 'lodash';
import {setCurrentItem} from './one-page';
import {initPaddingsAlignCenter} from './split';

var options;
var navDrawer;
var mainMenuWrapper;
var hamburgerMenu;

let offcanvasIsOpen = function (navDrawer) {
  let isOpen;
  if (navDrawer && navDrawer.classList.contains('gm-navigation-drawer--open')) {
    isOpen = true;
  } else {
    isOpen = false;
  }
  return isOpen;
};

function offcanvasOpen(navDrawer) {
  if (navDrawer) {
    navDrawer.classList.remove('gm-hidden');
    navDrawer.classList.add('gm-navigation-drawer--open');

    setTimeout(() => {
      navDrawer.classList.add('gm-navigation-drawer--delay');
    }, 420);

    let gmNavbar = document.querySelector('.gm-navbar');
    if (gmNavbar) {
      gmNavbar.classList.add('gm-drawer--open');
    }
    if (hamburgerMenu) {
      setTimeout(() => {
        hamburgerMenu.classList.add('is-active');
      }, 450);
    }
  }
}

function offcanvasClose(navDrawer) {
  if (offcanvasIsOpen(navDrawer)) {
    navDrawer.classList.remove('gm-navigation-drawer--open');

    setTimeout(() => {
      navDrawer.classList.remove('gm-navigation-drawer--delay');
    }, 420);

    let gmNavbar = document.querySelector('.gm-navbar');
    if (gmNavbar) {
      gmNavbar.classList.remove('gm-drawer--open');
    }
    if (hamburgerMenu) {
      setTimeout(() => {
        hamburgerMenu.classList.remove('is-active');
      }, 450);
    }
  } else {
    return;
  }
}

function offcanvasToggle(navDrawer) {
  if (offcanvasIsOpen(navDrawer)) {
    offcanvasClose(navDrawer);
  } else {
    offcanvasOpen(navDrawer);
  }
}

function offcanvasClickOutside() {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.gm-menu-btn')) {
      return;
    }

    if (event.target.closest('.gm-navbar-nav, .gm-navigation-drawer, .gm-main-menu-wrapper, .gm-burger, .gm-custom-hamburger') === null) {
      offcanvasClose(mainMenuWrapper);
      offcanvasClose(navDrawer);
    }
  });
}

function makeHiddenVisible(navDrawer) {
  let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');
  let isMobileFlag = isMobile(options.mobileWidth);

  if (navDrawer && navDrawer.classList.contains('gm-hidden') && isMobileFlag) {
    setTimeout(() => {
      navDrawer.classList.remove('gm-hidden');
    }, 100);
  }

  if (mainMenuWrapper) {
    if (!isMobileFlag) {
      mainMenuWrapper.classList.add('d-flex');
    } else {
      mainMenuWrapper.classList.remove('d-flex');
    }
  }
}

function topIndentForBurger(navDrawer) {
  if (!navDrawer || !isMobile(options.mobileWidth)) {
    // Remove Margin for actions wrapper.
    let gmContainer = document.querySelector('.gm-navbar .gm-inner .gm-container');
    if (gmContainer) {
      gmContainer.style.paddingLeft = null;
      gmContainer.style.paddingRight = null;
    }

    return;
  }
  let gmBurger = navDrawer.querySelector('.gm-burger');
  if (!gmBurger) {
    return;
  }
  let gmNavbar = document.querySelector('.gm-navbar');
  if (!gmNavbar) {
    return;
  }

  let gmToolbar = gmNavbar.querySelector('.gm-wrapper > .gm-toolbar');
  let gmInner = gmNavbar.querySelector('.gm-wrapper > .gm-inner');
  let wpAdminbarElem = document.querySelector('#wpadminbar');

  let gmToolbarHeight = 0;
  let gmInnerHeight = 0;
  let wpAdminbarElemHeight = 0;
  let gmBurgerHeight = 0;
  let gmBurgerPaddings = 0;
  let offset = 0;

  if (wpAdminbarElem) {
    wpAdminbarElemHeight = parseInt(window.getComputedStyle(wpAdminbarElem, null).height);
    wpAdminbarElemHeight = (!wpAdminbarElemHeight) ? 0 : wpAdminbarElemHeight;
  }
  if (gmToolbar) {
    gmToolbarHeight = parseInt(window.getComputedStyle(gmToolbar, null).height);
    gmToolbarHeight = (!gmToolbarHeight) ? 0 : gmToolbarHeight;
    let offsetToolbar = getCoords(gmToolbar).top - window.pageYOffset - wpAdminbarElemHeight;
    if (offsetToolbar < 1) {
      if ((gmToolbarHeight + offsetToolbar) < 1) {
        gmToolbarHeight = 0;
      } else {
        gmToolbarHeight = gmToolbarHeight + offsetToolbar;
      }
    }
  }

  if (gmInner) {
    gmInnerHeight = parseInt(window.getComputedStyle(gmInner, null).height);
    gmInnerHeight = (!gmInnerHeight) ? 20 : gmInnerHeight;
    offset = getCoords(gmInner).top - window.pageYOffset - wpAdminbarElemHeight;

    if (offset < 1) {
      if (options.mobileIndependentCssHamburgerFloat) {
        if ((gmInnerHeight + offset) < (0 - gmInnerHeight)) {
          gmInnerHeight = 0;
        } else {
          gmInnerHeight = gmInnerHeight + offset;
        }
      } else {
        if ((gmInnerHeight + offset) < (0 - gmInnerHeight)) {
          gmInnerHeight = 0;
        }
      }
    }
  }

  let gmBurgerHeightWrapper = parseInt(window.getComputedStyle(gmBurger, null).height);
  gmBurgerHeightWrapper = (!gmBurgerHeightWrapper) ? 20 : gmBurgerHeightWrapper;
  let gmBurgerWidth = parseInt(window.getComputedStyle(gmBurger, null).width);
  gmBurgerWidth = (!gmBurgerWidth) ? 20 : gmBurgerWidth;

  gmBurgerHeight = (gmBurgerHeightWrapper < 8 || !gmBurgerHeightWrapper) ? 8 : gmBurgerHeightWrapper;

  gmBurgerPaddings = (options.hamburgerIconPaddingMobile) ? (options.hamburgerIconPaddingMobile * 2) : 0;
  gmBurgerPaddings = (options.hamburgerIconMobileBorderWidth) ? (options.hamburgerIconMobileBorderWidth * 2) + gmBurgerPaddings : gmBurgerPaddings;
  if (gmBurgerPaddings > 0) {
    gmBurgerHeight = gmBurgerHeight - gmBurgerPaddings;
  }

  if (gmBurgerHeight < 8) {
    gmBurgerHeight = gmBurgerHeightWrapper;
  }

  let indentPx = gmToolbarHeight + (((gmInnerHeight - gmBurgerHeight) / 2) | 0);

  if (options.mobileIndependentCssHamburgerFloat) {
    if (offset < (0 - gmBurgerHeightWrapper)) {
      indentPx = 8;
      gmBurger.classList.add('gm-burger--float');
    } else {
      gmBurger.classList.remove('gm-burger--float');
    }
  } else {
    if (offset < 0) {
      indentPx = indentPx + offset;
    }
  }

  if (gmBurgerPaddings > 0) {
    indentPx = indentPx - ((gmBurgerPaddings / 2) | 0);
  }

  if (indentPx > window.innerHeight) {
    setTimeout(() => {
      topIndentForBurger(navDrawer);
    }, 504);
  } else {
    // Set margin for burger.
    gmBurger.style.marginTop = indentPx + 'px';

    // Margin for menu container (indent for burger).
    let gmContainer = document.querySelector('.gm-navbar .gm-inner .gm-container');
    if (gmContainer) {
      if (options.mobileNavDrawerOpenType === 'offcanvasSlideLeft' || options.mobileNavDrawerOpenType === 'offcanvasSlideSlide') {
        gmContainer.style.paddingLeft = (gmBurgerWidth + 8) + 'px';
      }
      if (options.mobileNavDrawerOpenType === 'offcanvasSlideRight' || options.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
        gmContainer.style.paddingRight = (gmBurgerWidth + 8) + 'px';
      }
    }
  }

}

function wrapContent() {
  let gmNavbar = document.querySelector('.gm-navbar');
  let navDrawer = document.querySelector('.gm-navigation-drawer');
  let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');
  let contentWrapper = document.querySelector('.gm-nav-content-wrapper');
  let wpAdminBar = document.querySelector('#wpadminbar');

  if (document.querySelector('.gm-nav-content-wrapper') !== null) {
    return;
  }

  if (!contentWrapper) {
    wrapInner(document.body, 'div', 'class', 'gm-nav-content-wrapper');
  }

  document.body.prepend(navDrawer);

  if (options.header.style === 2) {
    document.body.prepend(mainMenuWrapper);
  }

  document.body.prepend(gmNavbar);

  if (wpAdminBar !== null) {
    document.body.prepend(wpAdminBar);
  }
}

function closeIfNoChildren(navDrawer) {
  if (!navDrawer) {
    return;
  }

  let anchors = navDrawer.querySelectorAll('.gm-anchor');

  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      if (!this.classList.contains('gm-dropdown-toggle')) {
        offcanvasClose(navDrawer);
      }
    });
  });
}


function forceLogoCentering() {
  if (!options.forceLogoCenteringMobile || options.mobileLogoPosition !== 'center' || options.mobileSideIconPosition === 'left') {
    return false;
  }

  let gmLogo = document.querySelector('.gm-navbar .gm-logo > a');

  if (!gmLogo) {
    return null;
  }

  let isMobileFlag = isMobile(options.mobileWidth);

  if (!isMobileFlag) {
    gmLogo.style.marginLeft = null;
    return false;
  }


  let gmActions = document.querySelector('.gm-navbar .gm-menu-actions-wrapper');
  let gmBurger = document.querySelector('.gm-navigation-drawer .gm-burger');
  let indentPixels = 0;

  if (gmBurger) {
    indentPixels += 10;
  }

  if (gmActions) {
    let gmContainer = document.querySelector('.gm-navbar .gm-container');
    indentPixels = Math.floor(gmActions.offsetWidth / 2) + indentPixels + 32;
    if (gmContainer && indentPixels > 0 && indentPixels < Math.floor(gmContainer.clientWidth / 2)) {
      gmLogo.style.marginLeft = `${indentPixels}px`;
    }
  }

}


export function offcanvasSlide() {
  let headerStyle = parseInt(options.header.style, 10);

  window.addEventListener('resize', _.debounce(() => {
    if (!isMobile(options.mobileWidth) && options.header.style !== 2 && document.querySelector('.gm-nav-content-wrapper') !== null) {
      unwrapInner('.gm-nav-content-wrapper');
    }
  }, 310));

  function clickHandler() {
    if (!isMobile(options.mobileWidth) && headerStyle === 2) {
      offcanvasToggle(mainMenuWrapper);
    } else {
      offcanvasToggle(navDrawer);
    }
  }

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', clickHandler);
  }

  // Close button event for Fullscreen minimalistic type.
  if (2 === headerStyle && options.minimalisticMenuFullscreen) {
    let fullscreenCloseButton = document.querySelector('.gm-fullscreen-close');
    if (fullscreenCloseButton) {
      fullscreenCloseButton.addEventListener('click', clickHandler);
    }
  }

  if (isMobile(options.mobileWidth) && options.mobilePreventAutoclose) {
    // do nothing ...
  } else {
    offcanvasClickOutside();
  }

  window.addEventListener('resize', _.debounce(() => {
    makeHiddenVisible(navDrawer);
    topIndentForBurger(navDrawer);

    if (isMobile(options.mobileWidth) && options.mobilePreventAutoclose) {
      // do nothing ...
    } else {
      offcanvasClose(navDrawer);
    }

    forceLogoCentering();
  }, 310));

  closeIfNoChildren(navDrawer);

  window.addEventListener('scroll', _.debounce(() => {
    topIndentForBurger(navDrawer);
    forceLogoCentering();
  }, 200));

}

export function offcanvasWrap(navDrawer, side, slide) {
  slide = slide || false;

  if (slide) {
    wrapContent();
  }

  makeHiddenVisible(navDrawer);
  topIndentForBurger(navDrawer);
  forceLogoCentering();

  setTimeout(() => {
    topIndentForBurger(navDrawer);
  }, 180);

  if (navDrawer) {
    navDrawer.classList.add(`gm-navigation-drawer--${side}`);
  }
}

export function initOffcanvas(args) {
  options = args.options;
  navDrawer = args.navDrawer;
  mainMenuWrapper = args.mainMenuWrapper;
  hamburgerMenu = args.hamburgerMenu;
}
