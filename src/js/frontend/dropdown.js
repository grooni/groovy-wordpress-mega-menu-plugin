import { DOMAnimations, getCoords } from '../shared/helpers';

export function dropdownOpen (elem, options) {
  let dropdownWrapper = elem.querySelector('.gm-dropdown-menu-wrapper');

  if (dropdownWrapper !== null) {
    var hasParentLeft = elem.closest('.gm-dropdown-menu-wrapper');
    hasParentLeft = hasParentLeft !== null && hasParentLeft.classList.contains('gm-dropdown-menu-wrapper--left');
  }
  var isVerticalNavDrawer = options.header.style !== 1;

  if (elem.classList.contains('gm-minicart') && isVerticalNavDrawer) {
    return false;
  }

  let gmMainMenu = document.querySelector('#gm-main-menu');
  if (gmMainMenu) {
    clearTimeout(gmMainMenu.getAttribute('data-timeout-close-all'));
    gmMainMenu.setAttribute('data-timeout-close-all', null);
  }

  if (dropdownWrapper !== null &&
    (getCoords(dropdownWrapper).left + dropdownWrapper.offsetWidth > document.body.clientWidth || hasParentLeft) &&
    (getCoords(dropdownWrapper).left - dropdownWrapper.offsetWidth * 2 > 0) ||
    (dropdownWrapper !== null && getCoords(dropdownWrapper).left < 0)
  ) {
    dropdownWrapper.classList.add('gm-dropdown-menu-wrapper--left');
  }

  elem.classList.add('gm-open');
  elem.classList.add('gm-opened-before');

  if (elem.closest('.gm-navigation-drawer')) {
    let elemChildren = elem.children;

    for (let el of elemChildren) {
      if (el.classList.contains('gm-dropdown-menu-wrapper')) {
        DOMAnimations.slideDown(el);
      }
    }
  }

  let gmNavbar = elem.closest('.gm-navbar');
  if (gmNavbar) {
    gmNavbar.classList.add('gm-navbar-dropdown-opened');
  }

}

export function dropdownClose (elem) {
  let descendantsOpen = elem.querySelectorAll('.gm-open');

  descendantsOpen.forEach((item) => {
    item.classList.remove('gm-open');
    let itemDropdown = item.querySelector('.gm-dropdown-menu');
    if (itemDropdown) {
      itemDropdown.style.transform = null;
    }
  });

  elem.classList.remove('gm-open');
  let currentDropdown = elem.querySelector('.gm-dropdown-menu');
  if (currentDropdown) {
    currentDropdown.style.transform = null;
  }

  if (elem.closest('.gm-navigation-drawer')) {
    let elemChildren = elem.children;

    for (let el of elemChildren) {
      if (el.classList.contains('gm-dropdown-menu-wrapper')) {
        DOMAnimations.slideUp(el);
      }
    }
  }

  let elems = document.querySelectorAll('.gm-open');
  if (elems.length < 1) {
    let gmNavbar = document.querySelector('.gm-navbar');
    if (gmNavbar) {
      gmNavbar.classList.remove('gm-navbar-dropdown-opened');
    }
  }

}

export function dropdownToggle (elem, options) {
  if (elem.classList.contains('gm-open')) {
    dropdownClose(elem);
  } else {
    if (elem.classList.contains('gm-dropdown-submenu')) {
      // close only siblings
      let elParent = elem.closest('.gm-dropdown-menu');
      let elParentChildren = elParent.children;

      for (let el of elParentChildren) {
        if (el.classList.contains('gm-open')) {
          dropdownClose(el);
        }
      }
    } else {
      // close all
      dropdownCloseAll(400);
    }

    dropdownOpen(elem, options);
  }
}

export function dropdownCloseAll (delay) {

  if (!delay) {
    delay = 0;
  }

  let gmMainMenu = document.querySelector('#gm-main-menu');

  if (gmMainMenu && delay > 0) {

    gmMainMenu.setAttribute('data-timeout-close-all', setTimeout(function () {
      dropdownCloseAllOpened(delay);
    }, delay));

  } else {

    dropdownCloseAllOpened(delay);

  }

}

function dropdownCloseAllOpened (delay) {

  let queryOpened = '.gm-open';

  if (delay > 0) {
    queryOpened = '.gm-open:not(.gm-minicart)';
  }

  let elems = document.querySelectorAll(queryOpened);

  elems.forEach((el) => {

    clearTimeout(el.getAttribute('data-timeout-open'));
    el.setAttribute('data-timeout-open', null);
    el.setAttribute('data-close', true);

    if (el.closest('.gm-navigation-drawer')) {
      let elChildren = el.children;

      for (let el of elChildren) {
        if (el.classList.contains('gm-dropdown-menu-wrapper')) {
          DOMAnimations.slideUp(el);
        }
      }
    }

    el.classList.remove('gm-open');

    let elDropdown = el.querySelector('.gm-dropdown-menu');
    if (elDropdown) {
      elDropdown.style.transform = null;
    }
  });

  let gmNavbar = document.querySelector('.gm-navbar');
  if (gmNavbar) {
    gmNavbar.classList.remove('gm-navbar-dropdown-opened');
  }

  let gmMainMenu = document.querySelector('#gm-main-menu');
  if (gmMainMenu) {
    clearTimeout(gmMainMenu.getAttribute('data-timeout-close-all'));
    gmMainMenu.setAttribute('data-timeout-close-all', null);
  }

}
