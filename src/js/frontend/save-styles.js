import { isRtl } from '../shared/helpers';
import axios from 'axios';

function saveStyles (options, cssGenerated) {
  let data = {
    'action': 'gm_save_styles',
    'data': cssGenerated,
    'direction': isRtl() ? 'rtl' : 'ltr',
    'preset_id': options.preset.id
  };
  const params = new URLSearchParams(data);
  axios.post(groovyMenuHelper.ajaxurl, params);
}

export function reinsertCompiledStyles (gmStyles, options, cssGenerated) {
  saveStyles(options, cssGenerated);
  gmStyles.addToHeader(cssGenerated);

  if (document.querySelector('#groovy-menu-style-inline-css') !== null) {
    let menuStyles = document.querySelector('.gm-compiled-css');
    menuStyles.remove();
  }
}
