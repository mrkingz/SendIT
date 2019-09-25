/* eslint-disable no-unused-vars */
let oDropdown,
  modal,
  vCode,
  pageReload = false;
const baseUrl = "/api/v1";
$(`input[type='text']`).prop({ autocomplete: "off" });
$(".control, #submit").on("keypress blur click", () => {
  $("#message div")
    .addClass("zoomOut animated faster")
    .fadeOut(500);
});

$("body").on("change", "select", e => {
  const elem = $(e.target);
  elem.css({ color: elem.val().trim() === "" ? "#636c72" : "initial" });
});

const request = options => {
  const { method, path, data, fields, setContentType } = options;
  const token = localStorage.getItem("token");
  const bool = typeof setContentType === "undefined" ? true : setContentType;
  const headersOptions = bool
    ? { token, Accept: "application/json", "Content-type": "application/json" }
    : { token, Accept: "application/json" };
  const headers = new Headers(headersOptions);
  return new Request(
    `${baseUrl.concat(path)}`,
    // Remember, we don't need body in a GET request
    method === "GET"
      ? { method, headers }
      : {
          method: method || "POST",
          body: data || fields ? data || getFormData(fields) : null,
          headers
        }
  );
};

const getFormData = (fields = [], callback) => {
  const length = fields.length;
  const data = {};
  let field;
  for (let i = 0; i < length; i++) {
    field = document.getElementById(fields[i]);
    data[field.name] = field.value;
  }
  return typeof callback === "function"
    ? JSON.stringify(callback(data))
    : JSON.stringify(data);
};

const updateRequest = async (options, callback) => {
  await hideModal("");
  await showSpinner(options.callback);
  fetch(request({ ...options, method: "PUT" }))
    .then(res => res.json())
    .then(res => {
      if (res.status === "Success") {
        pageReload =
          typeof options.reload === "undefined" ? true : options.reload;
        toggleSpinner(res.message, res.status);
      } else toggleSpinner(res.message, res.status);
      if (typeof callback === "function") callback();
    })
    .catch(error => toggleSpinner(error.message, error.status));
};

const addClass = (element, classes) => {
  classes.forEach(value => {
    if (element && !element.classList.contains(value)) {
      element.classList.add(value);
    }
  });
};

const removeClass = (element, classes) => {
  classes.forEach(value => {
    if (element && element.classList.contains(value)) {
      element.classList.remove(value);
    }
  });
};

const processing = obj => {
  const btn = document.getElementById("submit");
  btn.innerHTML = obj["message"] || "Processing...";
  if (obj["start"]) {
    btn.setAttribute("disabled", obj["start"]);
  } else {
    btn.removeAttribute("disabled");
  }
};

const message = (msg, status, elem, animate, cls) => {
  const type = {
    success: "alert-success",
    fail: "alert-danger",
    info: "alert-info"
  };
  status = status ? status.toLowerCase() : "fail";
  const messageElem = elem || document.getElementById("message");
  messageElem.innerHTML = "";
  const parent = document.createElement("div");
  parent.classList.add("control-group");
  const div = document.createElement("div");
  if (animate) {
    addClass(div, ["alert", type[status], cls || "zoomIn", "animated"]);
  } else {
    addClass(div, ["alert", type[status]]);
  }
  div.innerHTML = msg;
  parent.appendChild(div);
  messageElem.appendChild(parent);
};

const isUnique = (field, msg) => {
  displayError(field, msg);
};

const hasEmpty = (fields, msg) => {
  let elem, emptyField;
  fields.forEach(field => {
    document.getElementById(field).classList.remove("invalid");
    elem = document.getElementById(field);
    removeElement(document.getElementById(`${field}-error`));
    removeListeners(elem);
    if (!emptyField && elem.value.trim() === "") {
      emptyField = elem;
    }
  });
  if (emptyField) {
    displayError(emptyField, msg);
    return true;
  }
  return false;
};

const displayError = (field, msg) => {
  let span = document.querySelector(`span#${field.id}-error`);
  if (span === null) {
    span = document.createElement("span");
    addClass(span, ["error"]);
    span.id = `${field.id}-error`;
    field.closest(".control-group").appendChild(span);
  }
  const errorMessage =
    field.nodeName.toLowerCase() === "select"
      ? `Please select ${field.id.replace(/[-]+/g, " ")}`
      : `${field.id.replace(/[-]+/g, " ")} cannot be empty`;
  span.innerHTML = msg || errorMessage;
  field.focus();

  addClass(field, ["invalid"]);
  addListeners(field);
};

