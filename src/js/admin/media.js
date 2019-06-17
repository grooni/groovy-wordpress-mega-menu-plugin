export function uploadMedia (e) {
  console.log('uploadMedia')
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
      if (uploadedImage.sizes.medium !== undefined && uploadedImage.sizes.medium.url !== undefined) {
        thumbImage = uploadedImage.sizes.medium.url;
      } else {
        thumbImage = uploadedImage.sizes.full.url;
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
    moduleMedia.querySelector('.gm-media-preview').innerHTML = '';
    console.log(logoImg)
    moduleMedia.querySelector('.gm-media-preview')
      .append(logoImg);
  } else {
    moduleMedia.classList.remove('gm-gui__module__media--selected');
    moduleMedia.querySelector('.gm-media-preview').innerHTML = '';
  }
}
