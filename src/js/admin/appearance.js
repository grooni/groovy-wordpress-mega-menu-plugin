document.addEventListener('DOMContentLoaded', () => {
  let megaMenus = document.querySelectorAll('.groovymenu-megamenu');
  let bgSelectBtns = document.querySelectorAll('.groovymenu-megamenu-bg-select');
  let bgRemoveBtns = document.querySelectorAll('.groovymenu-megamenu-bg-remove');
  let bgMenuInputs = document.querySelectorAll('.groovymenu-megamenu-bg-input');
  let changeEvent = new Event('change');

  function addBackgroundToMenu (e) {
    e.preventDefault();

    let btn = this;
    let image;

    if (image) {
      image.open();
      return;
    }

    image = wp.media({
      title: 'Upload Image',
      multiple: false
    });

    image.on('select', function () {
      let uploadedImage = image
        .state()
        .get('selection')
        .first()
        .toJSON();

      let thumbImage = uploadedImage.url;

      if (uploadedImage.sizes.thumbnail.url.length) {
        thumbImage = uploadedImage.sizes.thumbnail.url;
      }

      let bgInput = btn
        .closest('.groovymenu-megamenu-bg')
        .querySelector('.groovymenu-megamenu-bg-input');

      bgInput.value = uploadedImage.id;
      bgInput.dataset.url = uploadedImage.url;
      bgInput.dataset.thumbnail = thumbImage;
      bgInput.dispatchEvent(changeEvent);
    });
    image.open();
  }

  function removeBackgroundFromMenu () {
    if (confirm('Remove image?')) {
      let bgInput = this
        .closest('.groovymenu-megamenu-bg')
        .querySelector('.groovymenu-megamenu-bg-input');

      bgInput.value = '';
      bgInput.dataset.url = '';
      bgInput.dataset.thumbnail = '';
      bgInput.dispatchEvent(changeEvent);
    }
    return false;
  }

  function showPreviewThumb () {

    let url = this.dataset.thumbnail;
    let id = this.value;
    let preview = this
      .closest('.groovymenu-megamenu-bg')
      .querySelector('.groovymenu-megamenu-bg-preview');
    let remove = this
      .closest('.groovymenu-megamenu-bg')
      .querySelector('.groovymenu-megamenu-bg-remove');

    if (id !== '') {
      remove.style.display = null;
      let img = document.createElement('img');
      img.setAttribute('src', url);
      preview.innerHTML = '';
      preview.appendChild(img);
    } else if (id === '') {
      remove.style.display = 'none';
      preview.innerHTML = '';
    }
  }

  function toggleVisibility () {
    let dependantBlock = this
      .closest('.menu-item-settings')
      .querySelector('.megamenu-options-depend');
    let isChecked = this.checked;

    dependantBlock.style.display = isChecked ? 'block' : 'none';
  }

  megaMenus.forEach((megaMenu) => {
    megaMenu.addEventListener('change', toggleVisibility);
  });

  bgRemoveBtns.forEach((bgRemoveBtn) => {
    bgRemoveBtn.addEventListener('click', removeBackgroundFromMenu);
  });

  bgSelectBtns.forEach((bgSelectBtn) => {
    bgSelectBtn.addEventListener('click', addBackgroundToMenu);
  });

  bgMenuInputs.forEach((bgMenuInput) => {
    bgMenuInput.addEventListener('change', showPreviewThumb);
  });

  [...bgMenuInputs, ...megaMenus].forEach((el)=> {
    el.dispatchEvent(changeEvent);
  });

  try {
    wpNavMenu.menusChanged = false;
  } catch (e) { } // eslint-disable-line no-empty
});
