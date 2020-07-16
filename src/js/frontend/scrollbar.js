import PerfectScrollbar from 'perfect-scrollbar';
import { getCoords, isMobile } from '../shared/helpers';
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

  if (isVerticalMenu(settings)) {
    top = 0;
  }

  return ({
    top: top,
    width: width
  });
}

function isVerticalMenu (settings) {
  let verticalMenu = false;

  if (settings.header.style === 2 || settings.header.style === 3 || settings.header.style === 5) {
    verticalMenu = true;
  }

  return verticalMenu;
}

function getSubmenuDropdownRect (menuItem, settings, scrollbars) {
  let dropdownMenu = document.querySelector('.gm-dropdown-menu');
  let dropdownMenuBorderWidth = getComputedStyle(dropdownMenu)['borderTopWidth'] || 0;
  let closestdropdownMenuPs = menuItem.closest('.gm-dropdown-menu.ps');
  let psId = closestdropdownMenuPs.getAttribute('data-ps-id');
  let top = menuItem.offsetTop - parseInt(dropdownMenuBorderWidth, 10) - scrollbars[psId].lastScrollTop;

  if (top < 0) {
    top = 0;
  }

  if (isVerticalMenu(settings)) {
    top = 0;
  }

  return ({
    top: top
  });
}


// ---------------------------------------------------------------------------------------------------------------------

export default function initScrollbar (settings) {
  let dropdownMenuLinks = document.querySelectorAll('.gm-dropdown-toggle');
  let scrollbars = [];


  function handleScrollbarMouseEnter () {

    let parentMenuItem = this.closest('.gm-dropdown');

    if (!parentMenuItem) {
      return;
    }

    let currentDropdown = parentMenuItem.querySelector('.gm-dropdown-menu');

    if (!currentDropdown) {
      return;
    }


    let dropdownWrapper = parentMenuItem.querySelector('.gm-dropdown-menu-wrapper');


    // Second and next dropdown levels ---------------------------------------------------
    if (parentMenuItem.classList.contains('gm-dropdown-submenu')) {
      let subDropdownRect = getSubmenuDropdownRect(parentMenuItem, settings, scrollbars);

      parentMenuItem.style.position = 'static';

      dropdownWrapper.style.top = `${subDropdownRect.top}px`;
      dropdownWrapper.style.height = `${subDropdownRect.height}px`;

      currentDropdown.style.position = 'static';
      currentDropdown.style.maxHeight = `${getDropdownMaxHeight(currentDropdown)}px`;

      if (parentMenuItem.classList.contains('gm-has-featured-img')) {
        const image = parentMenuItem.querySelector('.attachment-menu-thumb');
        const imagePosition = getCoords(parentMenuItem);

        image.style.top = `${imagePosition.top}px`;
      }

      activatePerfectScrollbar(currentDropdown);
      currentDropdown.addEventListener('transitionend', handleTransitionEnd);

      return;
    }

    // First dropdown level --------------------------------------------------------------
    let firstDropdownRect = getFirstDropdownRect(parentMenuItem, settings);

    dropdownWrapper.style.top = `${firstDropdownRect.top}px`;
    dropdownWrapper.style.width = `${firstDropdownRect.width}px`;

    currentDropdown.style.position = 'static';
    currentDropdown.style.maxHeight = `${getDropdownMaxHeight(currentDropdown)}px`;

    activatePerfectScrollbar(currentDropdown);
    currentDropdown.addEventListener('transitionend', handleTransitionEnd);
  }

  function handleTransitionEnd (event) {
    if (event.propertyName !== 'transform') {
      return;
    }

    updateDropdownMaxHeight(this);

    let dropdown = this.closest('.gm-dropdown');

    if (dropdown && dropdown.classList.contains('gm-open')) {
      activatePerfectScrollbar(this);
    }
  }

  function updateDropdownMaxHeight (elem) {
    let dropdown = elem.closest('.gm-dropdown');

    if (dropdown.classList.contains('gm-open')) {
      elem.style.transform = 'none';
      elem.style.maxHeight = `${getDropdownMaxHeight(elem)}px`;
      elem.style.position = 'static';
    } else {
      elem.style.transform = null;
    }
  }

  function activatePerfectScrollbar (elem) {

    if (!elem) {
      return;
    }

    let isHandled = elem.classList.contains('ps');

    // Return if Perfect Scrollbar already arsing for elem.
    if (isHandled) {
      return;
    }

    // Preventing the calculation of the height of the current dropdown for all sub-dropdowns
    let childDropdowns = elem.querySelectorAll('.gm-dropdown-submenu');
    if (childDropdowns) {
      childDropdowns.forEach((dropdown) => {
        dropdown.style.position = 'static';
      });
    }

    // Init Perfect Scrollbar for elem.
    const ps = new PerfectScrollbar(elem, {
      suppressScrollX: true,
      wheelPropagation: false,
      swipeEasing: false,
      wheelSpeed: 0.5
    });

    // Save the index of the scrollbar object for further manipulation.
    elem.setAttribute('data-ps-id', scrollbars.length);

    // Save scrollbar object to array.
    scrollbars.push(ps);
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
