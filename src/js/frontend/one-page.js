import { getCoords } from '../shared/helpers';
import _ from 'lodash';

function getVisibleHeight (elem) {
  // Added 1px to fix the decimal offset bug on HiDPI
  let elementTop = getCoords(elem).top + 1;
  let elementBottom = elementTop + elem.offsetHeight;
  let viewportTop = window.pageYOffset;
  let viewportBottom = viewportTop + window.innerHeight;
  let isInViewport = elementBottom > viewportTop && elementTop < viewportBottom;
  if (!isInViewport) {
    return;
  }
  let visibleTop = elementTop < viewportTop
    ? viewportTop
    : elementTop;
  let visibleBottom = elementBottom > viewportBottom
    ? viewportBottom
    : elementBottom;

  return visibleBottom - visibleTop;
}

export function setCurrentItem () {
  let rowsArr = [];
  const menu = document.querySelector('.gm-navbar-nav');
  let rows = document.querySelectorAll('[id]');
  let mostVisibleRow = {};

  rows.forEach((row) => {
    let linkId = row.getAttribute('id');
    if (menu.querySelector(`.gm-anchor[href="#${linkId}"]`) === null) {
      return;
    }
    let visibleHeight = getVisibleHeight(row);
    let menuItem = menu.querySelector(`.gm-anchor[href="#${linkId}"]`)
      .closest('.gm-menu-item');

    menuItem.classList.remove('current-menu-item');
    rowsArr.push({id: linkId, visibleHeight: 0});

    if (visibleHeight > 0) {
      let index = _.findIndex(rowsArr, {id: linkId});
      rowsArr[index].visibleHeight = visibleHeight;
    }
  });

  if (rowsArr.length) {
    mostVisibleRow = rowsArr.reduce(function (prev, current) {
      return (prev.visibleHeight >= current.visibleHeight) ? prev : current;
    });
  }

  if (mostVisibleRow.visibleHeight > window.innerHeight / 2) {
    let menuItem = menu
      .querySelector(`.gm-anchor[href="#${mostVisibleRow.id}"]`)
      .closest('.gm-menu-item');

    menuItem.classList.add('current-menu-item');
  }
}

export function scrollToId () {
  let listItems = document.querySelectorAll('.gm-navbar-nav > .gm-menu-item');

  listItems.forEach((listItem) => {
    listItem.classList.remove('current-menu-item');
  });

  this.parentNode.classList.add('current-menu-item');
}
