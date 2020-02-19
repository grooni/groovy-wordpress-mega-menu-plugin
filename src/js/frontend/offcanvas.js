import { isMobile, unwrapInner, wrapInner } from '../shared/helpers';
import _ from 'lodash';

var options;
var navDrawer;
var hamburgerMenu;

let offcanvasIsOpen = function (navDrawer) {
  let isOpen;
  if (navDrawer.classList.contains('gm-navigation-drawer--open')) {
    isOpen = true;
  } else {
    isOpen = false;
  }
  return isOpen;
};

function offcanvasOpen (navDrawer) {
  navDrawer.classList.remove('gm-hidden');
  navDrawer.classList.add('gm-navigation-drawer--open');
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

function offcanvasClickOutside (navDrawer) {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.gm-menu-btn')) {
      return;
    }

    if (event.target.closest('.gm-navbar-nav, .gm-navigation-drawer') === null) {
      offcanvasClose(navDrawer);
    }
  });
}

function makeHiddenVisible () {
  let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');

  if (!isMobile(options.mobileWidth)) {
    mainMenuWrapper.classList.add('d-flex');
  } else {
    mainMenuWrapper.classList.remove('d-flex');
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
  let anchors = navDrawer.querySelectorAll('.gm-anchor');

  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      if (!this.classList.contains('gm-dropdown-toggle')) {
        offcanvasClose(navDrawer);
      }
    });
  });
}

export function offcanvasSlide (navDrawer, side, slide) {
  slide = slide || false;

  if (slide) {
    wrapContent();
  }

  window.addEventListener('resize', _.debounce(() => {
    if (!isMobile(options.mobileWidth) && options.header.style !== 2 && document.querySelector('.gm-nav-content-wrapper') !== null) {
      unwrapInner('.gm-nav-content-wrapper');
    }
  }, 100));

  makeHiddenVisible();
  navDrawer.classList.add(`gm-navigation-drawer--${side}`);

  offcanvasClickOutside(navDrawer);

  window.addEventListener('resize', () => {
    offcanvasClose(navDrawer);
  }, {once: true});

  closeIfNoChildren(navDrawer);
}

export function initOffcanvas (args) {
  options = args.options;
  navDrawer = args.navDrawer;
  hamburgerMenu = args.hamburgerMenu;

  function clickEventOffcanvasToggle() {
    offcanvasToggle(navDrawer);
    return false;
  }

  hamburgerMenu.addEventListener('click', clickEventOffcanvasToggle);
}
