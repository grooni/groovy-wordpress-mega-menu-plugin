const rtlcss = require('rtlcss');

import { isRtl } from './helpers';
import _ from 'lodash';

var lodash = _.noConflict();

export default class GmStyles {
  constructor (settings) {
    this.settings = settings;
    this.styles = '';
  }

  _append (css) {
    const {settings} = this;
    let styles = '';

    lodash.forEach(css, (rule) => {
      var isMedia = false;

      if (rule.media) {
        isMedia = true;

        if (rule.media === 'mobile') {
          styles += `@media (max-width: ${settings.mobileWidth}px) {`;
        } else if (rule.media === 'desktop') {
          let desktopWidth = +settings.mobileWidth + 1;
          styles += `@media (min-width: ${desktopWidth}px) {`;
        } else {
          styles += `@media (${rule.media}px) {`;
        }

        delete rule['media'];
      }

      lodash.forEach(rule, function (value, key) {
        styles += `${key} {${value}}`;
      });

      if (isMedia) {
        styles += '}';
      }
    });

    this.styles += styles;
  }

  _generate () {
    const {settings} = this;
    let css = [];
    const hoverStyleNumber = Number(settings.hoverStyle);
    const hoverStyle = settings.header.style === 1
      ? hoverStyleNumber
      : 1;

    let headerToolbar = settings.header.toolbar;

    // z-index param
    if (settings.menuZIndex > 0) {
      const menuZIndex = settings.menuZIndex;
      const menuZIndexToolbar = menuZIndex + 12;
      const menuZIndexButton = menuZIndexToolbar + 6; // Mobile wrapper must be more then desktop.
      const menuZIndexMobile = menuZIndexToolbar + 12; // Mobile wrapper must be more then desktop.
      const menuZIndexSearch = menuZIndexMobile + 12; // Search wrapper must be more then mobile.
      const adminBarZIndex = (menuZIndex < 99949) ? 0 : menuZIndexSearch + 12;

      css.push({
        '.gm-navbar': `z-index: ${menuZIndex} !important`,
      });
      css.push({
        '.gm-main-menu-wrapper': `z-index: ${menuZIndex} !important`,
      });
      css.push({
        '.gm-navigation-drawer': `z-index: ${menuZIndexMobile} !important`,
      });
      css.push({
        '.gm-navbar--style-3 .gm-toolbar': `z-index: ${menuZIndexToolbar} !important`,
      });
      css.push({
        '.gm-navbar--style-5 .gm-toolbar': `z-index: ${menuZIndexToolbar} !important`,
      });
      css.push({
        '.gm-navbar .gm-toolbar .wpml-ls': `z-index: ${menuZIndexToolbar} !important`,
      });
      css.push({
        '.gm-navbar .gm-logo': `z-index: ${menuZIndexToolbar} !important`,
        media: 'desktop'
      });
      css.push({
        '.gm-navbar .gm-menu-btn--expanded, .gm-burger': `z-index: ${menuZIndexButton} !important`,
        media: 'desktop'
      });
      css.push({
        '.gm-search__fullscreen-container': `z-index: ${menuZIndexMobile} !important`
      });
      if (adminBarZIndex > 0) {
        css.push({
          '#wpadminbar': `z-index: ${adminBarZIndex}`
        });
      }
    }


    if (settings.header.style === 1) {
      if (
        settings.submenuBorderStyle &&
        settings.submenuBorderThickness &&
        settings.submenuBorderColor
      ) {
        const {
          submenuBorderThickness: thickness,
          submenuBorderStyle: style,
          submenuBorderColor: color
        } = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link, .gm-main-menu-wrapper .gm-mega-menu__item__title':
            `border-bottom: ${thickness}px ${style} ${color};`,
          media: 'desktop'
        });
      }

      const {
        logoMarginTop,
        logoMarginRight,
        logoMarginBottom,
        logoMarginLeft,
      } = settings;

      if (settings.headerHeight) {
        css.push({
          '.gm-inner .gm-container': `height: ${settings.headerHeight}px;`,
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner': `min-height: ${settings.headerHeight}px;`,
          media: 'desktop'
        });
      }

      // Canvas and container boxed width
      if (settings.canvasContainerWidthType === 'canvas-boxed-container-boxed') {
        css.push({
          '.gm-wrapper': `max-width: ${settings.canvasBoxedContainerBoxedWidth}px`
        });
      }

      // Canvas wide - container boxed
      if (settings.canvasContainerWidthType === 'canvas-wide-container-boxed') {
        css.push({
          '.gm-container': `max-width: ${settings.canvasWideContainerBoxedWidth}px`
        });
      }

      // Canvas wide - container wide
      if (settings.canvasContainerWidthType === 'canvas-wide-container-wide') {
        const paddingLeft = `${settings.canvasWideContainerWidePadding}px !important;`;
        const paddingRight = `${settings.canvasWideContainerWidePadding}px !important;`;

        css.push({
          '.gm-wrapper, .gm-container': 'max-width: none'
        });

        css.push({
          '.gm-container': `padding-left: ${paddingLeft}`,
          media: 'desktop'
        });

        css.push({
          '.gm-container': `padding-right: ${paddingRight}`,
          media: 'desktop'
        });
      }

