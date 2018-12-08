let oDropdown, modal;
const baseUrl = '/api/v1';

$('.control').on('keypress blur', () => {
  $('#message div').addClass('zoomOut animated faster').fadeOut(500);
});

$('select').on('change', (e) => {
  const elem = $(e.target);
  elem.css({ color: elem.val().trim() === '' ? '#636c72' : 'initial' });
});

const request = (obj) => {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  if (obj['token']) {
    headers.append('token', obj['token']);
  }
  // We don't body in a GET request
  // So we'll just create the request object with the method and headers 
  if (obj['method'] === 'GET') {
    return new Request(`${baseUrl.concat(obj.path)}`, {
      method: obj['method'],
      headers
    }); 
  }

  return new Request(`${baseUrl.concat(obj.path)}`, {
    method: obj['method'] || 'POST',
    body: obj['data'] || getFormData(obj.fields),
    headers
  });
};

const getFormData = (fields, callback) => {
  const length = fields.length;
  const data = {};
  let field;
  for (let i = 0; i < length; i++) {
    field = document.getElementById(fields[i]);
    data[field.name] = field.value;
  }
  return (typeof callback === 'function')
    ? JSON.stringify(callback(data)) 
    : JSON.stringify(data);
};

const addClass = (element, classes) => {
  classes.forEach((value) => {
    if (!element.classList.contains(value)) {
      element.classList.add(value);
    }
  });
};

const removeClass = (element, classes) => {
  classes.forEach((value) => {
    if (element.classList.contains(value)) {
      element.classList.remove(value);
    }
  });
};


const processing = (obj) => {
  const btn = document.getElementById('submit');
  btn.innerHTML = obj['message'] || 'Processing...';
  if (obj['start']) {
      btn.setAttribute('disabled', obj['start']);
  } else {
      btn.removeAttribute('disabled');
  }
};

const message = (msg, status, elem) => {
  const type = {
    success: 'alert-success',
    fail: 'alert-danger',
    info: 'alert-info'
  };
  status = status ? status.toLowerCase() : 'fail';
  const messageElem = elem || document.getElementById('message');
  messageElem.innerHTML = '';
  const parent = document.createElement('div');
  parent.classList.add('control-group');
  const div = document.createElement('div');
  addClass(div, ['alert', type[status], 'bounceIn', 'animated']);
  div.innerHTML = msg;
  parent.appendChild(div);
  messageElem.appendChild(parent);
};

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
const dropdown = function (id) {
  oDropdown = document.getElementById(id);
  oDropdown.classList.toggle('show');
};

const isUnique = (field, msg) => {
  displayError(field, msg);  
};

const hasEmpty = (fields) => {
  const length = fields.length;
  let field;
  for (let i = 0; i < length; i++) {
    document.getElementById(fields[i]).classList.remove('invalid');
    field = document.getElementById(fields[i]);
    removeElement(document.getElementById(`${fields[i]}-error`));
    removeListeners(field);
    if (field.value.trim() === '') {
      displayError(field);
      return true;
    }
  }
  return false;
};

const displayError = (field, msg) => {
  let span = document.querySelector(`span#${field.id}-error`);
  if (span === null) {
    span = document.createElement('span');
    addClass(span, ['error']);
    span.id = `${field.id}-error`;
    field.parentNode.appendChild(span);
  }
  const errorMessage = (field.nodeName.toLowerCase() === 'select')
                    ? `Please select ${field.id.replace(/[-]+/g, ' ')}`
                    : `${field.id.replace(/[-]+/g, ' ')} cannot be empty`;
  span.innerHTML = msg || errorMessage;
  field.focus();
  
  addClass(field, ['invalid']);
  addListeners(field);
};

const isValidPhone = (field) => {
  const exp = /(^([\+]{1}[1-9]{1,3}|[0]{1})[7-9]{1}[0-1]{1}[0-9]{8})$/;
  const isValid = field.value.match(exp);
  if (!isValid) {
    displayError(field, 'Enter a valid phone number');
  }
  return isValid;
};

const isEmail = (field) => {
  const exp = /([a-zA-Z0-9_\-.]+)@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9]+\.)+))([a-zA-Z]{2,4}|[0-9]{1.3})/;
  const isValid = field.value.match(exp);
  if (!isValid) {
    displayError(field, 'Enter a valid email address');
  }
  return isValid;
};

const isValidPassword = (field) => {
  const isValid = field.value.length > 8;
  if (!isValid) {
    displayError(field, 'Password must be at least 8 characters long');
  }
  return isValid;
};

