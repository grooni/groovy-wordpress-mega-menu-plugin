let topTabs = document.querySelectorAll('.gm-gui__nav-tabs__item');
let subTabs = document.querySelectorAll('.gm-gui__nav-tabs__sublevel__item');

function toggleTabs (e) {
  e.stopPropagation();
  let tabId = this.dataset.tab;
  let descendantTabs = this.closest('ul')
    .querySelectorAll('li');
  let tabPanes = document.querySelectorAll('.tab-pane');

  [...descendantTabs, ...tabPanes].forEach((item) => {
    item.classList.remove('active');
  });

  this.classList.add('active');
  this.querySelector('.gm-gui__nav-tabs__sublevel__item')
    .click();
document.querySelector(`[data-tab=${tabId}]`)
    .classList
    .add('active');
  document.querySelector(`#${tabId}`)
    .classList
    .add('active');

  let firstSubTab = this.closest('li.active').querySelector('.gm-gui__nav-tabs__sublevel__item').dataset.sublevel;

  localStorage.setItem('gmPresetCurrentTab', firstSubTab);
}

function toggleTabItems (e) {
  e.stopPropagation();
  let sublevelName = this.dataset.sublevel;
  let tabName = this.closest('.gm-gui__nav-tabs__item').dataset.tab;

  localStorage.setItem('gmPresetCurrentTab', sublevelName);
  document.querySelectorAll('.gm-gui__nav-tabs__sublevel__item, .gm-sublevel')
    .forEach((item) => {
      item.classList.remove('active');
    });

  this.classList.add('active');
  document.querySelector(`#gm-sublevel-${tabName}-${sublevelName}`)
    .classList
    .add('active');
}

function activateSavedTab () {
  let gmPresetCurrentTab = localStorage.getItem('gmPresetCurrentTab');

  if (gmPresetCurrentTab === null) {
    topTabs[0].click();
  } else {
    subTabs.forEach((subTab) => {
      if (subTab.dataset.sublevel === gmPresetCurrentTab) {
        subTab.closest('.gm-gui__nav-tabs__item')
          .click();
        subTab.click();
      }
    });
  }
}

export function initTabs () {
  topTabs.forEach((tab) => {
    tab.addEventListener('click', toggleTabs);
  });

  subTabs.forEach((subTab) => {
    subTab.addEventListener('click', toggleTabItems);
  });
  activateSavedTab ();
}