      if (settings.subLevelBorderTopColor) {
        const {
          subLevelBorderTopThickness: borderTopThickness,
          subLevelBorderTopStyle: borderTopStyle,
          subLevelBorderTopColor: borderTopColor,
          subLevelBorderTopShift: borderTopShift,
        } = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu': `border-top: ${borderTopThickness}px ${borderTopStyle} ${borderTopColor}`,
          media: 'desktop'
        });
        if (!borderTopShift) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-submenu .gm-dropdown-menu-wrapper': `margin-top: -${borderTopThickness}px`,
            media: 'desktop'
          });
        }
      }

      // Sub level background color
      if (settings.subLevelBackgroundColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu': `background-color: ${settings.subLevelBackgroundColor}`,
          media: 'desktop'
        });
      }

      // Custom background color for Mega Menu dropdown
      if (settings.megamenuBackgroundColorCustom && settings.megamenuBackgroundColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .mega-gm-dropdown .gm-dropdown-menu': `background-color: ${settings.megamenuBackgroundColor}`,
          media: 'desktop'
        });
      }

      // Mega Menu columns padding hide
      if (!settings.megamenuColumnPadding) {
        css.push({
          '.gm-grid-container':'padding-left: 0; padding-right: 0;',
          '.gm-grid-row':'margin-left: 0; margin-right: 0;',
          '.gm-grid-container .gm-mega-menu__item .gm-mega-menu__item__title':'margin-left: 15px; margin-right: 15px;',
          '.gm-grid-container .gm-mega-menu__item .gm-dropdown-menu-wrapper':'margin-left: 15px !important; margin-right: 15px !important;',
          '.gm-navigation-drawer .gm-grid-container': 'padding-left: 15px; padding-right: 15px;',
          '.gm-navbar .grid,.gm-navbar .grid-5,.gm-navbar .grid-10,.gm-navbar .grid-11,.gm-navbar .grid-12,.gm-navbar .grid-14,.gm-navbar .grid-15,.gm-navbar .grid-16,.gm-navbar .grid-20,.gm-navbar .grid-25,.gm-navbar .grid-30,.gm-navbar .grid-35,.gm-navbar .grid-40,.gm-navbar .grid-45,.gm-navbar .grid-50,.gm-navbar .grid-55,.gm-navbar .grid-60,.gm-navbar .grid-65,.gm-navbar .grid-70,.gm-navbar .grid-75,.gm-navbar .grid-80,.gm-navbar .grid-85,.gm-navbar .grid-90,.gm-navbar .grid-95,.gm-navbar .grid-100,.gm-navbar .grid-33,.gm-navbar .grid-66,.gm-navbar .mobile-grid,.gm-navbar .mobile-grid-5,.gm-navbar .mobile-grid-10,.gm-navbar .mobile-grid-11,.gm-navbar .mobile-grid-12,.gm-navbar .mobile-grid-14,.gm-navbar .mobile-grid-15,.gm-navbar .mobile-grid-16,.gm-navbar .mobile-grid-20,.gm-navbar .mobile-grid-25,.gm-navbar .mobile-grid-30,.gm-navbar .mobile-grid-35,.gm-navbar .mobile-grid-40,.gm-navbar .mobile-grid-45,.gm-navbar .mobile-grid-50,.gm-navbar .mobile-grid-55,.gm-navbar .mobile-grid-60,.gm-navbar .mobile-grid-65,.gm-navbar .mobile-grid-70,.gm-navbar .mobile-grid-75,.gm-navbar .mobile-grid-80,.gm-navbar .mobile-grid-85,.gm-navbar .mobile-grid-90,.gm-navbar .mobile-grid-95,.gm-navbar .mobile-grid-100,.gm-navbar .mobile-grid-33,.gm-navbar .mobile-grid-66': 'padding-left: 0; padding-right: 0;',
          media: 'desktop'
        });
      }

      // Mega menu canvas wide width
      if (settings.megaMenuCanvasContainerWidthType === 'mega-menu-canvas-wide-container-boxed' ||
        settings.megaMenuCanvasContainerWidthType === 'mega-menu-canvas-wide-container-wide') {
        css.push({
          '.gm-main-menu-wrapper .mega-gm-dropdown > .gm-dropdown-menu, .gm-main-menu-wrapper .mega-gm-dropdown > .gm-dropdown-menu-wrapper': `
            width: 100vw;
            margin-left  : calc( -100vw / 2 + 100% / 2 );
            margin-right : calc( -100vw / 2 + 100% / 2 );
            max-width : 100vw;
            position: absolute;`
        });
      }

      // Mega menu canvas and container boxed width
      if (settings.megaMenuCanvasContainerWidthType === 'mega-menu-canvas-boxed-container-boxed') {
        const maxWidth = `${settings.megaMenuCanvasBoxedContainerBoxedWidth}px`;

        css.push({
          '.gm-main-menu-wrapper .mega-gm-dropdown > .gm-dropdown-menu, .gm-main-menu-wrapper .mega-gm-dropdown > .gm-dropdown-menu-wrapper': `
            width: ${maxWidth};
            max-width : ${maxWidth};
            position: absolute;`
        });
      }

      // Mega menu canvas wide - container boxed
      if (settings.megaMenuCanvasContainerWidthType === 'mega-menu-canvas-wide-container-boxed') {
        const maxWidth = `${settings.megaMenuCanvasWideContainerBoxedWidth}px`;

        css.push({
          '.gm-main-menu-wrapper .gm-grid-container': `max-width: ${maxWidth}`
        });
      }

      // Mega menu canvas wide - container wide
      if (settings.megaMenuCanvasContainerWidthType === 'mega-menu-canvas-wide-container-wide') {
        css.push({
          '.gm-main-menu-wrapper .gm-dropdown.mega-gm-dropdown .gm-dropdown-menu, .gm-grid-container': 'max-width: none'
        });
      }

      if (hoverStyle === 1) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'margin-top: 5px; margin-bottom: 5px; padding-top: 0; padding-bottom: 0;',
          media: 'desktop'
        });
      }

      if (settings.header.align === 'right') {
        css.push({
          '.gm-navbar .gm-container, .gm-navbar .gm-main-menu-wrapper, .gm-navbar .gm-actions, .gm-navbar .gm-minicart': 'flex-direction: row-reverse;'
        });
      }

      if (settings.header.align === 'center') {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav': 'width: 50%;',
          media: 'desktop'
        });

        css.push({
          '.gm-main-menu-wrapper': 'opacity: 0; transition: opacity 0.2s',
          media: 'desktop'
        });

        css.push({
          '.gm-container, #gm-main-menu': 'justify-content: center;',
          '.gm-navbar .gm-logo': 'position: absolute; top: 50%; left: 50%; right: auto; transform: translate(-50%, -50%); z-index: 9999;',
          '.gm-main-menu-wrapper .gm-navbar-nav.nav--left': 'justify-content: flex-end;',
          '.gm-main-menu-wrapper .gm-navbar-nav.nav--right': 'justify-content: flex-start;',
          media: 'desktop'
        });
      }

      if (settings.topLevelTextColorHover) {
        // hover style 2
        if (settings.hoverStyle === '2') {
          css.push({
            '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor::after, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-item > .gm-anchor::after, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-parent > .gm-anchor::after, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.menu-item > .gm-anchor:hover::after, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.menu-item.gm-open > .gm-anchor::after': `border-top-color: ${settings.topLevelTextColorHover} !important`,
            media: 'desktop'
          });

          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `color: ${settings.topLevelTextColorHover} !important`,
            media: 'desktop'
          });
        }

        // hover style 3
        if (settings.hoverStyle === '3') {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item:hover': `background-color: ${settings.topLevelTextColorHover}`,
            media: 'desktop'
          });
        }

        // hover style 4
        if (settings.hoverStyle === '4') {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `background-color: ${settings.topLevelTextColorHover}`,
            media: 'desktop'
          });

          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `border-color: ${settings.topLevelTextColorHover}`,
            media: 'desktop'
          });
        }

        // hover style 5
        if (settings.hoverStyle === '5') {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor .gm-menu-item__txt:after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor .gm-menu-item__txt:after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor .gm-menu-item__txt:after, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover .gm-menu-item__txt:after, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor .gm-menu-item__txt:after': `background-color: ${settings.topLevelTextColorHover}`,
            media: 'desktop'
          });
        }

        // hover style 6
        if (settings.hoverStyle === '6') {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `background-color: ${settings.topLevelTextColorHover}`,
            media: 'desktop'
          });
        }

        // hover style 7
        if (settings.hoverStyle === '7') {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor::after, .gm-main-menu-wrapper .gm-navbar-nav > li.menu-item > .gm-anchor:hover::after, .gm-main-menu-wrapper .gm-navbar-nav > li.menu-item.gm-open > .gm-anchor::after': `border-bottom-color: ${settings.topLevelTextColorHover} !important`,
            media: 'desktop'
          });

          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav li.current-menu-ancestor.gm-open > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor:hover, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `color: ${settings.topLevelTextColorHover} !important`,
            media: 'desktop'
          });
        }
      }

      if (settings.topLevelTextColorHover2) {
        if (settings.hoverStyle === '3') {
          css.push({
            '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li:hover > .gm-anchor': `color: ${settings.topLevelTextColorHover2}`,
            media: 'desktop'
          });
        }

        if (settings.hoverStyle === '4') {
          css.push({
            '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li > .gm-anchor:hover, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav li.current-menu-ancestor.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav li.current-menu-item > .gm-anchor.gm-menu-item__link, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav li.current-menu-parent > .gm-anchor': `color: ${settings.topLevelTextColorHover2}`,
            media: 'desktop'
          });
        }

        if (settings.hoverStyle === '6') {
          css.push({
            '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li > .gm-anchor:hover, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor.gm-menu-item__link, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li.current-menu-parent > .gm-anchor': `color: ${settings.topLevelTextColorHover2}`,
            media: 'desktop'
          });
        }
      }

      // Main menu items gutter space
      if (settings.itemsGutterSpace) {
        const gutterSpace = settings.itemsGutterSpace;

        if (
          settings.hoverStyle === '1' ||
          settings.hoverStyle === '4' ||
          settings.hoverStyle === '5' ||
          settings.hoverStyle === '6'
        ) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor': `margin-left: ${gutterSpace}px`,
            media: 'desktop'
          });

          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor': `margin-right: ${gutterSpace}px`,
            media: 'desktop'
          });

          css.push({
            '.gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': `right: -${gutterSpace}px !important;`,
            media: 'desktop'
          });
        } else {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor': `padding-left: ${gutterSpace}px`,
            media: 'desktop'
          });

          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor': `padding-right: ${gutterSpace}px`,
            media: 'desktop'
          });
        }
      }

      // Submenu border radius.
      if (settings.subDropdownRadius) {
        const topLeft = settings.subDropdownRadius1;
        const topRight = settings.subDropdownRadius2;
        const bottomRight = settings.subDropdownRadius3;
        const bottomLeft = settings.subDropdownRadius4;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu': `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
          media: 'desktop'
        });

      }

      // Dropdown margin.
      if (settings.dropdownMargin) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-dropdown:not(.mega-gm-dropdown) > .gm-dropdown-menu-wrapper': `margin-top: ${settings.dropdownMargin}px`,
          media: 'desktop'
        });
      }

      // Sub-Dropdown margin.
      if (settings.subDropdownMargin) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-submenu > .gm-dropdown-menu-wrapper:not(.gm-dropdown-menu-wrapper--left)': `margin-left: ${settings.subDropdownMargin}px`,
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-submenu > .gm-dropdown-menu-wrapper--left': `margin-right: ${settings.subDropdownMargin}px`,
          media: 'desktop'
        });
      }

      // Mega menu margin.
      if (settings.megaMenuDropdownMargin) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .mega-gm-dropdown > .gm-dropdown-menu-wrapper > .gm-dropdown-menu': `margin-top: ${settings.megaMenuDropdownMargin}px`,
          media: 'desktop'
        });
      }

      if (settings.logoType !== 'no') {
        css.push({
          '.gm-navbar .gm-logo': `margin: ${logoMarginTop}px ${logoMarginRight}px ${logoMarginBottom}px ${logoMarginLeft}px;`,
          media: 'desktop'
        });
      }

      if (
        settings.header.align === 'left' &&
        settings.topLvlLinkAlign === 'left' &&
        settings.logoType !== 'no'
      ) {
        css.push({
          '.gm-navbar .gm-logo': `margin-right: ${settings.gapBetweenLogoAndLinks}px`,
          media: 'desktop'
        });
      }

      if (
        (settings.header.align === 'right' || settings.header.align === 'left') &&
        settings.topLvlLinkAlign === 'center' &&
        settings.topLvlLinkCenterConsideringLogo
      ) {
        css.push({
          '.gm-navbar.gm-top-links-align-center .gm-logo': 'position: inherit !important;',
          media: 'desktop'
        });
      }

      if (settings.woocommerceCart) {
        css.push({
          '.gm-navbar .gm-minicart-icon-wrapper i': 'display: block;',
          '.gm-navbar .gm-minicart > a': 'height: 30px; padding-right: 15px',
          media: 'desktop'
        });

        if (settings.header.align === 'right') {
          css.push({
            '.gm-navbar .gm-minicart': 'margin-left: 17px;',
            media: 'desktop'
          });
        } else {
          css.push({
            '.gm-navbar .gm-minicart': 'margin-right: 17px;',
            media: 'desktop'
          });
        }
      }

      // Desktop styles
      css.push({
        '.gm-navbar .gm-container': 'padding-right: 15px; padding-left: 15px; flex: 1 100%;',
        '.gm-navbar .gm-menu-item:last-of-type:not(:only-of-type) > .gm-menu-item__link': 'border-bottom: none;',
        '.gm-navbar .gm-dropdown-menu-wrapper--left': 'right: 0; left: auto;',
        '.gm-navbar .gm-dropdown-submenu .gm-dropdown-menu-wrapper': 'left: 100%; z-index: 1;',
        '.gm-navbar .gm-dropdown-submenu .gm-dropdown-menu-wrapper--left': 'right: 100%; left: auto; z-index: 1;',
        '.gm-navbar #gm-main-menu': 'flex-grow: 1; display: flex;',
        '.gm-navbar .gm-main-menu-wrapper': 'flex-grow: 1; align-items: stretch;',
        '.gm-navbar.gm-top-links-align-left #gm-main-menu': 'justify-content: flex-start;',
        '.gm-navbar.gm-top-links-align-center #gm-main-menu': 'justify-content: center;',
        '.gm-navbar.gm-top-links-align-center .gm-logo': 'position: absolute; top: 50%; transform: translateY(-50%);',
        '.gm-navbar.gm-top-links-align-right #gm-main-menu': 'justify-content: flex-end;',
        '.gm-navbar .gm-toolbar-bg': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: opacity 0.2s; z-index: -1;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-caret i': 'transform: none;',
        '.gm-navbar .gm-navbar-nav > .gm-dropdown > .gm-dropdown-menu-wrapper': 'top: 100%;',
        '.gm-navbar .gm-logo a img': 'transition: height 0.2s, line-height 0.2s;',
        '.gm-navbar .gm-search': 'transition: height 0.2s, line-height 0.2s;',
        media: 'desktop'
      });

      // Appearance Styles
      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-dropdown-menu': 'transition: all 0.2s; transform: translateY(40px);',
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-dropdown-menu-wrapper > .gm-dropdown-menu': 'visibility: visible; transform: translateY(0); opacity: 1;',
          media: 'desktop'
        });
      }
      if (settings.dropdownAppearanceStyle === 'animate-with-scaling') {
        css.push({
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown > .gm-dropdown-menu-wrapper': 'transition: transform .28s ease , opacity .28s ease; transform: translateY(-50%) scaleY(0); opacity: 0.2;',
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown.gm-open > .gm-dropdown-menu-wrapper': 'transform: translateY(0) scaleY(1); opacity: 1;',
          media: 'desktop'
        });
      }

    }

    if (settings.header.style === 2) {
      const {
        submenuBorderThickness: thickness,
        submenuBorderStyle: style,
        submenuBorderColor: color,
        logoMarginTop,
        logoMarginRight,
        logoMarginBottom,
        logoMarginLeft
      } = settings;

      // Submenu bottom border style, Thickness, Color
      if (
        settings.submenuBorderThickness &&
        settings.submenuBorderStyle &&
        settings.submenuBorderColor
      ) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link:after':
            `border-bottom: ${thickness}px ${style} ${color};`,
          media: 'desktop'
        });
      }

      if (settings.headerHeight) {
        css.push({
          '.gm-inner .gm-container': `height: ${settings.headerHeight}px;`,
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner': `min-height: ${settings.headerHeight}px;`,
          media: 'desktop'
        });
      }

      // Canvas and container boxed width
      if (settings.canvasContainerWidthType === 'canvas-boxed-container-boxed') {
        css.push({
          '.gm-wrapper': `max-width: ${settings.canvasBoxedContainerBoxedWidth}px`
        });
      }

      // Canvas wide - container boxed
      if (settings.canvasContainerWidthType === 'canvas-wide-container-boxed') {
        css.push({
          '.gm-container': `max-width: ${settings.canvasWideContainerBoxedWidth}px`
        });
      }

      // Canvas wide - container wide
      if (settings.canvasContainerWidthType === 'canvas-wide-container-wide') {
        const paddingLeft = `${settings.canvasWideContainerWidePadding}px !important;`;
        const paddingRight = `${settings.canvasWideContainerWidePadding}px !important;`;

        css.push({
          '.gm-wrapper, .gm-container': 'max-width: none'
        });

        css.push({
          '.gm-container': `padding-left: ${paddingLeft}`,
          media: 'desktop'
        });

        css.push({
          '.gm-container': `padding-right: ${paddingRight}`,
          media: 'desktop'
        });
      }

      if (settings.header.align === 'right') {
        css.push({
          '.gm-navbar .gm-container, .gm-navbar ~ .gm-main-menu-wrapper, .gm-navbar ~ .gm-main-menu-wrapper .gm-minicart': 'flex-direction: row-reverse;'
        });

        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper .gm-cart-counter': 'top: -24px; right: -15px; left: auto; border-radius: 50% 50% 50% 0;',
          media: 'desktop'
        });
      }

      if (settings.header.align === 'center') {
        css.push({
          '.gm-navbar .gm-logo': 'flex-grow: 1; justify-content: center;',
          media: 'desktop'
        });
      } else if (settings.header.align === 'right') {
        css.push({
          '.gm-navbar .gm-logo': 'flex-grow: 1; justify-content: flex-end;',
          media: 'desktop'
        });
      } else {
        css.push({
          '.gm-navbar .gm-logo': 'flex-grow: 1; justify-content: flex-start;',
          media: 'desktop'
        });
      }

      // Minimalistic navigation drawer open type (desktop)
      css.push({
        '.gm-main-menu-wrapper.gm-navigation-drawer--open': 'transform: translate3d(0, 0, 0) !important;',
        media: 'desktop'
      });

      if (settings.minimalisticMenuOpenType === 'offcanvasSlideLeft' || settings.minimalisticMenuOpenType === 'offcanvasSlideSlide') {
        css.push({
          '.gm-main-menu-wrapper.gm-navigation-drawer--left': 'transform: translate3d(-300px, 0, 0);',
          '.gm-main-menu-wrapper': 'left: 0; right: auto;',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'left: 100% !important;',
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor .gm-caret i': 'transform: rotate(-90deg);',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          media: 'desktop'
        });
      }

      if (settings.minimalisticMenuOpenType === 'offcanvasSlideRight' || settings.minimalisticMenuOpenType === 'offcanvasSlideSlideRight') {
        css.push({
          '.gm-main-menu-wrapper.gm-navigation-drawer--right': 'transform: translate3d(300px, 0, 0);',
          '.gm-main-menu-wrapper': 'right: 0; left: auto;',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'right: 100% !important; left: auto !important;',
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor .gm-caret i': 'transform: rotate(90deg);',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-main-menu-wrapper .gm-cart-counter': 'right: -15px;',
          '.gm-dropdown-menu .gm-caret i': 'transform: rotate(180deg);',
          '[dir=\'rtl\'] .gm-dropdown-menu .gm-caret i': 'transform: none;',
          media: 'desktop'
        });
      }

      if (settings.minimalisticMenuOpenType === 'offcanvasSlideSlide') {
        css.push({
          '.gm-navigation-drawer--left.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(300px, 0, 0);',
          media: 'desktop'
        });
      }

      if (settings.minimalisticMenuOpenType === 'offcanvasSlideSlideRight') {
        css.push({
          '.gm-navigation-drawer--right.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(-300px, 0, 0);',
          media: 'desktop'
        });
      }

      // Minimalistic menu top level menu background color
      if (settings.minimalisticMenuTopLvlMenuBgColor) {
        const color = settings.minimalisticMenuTopLvlMenuBgColor;

        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Minimalistic menu first level submenu background color
      if (settings.minimalisticMenuFirstSubmenuBgColor) {
        const color = settings.minimalisticMenuFirstSubmenuBgColor;

        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu--lvl-1': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Minimalistic menu next level submenu background color
      if (settings.minimalisticMenuNextSubmenuBgColor) {
        const color = settings.minimalisticMenuNextSubmenuBgColor;

        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu:not(.gm-dropdown-menu--lvl-1)': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Desktop styles
      css.push({
        '.gm-navbar .gm-container': 'padding-right: 15px; padding-left: 15px;',
        '.gm-navbar ~ .gm-main-menu-wrapper': 'position: fixed; z-index: 9999; width: 300px; justify-content: center;',
        '.gm-navbar .gm-toolbar': 'box-sizing: content-box;',
        '.gm-navbar ~ .gm-main-menu-wrapper #gm-main-menu': 'flex: 1 100%;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav': 'flex-direction: column;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav .gm-menu-item': 'position: static;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item': 'padding-right: 53px; padding-left: 53px;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': 'padding: 7px 0;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-menu-item__link': 'position: relative;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .gm-menu-item': 'padding-right: 0; padding-left: 0;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .gm-menu-item__link': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .groovy-menu-wim-wrap': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .gm-menu-item__link::after': 'position: absolute; right: 32px; bottom: 0; left: 32px; content: "";',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-actions': 'position: fixed; bottom: 100px; z-index: 999; justify-content: center;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-actions > div:nth-of-type(n+2)': 'border-left-width: 1px; border-left-style: solid;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-minicart': 'margin: 0; text-align: center;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-minicart > a, .gm-navbar ~ .gm-main-menu-wrapper .gm-search > i': 'padding: 0; line-height: 1;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-minicart-icon-wrapper i, .gm-navbar ~ .gm-main-menu-wrapper .gm-search > i': 'display: block; padding-bottom: 15px; line-height: 1;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-search': 'text-align: center; transition: height 0.2s, line-height 0.2s;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-minicart__txt, .gm-navbar ~ .gm-main-menu-wrapper .gm-search__txt': 'display: block; text-transform: uppercase; font-weight: 700; line-height: 1;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu': 'top: 0; bottom: 0; display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: center;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'width: 100%; height: 100%;',
        '.gm-navbar .gm-toolbar-bg': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: opacity 0.2s; z-index: -1;',
        '.gm-navbar.gm-navbar ~ .gm-main-menu-wrapper .attachment-menu-thumb': 'display: none;',
        '.gm-main-menu-wrapper': 'display: none;',
        '.gm-navbar .gm-menu-btn': 'display: flex;',
        '.gm-navbar .gm-logo a img': 'transition: height 0.2s, line-height 0.2s;',
        '.gm-navbar ~ .gm-navbar-animated': 'transition: transform cubic-bezier(0.7, 0, 0.3, 1) 0.4s;',
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-dropdown-menu.ps--active-y': 'justify-content: flex-start;',
        media: 'desktop'
      });

      css.push({
        'body:not(.admin-bar) .gm-navbar ~ .gm-main-menu-wrapper': 'top: 0; height: 100vh;'
      });

      css.push({
        '.admin-bar .gm-navbar ~ .gm-main-menu-wrapper': 'top: 46px; height: calc(100vh - 46px);',
        media: 'max-width: 782'
      });

      css.push({
        '.admin-bar .gm-navbar ~ .gm-main-menu-wrapper': 'top: 32px; height: calc(100vh - 32px);',
        media: 'min-width: 783'
      });

      // Mobile navigation text color
      if (settings.responsiveNavigationTextColor) {
        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper .gm-actions > div:nth-of-type(n+2)': `border-color: ${settings.responsiveNavigationTextColor}`
        });
      }

      if (settings.logoType !== 'no') {
        css.push({
          '.gm-navbar .gm-logo': `margin: ${logoMarginTop}px ${logoMarginRight}px ${logoMarginBottom}px ${logoMarginLeft}px;`,
          media: 'desktop'
        });
      }

      css.push({
        '.gm-dropdown-with-scrollbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .ps__rail-y': 'top: 0 !important;',
        '.gm-dropdown-with-scrollbar ~ .gm-main-menu-wrapper .gm-dropdown-menu .ps__thumb-y': 'border-radius: 2px;',
        media: 'desktop'
      });

    }

    if (settings.header.style === 3) {
      const {
        submenuBorderThickness: thickness,
        submenuBorderStyle: style,
        submenuBorderColor: color,
        header,
        sidebarMenuSideBorderThickness,
        sidebarMenuSideBorderColor,
        sidebarMenuSideBorderStyle,
        logoMarginTop,
        logoMarginRight,
        logoMarginBottom,
        logoMarginLeft,
      } = settings;

      // Submenu bottom border style, Thickness, Color
      if (
        settings.submenuBorderThickness &&
        settings.submenuBorderStyle &&
        settings.submenuBorderColor
      ) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor, .gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link:after':
            `border-bottom: ${thickness}px ${style} ${color};`,
          media: 'desktop'
        });
      }

      // Sidebar menu first level submenu background color
      if (settings.sidebarMenuFirstSubmenuBgColor) {
        const color = settings.sidebarMenuFirstSubmenuBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu--lvl-1': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border thickness
      if (sidebarMenuSideBorderThickness && header.align === 'left') {
        const width = sidebarMenuSideBorderThickness;

        css.push({
          '.gm-navbar': `border-right-width: ${width}px`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border thickness
      if (sidebarMenuSideBorderThickness && header.align === 'right') {
        const width = sidebarMenuSideBorderThickness;

        css.push({
          '.gm-navbar': `border-left-width: ${width}px`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border color
      if (sidebarMenuSideBorderColor && header.align === 'left') {
        const color = sidebarMenuSideBorderColor;

        css.push({
          '.gm-navbar': `border-right-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border style
      if (sidebarMenuSideBorderStyle && header.align === 'left') {
        const style = sidebarMenuSideBorderStyle;

        css.push({
          '.gm-navbar': `border-right-style: ${style}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border color
      if (sidebarMenuSideBorderColor && header.align === 'right') {
        const color = sidebarMenuSideBorderColor;

        css.push({
          '.gm-navbar': `border-left-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border style
      if (sidebarMenuSideBorderStyle && header.align === 'right') {
        const style = sidebarMenuSideBorderStyle;

        css.push({
          '.gm-navbar': `border-left-style: ${style}`,
          media: 'desktop'
        });
      }

      if (settings.header.align === 'left') {
        css.push({
          'body': 'margin-left: 300px !important;',
          '.gm-navbar': 'left: 0;',
          '.gm-toolbar': 'left: 0;',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(-90deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(-90deg);',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'left: 100%; right: auto;',
          media: 'desktop'
        });
      }

      if (settings.header.align === 'right') {
        css.push({
          'body': 'margin-right: 300px !important;',
          '.gm-navbar': 'right: 0;',
          '.gm-toolbar': 'right: 0;',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-dropdown-menu': 'left: -100%;',
          '.gm-main-menu-wrapper .gm-cart-counter': 'right: -15px !important; left: auto !important; border-radius: 50% 50% 50% 0 !important;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(90deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(90deg);',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret > i': 'transform: rotate(180deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret > i': 'transform: rotate(0deg);',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'right: 100%; left: auto;',
          media: 'desktop'
        });
      }

      // Sidebar menu next level submenu background color
      if (settings.sidebarMenuNextSubmenuBgColor) {
        const color = settings.sidebarMenuNextSubmenuBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu:not(.gm-dropdown-menu--lvl-1)': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Top level text color
      if (settings.topLevelTextColor) {
        css.push({
          '.gm-navbar .gm-actions > div:nth-of-type(n+2)': `border-color: ${settings.topLevelTextColor}`,
          media: 'desktop'
        });
      }

      if (settings.header.toolbar && settings.toolbarIconColor) {
        const color = settings.toolbarIconColor;

        css.push({
          '.gm-navbar .gm-toolbar-socials-list__item': `box-shadow: 1px 0 0 0 ${color}, 0 1px 0 0 ${color}, 1px 1px 0 0 ${color}, 1px 0 0 0 ${color} inset, 0 1px 0 0 ${color} inset`,
          media: 'desktop'
        });
      }

      css.push({
        // Minicart
        '.gm-main-menu-wrapper .gm-minicart > a': 'padding-left: 0 !important;',
        media: 'desktop'
      });

      // Desktop styles
      css.push({
        '.gm-navbar': 'position: fixed; z-index: 1041; box-sizing: content-box; width: 300px;',
        '.gm-navbar .gm-wrapper': 'position: relative; height: 100vh;',
        '.gm-navbar .gm-inner': 'height: 100%;',
        '.gm-navbar .gm-container': 'height: 100%;',
        '.gm-navbar .gm-toolbar': 'position: absolute; z-index: 1005; bottom: 20px; width: 100%; text-align: center;',
        '.admin-bar .gm-navbar .gm-toolbar': 'bottom: 52px;',
        '.gm-navbar .gm-toolbar-right': 'flex-direction: column;',
        '.gm-navbar .gm-toolbar-socials-list': 'order: 2;',
        '.gm-navbar #lang_sel_click': 'align-self: center;',
        '.gm-navbar #lang_sel_click li': 'width: auto;',
        '.gm-navbar #lang_sel_click a': 'padding-left: 0 !important;',
        '.gm-navbar .gm-toolbar .gm-container': 'flex-direction: column;',
        '.gm-navbar .gm-toolbar-social-link': 'width: 42px; height: 42px;',
        '.gm-navbar .gm-toolbar-socials-list__item': 'padding-left: 0; padding-right: 0;',
        '.gm-navbar .gm-toolbar-email, .gm-navbar .gm-toolbar-phone': 'display: none;',
        '.gm-navbar .gm-logo': `position: absolute; width: 100%; margin: ${logoMarginTop}px ${logoMarginRight}px ${logoMarginBottom}px ${logoMarginLeft}px;`,
        '.gm-navbar .gm-logo__img': 'max-width: 100% !important; margin-right: auto; margin-left: auto;',
        '.gm-navbar .gm-actions': 'position: fixed; bottom: 100px; z-index: 999; justify-content: center;',
        '.gm-navbar .gm-actions > div:nth-of-type(n+2)': 'border-left-width: 1px; border-left-style: solid;',
        '.gm-navbar .gm-main-menu-wrapper .gm-minicart__txt, .gm-navbar .gm-main-menu-wrapper .gm-search__txt': 'display: block; text-transform: uppercase; font-weight: 700; line-height: 1;',
        '.gm-navbar .gm-minicart': 'margin: 0; text-align: center;',
        '.gm-navbar .gm-search': 'text-align: center;',
        '.gm-navbar .gm-minicart > a, .gm-navbar .gm-search > i': 'padding: 0; line-height: 1;',
        '.gm-navbar .gm-minicart-icon-wrapper i, .gm-navbar .gm-search > i': 'display: block; padding-bottom: 15px; line-height: 1;',
        '.gm-navbar .gm-cart-counter': 'top: -24px; right: -15px;',
        '.gm-navbar .gm-main-menu-wrapper': 'flex: 1 100%; justify-content: center;',
        '.gm-navbar #gm-main-menu': 'flex: 1 100%;',
        '.gm-navbar .gm-navbar-nav': 'display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: center;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item': 'padding-right: 56px; padding-left: 56px;',
        '.gm-navbar .gm-dropdown-menu-wrapper': 'width: 100%; height: 100%;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item': 'padding-right: 0; padding-left: 0;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item__link': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar .gm-dropdown-menu .groovy-menu-wim-wrap': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item__link::after': 'position: absolute; right: 32px; bottom: 0; left: 32px; content: "";',
        '.gm-navbar .gm-menu-item': 'position: static !important; transition: background-color ease 0.2s;',
        '.gm-navbar .gm-mega-menu-wrapper': 'position: relative;',
        '.gm-navbar .gm-mega-menu__item__title': 'display: block; clear: both; padding: 12px 20px; cursor: pointer; white-space: nowrap; text-transform: uppercase; color: #5a5a5a; border-bottom: none; font-size: 11px; font-weight: 700; line-height: 25px;',
        '.gm-navbar .gm-dropdown-menu': 'top: 0; right: 0; left: 100%; display: flex; flex-direction: column; height: 100%; justify-content: center;',
        '.gm-navbar .gm-dropdown-menu.ps--active-y': 'justify-content: flex-start;',
        '.gm-navbar .gm-minicart-dropdown': 'top: 100%;',
        '.gm-navbar .gm-menu-item__link': 'position: relative; padding-right: 0; padding-left: 0;',
        '.gm-navbar .attachment-menu-thumb': 'display: none;',
        '.admin-bar .gm-navbar' : 'top: 32px; height: calc(100vh - 32px);',
        media: 'desktop'
      });

      // Appearance Styles
      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-dropdown-menu': 'transition: all 0.2s; transform: translateY(80px);',
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-dropdown-menu-wrapper > .gm-dropdown-menu': 'visibility: visible; transform: translateY(0); opacity: 1;',
          media: 'desktop'
        });
      }
      if (settings.dropdownAppearanceStyle === 'animate-with-scaling') {
        css.push({
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown > .gm-dropdown-menu-wrapper': 'transition: transform .28s ease , opacity .28s ease; transform: translateY(-50%) scaleY(0); opacity: 0.2;',
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown.gm-open > .gm-dropdown-menu-wrapper': 'transform: translateY(0) scaleY(1); opacity: 1;',
          media: 'desktop'
        });
      }

    }

    if (settings.header.style === 4) {
      if (
        settings.submenuBorderStyle &&
        settings.submenuBorderThickness &&
        settings.submenuBorderColor
      ) {
        const {
          submenuBorderThickness: thickness,
          submenuBorderStyle: style,
          submenuBorderColor: color
        } = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link, .gm-main-menu-wrapper .gm-mega-menu__item__title':
            `border-bottom: ${thickness}px ${style} ${color};`,
          media: 'desktop'
        });
      }

      if (settings.subLevelBorderTopColor) {
        const {
          subLevelBorderTopThickness: borderTopThickness,
          subLevelBorderTopStyle: borderTopStyle,
          subLevelBorderTopColor: borderTopColor,
          subLevelBorderTopShift: borderTopShift,
        } = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu': `border-top: ${borderTopThickness}px ${borderTopStyle} ${borderTopColor}`,
          media: 'desktop'
        });
        if (!borderTopShift) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-submenu .gm-dropdown-menu-wrapper': `margin-top: -${borderTopThickness}px`,
            media: 'desktop'
          });
        }
      }

      // Sub level background color
      if (settings.subLevelBackgroundColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu': `background-color: ${settings.subLevelBackgroundColor}`,
          media: 'desktop'
        });
      }

      // Icon menu top level link background color
      if (settings.iconMenuTopLvlLinkBgColor) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__txt-wrapper': `background-color: ${settings.iconMenuTopLvlLinkBgColor}`,
          media: 'desktop'
        });
      }
      // Icon menu top level icon size
      if (settings.iconMenuIconSize) {
        const iconSize = settings.iconMenuIconSize;

        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav .gm-menu-item__icon': `font-size: ${iconSize}px`,
          media: 'desktop'
        });
      }

      //Icon menu top level border thickness
      if (settings.iconMenuBorderTopThickness) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navbar .gm-logo, .gm-navbar .gm-search, .gm-navbar .gm-minicart, .gm-navbar .gm-toolbar-social-link': `border-bottom-width: ${settings.iconMenuBorderTopThickness}px`,
          media: 'desktop'
        });
      }

      // Icon menu top level border color
      if (settings.iconMenuBorderTopColor) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navbar .gm-logo, .gm-navbar .gm-search, .gm-navbar .gm-minicart, .gm-navbar .gm-toolbar-social-link': `border-bottom-color: ${settings.iconMenuBorderTopColor}`,
          media: 'desktop'
        });
      }

      // Icon menu top level border style
      if (settings.iconMenuBorderTopStyle) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navbar .gm-logo, .gm-navbar .gm-search, .gm-navbar .gm-minicart, .gm-navbar .gm-toolbar-social-link': `border-bottom-style: ${settings.iconMenuBorderTopStyle}`,
          media: 'desktop'
        });
      }

      // Icon menu submenu border thickness
      if (settings.iconMenuSubmenuBorderTopThickness) {
        const width = settings.iconMenuSubmenuBorderTopThickness;

        css.push({
          '.gm-navbar .gm-menu-item__link': `border-bottom-width: ${width}px`,
          media: 'desktop'
        });
      }

      // Icon menu submenu border color
      if (settings.iconMenuSubmenuBorderTopColor) {
        const color = settings.iconMenuSubmenuBorderTopColor;

        css.push({
          '.gm-navbar .gm-menu-item__link': `border-bottom-color: ${color}`,
          media: 'desktop'
        });
      }

      // Icon menu submenu border style
      if (settings.iconMenuSubmenuBorderTopStyle) {
        const style = settings.iconMenuSubmenuBorderTopStyle;

        css.push({
          '.gm-navbar .gm-menu-item__link': `border-bottom-style: ${style}`,
          media: 'desktop'
        });
      }

      // Icon menu top level border style
      if (settings.iconMenuBorderTopStyle) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navbar .gm-logo': `border-bottom-style: ${settings.iconMenuBorderTopStyle}`,
          media: 'desktop'
        });
      }

      if (settings.iconMenuBorderTopStyle) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navbar .gm-logo': `border-bottom-style: ${settings.iconMenuBorderTopStyle}`,
          media: 'desktop'
        });
      }

      if (settings.logoType === 'no') {
        css.push({
          '.gm-navbar .gm-logo__no-logo' : 'font-size: 10px;',
          media: 'desktop'
        });
      }

      css.push({
        '.gm-navbar .gm-container': 'flex-direction: column;',
        '.gm-navbar': 'position: fixed; z-index: 999; box-sizing: content-box; width: 70px; height: 100%;',
        '.gm-navbar .gm-toolbar-contacts, .gm-navbar .gm-toolbar-email, .gm-navbar .gm-toolbar-phone': 'display: none;',
        '.gm-navbar #gm-main-menu': 'width: 100%;',
        '.gm-navbar .gm-wrapper': 'position: relative; display: flex; flex-direction: column; transform: none; backface-visibility: visible; perspective: none;',
        '.gm-navbar .gm-toolbar-left, .gm-navbar .gm-toolbar-right': 'flex-direction: column;',
        '.gm-navbar #lang_sel_click li': 'width: 70px !important;',
        '.gm-navbar #lang_sel ul li a, .gm-navbar #lang_sel_click ul li a': 'padding: 0 5px !important;',
        '.gm-navbar .gm-toolbar-socials-list': 'flex-direction: column; margin-left: 0 !important; margin-right: 0 !important; width: 100%;',
        '.gm-navbar .gm-main-menu-wrapper': 'flex-direction: column;',
        '.gm-navbar .gm-toolbar': 'order: 1;',
        '.gm-navbar .gm-toolbar-social-link': 'width: auto; height: 70px; text-align: center; line-height: 70px;',
        '.gm-navbar .gm-toolbar-social-link i': 'position: static; transform: none; line-height: 70px;',
        '.gm-navbar .gm-logo__img-header-sidebar': 'display: block;',
        '.gm-navbar .gm-navbar-nav': 'flex-direction: column;',
        '.gm-navbar .gm-navbar-nav .gm-dropdown-menu li:only-child > .gm-anchor': 'border-bottom: none;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item': 'position: relative; width: 100%; transition: background-color ease 0.2s;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor': 'display: block; height: 70px; padding: 0; line-height: 70px;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__txt-wrapper': 'position: absolute; top: 0; visibility: hidden; padding-right: 15px; padding-left: 15px; transition: opacity 0.3s, visibility 0.3s; opacity: 0;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item.gm-open > .gm-anchor > .gm-menu-item__txt-wrapper': 'visibility: visible; opacity: 1;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__icon': 'display: block; text-align: center; line-height: 70px;',
        '.gm-navbar .gm-mega-menu-wrapper': 'position: relative;',
        '.gm-navbar .gm-actions': 'flex-direction: column;',
        '.gm-navbar .gm-search': 'height: 70px; text-align: center; line-height: 70px; box-sizing: content-box; width: 70px;',
        '.gm-navbar .gm-minicart': 'display: flex; height: 70px; margin: 0; text-align: center; line-height: 70px;',
        '.gm-navbar .gm-minicart > a': 'float: none; box-sizing: content-box; width: 70px; padding: 0 !important;',
        '.gm-navbar .gm-cart-counter': 'top: 5px; right: -26px;',
        '.gm-navbar .navbar.gm-navbar--align-right .gm-cart-counter': 'top: -2px; right: -25px; left: auto; border-radius: 50% 50% 50% 0;',
        '.gm-navbar .gm-mega-menu__item__title': 'display: block; clear: both; padding: 12px 20px; cursor: pointer; white-space: nowrap; text-transform: uppercase; color: #5a5a5a; border-bottom: none; font-size: 11px; font-weight: 700; line-height: 25px;',
        '.gm-navbar .gm-minicart-dropdown': 'top: 0;',
        '.admin-bar .gm-navbar' : 'top: 32px; height: calc(100vh - 32px);',
        '.gm-navbar .gm-dropdown-submenu .gm-dropdown-menu-wrapper': 'top: -3px;',
        media: 'desktop'
      });

      if (settings.header.align === 'left') {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu, .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__txt-wrapper, .gm-search-wrapper, .gm-dropdown-menu': `left: calc(100% + ${settings.iconMenuSideBorderThickness}px);`,
          'body': 'padding-left: 70px !important;',
          '.gm-navbar': 'left: 0;',
          '.gm-inner-bg': 'left: 0;',
          '.gm-search-wrapper': 'right: auto; left: 100%;',
          '.gm-minicart-dropdown': 'right: auto; left: 100%;',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'left: calc(100% + 1px);',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret': 'display: none;',
          media: 'desktop'
        });
        // Icon menu side border thickness
        if (settings.iconMenuSideBorderThickness) {
          const width = settings.iconMenuSideBorderThickness;

          css.push({
            '.gm-navbar': `border-right-width: ${width}px`,
            media: 'desktop'
          });
        }

        // Icon menu side border color
        if (settings.iconMenuSideBorderColor) {
          css.push({
            '.gm-navbar': `border-right-color: ${settings.iconMenuSideBorderColor}`,
            media: 'desktop'
          });
        }

        // Icon menu side border style
        if (settings.iconMenuSideBorderStyle) {
          css.push({
            '.gm-navbar': `border-right-style: ${settings.iconMenuSideBorderStyle}`,
            media: 'desktop'
          });
        }
      }

      if (settings.header.align === 'right') {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu, .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__txt-wrapper, .gm-search-wrapper, .gm-dropdown-menu': `right: calc(100% + ${settings.iconMenuSideBorderThickness}px);`,
          'body': 'padding-right: 70px !important;',
          '.gm-navbar': 'right: 0;',
          '.gm-inner-bg': 'right: 0;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item': 'float: none;',
          '.gm-search-wrapper': 'right: 100%; left: auto;',
          '.gm-minicart-dropdown': 'right: 100%; left: auto;',
          '.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'right: calc(100% + 1px); left: auto;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret': 'display: none;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret i': 'transform: rotate(180deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret i': 'transform: none;',
          media: 'desktop'
        });

        // Icon menu side border thickness
        if (settings.iconMenuSideBorderThickness) {
          const width = settings.iconMenuSideBorderThickness;

          css.push({
            '.gm-navbar': `border-left-width: ${width}px`,
            media: 'desktop'
          });
        }

        // Icon menu side border color
        if (settings.iconMenuSideBorderColor) {
          css.push({
            '.gm-navbar': `border-left-color: ${settings.iconMenuSideBorderColor}`,
            media: 'desktop'
          });
        }

        // Icon menu side border style
        if (settings.iconMenuSideBorderStyle) {
          css.push({
            '.gm-navbar': `border-left-style: ${settings.iconMenuSideBorderStyle}`,
            media: 'desktop'
          });
        }
      }

      // Icon menu top level icon active & hover color
      if (settings.iconMenuTopLevelIconActiveColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item .gm-menu-item__icon, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent .gm-menu-item__icon, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor .gm-menu-item__icon, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open .gm-menu-item__icon, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item:hover .gm-menu-item__icon': `color: ${settings.iconMenuTopLevelIconActiveColor} !important`,
          media: 'desktop'
        });
      }

      // Icon menu top level active & hover background color
      if (settings.iconMenuTopLevelIconActiveBgColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open, .gm-main-menu-wrapper .gm-navbar-nav > .menu-item:hover': `background-color: ${settings.iconMenuTopLevelIconActiveBgColor} !important`,
          media: 'desktop'
        });
      }

      // Icon menu first level submenu active link color
      if (settings.iconMenuFirstSubmenuActiveLinkColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav li.current-menu-item > .gm-menu-item__link, .gm-main-menu-wrapper .gm-navbar-nav li.current-menu-ancestor > .gm-menu-item__link': `color: ${settings.iconMenuFirstSubmenuActiveLinkColor} !important`,
          media: 'desktop'
        });
      }

      // Don't show the logo container if No Logo
      if (settings.logoType !== 'no') {
        css.push({
          '.gm-navbar .gm-logo': 'box-sizing: content-box; width: 100%; height: 70px;',
          media: 'desktop'
        });
      }

      // Show logo responsive (fit with block)
      if (settings.logoResponsive) {
        css.push({
          '.gm-navbar .gm-logo__img-header-sidebar': 'max-width: 100% !important; height: auto !important;',
          media: 'desktop'
        });
      }

      if (settings.subLevelWidth) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-dropdown .gm-dropdown-menu, .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor >.gm-menu-item__txt-wrapper': `min-width: ${settings.subLevelWidth}px`,
          media: 'desktop'
        });
      }

      // Appearance Styles
      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-dropdown-menu': 'transition: all 0.2s; transform: translateY(40px);',
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-dropdown-menu-wrapper > .gm-dropdown-menu': 'visibility: visible; transform: translateY(0); opacity: 1;',
          '.gm-dropdown-appearance-animate-from-bottom .gm-navbar-nav > .gm-menu-item > .gm-anchor > .gm-menu-item__txt-wrapper': 'transition: all 0.27s cubic-bezier(1, 0, 1, 1) 0.02s !important; transform: translateY(40px)',
          '.gm-dropdown-appearance-animate-from-bottom .gm-navbar-nav > .gm-menu-item.gm-open > .gm-anchor > .gm-menu-item__txt-wrapper': 'transform: translateY(0)',
          media: 'desktop'
        });
      }
      if (settings.dropdownAppearanceStyle === 'animate-with-scaling') {
        css.push({
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown > .gm-dropdown-menu-wrapper': 'transition: transform .28s ease , opacity .28s ease; transform: translateY(-50%) scaleY(0); opacity: 0.2;',
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown.gm-open > .gm-dropdown-menu-wrapper': 'transform: translateY(0) scaleY(1); opacity: 1;',
          media: 'desktop'
        });
      }

      // Submenu border radius.
      if (settings.subDropdownRadius) {
        const topLeft = settings.subDropdownRadius1;
        const topRight = settings.subDropdownRadius2;
        const bottomRight = settings.subDropdownRadius3;
        const bottomLeft = settings.subDropdownRadius4;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu': `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
          media: 'desktop'
        });

      }

    }

    if (settings.header.style === 5) {
      const {
        submenuBorderThickness: thickness,
        submenuBorderStyle: style,
        submenuBorderColor: color,
        header,
        sidebarExpandingMenuBorderThickness,
        sidebarExpandingMenuBorderColor,
        sidebarExpandingMenuBorderStyle,
        sidebarExpandingMenuTopBorderThickness,
        sidebarExpandingMenuTopBorderColor,
        sidebarExpandingMenuTopBorderStyle,
        sidebarExpandingMenuTopPadding,
        logoMarginTop,
        logoMarginRight,
        logoMarginBottom,
        logoMarginLeft,
        sidebarExpandingMenuInitialWidth,
        sidebarExpandingMenuExpandedWidth,
        sidebarExpandingMenuSubmenuWidth,
        sidebarExpandingMenuUseAnimation,
        sidebarExpandingMenuAnimationDuration,
        sidebarExpandingMenuIconSize,
        sidebarExpandingMenuShowSideIcon
      } = settings;

      let logoMarginWidth = logoMarginRight+ logoMarginLeft;

      let iconSize = sidebarExpandingMenuIconSize ? sidebarExpandingMenuIconSize : 32;
      let initialWidth = sidebarExpandingMenuInitialWidth ? sidebarExpandingMenuInitialWidth : 70;
      let expandedWidth = sidebarExpandingMenuExpandedWidth ? sidebarExpandingMenuExpandedWidth : 300;
      let submenuWidth = sidebarExpandingMenuSubmenuWidth ? sidebarExpandingMenuSubmenuWidth : 300;
      let animationCssParam, animationCssParamSecondary = '';

      if (sidebarExpandingMenuUseAnimation) {
        let seconds = sidebarExpandingMenuAnimationDuration ? parseInt(sidebarExpandingMenuAnimationDuration) : 300 ;
        seconds = (seconds / 1000).toFixed(1);
        animationCssParam = `transition: width ${seconds}s;`;
        animationCssParamSecondary = `transition: opacity 0.5s; ${seconds}s;`;
      } else {
        animationCssParam = 'transition: width 0.03s;';
        animationCssParamSecondary = 'transition: opacity 0.03s 0.05s;';
      }

      // Submenu bottom border style, Thickness, Color
      if (
        settings.submenuBorderThickness &&
        settings.submenuBorderStyle &&
        settings.submenuBorderColor
      ) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link:after':
            `border-bottom: ${thickness}px ${style} ${color};`,
          media: 'desktop'
        });
      }

      // Top level bottom border style, Thickness, Color
      if (
        sidebarExpandingMenuTopBorderThickness &&
        sidebarExpandingMenuTopBorderColor &&
        sidebarExpandingMenuTopBorderStyle
      ) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor':
            `border-bottom: ${sidebarExpandingMenuTopBorderThickness}px ${sidebarExpandingMenuTopBorderStyle} ${sidebarExpandingMenuTopBorderColor};`,
          media: 'desktop'
        });
      }

      // Top level paddings
      if (sidebarExpandingMenuTopPadding) {
        css.push({
          '.gm-navbar .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li > .gm-anchor':
            `padding-top: ${sidebarExpandingMenuTopPadding}px; padding-bottom: ${sidebarExpandingMenuTopPadding}px;`,
          media: 'desktop'
        });
      }

      // Sidebar menu first level submenu background color
      if (settings.sidebarMenuFirstSubmenuBgColor) {
        const color = settings.sidebarMenuFirstSubmenuBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu--lvl-1': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border thickness
      if (sidebarExpandingMenuBorderThickness && header.align === 'left') {
        const width = sidebarExpandingMenuBorderThickness;

        css.push({
          '.gm-navbar': `border-right-width: ${width}px`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border thickness
      if (sidebarExpandingMenuBorderThickness && header.align === 'right') {
        const width = sidebarExpandingMenuBorderThickness;

        css.push({
          '.gm-navbar': `border-left-width: ${width}px`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border color
      if (sidebarExpandingMenuBorderColor && header.align === 'left') {
        const color = sidebarExpandingMenuBorderColor;

        css.push({
          '.gm-navbar': `border-right-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border style
      if (sidebarExpandingMenuBorderStyle && header.align === 'left') {
        const style = sidebarExpandingMenuBorderStyle;

        css.push({
          '.gm-navbar': `border-right-style: ${style}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border color
      if (sidebarExpandingMenuBorderColor && header.align === 'right') {
        const color = sidebarExpandingMenuBorderColor;

        css.push({
          '.gm-navbar': `border-left-color: ${color}`,
          media: 'desktop'
        });
      }

      // Sidebar menu side border style
      if (sidebarExpandingMenuBorderStyle && header.align === 'right') {
        const style = sidebarExpandingMenuBorderStyle;

        css.push({
          '.gm-navbar': `border-left-style: ${style}`,
          media: 'desktop'
        });
      }

      // Do not show .gm-menu-btn--expanded on mobile.
      css.push({
        '.gm-navbar .gm-menu-btn--expanded': 'display: none;',
        media: 'mobile'
      });

      if (settings.header.align === 'left') {
        css.push({
          'body': `margin-left: ${initialWidth}px !important;`,
          '.gm-navbar': 'left: 0;',
          '.gm-toolbar': 'left: 0;',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(-90deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(-90deg);',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu-wrapper': 'left: 100%; right: auto;',
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu-wrapper > ul > li .gm-dropdown-menu-wrapper': `left: ${submenuWidth}px; right: auto;`,
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item': `padding-right: 18px;`,
          '.gm-navbar .gm-menu-btn--expanded' : 'left: 0;',
          media: 'desktop'
        });
      }

      if (settings.header.align === 'right') {
        css.push({
          'body': `margin-right: ${initialWidth}px !important;`,
          '.gm-navbar': 'right: 0;',
          '.gm-toolbar': 'right: 0;',
          '.gm-search': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-minicart': 'padding-left: 20px; padding-right: 20px; flex-shrink: 0;',
          '.gm-dropdown-menu': 'left: -100%;',
          '.gm-main-menu-wrapper .gm-cart-counter': 'right: -15px !important; left: auto !important; border-radius: 50% 50% 50% 0 !important;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(90deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret > i': 'transform: rotate(90deg);',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret > i': 'transform: rotate(180deg);',
          '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-dropdown-menu .gm-caret > i': 'transform: rotate(0deg);',
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu-wrapper': 'right: 100%; left: auto;',
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-dropdown-menu-wrapper > ul > li .gm-dropdown-menu-wrapper': `right: ${submenuWidth}px; left: auto;`,
          '.gm-navbar .gm-menu-btn--expanded': 'right: 0;',
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item': `padding-left: 18px;`,
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-anchor': 'flex-direction: row-reverse;',
          '.gm-navbar .gm-navbar-nav > .gm-menu-item .gm-anchor .gm-menu-item__txt-wrapper': 'flex-direction: row-reverse;',
          '.gm-navbar:not(.gm-expanding--open) .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item': `padding: 0; width: ${initialWidth}px;`,
          '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item .gm-menu-item__icon': 'margin-right: 0; margin-left: 8px;',
          '.gm-dropdown-hover-style-shift-right .gm-dropdown-menu .gm-menu-item:hover > .gm-anchor .gm-menu-item__txt-wrapper': 'transform: translateX(-25px);',
          '.gm-dropdown-hover-style-shift-right.gm-navbar--style-5 .gm-dropdown-menu .gm-menu-item > .gm-menu-item__link::before': 'left: auto; transform: rotate(180deg);',
          media: 'desktop'
        });
      }

      // Sidebar menu next level submenu background color
      if (settings.sidebarMenuNextSubmenuBgColor) {
        const color = settings.sidebarMenuNextSubmenuBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-dropdown-menu:not(.gm-dropdown-menu--lvl-1)': `background-color: ${color}`,
          media: 'desktop'
        });
      }

      // Top level text color
      if (settings.topLevelTextColor) {
        css.push({
          '.gm-navbar .gm-actions > div:nth-of-type(n+2)': `border-color: ${settings.topLevelTextColor}`,
          media: 'desktop'
        });
      }

      if (settings.header.toolbar && settings.toolbarIconColor) {
        const color = settings.toolbarIconColor;

        css.push({
          '.gm-navbar .gm-toolbar-socials-list__item': `box-shadow: 1px 0 0 0 ${color}, 0 1px 0 0 ${color}, 1px 1px 0 0 ${color}, 1px 0 0 0 ${color} inset, 0 1px 0 0 ${color} inset`,
          media: 'desktop'
        });
      }

      css.push({
        // Minicart
        '.gm-main-menu-wrapper .gm-minicart > a': 'padding-left: 0 !important;',
        media: 'desktop'
      });

      // Desktop styles
      css.push({
        '.gm-navbar': 'position: fixed; z-index: 1041; box-sizing: content-box;',
        '.gm-navbar .gm-wrapper': 'position: relative; height: 100vh;',
        '.gm-navbar .gm-inner': 'height: 100%;',
        '.gm-navbar .gm-container': 'height: 100%;',
        '.gm-navbar .gm-toolbar': 'position: absolute; z-index: 1005; bottom: 20px; width: 100%; text-align: center;',
        '.admin-bar .gm-navbar .gm-toolbar': 'bottom: 52px;',
        '.gm-navbar .gm-toolbar-right': 'flex-direction: column;',
        '.gm-navbar .gm-toolbar-socials-list': 'order: 2;',
        '.gm-navbar #lang_sel_click': 'align-self: center;',
        '.gm-navbar #lang_sel_click li': 'width: auto;',
        '.gm-navbar #lang_sel_click a': 'padding-left: 0 !important;',
        '.gm-navbar .gm-toolbar .gm-container': 'flex-direction: column;',
        '.gm-navbar .gm-toolbar-social-link': 'width: 42px; height: 42px;',
        '.gm-navbar .gm-toolbar-socials-list__item': 'padding-left: 0; padding-right: 0;',
        '.gm-navbar .gm-toolbar-email, .gm-navbar .gm-toolbar-phone': 'display: none;',
        '.gm-navbar .gm-logo': `position: absolute; margin: ${logoMarginTop}px ${logoMarginRight}px ${logoMarginBottom}px ${logoMarginLeft}px; width: calc(100% - ${logoMarginWidth}px);`,
        '.gm-navbar .gm-logo__img': 'margin-right: auto; margin-left: auto;',
        '.gm-navbar .gm-actions': 'position: fixed; bottom: 100px; z-index: 999; justify-content: center;',
        '.gm-navbar .gm-actions > div:nth-of-type(n+2)': 'border-left-width: 1px; border-left-style: solid;',
        '.gm-navbar .gm-main-menu-wrapper .gm-minicart__txt, .gm-navbar .gm-main-menu-wrapper .gm-search__txt': 'display: block; text-transform: uppercase; font-weight: 700; line-height: 1;',
        '.gm-navbar .gm-logo__img-header-sidebar': 'display: block;',
        '.gm-navbar .gm-minicart': 'margin: 0; text-align: center;',
        '.gm-navbar .gm-search': 'text-align: center;',
        '.gm-navbar .gm-minicart > a, .gm-navbar .gm-search > i': 'padding: 0; line-height: 1;',
        '.gm-navbar .gm-minicart-icon-wrapper i, .gm-navbar .gm-search > i': 'display: block; padding-bottom: 15px; line-height: 1;',
        '.gm-navbar .gm-cart-counter': 'top: -24px; right: -15px;',
        '.gm-navbar .gm-main-menu-wrapper': 'flex: 1 100%; justify-content: center;',
        '.gm-navbar #gm-main-menu': 'flex: 1 100%;',
        '.gm-navbar .gm-navbar-nav': 'display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: center;',
        '.gm-navbar .gm-dropdown-menu-wrapper': 'width: 100%; height: 100%;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item': 'padding-right: 0; padding-left: 0;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item__link': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar .gm-dropdown-menu .groovy-menu-wim-wrap': 'padding-right: 32px; padding-left: 32px;',
        '.gm-navbar .gm-dropdown-menu .gm-menu-item__link::after': 'position: absolute; right: 32px; bottom: 0; left: 32px; content: "";',
        '.gm-navbar .gm-menu-item': 'position: static !important; transition: background-color ease 0.2s;',
        '.gm-navbar .gm-mega-menu-wrapper': 'position: relative;',
        '.gm-navbar .gm-mega-menu__item__title': 'display: block; clear: both; padding: 12px 20px; cursor: pointer; white-space: nowrap; text-transform: uppercase; color: #5a5a5a; border-bottom: none; font-size: 11px; font-weight: 700; line-height: 25px;',
        '.gm-navbar .gm-dropdown-menu': 'top: 0; right: 0; left: 100%; display: flex; flex-direction: column; height: 100%; justify-content: center;',
        '.gm-navbar .gm-dropdown-menu.ps--active-y': 'justify-content: flex-start;',
        '.gm-navbar .gm-minicart-dropdown': 'top: 100%;',
        '.gm-navbar .gm-menu-item__link': 'position: relative; padding-right: 0; padding-left: 0;',
        '.gm-navbar .attachment-menu-thumb': 'display: none;',
        '.gm-navbar .gm-navbar-nav > .gm-menu-item': `width: ${expandedWidth}px;`,
        '.gm-menu-btn--expanded' : 'display:none',
        '.gm-navbar-nav > .gm-dropdown:not(.mega-gm-dropdown) .gm-dropdown-menu': `width: ${submenuWidth}px;`,

        '.admin-bar .gm-navbar': 'top: 32px; height: calc(100vh - 32px);',
        media: 'desktop'
      });


      // Hide elements by default
      css.push({
        '.gm-navbar': `width: ${initialWidth}px; ${animationCssParam}`,
        '.gm-navbar .gm-wrapper': 'overflow: hidden;',
        '.gm-navbar:not(.gm-animation-end) .gm-container': 'overflow: hidden;',

        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-menu-item__txt, .gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-badge, .gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret': `opacity: 0; ${animationCssParamSecondary}`,
        '.gm-navbar .gm-actions, .gm-navbar .gm-toolbar': 'opacity: 0; display: none; transition: opacity 0.3s;',
        '.gm-navbar .gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor':'transition: border 1s 0.3s;',
        '.gm-navbar:not(.gm-expanding--open) .gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor':'border-bottom-color: transparent;',
        '.gm-navbar:not(.gm-expanding--open) .gm-logo': 'overflow: hidden;',
        media: 'desktop'
      });

      // Show elements for Expanded
      css.push({
        '.gm-expanding--open.gm-navbar': `width: ${expandedWidth}px;`,
        '.gm-expanding--open.gm-navbar .gm-wrapper, .gm-expanding--hold.gm-navbar .gm-wrapper': 'overflow: unset;',

        '.gm-expanding--open.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-menu-item__txt, .gm-expanding--open.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-badge, .gm-expanding--open.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-caret': 'opacity: 1;',
        '.gm-expanding--open.gm-navbar .gm-toolbar': 'display: block; border: none;',
        '.gm-animation-end.gm-navbar .gm-toolbar': 'opacity: 1;',
        '.gm-expanding--open.gm-navbar .gm-actions': 'display: flex;',
        '.gm-animation-end.gm-navbar .gm-actions': 'opacity: 1;',
        '.gm-expanding--open.gm-navbar .gm-toolbar-socials-list__item': 'box-shadow: none;',
        media: 'desktop'
      });

      // Icons
      css.push({
        '.gm-navbar .gm-navbar-nav > .gm-menu-item > .gm-anchor .gm-menu-item__icon': `font-size: ${iconSize}px; width: ${initialWidth}px; display: flex; justify-content: center;`,
        media: 'desktop'
      });

      // Show logo responsive (fit with block)
      // Logo height
      if (settings.logoType === 'img') {
        if (settings.logoResponsive) {
          const {
            logoHeight
          } = settings;

          css.push({
            '.gm-navbar .gm-logo__img-header-sidebar': `max-width: 100% !important; height: auto !important; max-height: ${logoHeight}px;`,
            '.gm-expanding--open.gm-navbar .gm-logo': 'width: 100%;',
            media: 'desktop'
          });
        }
      }

      // Hamburger icon
      if (sidebarExpandingMenuShowSideIcon) {

        const {
          hamburgerIconBorderWidth,
          hamburgerIconPadding,
          hamburgerIconSize
        } = settings;

        let hamburgerIconHeight = hamburgerIconSize + (hamburgerIconPadding * 2) + (hamburgerIconBorderWidth * 2);

        css.push({
          '.gm-navbar .gm-menu-btn--expanded': `display: flex; position: absolute; top: 12px; width: ${initialWidth}px; text-align: center; cursor: pointer; justify-content: center;`,
          '.gm-navbar .gm-container': `padding-top: ${hamburgerIconHeight}px;`,
          media: 'desktop'
        });
      } else {
        css.push({
          '.gm-navbar .gm-menu-btn--expanded': `display: none;`,
          media: 'desktop'
        });
      }

      // Appearance Styles
      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-dropdown-menu': 'transition: all 0.2s; transform: translateY(80px);',
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-dropdown-menu-wrapper > .gm-dropdown-menu': 'visibility: visible; transform: translateY(0); opacity: 1;',
          media: 'desktop'
        });
      }
      if (settings.dropdownAppearanceStyle === 'animate-with-scaling') {
        css.push({
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown > .gm-dropdown-menu-wrapper': 'transition: transform .28s ease , opacity .28s ease; transform: translateY(-50%) scaleY(0); opacity: 0.2;',
          '.gm-dropdown-appearance-animate-with-scaling .gm-dropdown.gm-open > .gm-dropdown-menu-wrapper': 'transform: translateY(0) scaleY(1); opacity: 1;',
          media: 'desktop'
        });
      }

    }


    // hover style 1
    if (settings.topLevelTextColorHover && settings.hoverStyle === '1') {

      if (settings.header.style === 2) {
        css.push({
          '.gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-navbar ~ .gm-main-menu-wrapper .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `color: ${settings.topLevelTextColorHover} !important`
        });
      } else {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > .menu-item > .gm-anchor:hover, .gm-navbar:not(.gm-navbar-sticky-toggle) .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `color: ${settings.topLevelTextColorHover} !important`
        });
      }
    }

    // SHARED SETTINGS

    if (settings.logoType === 'text') {
      // Text logo
      if (settings.logoTxtFontSize) {
        css.push({
          '.gm-navbar .gm-logo a': `font-size: ${settings.logoTxtFontSize}px;`
        });
      }

      if (settings.logoTxtWeight) {
        const textWeight = settings.logoTxtWeight.toString();

        if (textWeight !== 'none') {
          const isItalic = textWeight.match(/italic/);
          const filteredTextWeight = textWeight.replace(/italic/, '');

          if (isItalic) {
            css.push({
              '.gm-navbar .gm-logo a': 'font-style: italic',
              media: 'desktop'
            });
          }

          css.push({
            '.gm-navbar .gm-logo a': `font-weight: ${filteredTextWeight}`,
            media: 'desktop'
          });
        }
      }

      if (settings.logoTxtColor) {
        css.push({
          '.gm-navbar .gm-logo a': `color: ${settings.logoTxtColor};`
        });
      }

      if (settings.logoTxtColorHover) {
        css.push({
          '.gm-navbar .gm-logo a:hover': `color: ${settings.logoTxtColorHover};`
        });
      }

      if (settings.logoTxtFont) {
        const {logoTxtFont} = settings;

        if (logoTxtFont !== 'none') {
          css.push({
            '.gm-navbar .gm-logo__txt': `font-family: '${logoTxtFont}', sans-serif`
          });
        } else {
          css.push({
            '.gm-navbar .gm-logo__txt': 'font-family: inherit'
          });
        }
      }
    }

    // Fonts
    if (settings.googleFont) {
      const {googleFont} = settings;

      if (googleFont !== 'none') {
        css.push({
          '.gm-navbar, .gm-main-menu-wrapper, .gm-navigation-drawer': `font-family: '${googleFont}', sans-serif`
        });
      } else {
        css.push({
          '.gm-navbar, .gm-main-menu-wrapper, .gm-navigation-drawer': 'font-family: inherit'
        });
      }
    }

    css.push(...this.setTopBgStyles());

    // Overlap
    if (typeof settings.header.toolbar === 'string') {
      settings.header.toolbar = (settings.header.toolbar === 'true');
    }

    if (!settings.overlap && !settings.header.toolbar) {
      css.push({
        '.gm-padding': `padding-top: ${settings.headerHeight}px`,
        media: 'desktop'
      });

      css.push({
        '.gm-padding': `padding-top: ${settings.mobileHeaderHeight}px`,
        media: 'mobile'
      });
    }

    // Sticky toolbar.
    if (
      headerToolbar &&
      (settings.header.style === 1 || settings.header.style === 2) &&
      settings.stickyToolbar
    ) {
      css.push({
        '.gm-navbar .gm-container': `opacity: 1 !important`
      });
    }

    // Hide toolbar on mobile devices
    if (settings.header.toolbar) {
      if (settings.hideToolbarOnMobile) {
        css.push({
          '.gm-toolbar': 'display: none;',
          media: 'mobile'
        });
      }

      // Hide social icon link text on mobile devices
      if (settings.hideToolbarIconTextOnMobile) {
        css.push({
          '.gm-navbar .gm-toolbar-social-link span': 'display: none;',
          media: 'mobile'
        });
      }

      // Toolbar top border thickness
      if (settings.toolbarTopThickness && settings.toolbarTopColor) {
        const {toolbarTopThickness, toolbarTopColor} = settings;

        if (settings.header.style !== 3) {
          css.push({
            '.gm-navbar .gm-toolbar': `border-top: ${toolbarTopThickness}px solid ${toolbarTopColor};`,
            media: 'desktop'
          });
        }

        css.push({
          '.gm-toolbar': `border-top: ${toolbarTopThickness}px solid ${toolbarTopColor};`,
          media: 'mobile'
        });
      }

      // Toolbar bottom border thickness
      if (settings.toolbarBottomThickness && settings.toolbarBottomColor) {
        const {toolbarBottomThickness, toolbarBottomColor} = settings;

        if (settings.header.style !== 3) {
          css.push({
            '.gm-navbar .gm-toolbar': `border-bottom: ${toolbarBottomThickness}px solid ${toolbarBottomColor};`,
            media: 'desktop'
          });
        }

        css.push({
          '.gm-toolbar': `border-bottom: ${toolbarBottomThickness}px solid ${toolbarBottomColor};`,
          media: 'mobile'
        });
      }

      // Toolbar background color
      if (settings.toolbarBgColor) {
        if (settings.header.style === 1 || settings.header.style === 2) {
          css.push({
            '.gm-toolbar-bg': `background-color: ${settings.toolbarBgColor}`
          });
        } else {
          css.push({
            '.gm-toolbar-bg': `background-color: ${settings.toolbarBgColor}`,
            media: 'mobile'
          });
        }
      }

      // Toolbar additional information color
      if (settings.toolbarAdditionalInfoColor) {
        css.push({
          '.gm-navbar .gm-toolbar-contacts, .gm-navbar #lang_sel_click ul ul a:visited, .gm-navbar #lang_sel_click ul ul a, .gm-navbar #lang_sel_click a:hover, .gm-navbar #lang_sel_click ul ul a:hover, .gm-navbar #lang_sel_click:hover> a, .gm-navbar #lang_sel_click ul ul:hover> a, .gm-navbar #lang_sel_click a.lang_sel_sel, .gm-navbar #lang_sel_click a.lang_sel_sel:hover': `color: ${settings.toolbarAdditionalInfoColor}`
        });
      }

      // Toolbar additional information fon size
      if (settings.toolbarAdditionalInfoFontSize) {
        const size = settings.toolbarAdditionalInfoFontSize;

        css.push({
          '.gm-navbar .gm-toolbar-contacts': `font-size: ${size}px;`
        });
      }

      // Toolbar icon color
      if (settings.toolbarIconColor) {
        const color = settings.toolbarIconColor;

        css.push({
          '.gm-navbar #gm-toolbar .gm-toolbar-social-link': `color: ${color} !important`
        });

        css.push({
          '.gm-navbar .gm-toolbar-socials-list__item': `border-right: 1px solid ${color}`,
          '.gm-navbar .gm-toolbar-socials-list__item:nth-last-child(1)': `border-right: none;`
        });
      }

      // Toolbar social icon size
      if (settings.toolbarIconSize) {
        css.push({
          '.gm-navbar .gm-toolbar-social-link, .gm-navbar .gm-toolbar-social-link i': `font-size: ${settings.toolbarIconSize}px; min-width: ${settings.toolbarIconSize}px; text-align: center;`
        });
      }
    }

    if (settings.header.style !== 3) {
      if (settings.bottomBorderColor) {
        let bottomBorderThickness = Number(settings.bottomBorderThickness);

        if (!bottomBorderThickness) {
          bottomBorderThickness = 0;
        }

        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner': `border-bottom-color: ${settings.bottomBorderColor}; border-bottom-width: ${bottomBorderThickness}px`
        });
      }

      if (hoverStyle === 2) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'height: 100%; position: relative;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor::after': 'position: absolute; top: 0; left: 0; content: ""; width: 100%; border-top-width: 3px; border-top-style: solid; border-top-color: transparent;',
          media: 'desktop'
        });

        if (settings.topLevelHoverLineThickness) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor::after': `border-top-width: ${settings.topLevelHoverLineThickness}px;`,
            media: 'desktop'
          });
        }
      }

      if (hoverStyle === 4) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'border: 1px solid transparent; padding-right: 15px; padding-left: 15px; transition: all 0.2s; border-radius: 5px;',
          media: 'desktop'
        });
      }

      if (hoverStyle === 6) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-menu-item > .gm-anchor': 'padding: 7px 15px;',
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': 'transition: background-color 0.2s;',
          media: 'desktop'
        });
      }

      if (hoverStyle === 7) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'height: 100%; position: relative;',
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor::after': 'position: absolute; bottom: 0; left: 0; content: ""; width: 100%; border-bottom: 3px solid transparent;',
          media: 'desktop'
        });

        if (settings.topLevelHoverLineThickness) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor::after': `border-bottom-width: ${settings.topLevelHoverLineThickness}px;`,
            media: 'desktop'
          });
        }
      }
    }

    if (settings.header.style !== 4) {
      css.push({
        '.gm-navbar ~ .gm-main-menu-wrapper .gm-menu-item__icon, .gm-navbar .gm-main-menu-wrapper .gm-menu-item__icon': 'margin-right: 8px;'
      });

      // Show icons only in icon menu
      if (settings.showTopLvlAndSubmenuIcons && settings.header.style !== 5) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav .gm-menu-item__icon': 'display: none'
        });
      }

      // Sub level box width
      if (settings.subLevelWidth && settings.header.style !== 5) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .gm-dropdown:not(.mega-gm-dropdown) .gm-dropdown-menu': `min-width: ${settings.subLevelWidth}px`,
          media: 'desktop'
        });
      }

      // Toolbar icon hover color
      if (settings.toolbarIconHoverColor) {
        const {toolbarIconHoverColor} = settings;

        css.push({
          '.gm-navbar #gm-toolbar .gm-toolbar-social-link:hover': `color: ${toolbarIconHoverColor} !important`,
          media: 'desktop'
        });
      }

      // Switch default logo to alternative
      if (settings.useAltLogoAtTop) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-default': 'display: none;',
          media: 'desktop'
        });

        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-alt': 'display: flex;',
          media: 'desktop'
        });
      } else {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-default': 'display: flex;',
          media: 'desktop'
        });

        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-alt': 'display: none;',
          media: 'desktop'
        });
      }
    }

    if (settings.woocommerceCart) {
      if (settings.woocommerceCartIconSizeDesktop) {
        const fontSize = settings.woocommerceCartIconSizeDesktop;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-icon-wrapper > i': `font-size: ${fontSize}px`,
          media: 'desktop'
        });
      }

      if (settings.woocommerceCartIconSizeMobile) {
        const fontSize = settings.woocommerceCartIconSizeMobile;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-icon-wrapper > i, .gm-navigation-drawer--mobile .gm-minicart .gm-icon': `font-size: ${fontSize}px`,
          media: 'mobile'
        });
      }

      if (settings.topLevelTextColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-minicart-icon-wrapper > i, .gm-main-menu-wrapper .gm-minicart-icon-wrapper > .gm-minicart__txt': `color: ${settings.topLevelTextColor}`,
          media: 'desktop'
        });
      }

      // WooCommerce minicart dropdown

      // Minicart bg color
      if (settings.wooCartDropdownBgColor) {
        const bgColor = settings.wooCartDropdownBgColor;

        css.push({
          '.gm-minicart-dropdown': `background-color: ${bgColor} !important;`,
          media: 'desktop'
        });
      }

      // Product name color
      if (settings.wooCartDropdownTextColor) {
        const color = settings.wooCartDropdownTextColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .woocommerce-mini-cart-item, .woocommerce-mini-cart__empty-message, .gm-minicart, .woocommerce-mini-cart__total': `color: ${color} !important;`,
          '.gm-main-menu-wrapper .gm-minicart-dropdown .woocommerce-mini-cart-item a':'color: inherit !important;',
          media: 'desktop'
        });
      }

      // Checkout button text color
      if (settings.checkoutBtnTextColor) {
        const {checkoutBtnTextColor} = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `color: ${checkoutBtnTextColor} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button text color on hover
      if (settings.checkoutBtnTextColorHover) {
        const color = settings.checkoutBtnTextColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout:hover': `color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button text font size
      if (settings.checkoutBtnFontSize) {
        const {checkoutBtnFontSize} = settings;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `font-size: ${checkoutBtnFontSize}px !important;`,
          media: 'desktop'
        });
      }

      // Checkout button text font weight
      if (settings.checkoutBtnFontWeight) {
        const weight = settings.checkoutBtnFontWeight;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `font-weight: ${weight} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button background color
      if (settings.checkoutBtnBgColor) {
        const color = settings.checkoutBtnBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `background-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button background color hover
      if (settings.checkoutBtnBgColorHover) {
        const color = settings.checkoutBtnBgColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout:hover': `background-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button border style
      if (settings.checkoutBtnBorderStyle) {
        const style = settings.checkoutBtnBorderStyle;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `border-style: ${style} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button border width
      if (settings.checkoutBtnBorderWidth) {
        const width = settings.checkoutBtnBorderWidth;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `border-width: ${width}px !important;`,
          media: 'desktop'
        });
      }

      // Checkout button border color
      if (settings.checkoutBtnBorderColor) {
        const color = settings.checkoutBtnBorderColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout': `border-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // Checkout button border color on hover
      if (settings.checkoutBtnBorderColorHover) {
        const color = settings.checkoutBtnBorderColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown .checkout:hover': `border-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button text color
      if (settings.viewCartBtnTextColor) {
        const color = settings.viewCartBtnTextColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button text color on hover
      if (settings.viewCartBtnTextColorHover) {
        const color = settings.viewCartBtnTextColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type:hover': `color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button text font size
      if (settings.viewCartBtnFontSize) {
        const size = settings.viewCartBtnFontSize;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `font-size: ${size}px !important;`,
          media: 'desktop'
        });
      }

      // View cart button text font weight
      if (settings.viewCartBtnFontWeight) {
        const weight = settings.viewCartBtnFontWeight;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `font-weight: ${weight} !important;`,
          media: 'desktop'
        });
      }

      // View cart button background color
      if (settings.viewCartBtnBgColor) {
        const color = settings.viewCartBtnBgColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `background-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button background color hover
      if (settings.viewCartBtnBgColorHover) {
        const color = settings.viewCartBtnBgColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type:hover': `background-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button border style
      if (settings.viewCartBtnBorderStyle) {
        const style = settings.viewCartBtnBorderStyle;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `border-style: ${style} !important;`,
          media: 'desktop'
        });
      }

      // View cart button border width
      if (settings.viewCartBtnBorderWidth) {
        const width = settings.viewCartBtnBorderWidth;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `border-width: ${width}px !important;`,
          media: 'desktop'
        });
      }

      // View cart button border color
      if (settings.viewCartBtnBorderColor) {
        const color = settings.viewCartBtnBorderColor;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type': `border-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // View cart button border color on hover
      if (settings.viewCartBtnBorderColorHover) {
        const color = settings.viewCartBtnBorderColorHover;

        css.push({
          '.gm-main-menu-wrapper .gm-minicart-dropdown a.button:first-of-type:hover': `border-color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // WooCommerce minicart count

      // Shape
      if (settings.wooCartCountShape) {
        if (settings.wooCartCountShape === 'drop') {
          css.push({
            '.gm-cart-counter': 'border-radius: 50% 50% 50% 0;'
          });
        } else if (settings.wooCartCountShape === 'circle') {
          css.push({
            '.gm-cart-counter': 'border-radius: 50%;'
          });
        }
      }

      // Background color
      if (settings.wooCartCountBgColor) {
        const bgColor = settings.wooCartCountBgColor;

        css.push({
          '.gm-cart-counter': `background-color: ${bgColor};`
        });
      }

      // Text color
      if (settings.wooCartCountTextColor) {
        const textColor = settings.wooCartCountTextColor;

        css.push({
          '.gm-cart-counter': `color: ${textColor};`
        });
      }

      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-minicart-dropdown': 'transition: all 0.2s; transform: translateY(40px);',
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-minicart-dropdown': 'visibility: visible; transform: translateY(0); opacity: 1;',
          media: 'desktop'
        });
      }

      css.push({
        // Minicart
        '.gm-main-menu-wrapper .gm-minicart > a': 'padding-left: 15px;',
        '.gm-navbar--align-right .gm-minicart-dropdown': 'right: auto; left: -15px;',
        '.gm-main-menu-wrapper .gm-minicart__txt': 'display: none;',
        media: 'desktop'
      });
    }

    if ((!settings.woocommerceCart && settings.searchForm !== 'disable') || (settings.woocommerceCart && settings.searchForm === 'disable')) {
      css.push({
        '.gm-navigation-drawer .gm-divider--vertical': 'display: none'
      });
    }

    if (settings.searchForm !== 'disable') {
      // Icon sizes
      if (settings.searchFormIconSizeDesktop) {
        css.push({
          '.gm-main-menu-wrapper .gm-search > i': `font-size: ${settings.searchFormIconSizeDesktop}px`,
          media: 'desktop'
        });
      }

      if (settings.searchFormIconSizeMobile) {
        css.push({
          '.gm-search > .gm-icon': `font-size: ${settings.searchFormIconSizeMobile}px`,
          media: 'mobile'
        });
      }

      if (settings.dropdownAppearanceStyle === 'animate-from-bottom') {
        css.push({
          '.gm-dropdown-appearance-animate-from-bottom .gm-open > .gm-search-wrapper': 'visibility: visible; transform: translateY(0); opacity: 1;',
          media: 'desktop'
        });
      }

      // Desktop styles
      css.push({
        // Search
        '.gm-search:not(.fullscreen) .gm-search-wrapper': 'position: absolute; top: 100%; right: 0; width: 350px; padding: 15px 20px; transition: opacity ease 0.3s, visibility ease 0.3s; border-right: 4px solid #93cb52; border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #fff; box-shadow: 0 0 5px rgba(0, 1, 0, 0.3);',
        '.gm-main-menu-wrapper .gm-search': 'cursor: pointer;',
        '.gm-main-menu-wrapper .gm-search > i': 'padding-left: 15px; padding-right: 13px;',
        '.gm-navbar--align-right .gm-search-wrapper': 'right: auto; left: -15px;',
        '.gm-main-menu-wrapper .gm-search__txt': 'display: none;',
        media: 'desktop'
      });

      if (settings.topLevelTextColor) {
        css.push({
          '.gm-main-menu-wrapper .gm-search > i, .gm-main-menu-wrapper .gm-search > .gm-search__txt': `color: ${settings.topLevelTextColor}`,
          media: 'desktop'
        });
      }

      // Mobile navigation text color
      if (settings.responsiveNavigationTextColor) {
        css.push({
          '.gm-navigation-drawer .gm-search': `color: ${settings.responsiveNavigationTextColor}`
        });
      }

      // Fullscreen canvas background color
      if (settings.searchFormFullscreenBackground) {
        css.push({
          '.gm-search__fullscreen-container': `background-color: ${settings.searchFormFullscreenBackground}`
        });
      }


      // Search element styles -----------------------------------------------------------------------------------------

      if (settings.searchFormCloseIconColor) {
        css.push({
          '.gm-search__fullscreen-container .gm-search__close svg': `fill: ${settings.searchFormCloseIconColor}`
        });
      }

      if (settings.searchFormIconColor) {
        css.push({
          '.gm-search__fullscreen-container .gm-search-btn': `color: ${settings.searchFormIconColor} !important`,
          '.gm-search:not(.fullscreen) .gm-search-btn': `color: ${settings.searchFormIconColor} !important`,
        });
      }

      if (settings.searchFormIconColorHover) {
        css.push({
          '.gm-search__fullscreen-container .gm-search-btn:hover': `color: ${settings.searchFormIconColorHover} !important`,
          '.gm-search:not(.fullscreen) .gm-search-btn:hover': `color: ${settings.searchFormIconColorHover} !important`,
        });
      }

      if (settings.searchFormDropdownBackground) {
        css.push({
          '.gm-search:not(.fullscreen) .gm-search-wrapper': `background: ${settings.searchFormDropdownBackground}`,
        });
      }

      if (settings.searchFormInputFieldBackground) {
        css.push({
          '.gm-search__fullscreen-container .gm-search__input[type="text"]': `background: ${settings.searchFormInputFieldBackground}`,
          '.gm-search__fullscreen-container .gm-search-btn': `background: ${settings.searchFormInputFieldBackground} !important`,
          '.gm-search:not(.fullscreen) .gm-search__input': `background: ${settings.searchFormInputFieldBackground}`,
        });
      }

      if (settings.searchFormInputFieldColor) {
        css.push({
          '.gm-search__fullscreen-container .gm-search__input[type="text"]': `color: ${settings.searchFormInputFieldColor}`,
          '.gm-search__fullscreen-container .gm-search__alpha': `color: ${settings.searchFormInputFieldColor}`,
          '.gm-search:not(.fullscreen) .gm-search__input': `color: ${settings.searchFormInputFieldColor}`,
        });
      }

      if (settings.searchFormSideBorderStyle) {
        let searchFormSideBorderThickness = Number(settings.searchFormSideBorderThickness);
        if (!searchFormSideBorderThickness) {
          searchFormSideBorderThickness = 0;
        }

        css.push({
          '.gm-search:not(.fullscreen) .gm-search-wrapper': `border-right: ${searchFormSideBorderThickness}px ${settings.searchFormSideBorderStyle} ${settings.searchFormSideBorderColor}`,
          '.gm-search__fullscreen-container .gm-search__input[type="text"]': `border-bottom: ${settings.searchFormSideBorderThickness}px ${settings.searchFormSideBorderStyle} ${settings.searchFormSideBorderColor}`,
          '.gm-search__fullscreen-container .gm-search-btn': `border-bottom: ${settings.searchFormSideBorderThickness}px ${settings.searchFormSideBorderStyle} ${settings.searchFormSideBorderColor} !important`,
        });
      }

      if (settings.searchFormDropdownBtnBackground) {
        css.push({
          '.gm-search:not(.fullscreen) .gm-search-btn': `background: ${settings.searchFormDropdownBtnBackground}`,
        });
      }

      if (settings.searchFormDropdownBtnHover) {
        css.push({
          '.gm-search:not(.fullscreen) .gm-search-btn:hover': `background: ${settings.searchFormDropdownBtnHover}`,
        });
      }

    }

    // Top level text color
    if (settings.topLevelTextColor) {
      css.push({
        '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > .menu-item > .gm-anchor': `color: ${settings.topLevelTextColor}`,
        media: 'desktop'
      });

      css.push({
        '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-main-menu-wrapper .gm-nav-inline-divider': `background-color: ${settings.topLevelTextColor}`,
        '.gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor': 'position: relative;',
        '.gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': 'position: absolute; width: 1px; height: 30px; opacity: 0.25; content: ""; top: 50%; right: 0; transform: translateY(-50%);',
        '.gm-navbar:not(.gm-navbar-sticky-toggle).gm-navbar--has-divider .gm-main-menu-wrapper .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': `background-color: ${settings.topLevelTextColor}`,
        media: 'desktop'
      });

      if (settings.showDividerBetweenMenuLinksWide) {
        if (settings.headerHeight) {
          css.push({
            '.gm-navbar:not(.gm-navbar-sticky-toggle).gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': `height: ${settings.headerHeight}px;`,
            media: 'desktop'
          });
        }
        if (settings.mobileHeaderHeight) {
          css.push({
            '.gm-navbar-sticky-toggle.gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': `height: ${settings.mobileHeaderHeight}px; max-height: 100%;`,
            media: 'desktop'
          });
        }

        if (hoverStyleNumber === 2 || hoverStyleNumber === 3 || hoverStyleNumber === 7) {
          css.push({
            '.gm-navbar--has-divider .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': 'max-height: 100%;',
            media: 'desktop'
          });
        }

      }

    }

    // Sub level text color
    if (settings.subLevelTextColor) {
      const color = settings.subLevelTextColor;

      css.push({
        '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link': `color: ${color}`,
        media: 'desktop'
      });
    }

    // Sub level text hover color
    if (settings.subLevelTextColorHover) {
      const color = settings.subLevelTextColorHover;

      css.push({
        '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav .gm-dropdown-menu .gm-menu-item__link:hover': `color: ${color}`,
        media: 'desktop'
      });
    }

    // Sub level active link text color
    if (settings.subLevelTextActiveColor) {
      css.push({
        '.gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav .gm-dropdown-menu li.current-menu-ancestor > .gm-menu-item__link, .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav .gm-dropdown-menu li.current-menu-item > .gm-menu-item__link ': `color: ${settings.subLevelTextActiveColor}`,
        media: 'desktop'
      });
    }

    // Sub level hover background color
    if (settings.subLevelBackgroundColorHover) {
      const color = settings.subLevelBackgroundColorHover;

      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav .gm-dropdown-menu .gm-menu-item:hover': `background-color: ${color}`,
        media: 'desktop'
      });
    }

    // Menu title color
    if (settings.menuTitleColor) {
      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item__title, .gm-main-menu-wrapper .gm-mega-menu__item__title .gm-menu-item__txt': 'color:' + settings.menuTitleColor,
        media: 'desktop'
      });
    }

    //Mobile navigation background color
    if (settings.responsiveNavigationBackgroundColor) {
      const color = settings.responsiveNavigationBackgroundColor;

      css.push({
        '.gm-navigation-drawer': `background-color: ${color};`,
        '.gm-mobile-submenu-style-slider .gm-navbar-nav .gm-dropdown-menu-wrapper': `background-color: ${color};`
      });
    }

    // Mobile navigation text color
    if (settings.responsiveNavigationTextColor) {
      css.push({
        '.gm-navigation-drawer .gm-anchor, .gm-navigation-drawer .gm-mega-menu__item__title, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': `color: ${settings.responsiveNavigationTextColor} !important`
      });
    }
    if (settings.mobileItemsBorderStyle) {
      let mobileItemsBorderThickness = Number(settings.mobileItemsBorderThickness);
      if (!mobileItemsBorderThickness) {
        mobileItemsBorderThickness = 0;
      }

      css.push({
        '.gm-navigation-drawer .gm-anchor, .gm-navigation-drawer .gm-mega-menu__item__title': `border-bottom: ${mobileItemsBorderThickness}px ${settings.mobileItemsBorderStyle} ${settings.mobileItemsBorderColor}`
      });

      css.push({
        '.gm-navigation-drawer .gm-divider--vertical': `border-color: ${settings.mobileItemsBorderColor}`
      });
    }

    // Mobile logo position
    if (settings.mobileLogoPosition !== 'default') {
      const {
        mobileLogoMarginTop,
        mobileLogoMarginRight,
        mobileLogoMarginBottom,
        mobileLogoMarginLeft,
      } = settings;

      css.push({
        '.gm-navbar .gm-logo > a': `position: absolute; margin: ${mobileLogoMarginTop}px ${mobileLogoMarginRight}px ${mobileLogoMarginBottom}px ${mobileLogoMarginLeft}px;`,
        media: 'mobile'
      });

      if (settings.mobileLogoPosition === 'left') {

        css.push({
          '.gm-navbar .gm-container .gm-logo': 'flex-grow: 1; justify-content: flex-start;',
          media: 'mobile'
        });

      } else if (settings.mobileLogoPosition === 'center') {

        css.push({
          '.gm-navbar .gm-container .gm-logo': 'flex-grow: 1; justify-content: space-around;',
          media: 'mobile'
        });

      } else if (settings.mobileLogoPosition === 'right') {

        css.push({
          '.gm-navbar .gm-container .gm-logo': 'flex-grow: 1; justify-content: flex-end;',
          media: 'mobile'
        });

      }

    }


    // Mobile Side icon position
    if (settings.mobileSideIconPosition === 'left') {

      css.push({
        '.gm-navbar .gm-container': 'flex-direction: row-reverse !important;',
        media: 'mobile'
      });

    } else if (settings.mobileSideIconPosition === 'right') {

      css.push({
        '.gm-navbar .gm-container': 'flex-direction: row !important;',
        media: 'mobile'
      });

    }

    // mobile toolbar icon colors
    if (settings.mobileToolbarIconColor) {
      css.push({
        '.gm-navigation-drawer .gm-search, .gm-navigation-drawer .gm-minicart': `color: ${settings.mobileToolbarIconColor} !important;`,
        media: 'mobile'
      });
    }

    // mobile_caret_custom_color
    if (settings.mobileCaretCustomColor) {
      css.push({
        '.gm-navigation-drawer .gm-caret': `color: ${settings.mobileCaretCustomColorTop};`,
        '.gm-navigation-drawer .gm-dropdown-menu-wrapper .gm-caret': `color: ${settings.mobileCaretCustomColorSub};`,
        '.gm-navigation-drawer .gm-anchor:hover .gm-caret, .gm-navigation-drawer li.current-menu-parent > .gm-anchor .gm-caret, .gm-navigation-drawer li.current-menu-item > .gm-anchor .gm-caret': `color: ${settings.mobileCaretCustomColorCurrent};`,
        media: 'mobile'
      });
    }

    // Mobile navigation text hover & current skin color
    if (settings.responsiveNavigationHoverTextColor) {
      css.push({
        '.gm-navigation-drawer .gm-anchor:hover, .gm-navigation-drawer li.current-menu-parent > .gm-anchor, .gm-navigation-drawer li.current-menu-item > .gm-anchor': `color: ${settings.responsiveNavigationHoverTextColor} !important`
      });
    }

    if (settings.mobileOffcanvasWidth) {
      if (settings.mobileOffcanvasWidthDynamic) {
        let canvasIndent = 50;

        if (settings.mobileIndependentCssHamburger) {
          // Burger size calc.
          let gmBurgerSize = (settings.hamburgerIconSizeMobile) ? (settings.hamburgerIconSizeMobile) : 12;
          gmBurgerSize = (settings.hamburgerIconPaddingMobile) ? gmBurgerSize + (settings.hamburgerIconPaddingMobile * 2) : gmBurgerSize;
          gmBurgerSize = (settings.hamburgerIconMobileBorderWidth) ? gmBurgerSize + (settings.hamburgerIconMobileBorderWidth * 2) : gmBurgerSize;

          canvasIndent = gmBurgerSize + 8;

          if (canvasIndent < 50) {
            canvasIndent = 50;
          }
        }

        css.push({
          '.gm-navigation-drawer--mobile': 'max-width:' + settings.mobileOffcanvasWidth + 'px; width: calc( 100% - ' + canvasIndent + 'px );',
        });
      } else {
        css.push({
          '.gm-navigation-drawer--mobile': 'width:' + settings.mobileOffcanvasWidth + 'px;',
        });
      }
    }

    if (settings.mobileItemsPaddingY) {
      let caretHeight = settings.mobileItemsPaddingY * 2 + 20;

      css.push({
        '.gm-anchor, .gm-mega-menu__item__title': `padding:${settings.mobileItemsPaddingY}px 0;`,
        '.gm-navigation-drawer .gm-caret': `position: absolute; right: 0; height: ${caretHeight}px; top: auto; padding: calc( ${settings.mobileItemsPaddingY}px + 3px ) 0 ${settings.mobileItemsPaddingY}px 18px; min-width: 50px;`,
        '.gm-navigation-drawer .gm-dropdown > .gm-anchor': 'position: relative;',
        '.gm-navigation-drawer .gm-dropdown > .gm-anchor .gm-menu-item__txt': 'padding-right: 50px;',
        media: 'mobile'
      });
    }

    if (settings.mobileOffcanvasWidthDynamic) {
      // Mobile navigation drawer open type
      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideLeft') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left': 'transform: translate3d(calc( -100% ), 0, 0); left: 0',
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideRight') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right': 'transform: translate3d(calc( 100% ), 0, 0); right: 0'
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideSlide') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left': 'transform: translate3d(calc( -100% ), 0, 0); left: 0',
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(calc( 100% ), 0, 0);'
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right': 'transform: translate3d(calc( 100% ), 0, 0); right: 0',
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(calc( -100% ), 0, 0);'
        });
      }
    } else {
      // Mobile navigation drawer open type
      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideLeft') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left': 'transform: translate3d(-' + settings.mobileOffcanvasWidth + 'px, 0, 0); left: 0',
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideRight') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right': 'transform: translate3d(' + settings.mobileOffcanvasWidth + 'px, 0, 0); right: 0'
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideSlide') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left': 'transform: translate3d(-' + settings.mobileOffcanvasWidth + 'px, 0, 0); left: 0',
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--left.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(' + settings.mobileOffcanvasWidth + 'px, 0, 0);'
        });
      }

      if (settings.mobileNavDrawerOpenType === 'offcanvasSlideSlideRight') {
        css.push({
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right': 'transform: translate3d(' + settings.mobileOffcanvasWidth + 'px, 0, 0); right: 0',
          '.gm-navigation-drawer--mobile.gm-navigation-drawer--right.gm-navigation-drawer--open ~ .gm-nav-content-wrapper': 'transform: translate3d(-' + settings.mobileOffcanvasWidth + 'px, 0, 0);'
        });
      }
    }

    // Hide Mobile menu if so selected
    if (settings.mobileNavMenu && 'none' === settings.mobileNavMenu) {
      css.push({
        '.gm-hide-on-mobile': `display: none`,
        media: 'mobile'
      });
    }

    // Mobile header height
    if (settings.mobileHeaderHeight) {
      css.push({
        '.gm-inner .gm-container': `height: ${settings.mobileHeaderHeight}px`,
        media: 'mobile'
      });
    }

    if (settings.mobileItemTextSize) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': `font-size: ${settings.mobileItemTextSize}px`,
        media: 'mobile'
      });
    }

    if (settings.mobileItemTextCase) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': `text-transform: ${settings.mobileItemTextCase}`,
        media: 'mobile'
      });
    }

    if (settings.mobileItemTextWeight) {
      const textWeight = settings.mobileItemTextWeight.toString();

      if (textWeight !== 'none') {
        const isItalic = textWeight.match(/italic/);
        const filteredTextWeight = textWeight.replace(/italic/, '');

        if (isItalic) {
          css.push({
            '.gm-navigation-drawer--mobile .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': 'font-style: italic',
            media: 'mobile'
          });
        }

        css.push({
          '.gm-navigation-drawer--mobile .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': `font-weight: ${filteredTextWeight}`,
          media: 'mobile'
        });
      }
    }

    if (settings.mobileItemLetterSpacing) {
      const {mobileItemLetterSpacing} = settings;

      css.push({
        '.gm-navigation-drawer--mobile .gm-navbar-nav > .gm-menu-item > .gm-anchor, .gm-navigation-drawer--mobile .gm-navbar-nav .gm-dropdown-menu-title': `letter-spacing: ${mobileItemLetterSpacing}px`,
        media: 'mobile'
      });
    }

    if (settings.mobileSubitemTextSize) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-dropdown-menu .gm-anchor': `font-size: ${settings.mobileSubitemTextSize}px`,
        media: 'mobile'
      });
    }

    if (settings.mobileSubitemTextCase) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-dropdown-menu .gm-anchor': `text-transform: ${settings.mobileSubitemTextCase}`,
        media: 'mobile'
      });
    }

    if (settings.mobileSubitemTextWeight) {
      const textWeight = settings.mobileSubitemTextWeight.toString();

      if (textWeight !== 'none') {
        const isItalic = textWeight.match(/italic/);
        const filteredTextWeight = textWeight.replace(/italic/, '');

        if (isItalic) {
          css.push({
            '.gm-navigation-drawer--mobile .gm-dropdown-menu .gm-anchor': 'font-style: italic',
            media: 'mobile'
          });
        }

        css.push({
          '.gm-navigation-drawer--mobile .gm-dropdown-menu .gm-anchor': `font-weight: ${filteredTextWeight}`,
          media: 'mobile'
        });
      }
    }

    if (settings.mobileSubitemLetterSpacing) {
      const {mobileSubitemLetterSpacing} = settings;

      css.push({
        '.gm-navigation-drawer--mobile .gm-dropdown-menu .gm-anchor': `letter-spacing: ${mobileSubitemLetterSpacing}px`,
        media: 'mobile'
      });
    }

    // Top level menu item text size
    if (settings.itemTextSize) {
      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': `font-size: ${settings.itemTextSize}px`,
        media: 'desktop'
      });
    }

    // Sub level menu item text size
    if (settings.subLevelItemTextSize) {
      css.push({
        '.gm-main-menu-wrapper .gm-menu-item__link': `font-size: ${settings.subLevelItemTextSize}px`,
        media: 'desktop'
      });
    }

    // Top level menu text case
    if (settings.itemTextCase) {
      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': `text-transform: ${settings.itemTextCase}`,
        media: 'desktop'
      });
    }

    // Sub level menu text case
    if (settings.subLevelItemTextCase) {
      css.push({
        '.gm-main-menu-wrapper .gm-menu-item__link': `text-transform: ${settings.subLevelItemTextCase}`,
        media: 'desktop'
      });
    }

    // Menu title text case
    if (settings.megamenuTitleTextCase) {
      const {megamenuTitleTextCase} = settings;

      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item__title, .gm-main-menu-wrapper .gm-mega-menu__item__title .gm-menu-item__txt': `text-transform: ${megamenuTitleTextCase}`,
        media: 'desktop'
      });
    }

    // Menu title text size
    if (settings.megamenuTitleTextSize) {
      const {megamenuTitleTextSize} = settings;

      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item__title, .gm-main-menu-wrapper .gm-mega-menu__item__title .gm-menu-item__txt': `font-size: ${megamenuTitleTextSize}px`,
        media: 'desktop'
      });
    }

    // Menu title text weight
    if (settings.megamenuTitleTextWeight) {
      const textWeight = settings.megamenuTitleTextWeight.toString();

      if (textWeight !== 'none') {
        const isItalic = textWeight.match(/italic/);
        const filteredTextWeight = textWeight.replace(/italic/, '');

        if (isItalic) {
          css.push({
            '.gm-main-menu-wrapper .gm-mega-menu__item__title, .gm-main-menu-wrapper .gm-mega-menu__item__title .gm-menu-item__txt': 'font-style: italic',
            media: 'desktop'
          });
        }

        css.push({
          '.gm-main-menu-wrapper .gm-mega-menu__item__title, .gm-main-menu-wrapper .gm-mega-menu__item__title .gm-menu-item__txt': `font-weight: ${filteredTextWeight}`,
          media: 'desktop'
        });
      }
    }

    // Top level menu text weight
    if (settings.itemTextWeight) {
      const textWeight = settings.itemTextWeight.toString();

      if (textWeight !== 'none') {
        const isItalic = textWeight.match(/italic/);
        const filteredTextWeight = textWeight.replace(/italic/, '');

        if (isItalic) {
          css.push({
            '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': 'font-style: italic',
            media: 'desktop'
          });
        }

        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': `font-weight: ${filteredTextWeight}`,
          media: 'desktop'
        });
      }
    }

    // Sub level menu text weight
    if (settings.subLevelItemTextWeight) {
      const textWeight = settings.subLevelItemTextWeight.toString();

      if (textWeight !== 'none') {
        const isItalic = textWeight.match(/italic/);
        const filteredTextWeight = textWeight.replace(/italic/, '');

        if (isItalic) {
          css.push({
            '.gm-main-menu-wrapper .gm-menu-item__link': 'font-style: italic',
            media: 'desktop'
          });
        }

        css.push({
          '.gm-main-menu-wrapper .gm-menu-item__link': `font-weight: ${filteredTextWeight}`,
          media: 'desktop'
        });
      }
    }

    // Top level menu item letter spacing
    if (settings.itemLetterSpacing) {
      const {itemLetterSpacing} = settings;

      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav > li > .gm-anchor': `letter-spacing: ${itemLetterSpacing}px`,
        media: 'desktop'
      });
    }

    // Sub level menu item letter spacing
    if (settings.subItemLetterSpacing) {
      const {subItemLetterSpacing} = settings;

      css.push({
        '.gm-main-menu-wrapper .gm-menu-item__link': `letter-spacing: ${subItemLetterSpacing}px`,
        media: 'desktop'
      });
    }

    // Menu title letter spacing
    if (settings.menuTitleLetterSpacing) {
      const {menuTitleLetterSpacing} = settings;

      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item__title': `letter-spacing: ${menuTitleLetterSpacing}px`,
        media: 'desktop'
      });
    }

    if (settings.showWpml) {
      if (settings.showWpmlIconSizeDesktop) {
        css.push({
          '.gm-navbar .wpml-ls-flag': 'height: auto; width: ' + settings.showWpmlIconSizeDesktop + 'px',
          media: 'desktop'
        });
      }

      if (settings.showWpmlIconSizeMobile) {
        css.push({
          '.gm-navbar .wpml-ls-flag': 'height: auto; width: ' + settings.showWpmlIconSizeMobile + 'px',
          media: 'mobile'
        });
      }

      // WPML dropdown background color
      if (settings.wpmlDropdownBgColor) {
        css.push({
          '#lang_sel_click ul ul a:visited, #lang_sel_click ul ul a, #lang_sel_click ul ul a:hover': `background-color: ${settings.wpmlDropdownBgColor}`
        });
      }
    }

    // Show WPML
    if (!settings.showWpml) {
      css.push({
        '#lang_sel_click': 'display: none'
      });
    }


    // Hide menu elements when drawler is open.
    if (settings.mobileIndependentCssHamburger) {
      css.push({
        '.gm-navbar .gm-logo, .gm-navbar .gm-menu-actions-wrapper': 'transition: opacity 0.2s 0.18s',
        '.gm-drawer--open .gm-logo, .gm-drawer--open .gm-menu-actions-wrapper': 'opacity: 0; ',
        media: 'mobile'
      });
    }

    // Do not show .gm-burger on desktop.
    css.push({
      '.gm-burger': 'display: none;',
      media: 'desktop'
    });
    // Show burger on mobile.
    css.push({
      '.gm-burger': 'display: block;',
      media: 'mobile'
    });


    // Burger indent.
    if (settings.mobileOffcanvasWidth) {
      css.push({
        '.gm-navigation-drawer--mobile': 'overflow: visible;',
        '.gm-navigation-drawer--mobile .gm-burger': 'position: absolute;',
        '.gm-navigation-drawer--mobile.gm-navigation-drawer--right .gm-burger': 'right: calc( 100% + 15px );',
        '.gm-navigation-drawer--mobile.gm-navigation-drawer--left .gm-burger': 'left: calc( 100% + 15px );',
        '.gm-navigation-drawer--open.gm-navigation-drawer--right .gm-burger': 'right: calc( 100% + 4px );',
        '.gm-navigation-drawer--open.gm-navigation-drawer--left .gm-burger': 'left: calc( 100% + 4px );',
      });
    }

    // Hamburger icon color
    if (settings.hamburgerIconColor) {
      css.push({
        '.gm-menu-btn__inner': `color: ${settings.hamburgerIconColor};`,
        '.gm-menu-actions-wrapper a.gm-minicart-link': `color: ${settings.hamburgerIconColor} !important;`,
        media: 'desktop'
      });
    }

    // Hamburger icon size
    if (settings.hamburgerIconSize) {
      css.push({
        '.gm-menu-btn__inner': `font-size: ${settings.hamburgerIconSize}px;`,
        media: 'desktop'
      });
    }

    // Hamburger icon padding area
    if (settings.hamburgerIconPadding) {
      css.push({
        '.gm-menu-btn__inner': `padding: ${settings.hamburgerIconPadding}px;`,
        media: 'desktop'
      });
    }

    // Hamburger icon bg color
    if (settings.hamburgerIconBgColor) {
      const {hamburgerIconBgColor} = settings;

      css.push({
        '.gm-menu-btn__inner': `background-color: ${hamburgerIconBgColor};`,
        media: 'desktop'
      });
    }

    // Hamburger icon border
    if (
      settings.hamburgerIconBorderWidth !== 0 &&
      settings.hamburgerIconBorderColor
    ) {
      const {
        hamburgerIconBorderWidth: width,
        hamburgerIconBorderColor: color
      } = settings;


      css.push({
        '.gm-menu-btn__inner': `border: ${width}px solid ${color};`,
        media: 'desktop'
      });
    }

    // Mobile hamburger icon color
    if (settings.hamburgerIconColorMobile) {
      css.push({
        '.gm-menu-btn__inner': `color: ${settings.hamburgerIconColorMobile};`,
        '.gm-menu-actions-wrapper a': `color: ${settings.hamburgerIconColorMobile};`,
        '.gm-menu-actions-wrapper a.gm-minicart-link': `color: ${settings.hamburgerIconColorMobile} !important;`,
        '.gm-burger .hamburger-inner, .gm-burger .hamburger-inner::after, .gm-burger .hamburger-inner::before': `background-color: ${settings.hamburgerIconColorMobile};`,
        '.gm-burger.hamburger.is-active .hamburger-inner, .gm-burger.hamburger.is-active .hamburger-inner::after, .gm-burger.hamburger.is-active .hamburger-inner::before': `background-color: ${settings.hamburgerIconColorMobile};`,
        media: 'mobile'
      });
    }

    if (settings.mobileShowWoominicart) {
      if (settings.header.align === 'right' && (settings.header.style === 1 || settings.header.style === 2)) {
        css.push({
          '.gm-navbar .gm-logo': 'flex-grow: 1; justify-content: flex-end;',
          media: 'mobile'
        });
      } else {
        css.push({
          '.gm-navbar .gm-logo': 'flex-grow: 1; justify-content: flex-start;',
          media: 'mobile'
        });
      }
    }

    // Mobile hamburger icon size
    if (settings.hamburgerIconSizeMobile) {
      const {hamburgerIconSizeMobile} = settings;

      css.push({
        '.gm-menu-btn__inner, .gm-navbar .gm-menu-actions-wrapper .gm-minicart .gm-icon': `font-size: ${hamburgerIconSizeMobile}px;`,
        '.gm-burger .hamburger-box, .gm-burger .hamburger-inner, .gm-burger .hamburger-inner::after, .gm-burger .hamburger-inner::before': `width: ${hamburgerIconSizeMobile}px;`,
        media: 'mobile'
      });
    }

    // Mobile hamburger icon bg color
    if (settings.hamburgerIconBgColorMobile) {
      const bgColor = settings.hamburgerIconBgColorMobile;

      css.push({
        '.gm-menu-btn__inner, .gm-burger': `background-color: ${bgColor};`,
        media: 'mobile'
      });
    }

    // Mobile hamburger icon padding area
    if (settings.hamburgerIconPaddingMobile) {
      css.push({
        '.gm-menu-btn__inner, .gm-burger': `padding: ${settings.hamburgerIconPaddingMobile}px;`,
        media: 'mobile'
      });
    } else {
      css.push({
        '.gm-menu-btn__inner, .gm-burger': `padding: 0;`,
        media: 'mobile'
      });
    }

    // Hamburger icon mobile border
    if (
      settings.hamburgerIconMobileBorderWidth !== '0' &&
      settings.hamburgerIconMobileBorderColor
    ) {
      const {
        hamburgerIconMobileBorderWidth: width,
        hamburgerIconMobileBorderColor: color
      } = settings;

      css.push({
        '.gm-menu-btn__inner, .gm-burger': `border: ${width}px solid ${color};`,
        media: 'mobile'
      });
    }

    // Mega menu columns divider color
    if (settings.megaMenuDividerColor) {
      const color = settings.megaMenuDividerColor;

      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item:not(:last-of-type) > .gm-dropdown-menu-wrapper > ul::after': `border-right: 1px solid ${color};`,
        media: 'desktop'
      });
    }

    // Mega menu show links bottom border
    if (settings.megaMenuShowLinksBottomBorder === false) {
      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item .gm-menu-item__link': 'border-bottom: none !important;',
        media: 'desktop'
      });
    }

    // Mega menu links left/right padding
    if (settings.megaMenuLinksSidePadding) {
      css.push({
        '.gm-main-menu-wrapper .gm-mega-menu__item .gm-menu-item__link': `padding-left: ${settings.megaMenuLinksSidePadding}px; padding-right: ${settings.megaMenuLinksSidePadding}px;`,
        media: 'desktop'
      });
    }

    // Toolbar background color
    if (!settings.toolbarIconSwitchBorder) {
      css.push({
        '.gm-navbar .gm-toolbar-socials-list__item': 'border: none!important'
      });
    }

    // Logo height
    if (settings.logoType === 'img') {
      const {
        logoHeight: height,
        logoHeightMobile: heightMobile,
      } = settings;

      css.push({
        '.gm-navbar .gm-logo > a > img': `height: ${height}px`,
        media: 'desktop'
      });

      css.push({
        '.gm-navbar .gm-logo > a > img': `height: ${heightMobile}px`,
        media: 'mobile'
      });
    }

    // Switch mobile logo to alternative
    if (settings.useAltLogoAtMobile) {
      css.push({
        '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-mobile': 'display: none;',
        media: 'mobile'
      });

      css.push({
        '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-mobile-alt': 'display: flex;',
        media: 'mobile'
      });
    } else {
      css.push({
        '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-mobile': 'display: flex;',
        media: 'mobile'
      });

      css.push({
        '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-logo__img-mobile-alt': 'display: none;',
        media: 'mobile'
      });
    }

    // this._append(css);
    // css = [];

    // Desktop styles
    css.push({
      // Grid
      '.gm-navbar .grid': 'flex-basis: 0; flex-grow: 1; max-width: 100%;',
      '.gm-navbar .grid-5': 'max-width: 5%; flex: 0 0 5%;',
      '.gm-navbar .grid-10': 'max-width: 10%; flex: 0 0 10%;',             // 1/10 cols
      '.gm-navbar .grid-11': 'max-width: 11.11111%; flex: 0 0 11.11111%;', // 1/9 cols
      '.gm-navbar .grid-12': 'max-width: 12.5%; flex: 0 0 12.5%;',         // 1/8 cols
      '.gm-navbar .grid-14': 'max-width: 14.28571%; flex: 0 0 14.28571%;', // 1/7 cols
      '.gm-navbar .grid-15': 'max-width: 15%; flex: 0 0 15%;',
      '.gm-navbar .grid-16': 'max-width: 16.66666%; flex: 0 0 16.66666%;', // 1/6 cols
      '.gm-navbar .grid-20': 'max-width: 20%; flex: 0 0 20%;',             // 1/5 cols
      '.gm-navbar .grid-25': 'max-width: 25%; flex: 0 0 25%;',             // 1/4 cols
      '.gm-navbar .grid-30': 'max-width: 30%; flex: 0 0 30%;',
      '.gm-navbar .grid-35': 'max-width: 35%; flex: 0 0 35%;',
      '.gm-navbar .grid-40': 'max-width: 40%; flex: 0 0 40%;',
      '.gm-navbar .grid-45': 'max-width: 45%; flex: 0 0 45%;',
      '.gm-navbar .grid-50': 'max-width: 50%; flex: 0 0 50%;',
      '.gm-navbar .grid-55': 'max-width: 55%; flex: 0 0 55%;',
      '.gm-navbar .grid-60': 'max-width: 60%; flex: 0 0 60%;',
      '.gm-navbar .grid-65': 'max-width: 65%; flex: 0 0 65%;',
      '.gm-navbar .grid-70': 'max-width: 70%; flex: 0 0 70%;',
      '.gm-navbar .grid-75': 'max-width: 75%; flex: 0 0 75%;',
      '.gm-navbar .grid-80': 'max-width: 80%; flex: 0 0 80%;',
      '.gm-navbar .grid-85': 'max-width: 85%; flex: 0 0 85%;',
      '.gm-navbar .grid-90': 'max-width: 90%; flex: 0 0 90%;',
      '.gm-navbar .grid-95': 'max-width: 95%; flex: 0 0 95%;',
      '.gm-navbar .grid-33': 'max-width: 33.33333%; flex: 0 0 33.33333%;', // 1/3 cols
      '.gm-navbar .grid-66': 'max-width: 66.66667%; flex: 0 0 66.66667%;',
      '.gm-navbar .grid-100': 'max-width: 100%; flex: 0 0 100%;',

      // Common
      '.gm-navbar .attachment-menu-thumb, .gm-main-menu-wrapper .attachment-menu-thumb': 'position: absolute; z-index: 1; top: 0; display: none; max-width: none; opacity: 0; transition: opacity 0.2s 0.5s;',
      '.gm-navbar:not(.gm-navbar--align-right) .attachment-menu-thumb': 'left: calc(100% - 30px);',
      '.gm-navbar.gm-navbar--align-right .attachment-menu-thumb': 'right: 100%;',
      '.gm-menu-item.gm-has-featured-img:hover .attachment-menu-thumb': 'display: block;',
      //'.gm-main-menu-wrapper .gm-dropdown-menu': 'position: absolute;',
      //'.gm-main-menu-wrapper .gm-dropdown-menu-wrapper': 'position: absolute; left: 0; visibility: hidden;',
      //'.gm-dropdown-submenu': 'overflow: hidden;',
      '[dir=\'rtl\'] .gm-caret i': 'transform: rotate(180deg);',
      '.gm-caret': 'padding-left: 5px',
      media: 'desktop'
    });

    if (settings.header.style !== 2) {
      css.push({
        '.gm-navbar .gm-menu-btn': 'display: none;',
        '.gm-navbar .gm-menu-actions-wrapper': 'display: none;',
        media: 'desktop'
      });
    }

    // Mobile styles
    css.push({
      // Grid
      '.gm-navbar .mobile-grid': 'flex-basis: 0; flex-grow: 1; max-width: 100%;',
      '.gm-navbar .mobile-grid-5': 'max-width: 5%; flex: 0 0 5%;',
      '.gm-navbar .mobile-grid-10': 'max-width: 10%; flex: 0 0 10%;',             // 1/10 cols
      '.gm-navbar .mobile-grid-11': 'max-width: 11.11111%; flex: 0 0 11.11111%;', // 1/9 cols
      '.gm-navbar .mobile-grid-12': 'max-width: 12.5%; flex: 0 0 12.5%;',         // 1/8 cols
      '.gm-navbar .mobile-grid-14': 'max-width: 14.28571%; flex: 0 0 14.28571%;', // 1/7 cols
      '.gm-navbar .mobile-grid-15': 'max-width: 15%; flex: 0 0 15%;',
      '.gm-navbar .mobile-grid-16': 'max-width: 16.66666%; flex: 0 0 16.66666%;', // 1/6 cols
      '.gm-navbar .mobile-grid-20': 'max-width: 20%; flex: 0 0 20%;',             // 1/5 cols
      '.gm-navbar .mobile-grid-25': 'max-width: 25%; flex: 0 0 25%;',             // 1/4 cols
      '.gm-navbar .mobile-grid-30': 'max-width: 30%; flex: 0 0 30%;',
      '.gm-navbar .mobile-grid-35': 'max-width: 35%; flex: 0 0 35%;',
      '.gm-navbar .mobile-grid-40': 'max-width: 40%; flex: 0 0 40%;',
      '.gm-navbar .mobile-grid-45': 'max-width: 45%; flex: 0 0 45%;',
      '.gm-navbar .mobile-grid-50': 'max-width: 50%; flex: 0 0 50%;',
      '.gm-navbar .mobile-grid-55': 'max-width: 55%; flex: 0 0 55%;',
      '.gm-navbar .mobile-grid-60': 'max-width: 60%; flex: 0 0 60%;',
      '.gm-navbar .mobile-grid-65': 'max-width: 65%; flex: 0 0 65%;',
      '.gm-navbar .mobile-grid-70': 'max-width: 70%; flex: 0 0 70%;',
      '.gm-navbar .mobile-grid-75': 'max-width: 75%; flex: 0 0 75%;',
      '.gm-navbar .mobile-grid-80': 'max-width: 80%; flex: 0 0 80%;',
      '.gm-navbar .mobile-grid-85': 'max-width: 85%; flex: 0 0 85%;',
      '.gm-navbar .mobile-grid-90': 'max-width: 90%; flex: 0 0 90%;',
      '.gm-navbar .mobile-grid-95': 'max-width: 95%; flex: 0 0 95%;',
      '.gm-navbar .mobile-grid-33': 'max-width: 33.33333%; flex: 0 0 33.33333%;',
      '.gm-navbar .mobile-grid-66': 'max-width: 66.66667%; flex: 0 0 66.66667%;',
      '.gm-navbar .mobile-grid-100': 'max-width: 100%; flex: 0 0 100%;',

      // Common
      '.gm-toolbar-bg': 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: opacity 0.2s; z-index: -1;',
      '.gm-container': 'padding-right: 15px; padding-left: 15px; flex-wrap: wrap;',
      '.attachment-menu-thumb': 'display: none;',
      '.gm-dropdown-menu--background': 'background-image: none !important;',
      '.gm-menu-btn': 'display: flex;',
      '.gm-caret': 'padding-left: 15px',
      '.gm-main-menu-wrapper .gm-dropdown-submenu .gm-caret i': 'transform: rotate(90deg)',
      '[dir=\'rtl\'] .gm-main-menu-wrapper .gm-dropdown-submenu .gm-caret i': 'transform: rotate(-90deg)',
      '[dir=\'rtl\'] .gm-navigation-drawer .gm-dropdown-toggle.gm-menu-item__link .gm-caret i': 'transform: rotate(-90deg)',
      media: 'mobile'
    });

    // Hover styles
    if (hoverStyle === 3) {
      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'height: 100%; position: relative;',
        media: 'desktop'
      });
    }

    if (hoverStyle === 5) {
      css.push({
        '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor .gm-menu-item__txt::after': 'display: block; width: 100%; height: 2px; content: ""; transition: all 0.15s ease-out; transform: scale(0, 1); transform-origin: left center;',
        '.gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor .gm-menu-item__txt::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-parent > .gm-anchor .gm-menu-item__txt::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-item > .gm-anchor .gm-menu-item__txt::after, .gm-main-menu-wrapper .gm-navbar-nav > li:hover > .gm-anchor .gm-menu-item__txt::after, .gm-main-menu-wrapper .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor .gm-menu-item__txt::after': 'transform: scale(1, 1);',
        '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor': 'margin-top: 5px; margin-bottom: 5px; padding-top: 0; padding-bottom: 0;',
        media: 'desktop'
      });

      if (settings.topLevelHoverLineThickness) {
        css.push({
          '.gm-main-menu-wrapper .gm-navbar-nav > .menu-item > .gm-anchor .gm-menu-item__txt::after': `height: ${settings.topLevelHoverLineThickness}px;`,
          media: 'desktop'
        });
      }

    }

    css.push({
      '.gm-main-menu-wrapper': 'display: none;',
      media: 'mobile'
    });

    // mobile_menu_wrapper_indent .
    if (settings.mobileMenuWrapperIndent) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-mobile-menu-container': `margin-top: ${settings.mobileMenuWrapperIndent}px;`,
        media: 'mobile'
      });
    }

    // Mobile submenu style SLIDER
    if (settings.mobileSubmenuStyle && 'slider' === settings.mobileSubmenuStyle) {
      css.push({
        '.gm-navigation-drawer--mobile .gm-dropdown-menu-wrapper': 'padding-left: 0;',
        '.gm-navigation-drawer--mobile .gm-dropdown-menu-wrapper .gm-menu-item > .gm-anchor': 'padding-left: 15px;',
        '.gm-navigation-drawer--mobile .gm-dropdown .gm-anchor .gm-caret i.fa-angle-down': 'transform: rotate(270deg);',
        '.gm-navigation-drawer--mobile .gm-dropdown .gm-anchor .gm-caret i.fa-angle-right': 'transform: rotate(0deg);',
        '.gm-navigation-drawer--mobile .gm-dropdown .gm-dropdown-menu-title .gm-caret i.fa-angle-down': 'transform: rotate(90deg);',
        '.gm-navigation-drawer--mobile .gm-dropdown .gm-dropdown-menu-title .gm-caret i.fa-angle-right': 'transform: rotate(180deg);',
        media: 'mobile'
      });

      // mobile_menu_wrapper_indent for slider type.
      if (settings.mobileMenuWrapperIndent) {
        css.push({
          '.gm-navigation-drawer--mobile .gm-dropdown-menu-wrapper::before': `content: ""; display: block; height: ${settings.mobileMenuWrapperIndent}px;`,
          media: 'mobile'
        });
      }

      //Mobile slider title background color.
      if (settings.mobileSliderTitleBackgroundColor) {
        css.push({
          '.gm-mobile-submenu-style-slider .gm-navbar-nav .gm-dropdown-menu-wrapper .gm-dropdown-menu-title': `background-color: ${settings.mobileSliderTitleBackgroundColor};`,
          '.gm-navigation-drawer--mobile .gm-dropdown-menu-wrapper::before': `background-color: ${settings.mobileSliderTitleBackgroundColor};`,
          media: 'mobile'
        });
      }

      //Mobile slider title height.
      if (settings.mobileSliderTitleHeight) {
        css.push({
          '.gm-mobile-submenu-style-slider .gm-dropdown-menu-wrapper .gm-dropdown-menu-title, .gm-mobile-submenu-style-slider .gm-dropdown-menu-wrapper .gm-dropdown-menu-title .gm-caret': `height: ${settings.mobileSliderTitleHeight}px;`,
          '.gm-mobile-submenu-style-slider .gm-dropdown-menu-wrapper .gm-dropdown-menu-title .gm-caret': 'padding-left: 5px;',
          media: 'mobile'
        });
      }
    }


    // Write css array.
    css.push(...this.setStickyStyles());

    this._append(css);
  }


  setStickyStyles () {
    const {settings} = this;
    let css = [];
    const {
      stickyBackgroundColor: backgroundColor,
      stickyBgImage: bgImage,
      stickyBgRepeat: bgRepeat,
      stickyBgAttachment: bgAttachment,
      stickyBgPosition: bgPosition,
      stickyBackgroundColorChangeOnSubmenuOpened,
      stickyBackgroundColorChange
    } = settings;
    // STICKY STYLES

    // DESKTOP SHARED STICKY STYLES
    if (settings.stickyHeader !== 'disable-sticky-header') {

      if (settings.header.style === 1) {
        if (settings.stickyTopLevelTextColorHover) {

          // hover style 2
          if (settings.hoverStyle === '2') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.gm-open > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li:hover > .gm-anchor::after': `border-top-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });

            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li > .gm-anchor:hover, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }

          // hover style 3
          if (settings.hoverStyle === '3') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open, .gm-navbar-sticky-toggle .gm-navbar-nav > li:hover': `background-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }

          // hover style 4
          if (settings.hoverStyle === '4') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li:hover > .gm-anchor': `background-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });

            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li:hover > .gm-anchor': `border-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }

          // hover style 5
          if (settings.hoverStyle === '5') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor .gm-menu-item__txt:after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor .gm-menu-item__txt:after, .gm-navbar-sticky-toggle .gm-navbar-nav > li:hover > .gm-anchor .gm-menu-item__txt:after, .gm-navbar-sticky-toggle .gm-navbar-nav > li > .gm-anchor .gm-menu-item__txt:after': `background-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }

          // hover style 6
          if (settings.hoverStyle === '6') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li > .gm-anchor:hover, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor': `background-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }

          // hover style 7
          if (settings.hoverStyle === '7') {
            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.menu-item > .gm-anchor:hover::after, .gm-navbar-sticky-toggle .gm-navbar-nav > li.menu-item.gm-open > .gm-anchor::after': `border-bottom-color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });

            css.push({
              '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li > .gm-anchor:hover': `color: ${settings.stickyTopLevelTextColorHover} !important`,
              media: 'desktop'
            });
          }
        }

        if (settings.stickyTopLevelTextColorHover2) {
          if (settings.hoverStyle === '3') {
            css.push({
              '.gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li > .gm-anchor:hover, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor,.gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li:hover > .gm-anchor': `color: ${settings.stickyTopLevelTextColorHover2} !important`,
              media: 'desktop'
            });
          }

          if (settings.hoverStyle === '4') {
            css.push({
              '.gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li > .gm-anchor:hover, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-parent > .gm-anchor': `color: ${settings.stickyTopLevelTextColorHover2} !important`,
              media: 'desktop'
            });
          }

          if (settings.hoverStyle === '6') {
            css.push({
              '.gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li > .gm-anchor:hover, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle #gm-main-menu .gm-navbar-nav > li.current-menu-parent > .gm-anchor': `color: ${settings.stickyTopLevelTextColorHover2} !important`,
              media: 'desktop'
            });
          }
        }
      }

      // Sticky menu height
      if (settings.header.style === 1 || settings.header.style === 2) {
        if (settings.headerHeightSticky) {
          css.push({
            '.gm-navbar-sticky-toggle .gm-inner  .gm-container': `height: ${settings.headerHeightSticky}px;`,
            media: 'desktop'
          });
        }
      }

      if (settings.header.style === 3 || settings.header.style === 5) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-wrapper': 'transform: none !important;',
          media: 'desktop'
        });
      }

      if (settings.header.style === 4) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-wrapper': 'transform: none !important;',
          '.gm-navbar-nav > .gm-dropdown > .gm-dropdown-menu-wrapper': 'top: 70px;',
          media: 'desktop'
        });
      }

      // Sticky text logo
      if (settings.stickyLogoTxtWeight && settings.logoType === 'text') {
        const textWeight = settings.stickyLogoTxtWeight.toString();

        if (textWeight !== 'none') {
          const isItalic = textWeight.match(/italic/);
          const filteredTextWeight = textWeight.replace(/italic/, '');

          if (isItalic) {
            css.push({
              '.gm-navbar-sticky-toggle .gm-logo a': 'font-style: italic',
              media: 'desktop'
            });
          } else {
            css.push({
              '.gm-navbar-sticky-toggle .gm-logo a': 'font-style: normal',
              media: 'desktop'
            });
          }

          css.push({
            '.gm-navbar-sticky-toggle .gm-logo a': `font-weight: ${filteredTextWeight}`,
            media: 'desktop'
          });
        }
      }

      //Top level text color sticky
      if (settings.stickyTopLevelTextColor) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-main-menu-wrapper .gm-nav-inline-divider, .gm-navbar-sticky-toggle.gm-navbar--has-divider .gm-main-menu-wrapper .gm-navbar-nav > li:not(:last-of-type) > .gm-anchor::before': `background-color: ${settings.stickyTopLevelTextColor}`,
          media: 'desktop'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-main-menu-wrapper #gm-main-menu .gm-navbar-nav > li > .gm-anchor, .gm-navbar-sticky-toggle .gm-main-menu-wrapper .gm-search > i, .gm-navbar-sticky-toggle .gm-main-menu-wrapper .gm-minicart-icon-wrapper > i': `color: ${settings.stickyTopLevelTextColor}`,
          media: 'desktop'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-main-menu-wrapper .gm-nav-inline-divider': `background-color: ${settings.stickyTopLevelTextColor}`,
          media: 'desktop'
        });
      }

      // Desktop styles
      css.push({
        '.gm-navbar-sticky-toggle .gm-logo__img-default, .gm-navbar-sticky-toggle .gm-logo__img-alt': 'display: none;',
        media: 'desktop'
      });

      // Shared styles
      css.push({
        '.gm-navbar-sticky:not(.gm-navbar-sticky-toggle) .gm-main-menu-wrapper': 'top: 0 !important;'
      });

      // Switch sticky logo to alternative
      if (settings.useAltLogoAtSticky) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky': 'display: none;',
          media: 'desktop'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-alt': 'display: flex;',
          media: 'desktop'
        });
      } else {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky': 'display: flex;',
          media: 'desktop'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-alt': 'display: none;',
          media: 'desktop'
        });
      }

      // Logo height
      if (settings.logoType === 'img') {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo > a > img': `height: ${settings.logoHeightSticky}px`,
          media: 'desktop'
        });
      }

      // Hamburger icon sticky color
      if (settings.hamburgerIconStickyColor) {
        const color = settings.hamburgerIconStickyColor;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `color: ${color};`,
          '.gm-navbar-sticky-toggle .gm-menu-actions-wrapper a.gm-minicart-link': `color: ${color} !important;`,
          media: 'desktop'
        });
      }

      // Hamburger icon sticky size
      if (settings.hamburgerIconStickySize) {
        const size = settings.hamburgerIconStickySize;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `font-size: ${size}px;`,
          media: 'desktop'
        });
      }

      // Hamburger icon bg sticky color
      if (settings.hamburgerIconStickyBgColor) {
        const color = settings.hamburgerIconStickyBgColor;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `background-color: ${color};`,
          media: 'desktop'
        });
      }

      // Hamburger icon sticky padding area
      if (settings.hamburgerIconStickyPadding) {
        const padding = settings.hamburgerIconStickyPadding;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `padding: ${padding}px;`,
          media: 'desktop'
        });
      }

      // Hamburger icon sticky border
      if (
        settings.hamburgerIconStickyBorderWidth !== '0' &&
        settings.hamburgerIconStickyBorderColor
      ) {
        const {
          hamburgerIconStickyBorderWidth: width,
          hamburgerIconStickyBorderColor: color
        } = settings;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `border: ${width}px solid ${color};`,
          media: 'desktop'
        });
      }
    }

    // MOBILE SHARED STICKY STYLES
    if (settings.stickyHeaderMobile !== 'disable-sticky-header') {
      // Switch sticky mobile logo to alternative
      if (settings.useAltLogoAtStickyMobile) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-mobile': 'display: none;',
          media: 'mobile'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-alt-mobile': 'display: flex;',
          media: 'mobile'
        });
      } else {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-mobile': 'display: flex;',
          media: 'mobile'
        });

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo__img-sticky-alt-mobile': 'display: none;',
          media: 'mobile'
        });
      }

      // Logo height
      if (settings.logoType === 'img') {
        css.push({
          '.gm-navbar-sticky-toggle .gm-logo > a > img': `height: ${settings.logoHeightMobileSticky}px`,
          media: 'mobile'
        });
      }

      // Hamburger icon mobile sticky border
      if (
        settings.hamburgerIconMobileStickyBorderWidth &&
        settings.hamburgerIconMobileStickyBorderColor
      ) {
        const {
          hamburgerIconMobileStickyBorderWidth: width,
          hamburgerIconMobileStickyBorderColor: color
        } = settings;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `border: ${width}px solid ${color};`,
          media: 'mobile'
        });
      }

      // Hamburger icon mobile sticky padding area
      if (settings.hamburgerIconMobileStickyPadding) {
        const padding = settings.hamburgerIconMobileStickyPadding;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `padding: ${padding}px;`,
          media: 'mobile'
        });
      }

      // Hamburger icon mobile sticky color
      if (settings.hamburgerIconMobileStickyColor) {
        const color = settings.hamburgerIconMobileStickyColor;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `color: ${color};`,
          '.gm-navbar-sticky-toggle .gm-menu-actions-wrapper a': `color: ${color};`,
          '.gm-navbar-sticky-toggle .gm-menu-actions-wrapper a.gm-minicart-link': `color: ${color} !important;`,
          media: 'mobile'
        });
      }

      // Hamburger icon mobile sticky size
      if (settings.hamburgerIconMobileStickySize) {
        const size = settings.hamburgerIconMobileStickySize;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner, .gm-navbar.gm-navbar-sticky-toggle .gm-menu-actions-wrapper .gm-minicart .gm-icon': `font-size: ${size}px;`,
          media: 'mobile'
        });
      }

      // Hamburger icon mobile bg sticky color
      if (settings.hamburgerIconMobileStickyBgColor) {
        const color = settings.hamburgerIconMobileStickyBgColor;

        css.push({
          '.gm-navbar-sticky-toggle .gm-menu-btn__inner': `background-color: ${color};`,
          media: 'mobile'
        });
      }

      // Mobile header sticky height
      if (settings.mobileHeaderStickyHeight) {
        const height = settings.mobileHeaderStickyHeight;

        css.push({
          '.gm-navbar-sticky-toggle .gm-inner .gm-container': `height: ${height}px`,
          media: 'mobile'
        });
      }
    }

    // SHARED STICKY STYLES
    if (
      settings.stickyHeader !== 'disable-sticky-header' ||
      settings.stickyHeaderMobile !== 'disable-sticky-header') {
      // Sticky text logo
      if (settings.stickyLogoTxtFontSize && settings.logoType === 'text') {
        const fontSize = settings.stickyLogoTxtFontSize;

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo a': `font-size: ${fontSize}px;`
        });
      }

      if (settings.stickyLogoTxtColor && settings.logoType === 'text') {
        const color = settings.stickyLogoTxtColor;

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo a': `color: ${color};`
        });
      }

      if (settings.stickyLogoTxtColorHover && settings.logoType === 'text') {
        const color = settings.stickyLogoTxtColorHover;

        css.push({
          '.gm-navbar-sticky-toggle .gm-logo a:hover': `color: ${color};`
        });
      }

      if (settings.stickyBackgroundColor) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': `background-color: ${backgroundColor}`
        });
      }

      if (settings.header.style !== 2 && stickyBackgroundColorChangeOnSubmenuOpened) {
        if (stickyBackgroundColorChange) {
          css.push({
            '.gm-navbar-dropdown-opened.gm-navbar-sticky-toggle .gm-inner-bg': `background-color: ${stickyBackgroundColorChange}`
          });
        }
      }

      if (settings.stickyBgImage) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': `background-image: url(${bgImage});`
        });
      }

      // Background repeat
      if (settings.stickyBgRepeat) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': `background-repeat: ${bgRepeat}`
        });
      }

      // Background attachment
      if (settings.stickyBgAttachment) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': `background-attachment: ${bgAttachment}`
        });
      }

      // Background position
      if (settings.stickyBgPosition) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': `background-position: ${bgPosition}`
        });
      }

      // Cover background
      if (settings.stickyBgCover) {
        css.push({
          '.gm-navbar-sticky-toggle .gm-inner-bg': 'background-size: cover'
        });
      }

      // Sticky header bottom border thickness
      if (settings.bottomBorderColorSticky) {
        const {
          bottomBorderColorSticky: color,
          bottomBorderThicknessSticky: width
        } = settings;
        const border = `border-bottom-color: ${color}; border-bottom-width: ${width}px`;

        css.push({
          '.gm-navbar-sticky-toggle .gm-inner': border
        });
      }

      // Sticky hover
      if (settings.stickyTopLevelTextColorHover && settings.hoverStyle === '1') {
        css.push({
          '.gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-parent > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-item > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li.current-menu-ancestor > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > .menu-item.gm-open > .gm-anchor, .gm-navbar-sticky-toggle .gm-navbar-nav > li > .gm-anchor:hover': `color: ${settings.stickyTopLevelTextColorHover} !important`
        });
      }
    }

    return css;
  }

  setTopBgStyles () {
    const {settings} = this;
    const {
      backgroundColor,
      backgroundImage,
      backgroundRepeat,
      backgroundAttachment,
      backgroundPosition,
      coverBackground,
      backgroundColorChangeOnSubmenuOpened,
      backgroundColorChange
    } = settings;
    let css = [];

    if (settings.header.style !== 4) {
      if (backgroundColor) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg, .gm-padding': `background-color: ${backgroundColor}`
        });
      }

      if (backgroundImage) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg': `background-image: url(${backgroundImage});`
        });
      }

      // Background repeat
      if (backgroundRepeat) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg': `background-repeat: ${backgroundRepeat}`
        });
      }

      // Background attachment
      if (backgroundAttachment) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg': `background-attachment: ${backgroundAttachment}`
        });
      }

      // Background position
      if (backgroundPosition) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg': `background-position: ${backgroundPosition}`
        });
      }

      // Cover background
      if (coverBackground) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle) .gm-inner-bg': 'background-size: cover'
        });
      }
    } else {
      if (backgroundColor) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': `background-color: ${backgroundColor}`
        });

        css.push({
          '.gm-navbar .gm-inner-bg': `background-color: ${backgroundColor}`,
          media: 'mobile'
        });
      }

      if (backgroundImage) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': `background-image: url(${backgroundImage});`
        });
      }

      // Background repeat
      if (backgroundRepeat) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': `background-repeat: ${backgroundRepeat}`
        });
      }

      // Background attachment
      if (backgroundAttachment) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': `background-attachment: ${backgroundAttachment}`
        });
      }

      // Background position
      if (backgroundPosition) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': `background-position: ${backgroundPosition}`
        });
      }

      // Cover background
      if (coverBackground) {
        css.push({
          '.gm-navbar:not(.gm-navbar-sticky-toggle)': 'background-size: cover'
        });
      }
    }


    if (settings.header.style !== 2 && backgroundColorChangeOnSubmenuOpened) {
      if (backgroundColorChange) {
        css.push({
          '.gm-navbar-dropdown-opened:not(.gm-navbar-sticky-toggle) .gm-inner-bg, .gm-navbar-dropdown-opened .gm-padding': `background-color: ${backgroundColorChange}`
        });
      }
    }


    return css;
  }

  addToHeader (styles) {
    if (document.querySelector('.gm-compiled-css') !== null) {
      document.querySelector('.gm-compiled-css').remove();
    }

    let head = document.head;
    let style = document.createElement('style');

    style.classList.add('gm-compiled-css');
    style.append(styles);
    head.append(style);

    let menuStyles = document.querySelector('.gm-compiled-css');
    menuStyles.append(styles);
  }

  get () {
    this._generate();
    return isRtl() ? rtlcss.process(this.styles) : this.styles;
  }
}