const isValidPhone = field => {
  const exp = /(^(([\+]{0,1}|([0]{2}[9]{1}))[1-9]{1,3}|[0]{0,1})[7-9]{1}[0-1]{1}[0-9]{8})$/;
  const isValid = field.value.match(exp);
  if (!isValid) {
    displayError(field, "Enter a valid phone number");
  }
  return isValid;
};

const isEmail = field => {
  const exp = /([a-zA-Z0-9_\-.]+)@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9]+\.)+))([a-zA-Z]{2,4}|[0-9]{1.3})/;
  const isValid = field.value.match(exp);
  if (!isValid) {
    displayError(field, "Enter a valid email address");
  }
  return isValid;
};

const isValidPassword = field => {
  const isValid = field.value.length > 8;
  if (!isValid) {
    displayError(field, "Password must be at least 8 characters long");
  }
  return isValid;
};

const isValidWeight = field => {
  const intExp = /^[0-9]+$/;
  const floatExp = /(^[0-9]*[.]{1}[0-9]*$)/;
  const isValid = field.value.match(intExp) || field.value.match(floatExp);
  if (!isValid) {
    displayError(field, "Enter a valid number for weight");
  }
  return isValid;
};

const focusListener = e => {
  const element = e.target;
  if (element !== null) {
    element.classList.remove("invalid");
  }
};

const changeListener = e => {
  const element = e.target;
  element.classList.remove("invalid");
  const span = document.getElementById(`${element.id}-error`);
  const button = document.getElementById("submit");
  if (button !== null) {
    button.removeAttribute("disabled");
  }
  if (span !== null) {
    span.remove();
  }
};

const keypressListener = e => {
  const element = e.target;
  element.classList.remove("invalid");
  const span = document.getElementById(`${element.id}-error`);
  const button = document.getElementById("submit");
  if (button !== null) {
    button.removeAttribute("disabled");
  }
  if (span !== null) {
    span.remove();
  }
};

const removeElement = element => {
  if (element !== null) {
    element.parentNode.removeChild(element);
  }
};

const addListeners = element => {
  element.addEventListener("focus", focusListener);
  if (element.nodeName.toLowerCase() === "select") {
    element.addEventListener("change", changeListener);
  } else {
    element.addEventListener("keypress", keypressListener);
  }
};

const removeListeners = element => {
  element.removeEventListener("focus", focusListener);
  if (element.nodeName.toLowerCase() === "select") {
    element.removeEventListener("change", changeListener);
  } else {
    element.removeEventListener("keypress", keypressListener);
  }
};

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
const dropdown = id => {
  if (oDropdown && oDropdown.id !== id) {
    oDropdown.classList.remove("show");
  }
  oDropdown = document.getElementById(id);
  oDropdown.classList.toggle("show");
};

//Close the dropdown menu if the user clicks outside of it
window.onclick = event => {
  if (event.target === modal && !modal.classList.contains("static")) {
    hideModal();
  }
  if (
    !event.target.matches(".dropbtn") &&
    !event.target.matches(".dropbtn *")
  ) {
    let dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach(d => {
      if (d.classList.contains("show")) {
        d.classList.remove("show");
        oDropdown = null;
      }
    });
  }
};

const confirmModal = (content, type, callback) => {
  showModal({
    content,
    title: `Confirm ${type}`,
    type: "confirm",
    callback: () => {
      document
        .getElementById("confirm-btn")
        .addEventListener("click", callback);
    }
  });
};

const alertModal = options => {
  showModal({
    type: "alert",
    title: options.title || "Successfull!",
    content: `<div class="alert alert-${options.type || "success"}">${
      options.message
    }</div>`
  });
};

// // When the user clicks the button, open the modal
const showModal = obj => {
  const { content, title, size, type, id, callback } = obj;
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = id;
  let html = `<div class="modal-content ${size || "modal-sm"}">
                <div class="modal-header">
                  ${
                    type
                      ? ""
                      : '<span class="close" onclick="hideModal()" tabindex="-1">&times;</span>'
                  }
                </div>`;
  switch (type) {
    case "alert":
    case "confirm":
      html += `<div class="modal-body">
                    <div class="modal-title" id="confirm-title">${title}</div>
                      ${content}
                    <div class="confirm-btns mt-md">
                      ${
                        type === "alert"
                          ? ""
                          : '<button class="btn btn-primary" id="confirm-btn">Proceed</button>'
                      } 
                      <button class="btn btn-primary" onclick="hideModal()">
                        ${type === "alert" ? "Close" : "Cancel"}
                      </button>
                    </div>
                  </div>`;
      break;
    default:
      html += `<div class="modal-body">
                  <div class="modal-title">${title}</div>
                  <div class="panel">${content}</div>
                </div>`;
  }
  modal.innerHTML = html.concat("</div>");
  document.querySelector("body").appendChild(modal);
  if (typeof callback === "function") {
    callback();
  }
  modal.style.display = "block";
};

