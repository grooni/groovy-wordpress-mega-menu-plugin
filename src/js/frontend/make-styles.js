import GmStyles from '../shared/styles';
import {reinsertCompiledStyles} from './save-styles';

class GroovyMenuMakeStyle {
  constructor(options) {
    this.options = options;
    this.init();
  }

  init() {

    let options = this.options;

    let gmStyles = new GmStyles(options);
    let cssGenerated = gmStyles.get();

    const body = document.body;
    const isPreview = body.classList.contains('gm-preview-body');
    let navbar = document.querySelector('.gm-navbar');


    if (navbar) {
      if (navbar.classList.contains('gm-no-compiled-css') || isPreview) {
        gmStyles.addToHeader(cssGenerated);
      }

      if (!isPreview) {
        if (navbar.classList.contains('gm-no-compiled-css') || options.version !== navbar.getAttribute('data-version')) {
          gmStyles.addToHeader(cssGenerated);
          reinsertCompiledStyles(gmStyles, options, cssGenerated);
        }
      }
    }

  }
}


document.addEventListener('DOMContentLoaded', function () {
  if (groovyMenuSettings) {
    window.GroovyMenuMakeStyle = new GroovyMenuMakeStyle(groovyMenuSettings);
  }
});
