export function initChangeHeader () {
  let align = this.dataset.align;
  let toolbar = this.dataset.toolbar;
  let style = parseInt(this.dataset.style, 10);

  let isHideAlignCenter = (style !== 1 && style !== 2);
  let styleName = document.querySelector(`.gm-gui__header-types__options__list select option[value="${style}"]`).textContent;
  let headerTypes = document.querySelector('#gm-gui__header-types');
  let logoAlignTypeCenter = document.querySelector('.gm-gui__header-types__options__align--center');
  let logoAlignTypes = document.querySelectorAll('.gm-gui__header-types__options__align > span');
  let switcher = document.querySelector('#switch-toolbar-toggle');

  logoAlignTypeCenter.style.display = isHideAlignCenter ? 'none' : 'block';

  // set active align
  logoAlignTypes.forEach((item) => {
    item.classList.remove('active');
  });
  document.querySelector(`.gm-gui__header-types__options__align > span[rel="${align}"]`)
    .classList
    .add('active');

  // set active style from select
  document.querySelector('.gm-gui__header-types__options__list select')
    .closest('.select')
    .querySelector('.select-styled')
    .textContent = styleName;

  // set toolbar switcher
  if (toolbar === true || toolbar === 'true') {
    switcher.checked = true;
  }

  // set html classes
  headerTypes.className = '';
  headerTypes.classList.add(`style-${style}-align-${align}`, `toolbar-${toolbar}`);

  // mutate value obj
  let strValue = JSON.stringify({
    'align': align,
    'style': style,
    'toolbar': toolbar.toString()
  });

  this.value = strValue;
}
