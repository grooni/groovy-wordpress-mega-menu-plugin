function initSelect (select) {
  let changeEvent = new Event('change');

  // main wrapper
  let selectWrapper = document.createElement('div');
  selectWrapper.classList.add('select');

  // selected option wrapper
  let selectStyled = document.createElement('div');
  selectStyled.classList.add('select-styled');
  selectStyled.textContent = select.options[select.selectedIndex].text;

  selectWrapper.append(selectStyled);

  // ul containing list items
  let list = document.createElement('ul');
  list.classList.add('select-options');
  selectWrapper.append(list);

  select.classList.add('select-hidden');

  if (select.selectedIndex == -1) {
    select.options[0].selected = true;
  }

  [...select.children].forEach((option) => {
    let listHtml = document.createElement('li');

    listHtml.innerHTML = `${option.textContent}`;
    listHtml.setAttribute('rel', option.value);
    list.append(listHtml);
  });

  let listItems = list.children;
  let styledSelect = selectWrapper.querySelector('.select-styled');

  function itemChange (e) {
    e.stopPropagation();

    styledSelect.textContent = this.textContent;
    styledSelect.classList.remove('active');
    select.value = this.getAttribute('rel');
    select.dispatchEvent(changeEvent);
    select.querySelectorAll('option')
      .forEach((option) => {
        option.removeAttribute('selected');
      });
    select.querySelector(`option[value="${this.getAttribute('rel')}"]`)
      .setAttribute('selected', 'selected');
    list.style.display = 'none';
  }

  styledSelect.addEventListener('click', function (e) {
    e.stopPropagation();

    document.querySelectorAll('.select-styled.active')
      .forEach((select) => {
        select.classList.remove('active');
      });
    this.classList.toggle('active');
  }, false);

  [...listItems].forEach((item) => {
    item.addEventListener('click', itemChange);
  });

  document.addEventListener('click', function () {
    styledSelect.classList.remove('active');
  });

  select.after(selectWrapper);
  selectWrapper.append(select);
}

export function handleSelectChanges () {
  const fontSelects = [
    'google_font',
    'logo_txt_font',
    'item_text_weight',
    'mobile_item_text_weight',
    'mobile_subitem_text_weight',
    'item_text_subset',
    'sub_level_item_text_weight',
    'sub_level_item_text_subset',
    'megamenu_title_text_weight',
    'megamenu_title_text_subset',
    'logo_txt_weight',
    'logo_txt_subset',
    'sticky_logo_txt_weight',
    'sticky_logo_txt_subset'
  ];

  if (fontSelects.includes(this.dataset.name)) {
    return;
  }

  if (this.parentElement.matches('.select')) {
    this.closest('.select')
      .after(this);
    this.previousElementSibling.remove();
  }

  initSelect(this);
}
