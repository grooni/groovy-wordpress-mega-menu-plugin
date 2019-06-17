function enableMenuThumbnail () {
  const menuItem = this;
  const image = menuItem.querySelector('.attachment-menu-thumb');

  image.style.top = `${menuItem.offsetTop}px`;
  image.style.opacity = '1';
  menuItem.style.position = 'static';
}

function disableMenuThumbnail () {
  const menuItem = this;
  const image = menuItem.querySelector('.attachment-menu-thumb');

  image.style.opacity = '0';
  menuItem.style.position = '';
}

export function initMenuThumbnails () {
  const gmNavbar = document.querySelector('.gm-navbar');
  const thumbnailMenuItems = gmNavbar.querySelectorAll('.gm-has-featured-img');

  thumbnailMenuItems.forEach(function (item) {
    item.addEventListener('mouseenter', enableMenuThumbnail);
    item.addEventListener('mouseleave', disableMenuThumbnail);
  });
}
