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
  const menu = document.querySelector('.gm-main-menu-wrapper');

  if (!menu) {
    return;
  }

  let rowsArr = [];
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

  if (mostVisibleRow.visibleHeight) {
    let menuItem = menu
      .querySelector(`.gm-anchor[href="#${mostVisibleRow.id}"]`)
      .closest('.gm-menu-item');

    menuItem.classList.add('current-menu-item');
  }
}


export function scrollToId(e, scroll, url, scrollOptions) {

  if (url.indexOf('#') === -1) {
    return;
  }

  let hash = '#' + url.split('#')[1];
  let divWithId = document.querySelector(hash);
  let scrollOffset = scrollOptions.scrollOffset;

  if (divWithId) {

    let elemWindowOffset = divWithId.getBoundingClientRect().top;
    let wpadminbarElem = document.getElementById('wpadminbar');

    if (wpadminbarElem && wpadminbarElem.clientHeight) {
      scrollOffset = scrollOffset + wpadminbarElem.clientHeight;
    }

    let elemScrollOffsetDelta = elemWindowOffset - scrollOffset;

    if (Math.abs(elemScrollOffsetDelta) > scrollOffset) {
      scroll.animateScroll(divWithId, 0, scrollOptions);
    } else {
      if (e) {
        e.preventDefault();
      }
      scroll.cancelScroll();
    }

  }

}
