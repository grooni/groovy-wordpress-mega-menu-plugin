/**
 * Groovy menu plugin
 */

import GmStyles from '../shared/styles';
import _ from 'lodash';
import fixMenuCloseOnIOS, {
  isMobile as isMobileHelper,
  isRtl,
  isTargetScrollbar,
  getElemParents
} from '../shared/helpers';
import { scrollToId, setCurrentItem } from './one-page';

import { initPaddingsAlignCenter, splitMenu } from './split';
import { disableStickyNav, enableStickyNav, initStickyNav } from './sticky';
import { initOffcanvas, offcanvasSlide, offcanvasWrap } from './offcanvas';
import { initExpanding, expandingSidebarEvents } from './expanding';
import { initMenuThumbnails } from './thumbnails';

import SmoothScroll from 'smooth-scroll';
import {
  dropdownCloseAll,
  dropdownToggle,
  dropdownOpen,
  dropdownClose
} from './dropdown';
import { overlapMenu } from './overlap';
import { reinsertCompiledStyles } from './save-styles';

class GroovyMenu {
  constructor (selector, options) {
    this.selector = document.querySelector(`${this.selector}`);
    this.options = options;
  }

  init () {
    let options = this.options;

    let gmStyles = new GmStyles(options);
    let cssGenerated = gmStyles.get();
    const body = document.body;
    const wpAdminBar = document.querySelector('#wpadminbar');
    let navbarSearchContainer = document.querySelector('.gm-search__fullscreen-container');

    let navbar = document.querySelector('.gm-navbar');
    let navDrawer = document.querySelector('.gm-navigation-drawer');

    let hamburgerMenu = document.querySelector('.gm-menu-btn');
    let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');
    let toolbar = document.querySelector('.gm-toolbar');
    let navbarWrapper = document.querySelector('.gm-wrapper');
    let gmSearch = document.querySelectorAll('.gm-search');
    let gmSearchClose = document.querySelector('.gm-search__close');

    let adminbarHeight = wpAdminBar === null ? 0 : wpAdminBar.offsetHeight;

    const isPreview = body.classList.contains('gm-preview-body');

    let scrollOptions = {
      speed: 300,
      offset() {
        if (options.stickyHeader !== undefined && options.stickyHeader !== 'disable-sticky-header') {
          return isMobile() ? options.mobileHeaderStickyHeight : options.headerHeightSticky;
        } else {
          return 0;
        }

      },
      updateURL: false,
    };
    let linksWithHashes = document.querySelectorAll('.menu-item > a[href^="#"]:not([href="#"])');
    let linkWithHash = document.querySelector('.menu-item > a[href^="#"]:not([href="#"])');

    let scroll = new SmoothScroll('.gm-navbar-nav a[href^="#"]:not([href="#"])', scrollOptions);
    let headerStyle = parseInt(options.header.style, 10);
    const direction = isRtl() ? 'rtl' : 'ltr';
    let isTouchDevice = 'ontouchstart' in document.documentElement;

    fixMenuCloseOnIOS();

    // Check if window width less options.mobileWidth
    function isMobile () {
      return isMobileHelper(options.mobileWidth);
    }

    // Init split menu
    if (headerStyle === 1 && options.header.align === 'center') {
      splitMenu();
    }

    // Header types
    if (headerStyle === 1) {
      let gmNavInlineDivider = document.querySelector('.gm-nav-inline-divider');

      if (gmNavInlineDivider !== null) {
        options.showDivider ?
          gmNavInlineDivider.classList.remove('gm-d-none') :
          gmNavInlineDivider.classList.add('gm-d-none');
      }
    }

    if (options.hideDropdownBg) {
      let dropdownMenus = document.querySelectorAll('.gm-dropdown-menu');

      dropdownMenus.forEach((el) => {
        el.style.backgroundImage = null;
      });
    }

    if (headerStyle === 1 || headerStyle === 2) {
      overlapMenu(options);
    }

    if (navbar) {
      if (navbar.classList.contains('gm-no-compiled-css') || isPreview) {
        gmStyles.addToHeader(cssGenerated);
      }

      if (!isPreview) {
        if (navbar.classList.contains('gm-no-compiled-css')
          || options.version !== navbar.getAttribute('data-version')) {
          gmStyles.addToHeader(cssGenerated);
          reinsertCompiledStyles(gmStyles, options, cssGenerated);
        }
      }
    }

    document.addEventListener('click', (e) => {
      if (isTargetScrollbar(e.target)
        || e.target.closest('.gm-open')) {
        return;
      }

      if (document.querySelector('.gm-open') !== null && !e.target.closest('.gm-dropdown')) {
        dropdownCloseAll();
      }
    });


    let initDropdownAction = (e) => {
      let delay = 210;
      let closestDropdown = e.target.closest('.gm-dropdown');
      let dropdownMenus = document.querySelectorAll('.gm-dropdown');
      let hasOpenedElems = false;

      if (e.target.closest('.gm-minicart') && e.type === 'click') {
        if (headerStyle !== 1 || isMobile()) {
          window.location = document.querySelector('.gm-minicart-link')
            .getAttribute('href');
          e.stopPropagation();
          return false;
        }

        e.preventDefault();
        dropdownToggle(closestDropdown, options);
        return false;
      }

      if (e.target.closest('.gm-caret')) {
        e.preventDefault();
        e.stopPropagation();
        dropdownToggle(closestDropdown, options);
        return false;
      }

      if (dropdownMenus.length > 0) {
        dropdownMenus.forEach((el) => {
          clearTimeout(el.getAttribute('data-timeout-open'));
          if (el.classList.contains('gm-open')) {
            hasOpenedElems = true;
          }
        });
      }


      if (closestDropdown) {

        if (!hasOpenedElems) {
          delay = 0;
        }

        let openParents = getElemParents(closestDropdown, 'gm-open');
        if (openParents.length > 0) {
          openParents.forEach((el) => {
            el.setAttribute('data-close', false);
            clearTimeout(el.getAttribute('data-timeout-close'));
            el.setAttribute('data-timeout-close', null);
          });
        }

        // Don't open on hover search and minicart dropdown
        if (closestDropdown.classList.contains('gm-search') ||
          closestDropdown.classList.contains('gm-minicart')) {
          return false;
        }

        closestDropdown.setAttribute('data-close', false);

        // smooth switching between adjacent dropdowns
        closestDropdown.setAttribute('data-timeout-open', setTimeout(function () {

          if (closestDropdown.querySelectorAll('.gm-open').length === 0) {

            // Close woocommerce cart and search dropdowns.
            let cartElements = document.querySelectorAll('.gm-search.gm-open, .gm-minicart.gm-open');
            if (cartElements.length > 0) {
              cartElements.forEach((el) => {
                dropdownClose(el);
              });
            }

            // Collect all parents opened dropdowns and prevent close it.
            let parentsIds = [closestDropdown.id];
            if (openParents.length > 0) {
              openParents.forEach((el) => {
                parentsIds.push(el.id);
                el.setAttribute('data-close', false);
                clearTimeout(el.getAttribute('data-timeout-close'));
                el.setAttribute('data-timeout-close', null);
              });
            }

            dropdownOpen(closestDropdown, options);

            // Close all not parents dropdowns.
            if (dropdownMenus.length > 0) {
              dropdownMenus.forEach((el) => {
                if (parentsIds.indexOf(el.id) === -1) {
                  dropdownClose(el);
                }
              });
            }

          } else { // menu item without children dropdown. Just close all others opened dropdown.

            // Collect all parents opened dropdowns and prevent close it.
            let parentsIds = [closestDropdown.id];
            if (openParents.length > 0) {
              openParents.forEach((el) => {
                parentsIds.push(el.id);
                el.setAttribute('data-close', false);
                clearTimeout(el.getAttribute('data-timeout-close'));
                el.setAttribute('data-timeout-close', null);
              });
            }

            // Close all not parents dropdowns.
            if (dropdownMenus.length > 0) {
              dropdownMenus.forEach((el) => {
                if (parentsIds.indexOf(el.id) === -1) {
                  dropdownClose(el);
                }
              });
            }
          }

        }, delay));

      } else { // apparently this is the top level menu without dropdown.
        // Close all dropdowns.
        dropdownCloseAll();
      }
    };


    let leaveDropdownAction = (e) => {

      let closestDropdown = e.target.closest('.gm-dropdown');

      // parent dropdown not exist.
      if (!closestDropdown) {
        return;
      }

      // exclude first level of the nav menu.
      if (!closestDropdown.classList.contains('gm-dropdown-submenu')) {
        return;
      }

      // parent dropdown is open.
      if (closestDropdown.classList.contains('gm-open')) {
        return;
      }

      let delay = 230;

      // disable for search and WooCommerce buttons.
      if (closestDropdown.classList.contains('gm-search')
        || closestDropdown.classList.contains('gm-minicart')) {
        return;
      }

      closestDropdown.setAttribute('data-close', true);

      // smooth switching between adjacent dropdowns
      closestDropdown.setAttribute('data-timeout-close', setTimeout(function () {
        if (closestDropdown.getAttribute('data-close')) {
          dropdownClose(closestDropdown);
        }
      }, delay));
    };

    let dropdownItems = document.querySelectorAll('.gm-anchor, .gm-minicart-link');
    let navbarNav = document.querySelector('.gm-navbar-nav');

    if (options.showSubmenu === 'hover' && !isMobile() && dropdownItems) {
      dropdownItems.forEach((dropdownItem) => {
        if (isTouchDevice) {
          dropdownItem.addEventListener('click', initDropdownAction);
        } else {
          dropdownItem.addEventListener('click', initDropdownAction);
          dropdownItem.addEventListener('mouseenter', initDropdownAction);
          dropdownItem.addEventListener('mouseleave', leaveDropdownAction);
        }
      });

      if (!isTouchDevice && navbarNav) {
        navbarNav.addEventListener('mouseleave', dropdownCloseAll);
      }
    }

    if (options.showSubmenu === 'click' || isMobile()) {
      dropdownItems.forEach((dropdownItem) => {
        dropdownItem.addEventListener('click', initDropdownAction);
      });
    }

    if (options.stickyHeader !== undefined) {
      initStickyNav({
        options: options,
        wpAdminBar,
        adminbarHeight,
        navbar,
        toolbar,
        navbarWrapper
      });

      if (
        headerStyle === 1 ||
        headerStyle === 2 ||
        isMobile()
      ) {
        enableStickyNav();
      }
    }

    if (mainMenuWrapper) {
      if (isMobile() || headerStyle === 2) {
        window.addEventListener('load', function () {
          mainMenuWrapper.classList.add('gm-navbar-animated');
        });
      } else {
        mainMenuWrapper.classList.remove('gm-navbar-animated');
      }
    }

    initOffcanvas({
      options: options,
      navDrawer,
      mainMenuWrapper,
      hamburgerMenu
    });

    function setOffcanvas () {
      if (!isMobile() && headerStyle === 2) {
        if (options.minimalisticMenuOpenType === 'offcanvasSlideSlide') {
          offcanvasWrap(mainMenuWrapper, 'left', true);
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideSlideRight') {
          offcanvasWrap(mainMenuWrapper, 'right', true);
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideLeft') {
          offcanvasWrap(mainMenuWrapper, 'left');
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideRight') {
          offcanvasWrap(mainMenuWrapper, 'right');
        } else {
          offcanvasWrap(mainMenuWrapper, 'left');
        }
      }

      if (isMobile()) {
        if (options.mobileNavDrawerOpenType === 'offcanvasSlideLeft') {
          offcanvasWrap(navDrawer, 'left');
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideRight') {
          offcanvasWrap(navDrawer, 'right');
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideSlide') {
          offcanvasWrap(navDrawer, 'left', true);
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
          offcanvasWrap(navDrawer, 'right', true);
        } else {
          offcanvasWrap(navDrawer, 'left');
        }
      }
    }


    setOffcanvas();
    offcanvasSlide();


    window.addEventListener('resize', _.debounce(() => {

      overlapMenu(options);

      if (headerStyle === 1 && options.header.align !== 'center' && navbar) {
        navbar.classList.add(`gm-top-links-align-${options.topLvlLinkAlign}`);
      }

      setOffcanvas();

      if (options.stickyHeader !== undefined) {
        if (
          headerStyle === 1 ||
          headerStyle === 2 ||
          isMobile()
        ) {
          disableStickyNav();
          enableStickyNav();
        }

        if (
          (headerStyle === 3 || headerStyle === 4) &&
          !isMobile()
        ) {
          disableStickyNav();
        }
      }

      if (mainMenuWrapper) {
        if (isMobile() || headerStyle === 2) {
          mainMenuWrapper.classList.add('gm-navbar-animated');
        } else {
          mainMenuWrapper.classList.remove('gm-navbar-animated');
        }
      }

    }, 100));

    // Append .gm-main-menu-wrapper css class to body
    if (headerStyle === 2) {
      navbar.after(mainMenuWrapper);
    }

    document.querySelectorAll('.gm-search-wrapper')
      .forEach((el) => {
        el.addEventListener('click', (e) => e.stopPropagation());
      });

    // Enable fullscreen search
    if (navbarSearchContainer !== null) {
      body.appendChild(navbarSearchContainer);
    }

    gmSearch.forEach((item) => {
      item.addEventListener('click', function () {
        if (item.classList.contains('fullscreen') || isMobile()) {
          navbarSearchContainer.classList.remove('gm-hidden');
          setTimeout(() => {
            navbarSearchContainer.querySelector('.gm-search__input')
              .focus();
          }, 200);
          return;
        }

        if (headerStyle !== 3 && headerStyle !== 4) {
          dropdownToggle(item.closest('.gm-search'), options);
          setTimeout(() => {
            item.querySelector('.gm-search__input')
              .focus();
          }, 200);
          return;
        }
      });
    });

    // Hide fullscreen search
    if (gmSearchClose !== null) {
      gmSearchClose.addEventListener('click', () => {
        navbarSearchContainer.classList.add('gm-hidden');
      });
    }

    linksWithHashes.forEach((link) => {
      link.addEventListener('click', scrollToId);
    });

    function setPagePositionByHash () {
      let target = window.location.hash;

      if (target.length) {
        let divWithId = document.querySelector(target);
        scroll.animateScroll(divWithId, scrollOptions);
      }
    }

    if (linkWithHash !== null) {
      window.addEventListener('scroll', _.debounce(setCurrentItem, 50));
      setCurrentItem();

      window.addEventListener('load', () => {
        setPagePositionByHash();
      });
    }

    if (
      !isMobile() &&
      headerStyle !== 2 &&
      headerStyle !== 3
    ) {
      initMenuThumbnails();
    }

    if (
      !isMobile() &&
      headerStyle === 1 &&
      options.header.align === 'center'
    ) {
      setTimeout(() => {
        initPaddingsAlignCenter({options: options});
      }, 200);
    }


    // Expanding sidebar
    initExpanding({
      options: options,
      navbar,
      hamburgerMenu
    });

    expandingSidebarEvents();


  }
}

window.GroovyMenu = GroovyMenu;
