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

import initScrollbar from './scrollbar';

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

    let hamburgerMenu = options.mobileIndependentCssHamburger ? document.querySelector('.gm-burger') : document.querySelector('.gm-menu-btn');
    let mainMenuWrapper = document.querySelector('.gm-main-menu-wrapper');
    let toolbar = document.querySelector('.gm-toolbar');
    let navbarWrapper = document.querySelector('.gm-wrapper');
    let gmSearch = document.querySelectorAll('.gm-search');
    let gmSearchClose = document.querySelector('.gm-search__close');

    let adminbarHeight = wpAdminBar === null ? 0 : wpAdminBar.offsetHeight;

    const isPreview = body.classList.contains('gm-preview-body');

    let scrollOffset = 0;
    if (options.stickyHeader !== undefined && options.stickyHeader !== 'disable-sticky-header') {
      scrollOffset = isMobile() ? options.mobileHeaderStickyHeight : options.headerHeightSticky;
    }

    let scrollOptions = {
      speed: 400,
      durationMax: 2000,
      durationMin: 250,
      clip: true,
      easing: 'easeInOutQuad',
      scrollOffset: scrollOffset,
      offset() {
        return scrollOffset;
      },
      updateURL: false,
    };

    if (options.scrollSpeedSettings) {
      if (options.scrollSpeedSettingsMain) {
        scrollOptions.speed = options.scrollSpeedSettingsMain;
      }
      if (options.scrollSpeedSettingsMin) {
        scrollOptions.durationMin = options.scrollSpeedSettingsMin;
      }
      if (options.scrollSpeedSettingsMax) {
        scrollOptions.durationMax = options.scrollSpeedSettingsMax;
      }
      if (options.scrollSpeedSettingsEasing) {
        scrollOptions.easing = options.scrollSpeedSettingsEasing;
      }
    }

    let scroll = new SmoothScroll();

    let linksWithHashes = document.querySelectorAll('.menu-item > a[href^="#"]:not([href="#"])');

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
        dropdownCloseAll(0);
      }
    });


    let initDropdownAction = (e) => {
      let delay = 210;
      let closestDropdown = e.target.closest('.gm-dropdown');
      let isTopLevelClass = false;
      let dropdownMenus = document.querySelectorAll('.gm-dropdown');
      let gmMainMenu = document.querySelector('#gm-main-menu');
      let hasOpenedElems = false;
      let miniCart = e.target.closest('.gm-minicart');

      if (closestDropdown) {
        isTopLevelClass = closestDropdown.classList.contains('gm-menu-item--lvl-0');
      }

      if (e.target.closest('.gm-caret')) {
        e.preventDefault();
        e.stopPropagation();

        if (closestDropdown && isTopLevelClass) {

          let isOpenedBefore = closestDropdown.classList.contains('gm-open');

          dropdownCloseAll(0);

          if (! isOpenedBefore) {
            dropdownOpen(closestDropdown, options);
          }

        } else {
          dropdownToggle(closestDropdown, options);
        }

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

        closestDropdown.setAttribute('data-close', false);

        if (isTopLevelClass && !openParents.length) {
          clearTimeout(closestDropdown.getAttribute('data-timeout-close'));
          closestDropdown.setAttribute('data-timeout-close', null);
        }

        if (gmMainMenu) {
          clearTimeout(gmMainMenu.getAttribute('data-timeout-close-all'));
          gmMainMenu.setAttribute('data-timeout-close-all', null);
        }

        // Click event on the woo minicart dropdown.
        if (miniCart && e.type === 'click') {
          if (headerStyle !== 1 || isMobile()) {
            window.location = document.querySelector('.gm-minicart-link')
              .getAttribute('href');
            e.stopPropagation();
            return false;
          }

          if (e.target.closest('.gm-minicart-link')) {
            e.preventDefault();
            let searchOpenElem = document.querySelector('.gm-search.gm-open');
            if (searchOpenElem) {
              dropdownToggle(searchOpenElem, options);
            }
            dropdownToggle(closestDropdown, options);
          }

          return false;
        }

        // Don't open on hover search and minicart dropdown
        if (closestDropdown.classList.contains('gm-search') ||
          closestDropdown.classList.contains('gm-minicart')) {
          return false;
        }

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

            // Close all not parents dropdowns.
            if (dropdownMenus.length > 0) {
              dropdownMenus.forEach((el) => {
                if (parentsIds.indexOf(el.id) === -1) {
                  dropdownClose(el);
                }
              });
            }

            dropdownOpen(closestDropdown, options);

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
        dropdownCloseAll(420);
      }
    };


    let leaveDropdownAction = (e) => {

      let closestDropdown = e.target.closest('.gm-dropdown');
      let isTopLevelClass = e.target.classList.contains('gm-menu-item--lvl-0');

      // parent dropdown not exist.
      if (!closestDropdown) {
        return;
      }

      let elemClassList = closestDropdown.classList;

      // exclude first level of the nav menu.
      if (!elemClassList.contains('gm-dropdown-submenu') && !isTopLevelClass) {
        return;
      }

      // parent dropdown is open.
      if (elemClassList.contains('gm-open') && !elemClassList.contains('gm-menu-item--lvl-0')) {
        return;
      }

      let delay = 350;

      // disable for search and WooCommerce buttons.
      if (elemClassList.contains('gm-search') || elemClassList.contains('gm-minicart')) {
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


    let gmAnchorItems = document.querySelectorAll('.gm-anchor, .gm-minicart, .gm-search, .mega-gm-dropdown > .gm-dropdown-menu-wrapper');
    let gmMainMenu = document.querySelector('#gm-main-menu');

    if (gmAnchorItems && options.showSubmenu === 'hover' && !isMobile()) {
      gmAnchorItems.forEach((dropdownItem) => {

        let menuItem = dropdownItem.closest('.gm-menu-item');

        dropdownItem.addEventListener('click', initDropdownAction);

        if (!isTouchDevice) {
          dropdownItem.addEventListener('mouseenter', initDropdownAction);
          if (menuItem) {
            menuItem.addEventListener('mouseleave', leaveDropdownAction);
          } else {
            dropdownItem.addEventListener('mouseleave', leaveDropdownAction);
          }
        }
      });

      if (!isTouchDevice && gmMainMenu) {
        gmMainMenu.addEventListener('mouseleave', () => {
          dropdownCloseAll(750);
        });
      }
    }

    if (gmAnchorItems && (options.showSubmenu === 'click' || isMobile())) {
      gmAnchorItems.forEach((dropdownItem) => {
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

    // Click event on the gm-search
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

        if (headerStyle !== 3 && headerStyle !== 4 && headerStyle !== 5) {
          let miniCartOpenElem = document.querySelector('.gm-minicart.gm-open');
          if (miniCartOpenElem) {
            dropdownToggle(miniCartOpenElem, options);
          }
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

    function setPagePositionByHash () {
      let target = window.location.hash;

      if (target.length) {
        scrollToId(null, scroll, target, scrollOptions);
      }
    }

    if (linksWithHashes !== null) {
      window.addEventListener('scroll', _.debounce(setCurrentItem, 50));

      setCurrentItem();

      window.addEventListener('load', () => {
        setPagePositionByHash();
      });
    }

    linksWithHashes.forEach((link) => {
      let targetHash = link.getAttribute('href');
      link.addEventListener('click', (e) => {
        scrollToId(e, scroll, targetHash, scrollOptions);
      });
    });

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


    if (options.scrollbarEnable) {
      initScrollbar(options);
    }


  }
}

window.GroovyMenu = GroovyMenu;
