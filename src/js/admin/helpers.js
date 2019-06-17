import { getAllUrlParams } from '../shared/helpers';

export function setTitle () {
  let pageQuery = getAllUrlParams().page;
  let actionQuery = getAllUrlParams().action;
  let newTitle = document.querySelector('.gm-gui__preset-name').textContent;

  if (pageQuery === 'groovy_menu_settings' && actionQuery === 'edit') {
    document.title = newTitle;
  }
}
