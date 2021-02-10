import _ from 'lodash';

var options;
var navbar;
var hamburgerMenuExpanded;

let expandingIsOpen = function (navbar) {
  let isOpen;
  if (navbar && navbar.classList.contains('gm-expanding--open')) {
    isOpen = true;
  } else {
    isOpen = false;
  }
  return isOpen;
};

function expandingOpen(navbar) {
  if (navbar) {

    navbar.classList.add('gm-expanding--open');

  }

  let miliSeconds =
    (options.sidebarExpandingMenuAnimationDuration) ? parseInt(options.sidebarExpandingMenuAnimationDuration) : 300;

  setTimeout(() => {
    navbar.classList.add('gm-animation-end');
  }, miliSeconds + 20);

  if (hamburgerMenuExpanded) {
    setTimeout(() => {
      hamburgerMenuExpanded.classList.add('is-active');
    }, miliSeconds + 20);
  }
}

function expandingClose(navbar) {

  let miliSeconds =
    (options.sidebarExpandingMenuAnimationDuration) ? parseInt(options.sidebarExpandingMenuAnimationDuration) : 300;

  if (hamburgerMenuExpanded) {
    setTimeout(() => {
      hamburgerMenuExpanded.classList.remove('is-active');
    }, miliSeconds + 20);
  }

  if (expandingIsOpen(navbar)) {
    navbar.classList.remove('gm-expanding--open');
    navbar.classList.remove('gm-animation-end');
  } else {
    return;
  }
}

function expandingToggle(navbar) {
  if (expandingIsOpen(navbar)) {
    expandingClose(navbar);
  } else {
    expandingOpen(navbar);
  }
}

function expandingClickOutside() {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.gm-menu-btn--expanded')) {
      return;
    }

    if (event.target.closest('.gm-navbar, .gm-navbar-nav, .gm-main-menu-wrapper') === null) {
      expandingClose(navbar);
    }
  });
}

function expandingClickHamburger() {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.gm-menu-btn--expanded')) {
      expandingToggle(navbar);
    }
  });
}

function transitionSidebarEvents() {
  const navbar = document.querySelector('.gm-navbar');

  if (navbar) {
    navbar.addEventListener('transitionend', handleTransitionEnd);
  }
}

function handleTransitionEnd(event) {
  if (event.propertyName !== 'width') {
    return;
  }

  if (event.target.classList.contains('gm-expanding--open')) {
    event.target.classList.add('gm-animation-end');
  } else {
    event.target.classList.remove('gm-animation-end');
  }

}

function expandingOpenMouseEvents() {
  navbar.addEventListener('mouseenter', function (event) {
    expandingOpen(navbar);
  }, false);

  navbar.addEventListener('mouseleave', function (event) {
    expandingClose(navbar);
  }, false);
}

export function expandingSidebarEvents() {
  let headerStyle = parseInt(options.header.style, 10);

  if (headerStyle !== 5) {
    return;
  }

  let hamburgerMenuExpandedType = (options.sidebarExpandingMenuCssHamburgerType) ? options.sidebarExpandingMenuCssHamburgerType : 'hamburger--squeeze';
  if (hamburgerMenuExpanded) {
    hamburgerMenuExpanded.classList.add(hamburgerMenuExpandedType);
  }

  if (options.sidebarExpandingMenuOpenOnHover) {
    expandingOpenMouseEvents();
  }

  expandingClickOutside();

  expandingClickHamburger();

  transitionSidebarEvents();

  window.addEventListener('resize', _.debounce(() => {
    expandingClose(navbar);
  }, 750));

}

export function initExpanding(args) {
  options = args.options;
  navbar = args.navbar;
  hamburgerMenuExpanded = args.hamburgerMenuExpanded;
}
