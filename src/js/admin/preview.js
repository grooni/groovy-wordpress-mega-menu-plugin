import groovyTakeScreenshot from './screenshot';
import { getAllUrlParams } from '../shared/helpers';

document.addEventListener('DOMContentLoaded', () => {
  let body = document.body;
  let navbar = document.querySelector('.gm-navbar');
  window.parent.previewMobileWidth = groovyMenuSettings.mobileWidth - 1;
  window.parent.previewChangeBgColor = (color) => {
    body.classList.remove(`bg--${body.dataset.color}`);
    body.classList.add(`bg--${color}`);
    body.setAttribute('data-color', color);
  };

  window.parent.previewChangeSticky = (sticky) => {
    let menuTypeAllowed = groovyMenuSettings.header.style === 1
      || groovyMenuSettings.header.style === 2;
    if (menuTypeAllowed &&
      groovyMenuSettings.stickyHeader !== 'disable-sticky-header') {
      if (sticky) {
        navbar.classList.add('gm-navbar-sticky-toggle');
      } else {
        navbar.classList.remove('gm-navbar-sticky-toggle');
      }
    }
  };

  function generateMinicartItem () {
    let previewMinicartContent = `
        <ul class="woocommerce-mini-cart cart_list product_list_widget">
        <li class="woocommerce-mini-cart-item mini_cart_item">
          <a href="#disabled" class="remove remove_from_cart_button">×</a>
          <a href="#disabled">
            <img src="/wp-content/themes/crane/assets/images/wp/shop_cap.png" class="woocommerce-placeholder wp-post-image">Product 1
          </a>
          <span class="quantity">1 × 
            <span class="woocommerce-Price-amount amount">
            <span class="woocommerce-Price-currencySymbol">$</span>
            20.00</span>
          </span>
        </li>
        <li class="woocommerce-mini-cart-item mini_cart_item">
          <a href="#disabled" class="remove remove_from_cart_button">×</a>
          <a href="#disabled">
            <img src="/wp-content/themes/crane/assets/images/wp/shop_cap.png" class="woocommerce-placeholder wp-post-image">Product 1
          </a>
          <span class="quantity">1 × 
            <span class="woocommerce-Price-amount amount">
            <span class="woocommerce-Price-currencySymbol">$</span>
            20.00</span>
          </span>
        </li>
        </ul>
        <p class="woocommerce-mini-cart__total total">
          <strong>Subtotal:</strong>
          <span class="woocommerce-Price-amount amount">
          <span class="woocommerce-Price-currencySymbol">$</span>50.00
          </span>
        </p>
        <p class="woocommerce-mini-cart__buttons buttons">
          <a href="#disabled" class="button wc-forward">View cart</a>
          <a href="#disabled" class="button checkout wc-forward">Checkout</a>
        </p>`;

    let previewMinicartWrapper = document.querySelector('.widget_shopping_cart_content');

    if (previewMinicartWrapper !== null) {
      previewMinicartWrapper.innerHTML = previewMinicartContent;
      let previewMinicartLinks = previewMinicartWrapper.querySelector('a');
      let cartCounter = document.querySelector('.gm-cart-counter');

      cartCounter.textContent = '2';
      // Prevent call WC event handlers
      previewMinicartLinks.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
      });
    }
  }

  if (groovyMenuSettings.woocommerceCart === true) {
    generateMinicartItem();
  }

});

window.addEventListener('load', () => {
  let screenQuery = getAllUrlParams().screen;
  let preload = document.querySelector('.gm-preload');
  let preview = document.querySelector('.gm-preview');
  let previewLinks = document.querySelectorAll('.gm-preview a');

  preload.classList.add('gm-loaded');
  preview.classList.add('gm-preview-ready');

  previewLinks.forEach((link) => {
    link.setAttribute('href', '#disabled');
  });

  if (screenQuery) {
    let html = document.documentElement;
    let idQuery = getAllUrlParams().id;

    html.classList.add('gm-screenshot-action');
    html.style.width = `${window.innerWidth}px`;
    html.style.height = `600px`;

    setTimeout(() => {
      groovyTakeScreenshot(idQuery, html);
    }, 3000);
  }
});
