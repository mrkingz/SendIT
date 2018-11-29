let oDropdown, modal;
const baseUrl = 'http://localhost:3000/api/v1';

const getFormData = (fields) => {
	const length = fields.length;
	const data = {};
	for (let i = 0; i < length; i++) {
		data[fields[i]] = document.getElementById(fields[i]).value;
	}
	return JSON.stringify(data);
};

const message = (msg, status) => {
  const parent = document.createElement('div');
  parent.classList.add('control-group');
  const div = document.createElement('div');
  div.classList.add('alert');
  div.classList.add((status || false) ? 'alert-success' : 'alert-danger');
  div.innerHTML = msg;
  parent.appendChild(div);
  document.getElementById('message').appendChild(parent);
};

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
const dropdown = function (id) {
  oDropdown = document.getElementById(id);
  oDropdown.classList.toggle('show');
};

const validateEmpty = (fields) => {
  const length = fields.length;
  let field;
  for (let i = 0; i < length; i++) {
    document.getElementById(fields[i]).classList.remove('invalid');
    field = document.getElementById(fields[i]);
    removeElement(document.getElementById(`${fields[i]}-error`));
    removeListeners(field);
    if (field.value.trim() === '') {
      field.classList.add('invalid');
      displayError(field);
      addListeners(field);
      return true;
    }
  }
  return false;
};

const displayError = (field, msg) => {
  const span = document.createElement('span');
  span.innerHTML = msg || `${field.id} cannot be empty`;
  span.classList.add('error');
  span.id = `${field.id}-error`;
  field.parentNode.appendChild(span);
};

const isEmail = (field) => {
  const exp = /([a-zA-Z0-9_\-.]+)@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9]+\.)+))([a-zA-Z]{2,4}|[0-9]{1.3})/;
  const isValid = field.value.match(exp);
  if (!isValid) {
    addListeners(field);
    field.classList.add('invalid');
    displayError(field, 'Enter a valid email address');
  }
  return isValid;
};

const isValidPassword = (field) => {
  const isValid = field.value.length > 8;
  if (!isValid) {
    addListeners(field);
    field.classList.add('invalid');
    displayError(field, 'Password must be at least 8 characters long');
  }
  return isValid;
};

const focusListener = (e) => {
  const element = e.target;
  if (element !== null) {
    element.classList.remove('invalid');
  }
};

const keypressListener = (e) => {
  const span = document.getElementById(`${e.target.id}-error`);
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
  element.addEventListener('keypress', keypressListener);
};

const removeListeners = (element) => {
  element.removeEventListener('focus', focusListener);
  element.removeEventListener('keypress', keypressListener);
};

// Close the dropdown menu if the user clicks outside of it
window.onclick = (event) => {
  if (event.target === modal) {
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

const toggleEnquiryForm = (event, isShow) => {
  event.preventDefault();
  const div = document.getElementById('enquiry');
  if (isShow) {
    div.style.maxHeight = '500px';
  } else {
    div.style.maxHeight = '0px';
  }
};
