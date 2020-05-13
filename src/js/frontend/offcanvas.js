import { isMobile, unwrapInner, wrapInner } from '../shared/helpers';
import _ from 'lodash';

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
  }
}

function offcanvasClose (navDrawer) {
  if (offcanvasIsOpen(navDrawer)) {
    navDrawer.classList.remove('gm-navigation-drawer--open');
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

    if (event.target.closest('.gm-navbar-nav, .gm-navigation-drawer, .gm-main-menu-wrapper') === null) {
      offcanvasClose(mainMenuWrapper);
      offcanvasClose(navDrawer);
    }
  });
}

function makeHiddenVisible () {
  let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');

  if (mainMenuWrapper) {
    if (!isMobile(options.mobileWidth)) {
      mainMenuWrapper.classList.add('d-flex');
    } else {
      mainMenuWrapper.classList.remove('d-flex');
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
    makeHiddenVisible();
    offcanvasClose(navDrawer);
  }, 750));

  closeIfNoChildren(navDrawer);
}

export function offcanvasWrap(navDrawer, side, slide) {
  slide = slide || false;

  if (slide) {
    wrapContent();
  }

  makeHiddenVisible();
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
