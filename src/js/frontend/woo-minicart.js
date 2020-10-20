function updateWooMiniCartCounter () {
  let documentBody = document.querySelector('body');

  if (!documentBody) {
    return;
  }

  let miniCartCounter = documentBody.querySelector('.gm-navbar .gm-minicart .gm-minicart-link .gm-cart-counter');

  if (!miniCartCounter) {
    return;
  }

  let count = miniCartCounter.innerHtml;
  let mobileMiniCart = documentBody.querySelector('.gm-navbar .gm-menu-actions-wrapper .gm-menu-action-btn.gm-minicart .gm-cart-counter');

  if (mobileMiniCart) {
    mobileMiniCart.innerHtml = count;
  }

}

export function watchWooMiniCartCounter () {
  document.addEventListener('added_to_cart', updateWooMiniCartCounter);
}
