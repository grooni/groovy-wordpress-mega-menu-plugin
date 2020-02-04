/**
 * Groovy menu plugin
 */

import GmStyles from '../shared/styles';
import _ from 'lodash';
import fixMenuCloseOnIOS, {
  isMobile as isMobileHelper,
  isRtl,
  isTargetScrollbar
} from '../shared/helpers';
import { scrollToId, setCurrentItem } from './one-page';

import { initPaddingsAlignCenter, splitMenu } from './split';
import { disableStickyNav, enableStickyNav, initStickyNav } from './sticky';
import { initOffcanvas, offcanvasSlide } from './offcanvas';
import { initMenuThumbnails } from './thumbnails';

import SmoothScroll from 'smooth-scroll';
import {
  dropdownCloseAll,
  dropdownToggle
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

    if (navbar.classList.contains('gm-no-compiled-css') || isPreview) {
      gmStyles.addToHeader(cssGenerated);
    }

    if (!isPreview) {
      if (navbar.classList.contains('gm-no-compiled-css')
        || options.version !== navbar.getAttribute('data-version')
        || direction !== options.direction) {
        gmStyles.addToHeader(cssGenerated);
        reinsertCompiledStyles(gmStyles, options, cssGenerated);
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
      let closestDropdown = e.target.closest('.gm-dropdown');

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

      if (e.target.closest('.gm-dropdown-toggle') === null) {
        dropdownCloseAll();
      } else {
        if (e.target.closest('.gm-dropdown-toggle')
          .getAttribute('href') !== null
          || e.target.closest('.gm-dropdown-toggle')
            .getAttribute('href') === '#') {
          dropdownToggle(closestDropdown, options);
          return false;
        }
      }
    };

    let dropdownItems = document.querySelectorAll('.gm-anchor, .gm-minicart-link');
    let navbarNav = document.querySelector('.gm-navbar-nav');

    if (options.showSubmenu === 'hover' && !isMobile()) {
      dropdownItems.forEach((dropdownItem) => {
        if (isTouchDevice) {
          dropdownItem.addEventListener('click', initDropdownAction);
        } else {
          dropdownItem.addEventListener('click', initDropdownAction);
          dropdownItem.addEventListener('mouseenter', initDropdownAction);
        }
      });

      if (!isTouchDevice) {
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

    if (isMobile() || headerStyle === 2) {
      window.addEventListener('load', function () {
        mainMenuWrapper.classList.add('gm-navbar-animated');
      });
    } else {
      mainMenuWrapper.classList.remove('gm-navbar-animated');
    }

    initOffcanvas({
      options: options,
      navDrawer,
      hamburgerMenu
    });

    function setOffcanvas () {
      if (!isMobile() && headerStyle === 2) {
        if (options.minimalisticMenuOpenType === 'offcanvasSlideSlide') {
          offcanvasSlide(mainMenuWrapper, 'left', true);
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideSlideRight') {
          offcanvasSlide(mainMenuWrapper, 'right', true);
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideLeft') {
          offcanvasSlide(mainMenuWrapper, 'left');
        } else if (options.minimalisticMenuOpenType === 'offcanvasSlideRight') {
          offcanvasSlide(mainMenuWrapper, 'right');
        } else {
          offcanvasSlide(mainMenuWrapper, 'left');
        }
      }

      if (isMobile()) {
        if (options.mobileNavDrawerOpenType === 'offcanvasSlideLeft') {
          offcanvasSlide(navDrawer, 'left');
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideRight') {
          offcanvasSlide(navDrawer, 'right');
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideSlide') {
          offcanvasSlide(navDrawer, 'left', true);
        } else if (options.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
          offcanvasSlide(navDrawer, 'right', true);
        } else {
          offcanvasSlide(navDrawer, 'left');
        }
      }
    }

    setOffcanvas();

    window.addEventListener('resize', _.debounce(() => {
      overlapMenu(options);

      if (headerStyle === 1 && options.header.align !== 'center') {
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

      if (isMobile() || headerStyle === 2) {
        mainMenuWrapper.classList.add('gm-navbar-animated');
      } else {
        mainMenuWrapper.classList.remove('gm-navbar-animated');
      }

    }, 50));

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
  }
}

window.GroovyMenu = GroovyMenu;
