export function uploadMedia (e) {
  e.preventDefault();
  let changeEvent = new Event('change');
  let uploadInput = this
    .closest('.gm-gui__module__media')
    .querySelector('.gm-upload-input');
  var image;

  image = wp.media({
    title: 'Upload Image',
    multiple: false
  })
    .open()
    .on('select', function () {
      var uploadedImage = image
        .state()
        .get('selection')
        .first()
        .toJSON();

      var thumbImage = uploadedImage.url;

      if ('sizes' in uploadedImage) {
        if ('thumbnail' in uploadedImage.sizes) {
          if ('url' in uploadedImage.sizes.thumbnail) {
            if (uploadedImage.sizes.thumbnail.url.length) {
              thumbImage = uploadedImage.sizes.thumbnail.url;
            }
          }
        }
      }

      uploadInput.value = uploadedImage.id;
      uploadInput.setAttribute('data-url', uploadedImage.url);
      uploadInput.setAttribute('data-thumbnail', thumbImage);
      uploadInput.dispatchEvent(changeEvent);
    });
}

export function removeMedia () {
  if (confirm('Remove image?')) {
    let moduleMedia = this.closest('.gm-gui__module__media')
      .querySelector('.gm-upload-input');
    let changeEvent = new Event('change');

    moduleMedia.value = '';
    moduleMedia.dataset.url = '';
    moduleMedia.dataset.thumbnail = '';
    moduleMedia.dispatchEvent(changeEvent);
  }
}

export function changeMedia () {
  let moduleMedia = this.closest('.gm-gui__module__media');

  if (this.value !== '') {
    let logoImg = document.createElement('img');

    logoImg.setAttribute('src', this.dataset.thumbnail);
    moduleMedia.classList.add('gm-gui__module__media--selected');
    moduleMedia.querySelector('.gm-media-preview')
      .append(logoImg);
  } else {
    moduleMedia.classList.remove('gm-gui__module__media--selected');
    moduleMedia.querySelector('.gm-media-preview').innerHTML = '';
  }
}
