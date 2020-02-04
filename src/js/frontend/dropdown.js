import { DOMAnimations, getCoords } from '../shared/helpers';

function dropdownOpen (elem, options) {
  let dropdownWrapper = elem.querySelector('.gm-dropdown-menu-wrapper');

  if (dropdownWrapper !== null) {
    var hasParentLeft = elem.closest('.gm-dropdown-menu-wrapper');
    hasParentLeft = hasParentLeft !== null && hasParentLeft.classList.contains('gm-dropdown-menu-wrapper--left');
  }
  var isVerticalNavDrawer =
    options.header.style === 2 ||
    options.header.style === 3 ||
    options.header.style === 4;

  if (elem.classList.contains('gm-minicart') && isVerticalNavDrawer) {
    return false;
  }

  if (dropdownWrapper !== null &&
    (getCoords(dropdownWrapper).left + dropdownWrapper.offsetWidth > document.body.clientWidth || hasParentLeft) &&
    (getCoords(dropdownWrapper).left - dropdownWrapper.offsetWidth * 2 > 0) ||
    (dropdownWrapper !== null && getCoords(dropdownWrapper).left < 0)
  ) {
    dropdownWrapper.classList.add('gm-dropdown-menu-wrapper--left');
  }

  elem.classList.add('gm-open');

  if (elem.closest('.gm-navigation-drawer')) {
    let elemChildren = elem.children;

    for (let el of elemChildren) {
      if (el.classList.contains('gm-dropdown-menu-wrapper')) {
        DOMAnimations.slideDown(el);
      }
    }
  }
}

function dropdownClose (elem) {
  let descendantsOpen = elem.querySelectorAll('.gm-open');

  descendantsOpen.forEach((item) => {
    item.classList.remove('gm-open');
  });

  elem.classList.remove('gm-open');

  if (elem.closest('.gm-navigation-drawer')) {
    let elemChildren = elem.children;

    for (let el of elemChildren) {
      if (el.classList.contains('gm-dropdown-menu-wrapper')) {
        DOMAnimations.slideUp(el);
      }
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
      dropdownCloseAll();
    }

    dropdownOpen(elem, options);
  }
}

export function dropdownCloseAll () {
  let elems = document.querySelectorAll('.gm-open');

  elems.forEach((el) => {
    if (event.target.closest('.gm-open')) {
      return;
    }

    if (el.closest('.gm-navigation-drawer')) {
      let elChildren = el.children;

      for (let el of elChildren) {
        if (el.classList.contains('gm-dropdown-menu-wrapper')) {
          DOMAnimations.slideUp(el);
        }
      }
    }

    el.classList.remove('gm-open');
  });
}
