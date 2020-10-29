export function isRtl() {
  return document.documentElement.getAttribute('dir') === 'rtl';
}

export function isMobile(mobileWidth) {
  return window.matchMedia(`(max-width: ${mobileWidth}px)`).matches;
}

export function isTargetScrollbar(target) {
  const isScrollRail = target.classList.contains('ps__rail-y');
  const isScrollThumb = target.classList.contains('ps__thumb-y');

  return isScrollRail || isScrollThumb;
}

export function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

// helper function, analog of jQuery wrapInner
export function wrapInner(parent, wrapper, attribute, attributevalue) {
  if (typeof wrapper === 'string') {
    wrapper = document.createElement(wrapper);
  }
  parent.appendChild(wrapper)
    .setAttribute(attribute, attributevalue);

  while (parent.firstChild !== wrapper) {
    wrapper.appendChild(parent.firstChild);
  }
}

// helper function, analog of jQuery unwrap
export function unwrapInner(selector) {
  let el = document.querySelector(selector);
  let parent = el.parentNode;

  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

export function wrap(context, query, tag, attribute, attributevalue) {
  context.querySelectorAll(query)
    .forEach(elem => {
      const div = document.createElement(tag);
      div.setAttribute(attribute, attributevalue);
      elem.parentElement.insertBefore(div, elem);
      div.appendChild(elem);
    });
}

export class DOMAnimations {
  /*
    * Mask an item with a fallback effect
  * @param {HTMLElement} element
  * @param {Number} duration
  * @returns {Promise <boolean>}
  */
  static slideUp(element, duration = 300) {
    return new Promise(function (resolve, reject) {
      element.style.height = element.offsetHeight + 'px';
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + 'ms';
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      element.style.overflow = 'hidden';
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';

      window.setTimeout(function () {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
        resolve(false);
      }, duration);
    });
  }

  /*
  * Displays an element with an unfolding effect
  * @param {HTMLElement} element
  * @param {Number} duration
  * @returns {Promise <boolean>}
  */
  static slideDown(element, duration = 300) {
    return new Promise(function (resolve, reject) {
      element.style.removeProperty('display');
      let display = window.getComputedStyle(element).display;
      if (display === 'none') {
        display = 'block';
      }
      element.style.display = display;
      let height = element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + 'ms';
      element.style.height = height + 'px';
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');

      window.setTimeout(function () {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
      }, duration);
    });
  }

  /*
  * Show or hide an item with a fallback effect
  * @param {HTMLElement} element
  * @param {Number} duration
  * @returns {Promise <boolean>}
  */
  static slideToggle(element, duration = 300) {
    if (window.getComputedStyle(element).display === 'none') {
      return this.slideDown(element, duration);
    } else {
      return this.slideUp(element, duration);
    }
  }
}

export default function fixMenuCloseOnIOS() {

  let iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  let config = {attributes: true};
  let target = document.querySelector('.gm-navigation-drawer');
  let body = document.body;

  if (!target) {
    return;
  }
  let observer = new MutationObserver(function () {
    if (!iOS) {
      return;
    }

    if (target.classList.contains('gm-navigation-drawer--open')) {
      body.style.cursor = 'pointer';
    } else {
      body.style.cursor = '';
    }
  });

  observer.observe(target, config);
}

export function getAllUrlParams(url) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};

  if (queryString) {

    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('=');
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*]/, function (v) {
        paramNum = v.slice(1, -1);
        return '';
      });
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(paramValue);
        } else {
          obj[paramName][paramNum] = paramValue;
        }
      } else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}


export function getElemParents(node, selector) {

  let current = node,
    list = [];

  while (current.parentNode != null && current.parentNode !== document.documentElement) {

    if (current.parentNode.classList.contains(selector)) {
      list.push(current.parentNode);
    }

    current = current.parentNode;
  }

  return list;
}

export function getPageWidth() {
  return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : 0;
}

export function getPageHeight() {
  return window.innerHeight != null ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ? document.body.clientHeight : 0;
}
