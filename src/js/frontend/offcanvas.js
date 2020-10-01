import { getCoords, isMobile, unwrapInner, wrapInner } from '../shared/helpers';
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

function offcanvasOpen (navDrawer) {
  if (navDrawer) {
    navDrawer.classList.remove('gm-hidden');
    navDrawer.classList.add('gm-navigation-drawer--open');

    let gmNavbar = document.querySelector('.gm-navbar');
    if (gmNavbar) {
      gmNavbar.classList.add('gm-drawer--open');
    }
    if (hamburgerMenu) {
      setTimeout(() => {
        hamburgerMenu.classList.add('is-active');
      }, 300);
    }
  }
}

function offcanvasClose (navDrawer) {
  if (offcanvasIsOpen(navDrawer)) {
    navDrawer.classList.remove('gm-navigation-drawer--open');

    let gmNavbar = document.querySelector('.gm-navbar');
    if (gmNavbar) {
      gmNavbar.classList.remove('gm-drawer--open');
    }
    if (hamburgerMenu) {
      setTimeout(() => {
        hamburgerMenu.classList.remove('is-active');
      }, 300);
    }
  } else {
    return;
  }
}

function offcanvasToggle (navDrawer) {
  if (offcanvasIsOpen(navDrawer)) {
    offcanvasClose(navDrawer);
  } else {
    offcanvasOpen(navDrawer);
  }
}

function offcanvasClickOutside () {
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

function makeHiddenVisible (navDrawer) {
  let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');

  if (navDrawer && isMobile(options.mobileWidth)) {
    setTimeout(() => {
      navDrawer.classList.remove('gm-hidden');
    }, 500);
  }

  if (mainMenuWrapper) {
    if (!isMobile(options.mobileWidth)) {
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
  let offset = 0;
  if (wpAdminbarElem) {
    wpAdminbarElemHeight = Number(window.getComputedStyle(wpAdminbarElem, null)
      .height
      .replace(/\D+/g, ''));
  }
  if (gmToolbar) {
    gmToolbarHeight = Number(window.getComputedStyle(gmToolbar, null)
      .height
      .replace(/\D+/g, ''));
    offset = getCoords(gmToolbar).top - window.pageYOffset - wpAdminbarElemHeight;
    if (offset < 1) {
      if ((gmToolbarHeight + offset) < 1) {
        gmToolbarHeight = 0;
      } else {
        gmToolbarHeight = gmToolbarHeight + offset;
      }
    }
  }
  if (gmInner) {
    gmInnerHeight = Number(window.getComputedStyle(gmInner, null)
      .height
      .replace(/\D+/g, ''));
    offset = getCoords(gmInner).top - window.pageYOffset - wpAdminbarElemHeight;
    if (offset < 1) {
      if ((gmInnerHeight + offset) < 1) {
        gmInnerHeight = 0;
      } else {
        gmInnerHeight = gmInnerHeight + offset;
      }
    }
  }
  let gmBurgerHeight = Number(window.getComputedStyle(gmBurger, null)
    .height
    .replace(/\D+/g, ''));
  let gmBurgerWidth = Number(window.getComputedStyle(gmBurger, null)
    .width
    .replace(/\D+/g, ''));

  let indentPx = gmToolbarHeight + (((gmInnerHeight - gmBurgerHeight) / 2) | 0);
  indentPx = (indentPx < -4) ? 8 : indentPx;

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
        gmContainer.style.paddingLeft = (gmBurgerWidth + 30) + 'px';
      }
      if (options.mobileNavDrawerOpenType === 'offcanvasSlideRight' || options.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
        gmContainer.style.paddingRight = (gmBurgerWidth + 30) + 'px';
      }
    }
  }

}

function wrapContent () {
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

function closeIfNoChildren (navDrawer) {
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


export function offcanvasSlide() {
  let headerStyle = parseInt(options.header.style, 10);

  window.addEventListener('resize', _.debounce(() => {
    if (!isMobile(options.mobileWidth) && options.header.style !== 2 && document.querySelector('.gm-nav-content-wrapper') !== null) {
      unwrapInner('.gm-nav-content-wrapper');
    }
  }, 250));

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

  offcanvasClickOutside();

  window.addEventListener('resize', _.debounce(() => {
    makeHiddenVisible(navDrawer);
    topIndentForBurger(navDrawer);
    offcanvasClose(navDrawer);
  }, 750));

  closeIfNoChildren(navDrawer);

  window.addEventListener('scroll', _.debounce(() => {
    topIndentForBurger(navDrawer);
  }, 250));

}

export function offcanvasWrap(navDrawer, side, slide) {
  slide = slide || false;

  if (slide) {
    wrapContent();
  }

  makeHiddenVisible(navDrawer);
  topIndentForBurger(navDrawer);

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