const hideModal = () => {
  if (modal) {
    modal.style.display = "none";
    document.querySelector("body").removeChild(modal);
  }
};
const showSpinner = callback => {
  modal = document.createElement("div");
  modal.id = "spinner";
  addClass(modal, ["modal", "static"]);
  modal.innerHTML = `<div class="modal-content modal-sm spinner">
                        <div class="bold" id="spinner-img">
                          <div>
                            <img style="height: 110px;" src="../images/processing.gif" alt="">
                          </div>
                          <div>Please wait...</div>
                        </div>
                        <div class="hide" id="spinner-message">
                          <div class="mb-md" id="success-img"></div>
                          <div id='message'></div>
                          <div class='mb-sm spinner-btn'>
                            <button class='btn btn-primary' id="close">Close</button>
                          </div>
                        </div>
                      </div>`;
  document.querySelector("body").appendChild(modal);
  modal.style.display = "block";
  document
    .querySelector(".spinner-btn #close")
    .addEventListener("click", () => {
      hideSpinner(callback);
    });
};

const toggleSpinner = (msg, status) => {
  const spinnerImg = document.getElementById("spinner-img");
  const spinnerMsg = document.getElementById("spinner-message");
  addClass(spinnerImg, ["hide"]);
  if (status === "Success") {
    const success = document.createElement("div");
    success.classList.add("size-18");
    success.innerText = "Succcessful!";
    const img = document.createElement("img");
    addClass(img, ["success-img-spinner", "bounceInDown", "animated"]);
    img.src = "../images/success.png";
    const successImg = document.getElementById("success-img");
    successImg.appendChild(img);
    successImg.appendChild(success);
  }
  removeClass(spinnerMsg, ["hide"]);
  document.querySelector(".modal").classList.remove("static");
  message(
    msg,
    status,
    document.querySelector("#spinner-message #message"),
    false
  );
};

const hideSpinner = async callback => {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.style.display = "none";
    await document.querySelector("body").removeChild(spinner);
  }
  if (typeof callback === "function") return callback();
  if (pageReload) window.location.reload();
};

const toggleEnquiryForm = (event, isShow) => {
  event.preventDefault();
  const div = document.getElementById("enquiry");
  if (isShow) {
    div.style.maxHeight = "500px";
  } else {
    div.style.maxHeight = "0px";
  }
};

const toggleOrder = async obj => {
  document.getElementById("message").innerHTML = "";
  const newOrder = document.getElementById("new-order");
  if (obj.show) {
    toggleOrderSteps(newOrder.nextElementSibling, false, obj.animation).then(
      () => {
        toggleOrderSteps(newOrder, true, obj.animation);
      }
    );
  } else {
    toggleOrderSteps(newOrder, false, obj.slide).then(elem => {
      toggleOrderSteps(elem.nextElementSibling, true, obj.animation);
    });
  }
};

const toggleOrderSteps = async (elem, isShow, animation) => {
  await removeClass(elem, [
    "bounceInLeft",
    "bounceInRight",
    "bounceOut",
    "bounceIn",
    "animated"
  ]);
  if (!isShow) {
    await addClass(elem, ["bounceOut", "animated"]);
    await $.when($(`#${elem.id}`).fadeOut());
  } else {
    $(`#${elem.id}`).show();
    addClass(elem, [`${animation}`, "animated"]);
  }
  return Promise.resolve(elem);
};

const loadStates = async array => {
  await fetch(
    request({
      path: "/states",
      method: "GET"
    })
  )
    .then(res => res.json())
    .then(result => {
      let options = "";
      result.states.forEach(item => {
        options += `<option value="${item.stateId}">${item.state}</option>`;
      });
      return options;
    })
    .then(options => {
      array.forEach(item => {
        document
          .getElementById(`${item}`)
          .insertAdjacentHTML("beforeend", options);
      });
    });
};

const loadLGAs = async e => {
  const stateId = e.target.value;
  const lgaNode = document.getElementById(
    `${e.target.id.replace("state", "lga")}`
  );
  let options = `<option value="">Select L.G.Area</option>`;
  if (stateId) {
    await fetch(
      request({
        path: `/states/${stateId}/lgas`,
        method: "GET"
      })
    )
      .then(res => res.json())
      .then(result => {
        result.lgas.forEach(item => {
          options += `<option value="${item.lgaId}">${item.lga}</option>`;
        });
        return options;
      })
      .then(ops => {
        lgaNode.innerHTML = "";
        lgaNode.insertAdjacentHTML("beforeend", ops);
      });
  } else {
    lgaNode.innerHTML = options;
  }
  lgaNode.style.color = "#636c72";
};

const signout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
