export function uploadMedia (e) {
  e.preventDefault();
  let changeEvent = new Event('change');
  let moduleMedia = this.closest('.gm-gui__module__media');
  let uploadInput = moduleMedia.querySelector('.gm-upload-input');
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
      /*if (uploadedImage.sizes.medium !== undefined && uploadedImage.sizes.medium.url !== undefined) {
        thumbImage = uploadedImage.sizes.medium.url;
      } else {
        thumbImage = uploadedImage.sizes.full.url;
      }*/

      uploadInput.value = uploadedImage.id;
      uploadInput.setAttribute('data-url', uploadedImage.url);
      uploadInput.setAttribute('data-thumbnail', thumbImage);
      uploadInput.dispatchEvent(changeEvent);

      let moduleMediaInfo = moduleMedia.querySelector('.gm-media-file-info');
      if (moduleMediaInfo) {
        moduleMediaInfo.querySelector('.gm-media-file-info-text--title .gm-text-value').innerHTML = uploadedImage.title;
        moduleMediaInfo.querySelector('.gm-media-file-info-text--alt .gm-text-value').innerHTML = uploadedImage.alt;
        moduleMediaInfo.querySelector('.gm-media-file-info-text--url .gm-text-value').innerHTML = uploadedImage.url;
      }

    });
}

export function removeMedia () {
  if (confirm('Remove image?')) {
    let moduleMedia = this.closest('.gm-gui__module__media');
    let moduleMediaInput = moduleMedia.querySelector('.gm-upload-input');
    let changeEvent = new Event('change');

    let moduleMediaInfo = moduleMedia.querySelector('.gm-media-file-info');
    if (moduleMediaInfo) {
      moduleMediaInfo.classList.add('gm-hidden');
    }

    moduleMediaInput.value = '';
    moduleMediaInput.dataset.url = '';
    moduleMediaInput.dataset.thumbnail = '';
    moduleMediaInput.dispatchEvent(changeEvent);
  }
}

export function changeMedia () {
  let moduleMedia = this.closest('.gm-gui__module__media');
  let moduleMediaInfo = moduleMedia.querySelector('.gm-media-file-info');

  if (this.value !== '') {
    let logoImg = document.createElement('img');

    logoImg.setAttribute('src', this.dataset.thumbnail);
    moduleMedia.classList.add('gm-gui__module__media--selected');
    moduleMedia.querySelector('.gm-media-preview').innerHTML = '';
    moduleMedia.querySelector('.gm-media-preview')
      .append(logoImg);

    moduleMediaInfo.classList.remove('gm-hidden');

  } else {
    moduleMedia.classList.remove('gm-gui__module__media--selected');
    moduleMedia.querySelector('.gm-media-preview').innerHTML = '';

    moduleMediaInfo.classList.add('gm-hidden');
  }
}
