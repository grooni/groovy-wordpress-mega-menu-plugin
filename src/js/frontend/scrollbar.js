import PerfectScrollbar from 'perfect-scrollbar';
import { getCoords, isMobile, wrap } from '../shared/helpers';
import _ from 'lodash';

function getDropdownMaxHeight (currentDropdown) {
  let windowHeight = window.innerHeight;
  let topOffset = getCoords(currentDropdown).top;
  let topViewportOffset = topOffset - window.pageYOffset;
  let transformValuesCss = getComputedStyle(document.querySelector('.gm-dropdown-menu'))['transform'];
  let transformValues = transformValuesCss
    .replace(/[^0-9\-.,]/g, '')
    .split(',');
  let dropdownMenuTranslateY = Number(transformValues[5]) || 0;
  let getDropdownMaxHeightValue = windowHeight - topViewportOffset + dropdownMenuTranslateY;

  return getDropdownMaxHeightValue;
}

function getFirstDropdownRect (menuItem, settings) {
  let currentDropdown = menuItem.querySelector('.gm-dropdown-menu');
  let currentDropdownWidth = currentDropdown.offsetWidth;
  let top = menuItem.offsetHeight;
  let width = currentDropdownWidth;

  if (settings.header.style === 2 || settings.header.style === 3 || settings.header.style === 5) {
    top = 0;
  }

  return ({
    top: top,
    width: width
  });
}

function getSubmenuDropdownRect (menuItem, settings) {
  let dropdownMenu = document.querySelector('.gm-dropdown-menu');
  let dropdownMenuBorderWidth = getComputedStyle(dropdownMenu)['borderTopWidth'] || 0;
  let top = menuItem.offsetTop - parseInt(dropdownMenuBorderWidth, 10);

  if (settings.header.style === 2 || settings.header.style === 3 || settings.header.style === 5) {
    top = 0;
  }

  return ({
    top: top
  });
}

export default function initScrollbar (settings) {
  let dropdownMenuLists = document.querySelectorAll('.gm-main-menu-wrapper .gm-dropdown-menu:not(.gm-minicart-dropdown)');
  let dropdownMenuLinks = document.querySelectorAll('.gm-dropdown-toggle');
  let isScrollbarEnabled = false;
  let scrollbars = [];


  function handleScrollbarMouseEnter () {
    let menuItem = this.closest('.gm-dropdown');
    let currentDropdown = menuItem.querySelector('.gm-dropdown-menu');
    let firstDropdownRect = getFirstDropdownRect(menuItem, settings);
    let currentDropdownWidth = firstDropdownRect.width;
    let dropdownWrapper = menuItem.querySelector('.gm-dropdown-menu-wrapper');

    if (menuItem.classList.contains('gm-dropdown-submenu')) {
      menuItem.style.position = 'static';
      dropdownWrapper.style.top = `${getSubmenuDropdownRect(menuItem, settings).top}px`;
      currentDropdown.style.maxHeight = `${getDropdownMaxHeight(currentDropdown)}px`;

      if (menuItem.classList.contains('gm-has-featured-img')) {
        const image = menuItem.querySelector('.attachment-menu-thumb');
        const imagePosition = getCoords(menuItem);

        image.style.top = `${imagePosition.top}px`;
      }
    }

    currentDropdown.style.position = 'static';
    currentDropdown.style.transform = 'none';
    currentDropdown.style.maxHeight = `${getDropdownMaxHeight(this)}px`;
    currentDropdown.addEventListener('transitionend', handleTransitionEnd);
  }

  function handleTransitionEnd (event) {
    if (event.propertyName !== 'transform') {
      return;
    }

    let dropdown = this.closest('.gm-dropdown');
    let gmWrapper = document.querySelector('.gm-wrapper');

    if (dropdown.classList.contains('gm-open')) {
      this.style.transform = 'none';
      this.style.maxHeight = `${getDropdownMaxHeight(this)}px`;
      const ps = new PerfectScrollbar(this, {
        suppressScrollX: true
      });
      scrollbars.push(ps);
      // this.style.position = 'static';
    } else {
      this.style.transform = null;
    }
  }

  function handleScrollbarMouseLeave () {
    let menuItem = this.closest('.gm-dropdown');
    let currentDropdown = menuItem.querySelector('.gm-dropdown-menu');

    currentDropdown.style.display = null;
    currentDropdown.style.transform = null;
  }

  function enableScrollbar () {
    if (isMobile(settings.mobileWidth)) {
      return;
    }

    dropdownMenuLinks.forEach((link) => {
      link.addEventListener('mouseenter', handleScrollbarMouseEnter);
      link.addEventListener('mouseleave', handleScrollbarMouseLeave);
    });
  }

  function disableScrollbar () {
    // ..
  }

  function handleResize () {
    if (window.gmIsResizeOnlyHorisontal) {
      return;
    }

    if (isMobile(settings.mobileWidth)) {
      disableScrollbar();
    }

    if (!isMobile(settings.mobileWidth)) {
      enableScrollbar();
    }
  }

  enableScrollbar();
  window.addEventListener('resize', _.throttle(handleResize, 100));
}
