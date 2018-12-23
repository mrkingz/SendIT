/* eslint-disable no-unused-vars */
let oDropdown, modal, vCode, pageReload = false;
const baseUrl = '/api/v1';
$(`input[type='text']`).prop({ autocomplete: 'off' });
$('.control, #submit').on('keypress blur click', () => {
  $('#message div').addClass('zoomOut animated faster').fadeOut(500);
});

$('body').on('change', 'select', (e) => {
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
    method: obj.method || 'POST',
    body: (obj.data || obj.fields) ? obj.data || getFormData(obj.fields) : null,
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

const updateRequest = async (obj) => {
  await hideModal('');
  await showSpinner();
  fetch(request({
    path: obj.path,
    token: localStorage.getItem('token'),
    data: obj['data'],
    method: 'PUT'
  })).then(res => res.json())
    .then((res) => {
      if (res.status === 'Success') {
        pageReload = true;
        toggleSpinner(res.message, res.status);
      } else {
        toggleSpinner(res.message, res.status);
      }
    }).catch(error => toggleSpinner(error.message, error.status));
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

const message = (msg, status, elem, animate = true) => {
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
  if (animate) { 
    addClass(div, ['alert', type[status], 'zoomIn', 'animated']);
  } else {
    addClass(div, ['alert', type[status]]);
  }
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

const hasEmpty = (fields, msg) => {
  const length = fields.length;
  let field, emptyField;
  for (let i = 0; i < length; i++) {
    document.getElementById(fields[i]).classList.remove('invalid');
    field = document.getElementById(fields[i]);
    removeElement(document.getElementById(`${fields[i]}-error`));
    removeListeners(field);
    if (!emptyField && field.value.trim() === '') {
      emptyField = field;
    }
  }
  if (emptyField) {
    displayError(emptyField, msg);
    return true;
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

const isValidWeight = (field) => {
  const intExp = /^[0-9]+$/;
  const floatExp = /(^[0-9]*[.]{1}[0-9]*$)/;
  const isValid = field.value.match(intExp) || field.value.match(floatExp);
  if (!isValid) {
    displayError(field, 'Enter a valid number for weight');
  }
  return isValid;
};

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
    hideModal();
  }

  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn i')) {
    let dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach((d) => {
      if (d.classList.contains('show')) {
        d.classList.remove('show');
      }
    });
  }
};

// // When the user clicks the button, open the modal 
const showModal = (obj) => {
  const { 
    content, title, size, type, id, callback 
  } = obj;
  modal = document.createElement('div');
  modal.classList.add('modal');
  modal.id = id;
  let html = `<div class="modal-content ${size || 'modal-sm'}">
                <div class="modal-header">
                  ${type ? '' : '<span class="close" onclick="hideModal()" tabindex="-1">&times;</span>'}
                </div>`;
  switch (type) {
    case 'confirm':
        html += `<div class="modal-body">
                    <div class="modal-title" id="confirm-title">${title}</div>
                    ${content}
                    <div class="confirm-btns">
                      <button class="btn btn-primary btn-sm" id="confirm-btn">Proceed</button>
                      <button class="btn btn-primary btn-sm" onclick="hideModal()">Cancel</button>
                    </div>
                  </div>`;
        break;
    default: 
        html += `<div class="modal-body">
                  <div class="modal-title">${title}</div>
                  <div class="panel">${content}</div>
                </div>`;
  }
  modal.innerHTML = html.concat('</div>');
  document.querySelector('body').appendChild(modal);
  if (typeof callback === 'function') {
    callback();
  }
  modal.style.display = 'block';
};

const hideModal = () => {
  if (modal) {
    modal.style.display = 'none';
    document.querySelector('body').removeChild(modal);
  }
};

const showSpinner = () => {
  modal = document.createElement('div');
  modal.id = "spinner";
  addClass(modal, ['modal', 'static']);
  modal.innerHTML = `<div class="modal-content modal-sm spinner">
                        <div class="bold" id="spinner-img">
                          <div>
                            <img style="height: 120px;" src="../images/processing.gif" alt="">
                          </div>
                          <div>Please wait...</div>
                        </div>
                        <div class="hide" id="spinner-message">
                          <div class="mb-md" id="success-img"></div>
                          <div id='message'></div>
                          <div class='mb-sm'>
                            <button class='btn btn-primary' onclick="hideSpinner()">Close</button>
                          </div>
                        </div>
                      </div>`;
  document.querySelector('body').appendChild(modal);
  modal.style.display = 'block';
};

const toggleSpinner = (msg, status) => {
  const spinnerImg = document.getElementById('spinner-img');
  const spinnerMsg = document.getElementById('spinner-message');
  addClass(spinnerImg, ['hide']);
  if (status === 'Success') {
    const success = document.createElement('div');
    success.classList.add('size-18');
    success.innerText = 'Succcessful!';
    const img = document.createElement('img');
    addClass(img, ['success-img-spinner', 'bounceInDown', 'animated']);
    img.src = '../images/success.png';
    const successImg = document.getElementById('success-img');
    successImg.appendChild(img);
    successImg.appendChild(success);
  }
  removeClass(spinnerMsg, ['hide']);
  document.querySelector('.modal').classList.remove('static');
  message(msg, status, document.querySelector('#spinner-message #message'), false);
};

const hideSpinner = async () => {
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.style.display = 'none';
    await document.querySelector('body').removeChild(spinner);
  }
  if (pageReload) {
    window.location.reload();
  }
};

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

const verifyPhone = async (e, user) => {
  e.preventDefault();
  const btn = e.target.parentNode;
  const phone = document.getElementById('phone-number');
  processing({ start: true });
  if (!hasEmpty(['phone-number']) && isValidPhone(phone)) {
    const phoneDiv = document.getElementById('phone-div');
    await addClass(phoneDiv, ['zoomOut', 'animated', 'hide']);
    addClass(document.querySelector('.modal'), ['static']);
    document.getElementById('code-div').classList.add('show');
    document.getElementById('resend-div').classList.add('show');
    document.querySelector('.modal-body div').innerText = 'Verify phone number';
    btn.innerHTML = `<button class="btn btn-primary" onclick="verifyCode(event, user, updatePhone)">Confirm</button>`;
    generateCode();
    codeInfo('Enter the code sent to', phone.value);
  } else {
    processing({ start: false, message: 'Continue' });
  }
};

const codeInfo = (msg, phone) => {
  const info = document.getElementById('code-info');
  const num = phone.split('');
  num[5] = '*'; num[6] = '*';
  info.innerHTML = `<div class="alert alert-info bounceIn animated">
                      <div>${msg} <b>${num.join('')}</b></div>
                      <div class="bold"><b class="red-color">Note: </b>Code expires after 3mins</div>
                    </div>`;
};

const generateCode = (phone) => {
  vCode = {
    digit: Math.floor(Math.random() * 900000) + 99999,
    time: new Date().getMinutes() + 3
  };
  console.log(vCode.digit);
};

const verifyCode = (e, user, callback) => {
  e.preventDefault();
  if (!hasEmpty(['verification-code'], 'Enter verification code') && isValideCode()) {
    callback();
  }
};

const resendCode = async (user) => {
  generateCode();
  codeInfo('A new code was sent to', user.phonenumber);
  document.getElementById('verification-code').focus();
};

const isValideCode = () => {
  const min = new Date().getMinutes();
  const elem = document.getElementById('verification-code');
  if (vCode['digit'].toString() !== elem.value) {
    displayError(elem, 'Invalid verification code');
    return false;
  } else if (min > vCode['time']) {
    displayError(elem, 'Code has expired. Resend below');
    return false;
  }
  return true;
};

const signout = () => { 
  localStorage.removeItem('token');
};