isValidWeight = (field) => {
  const intExp = /^[0-9]+$/;
  const floatExp = /(^[0-9]*[.]{1}[0-9]*$)/;
  const isValid = field.value.match(intExp) || field.value.match(floatExp) ? true : false;
  if (!isValid) {
    displayError(field, 'Enter a valid number for weight');
  }
  return isValid;
}

const focusListener = (e) => {
  const element = e.target;
  if (element !== null) {
    element.classList.remove('invalid');
  }
};

const changeListener = (e) => {
  const element = e.target;
  element.classList.remove('invalid');
  const span = document.getElementById(`${element.id}-error`);
  const button = document.getElementById('submit');
  if (button !== null ) {
    button.removeAttribute('disabled');
  }
  if (span !== null) {
    span.remove();
  }
};

const keypressListener = (e) => {
  const element = e.target;
  element.classList.remove('invalid');
  const span = document.getElementById(`${element.id}-error`);
  const button = document.getElementById('submit');
  if (button !== null ) {
    button.removeAttribute('disabled');
  }
  if (span !== null) {
    span.remove();
  }
};

const removeElement = (element) => {
  if (element !== null) {
    element.parentNode.removeChild(element);
  }
};

const addListeners = (element) => {
  element.addEventListener('focus', focusListener);
  if (element.nodeName.toLowerCase() === 'select') {
    element.addEventListener('change', changeListener);
  } else {
    element.addEventListener('keypress', keypressListener);
  }
};

const removeListeners = (element) => {
  element.removeEventListener('focus', focusListener);
  if (element.nodeName.toLowerCase() === 'select') {
    element.removeEventListener('change', changeListener);
  } else {
    element.removeEventListener('keypress', keypressListener);
  }
};

// Close the dropdown menu if the user clicks outside of it
window.onclick = (event) => {
  if (event.target === modal && !modal.classList.contains('static')) {
    modal.style.display = 'none';
  }

  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn i')) {
    let dropdowns = document.getElementsByClassName('dropdown-content');

    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// // When the user clicks the button, open the modal 
const showModal = (modalId) => {
  modal = document.getElementById(modalId);
  modal.style.display = 'block';
};

const hideModal = () => {
  modal.style.display = 'none';
};

const showSpinner = () => {
  const modal = document.createElement('div')
  modal.id = "spinner";
  addClass(modal, ['modal', 'static']);
  modal.innerHTML = ` <div class="modal-content modal-sm spinner">
                          <div class="bold" id="spinner-img">
                              <div><img style="height: 120px;" src="../images/processing.gif" alt=""></div>
                              <div>Please wait...</div>
                          </div>
                          <div class="hide" id="spinner-message">
                              <div id='message'></div>
                              <div class=''><button class='btn btn-primary' onclick="hideSpinner()">Close</button></div>
                          </div>
                      </div>`;
  document.querySelector('body').appendChild(modal);
  showModal('spinner');
}

const toggleSpinner = (msg, status) => {
  const spinnerImg = document.getElementById('spinner-img');
  const spinnerMsg = document.getElementById('spinner-message');
  addClass(spinnerImg, ['hide']);
  removeClass(spinnerMsg, ['hide']);
  message(msg, status, document.querySelector('#spinner-message #message'));
}

const hideSpinner = () => {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'none';
  document.querySelector('body').removeChild(spinner)
}

const toggleEnquiryForm = (event, isShow) => {
  event.preventDefault();
  const div = document.getElementById('enquiry');
  if (isShow) {
    div.style.maxHeight = '500px';
  } else {
    div.style.maxHeight = '0px';
  }
};

const toggleOrder = async (obj) => {
  document.getElementById('message').innerHTML = '';
  const newOrder = document.getElementById('new-order');
  if (obj.show) {
    toggleOrderSteps(newOrder.nextElementSibling, false, obj.animation).then(() => {
      toggleOrderSteps(newOrder, true, obj.animation);
    });
  } else {
    toggleOrderSteps(newOrder, false, obj.slide).then((elem) => {
      toggleOrderSteps(elem.nextElementSibling, true, obj.animation);
    });
  }
};

const toggleOrderSteps = async (elem, isShow, animation) => {
  await removeClass(elem, [
    'bounceInLeft', 'bounceInRight', 'bounceOut', 'bounceIn', 'animated'
  ]);
  if (!isShow) {
    await addClass(elem, ['bounceOut', 'animated']);
    await $.when($(`#${elem.id}`).fadeOut());
  } else {
    $(`#${elem.id}`).show();
    addClass(elem, [`${animation}`, 'animated']);
  }
  return Promise.resolve(elem);
};

const signout = () => { 
  localStorage.removeItem('token');
};
