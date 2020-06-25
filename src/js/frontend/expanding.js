import _ from 'lodash';

var options;
var navbar;
var hamburgerMenu;

let expandingIsOpen = function (navbar) {
  let isOpen;
  if (navbar && (navbar.classList.contains('gm-expanding--open') || navbar.classList.contains('gm-expanding--hold'))) {
    isOpen = true;
  } else {
    isOpen = false;
  }
  return isOpen;
};

function expandingOpen(navbar) {
  if (navbar) {
    if (options.sidebarExpandingMenuOpenOnHover) {
      navbar.classList.add('gm-expanding--open');
    } else {
      navbar.classList.add('gm-expanding--hold');
    }
  }
}

function expandingClose(navbar) {
  if (expandingIsOpen(navbar)) {
    navbar.classList.remove('gm-expanding--hold');
    navbar.classList.remove('gm-expanding--open');
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
    if (event.target.closest('.gm-menu-btn')) {
      return;
    }

    if (event.target.closest('.gm-navbar, .gm-navbar-nav, .gm-main-menu-wrapper') === null) {
      expandingClose(navbar);
    }
  });
}

function expandingOpenMouseEvents() {
  navbar.addEventListener('mouseenter', function (event) {
    expandingToggle(navbar);
  }, false);

  navbar.addEventListener('mouseleave', function (event) {
    expandingToggle(navbar);
  }, false);
}

export function expandingSidebarEvents() {
  let headerStyle = parseInt(options.header.style, 10);

  if (headerStyle !== 5) {
    return;
  }

  expandingOpenMouseEvents();

  expandingClickOutside();

  window.addEventListener('resize', _.debounce(() => {
    expandingClose(navbar);
  }, 750));

}

export function initExpanding(args) {
  options = args.options;
  navbar = args.navbar;
  hamburgerMenu = args.hamburgerMenu;
}
