import PerfectScrollbar from 'perfect-scrollbar';
import {getCoords, isMobile, wrap} from '../shared/helpers';
import _ from 'lodash';

export default function initScrollbar(settings) {

  let scrollbars = [];

  let dropdownWrapper = document.querySelectorAll('.gm-dropdown-menu-wrapper > .gm-dropdown-menu');

  dropdownWrapper.forEach((elem) => {
    scrollbars.push(new PerfectScrollbar(elem, {suppressScrollX: true}));
  });


}


function getDropdownMaxHeight(currentDropdown) {
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

function getFirstDropdownRect(menuItem, settings) {
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

function getSubmenuDropdownRect(menuItem, settings) {
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