import { DOMAnimations, getCoords } from '../shared/helpers';

function dropdownOpen (elem) {
  let dropdownWrapper = elem.querySelector('.gm-dropdown-menu-wrapper');

  if (dropdownWrapper !== null) {
    var hasParentLeft = dropdownWrapper.classList.contains('gm-dropdown-menu-wrapper--left');
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
  let elemChildren = elem.children;

  elem.classList.remove('gm-open');
  let descendantsOpen = elem.querySelectorAll('.gm-open');
  descendantsOpen.forEach(function (item) {
    item.classList.remove('gm-open');
  });

  if (elem.closest('.gm-navigation-drawer')) {
    for (let el of elemChildren) {
      if (el.classList.contains('gm-dropdown-menu-wrapper')) {
        DOMAnimations.slideUp(el);
      }
    }
  }
}

export function dropdownToggle (elem) {
  if (!elem.classList.contains('gm-open')) {
    if (!elem.classList.contains('gm-dropdown-submenu')) {
      // close all
      dropdownCloseAll();
    } else {
      // close only siblings
      let elParent = elem.closest('.gm-dropdown-menu');
      let elParentChildren = elParent.children;

      for (let el of elParentChildren) {
        if (el.classList.contains('gm-open')) {
          dropdownClose(el);
        }
      }
    }
    dropdownOpen(elem);
  } else {
    dropdownClose(elem);
  }
}

export function dropdownCloseAll () {
  let elems = document.querySelectorAll('.gm-open');

  elems.forEach(function (el) {
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
