function createFieldListener (block, condition) {
  getFieldByCondition(condition)
    .forEach((item) => {
      item.addEventListener('change', function () {
        checkFieldCondition(block);
      });
    });

  checkFieldCondition(block);
}

function getFieldByCondition (condition) {
  let fieldName = condition[0].split('.')[0];
  let matchedFields = document.querySelectorAll(`[data-name="${fieldName}"]`);

  return matchedFields;
}

function isMatch (cond) {
  var show = false;
  var relations = getFieldByCondition(cond);
  var field = cond[0].split('.');
  var value;

  relations.forEach((relation) => {

    if (cond[1] === '==') {

      if (relation.matches('select')) {
        show = relation.value === cond[2];
      }

      if (relation.getAttribute('type') === 'checkbox') {
        show = relation.checked;
        if (cond[2] === 'false') {
          show = !show;
        }

      }

      if (relation.getAttribute('type') === 'radio') {
        if (relation.checked) {
          show = relation.value === cond[2];
        }
      }

      if (field.length === 2) {
        value = relation.dataset[field[1]];
        show = value === cond[2];
      }
    }

    if (cond[1] === 'in') {
      show = cond[2].includes(relation.value.toString());
      if (relation.getAttribute('type') === 'checkbox') {
        show = relation.checked;

      }

      if (relation.getAttribute('type') === 'radio') {
        // fix for initial values
        show = true;

        if (relation.checked) {
          const relationValue = relation.value;

          show = cond[2].includes(relationValue);
        }
      }

      if (field.length === 2) {
        value = relation.dataset[field[1]];
        show = cond[2].includes(value.toString());
      }
    }
  });
  return show;
}

function isResultsMatched (type, results) {
  if (type === 'OR') {
    return results.includes(true);
  }

  if (type === 'NOT') {
    return !results.includes(true);
  }

  return !results.includes(false);
}

function isInlineFieldEmpty (field) {
  var isFieldEmpty = true;
  let modules = field.querySelectorAll('.gm-gui__module');

  if (field.classList.contains('gm-gui-module-wrapper') === false) {
    return;
  }

  modules.forEach(function (module) {
    if (getComputedStyle(module)['display'] !== 'none') {
      isFieldEmpty = false;
    }
  });

  return isFieldEmpty;
}

function checkFieldCondition (field) {
  let conditions = JSON.parse(field.dataset.condition);
  let conditionType = field.dataset.condition_type;
  var show = true;

  if (Array.isArray(conditions) && Array.isArray(conditions[0])) {
    let matchResults = [];

    conditions.forEach((cond) => {
      matchResults.push(isMatch(cond));
    });
    show = isResultsMatched(conditionType, matchResults);
  } else {
    show = isMatch(conditions);
  }

  if (isInlineFieldEmpty(field)) {
    show = false;
  }
  changeFieldVisibility(field, show);
}

function changeFieldVisibility (field, visibility) {
  let changeEvent = new Event('change');

  if (field.matches('option')) {
    field.setAttribute('disabled', !visibility);
    field.dispatchEvent(changeEvent);
  } else {
    if (visibility) {
      field.style.removeProperty('display');
    } else {
      field.style.display = 'none';

      if (field.classList.contains('gm-gui__module__hover-style__item')) {
        let hoverStyleItems = document.querySelectorAll('.gm-gui__module__hover-style__item');

        hoverStyleItems.forEach((item) => {
          if (getComputedStyle(item)['display'] !== 'none') {
            item.classList.remove('active');
            document.querySelector('.gm-gui__module__hover-style__item')
              .classList
              .add('active');
            document.querySelector('.gm-hover-style-input').value = '1';
          }
        });
      }
    }
  }
}

export function startListenerCreation (block) {
  let conditions = JSON.parse(block.dataset.condition);

  if (Array.isArray(conditions) && Array.isArray(conditions[0])) {
    conditions.forEach((cond) => {
      createFieldListener(block, cond);
    });
  } else {
    createFieldListener(block, conditions);
  }
}

