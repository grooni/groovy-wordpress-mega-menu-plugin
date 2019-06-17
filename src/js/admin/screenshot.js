import html2canvas from 'html2canvas';
import axios from 'axios';

function groovyRefreshScreen (id, url) {
  let preset = window.parent.document.querySelector(`.preset[data-id="${id}"] .preset-placeholder img`);

  preset.setAttribute('src', url);
}

function groovyRemoveScreenshotFrame (id) {
  let iframe = window.parent.document.querySelector(`#screenshot-iframe-${id}`);
  iframe.remove();
}

export default function groovyTakeScreenshot (id, element) {
  setTimeout(() => {
    html2canvas(element)
      .then(
        canvas => {
          let dataURL = canvas.toDataURL();
          let data = {
            image: dataURL
          };
          const params = new URLSearchParams(data);

          groovyRefreshScreen(id, dataURL);

          axios.post('', params)
            .then(() => {
              groovyRemoveScreenshotFrame(id);
            });

        }
      );
  }, 500);
}
