/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const places = options => {
  const { state, lga } = options;
  return `<div class="control-group">
            <label class="required" for="state">State</label>
            <select name="${
              state.name
            }" id="state" onchange="loadLGAs(event)" class="control" value="${
    state.stateId
  }">
            <option value="">Select state</option>
            </select>
          </div>
          <div class="control-group">
            <label class="required" for="city">L.G. Area</label>
            <select name="${lga.name}" id="lga" class="control" value="${
    lga.lgaId
  }">
              <option valaue="">Select L.G. Area</option>
            </select>
          </div>`;
};
const editDestinationModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="address">Address</label>
                      <input type="text" class="control" name="destinationAddress" id="address" placeholder="Address" value="${
                        parcel.to.address
                      }">
                    </div>
                    ${places({
                      state: {
                        stateId: parcel.to.stateId,
                        name: "destinationStateId"
                      },
                      lga: { lgaId: parcel.to.lgaId, name: "destinationLGAId" }
                    })}
                    <div class="control-group">
                      <button class="btn btn-primary" onclick="editDestination(event)">Save</button>
                    </div>
                </form>`;
  showModal({
    content,
    title: e.target.innerText,
    callback: () => {
      $("select").css({ color: "initial" });
    }
  });
  loadStates(["state"]);
  document.getElementsByClassName("control")[0].focus();
};

const editParcelModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="weight">Parcel weight</label>
                        <input type="text" id="weight" class="control" name="weight" placeholder="Parcel weight" value="${
                          parcel.weight
                        }">
                      </div>
                      <div class="control-group">
                        <label class="required" for="description">Description</label>
                        <input type="text" class="control" name="description" id="description" placeholder="Description" value="${
                          parcel.description
                        }">
                      </div>
                      <div class="control-group">
                        <label for="delivery-method">Choose your delivery method</label>
                        <div id="delivery-method" class="more-details">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" id="fast" name="deliveryMethod" value="Fast">
                            <label class="form-check-label" for="fast">Fast delivery</label>
                          </div>
                          <div class="form-check m-0">
                            <input class="form-check-input" type="radio" id="normal" name="deliveryMethod" value="Normal"> 
                            <label class="form-check-label" for="normal">Normal delivery</label>
                          </div>
                        </div>
                      </div>
                      <div class="control-group mb-0">
                        <button class="btn btn-primary" onclick="editParcel(event)">Save</button>
                      </div>
                    </form>`;
  showModal({
    content,
    title: e.target.innerText,
    callback: () => {
      const id = parcel.deliveryMethod.toLowerCase();
      document.querySelector(`.control-group #${id}`).checked = true;
    }
  });
  document.getElementsByClassName("control")[0].focus();
};

const editPickupModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="address">Address</label>
                      <input type="text" class="control" name="pickUpAddress" id="address" placeholder="Address" value="${
                        parcel.from.address
                      }" autofocus>
                    </div>
                    ${places({
                      state: {
                        stateId: parcel.from.stateId,
                        name: "pickUpStateId"
                      },
                      lga: { lgaId: parcel.from.lgaId, name: "pickUpLGAId" }
                    })}
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="editPickup(event)">Save</button>
                    </div>
                  </form>`;
  showModal({
    content,
    title: e.target.innerText,
    callback: () => {
      $("select").css({ color: "initial" });
    }
  });
  loadStates(["state"]);
};

const editReceiverModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="receiver-name">Receicver's full name</label>
                      <input type="text" class="control" name="receiverName" id="receiver-name" placeholder="Full name" value="${
                        parcel.to.receiver.name
                      }">
                    </div>         
                    <div class="control-group">
                      <label class="required" for="receiver-phone">Receicver's phone</label>
                      <div class="input-group">
                        <input class="group-member bold country-code" name="countryCode" id="country-code" value="+234">
                        <input type="text" class="control group-member" name="receiverPhone" id="receiver-phone" placeholder="Phone" value="${parcel.to.receiver.phone.substr(
                          -10
                        )}">
                      </div>
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="editReceiver(event)">Save</button>
                    </div>
                  </form>`;
  showModal({
    content,
    title: e.target.innerText
  });
  document.getElementById("receiver-name").focus();
};

const updateLocationModal = e => {
  const { stateId, lgaId } = parcel.presentLocation || {};
  const content = `<form class="form">
                    ${places({
                      state: { stateId, name: "locationStateId" },
                      lga: { lgaId, name: "locationLGAId" }
                    })}
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="updatePresentLocation(event)">Save</button>
                    </div>
                  </form>`;
  showModal({ content, title: e.target.innerText });
  $("#state").css({ color: "initial" });
  loadStates(["state"]);
};

const updateStatusModal = e => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="new-delivery-status">Delivery status</label>
                      <select name="deliveryStatus" id="new-delivery-status" class="control" autofocus>
                        <option value="">Select status</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Transiting">Transiting</option>
                      </select>
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="updateDeliveryStatus(event)">Save</button>
                    </div>
                  </form>`;
  showModal({ content, title: e.target.innerText });
};

const updatePhoneModal = (e, user) => {
  const content = `<form class="form">
                    <div id="phone-div">
                      <div class="control-group">
                        <label class="required" for="phone">Phone number</label>
                        <div class="input-group">
                          <input class="group-member bold country-code" name="countryCode" id="country-code" value="+234">
                          <input type="text" class="control group-member" name="phoneNumber" id="phone-number" placeholder="Phone number" value="${
                            user.phoneNumber ? user.phoneNumber.substr(-10) : ""
                          }">
                        </div>
                      </div>
                    </div>
                    <div class="hide" id="code-div">
                      <div class="mb-lg" id="code-info"></div>
                      <div class="control-group">
                        <label class="required" for="phone">Verification code</label>
                        <input type="text" class="control" id="verification-code" placeholder="Verification code" autofocus>
                      </div>
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" id="submit" onclick="verifyPhone(event, user)">Continue</button>
                    </div>
                    <div id="resend-div" class="size-11 align-right mx-sm mt-lg hide">
                      <span>Code not received?<button class="btn btn-link btn-sm fine-btn ml-md" onclick="resendCode(user); return false">Resend</button></span>
                    </div>08108725001
                  </form>`;
  showModal({ content, title: e.target.innerText });
  document.getElementById("phone-number").focus();
};

const changePasswordModal = (e, user) => {
  const content = `<form class="form">
                    <div class="control-group" id="current-div">
                      <label class="required" for="current-password">Current password</label>
                      <input type="password" class="control" name="password" id="current-password" placeholder="Current password">
                    </div>
                    <div class="hide" id="new-div">
                      <div class="control-group">
                        <label class="required" for="new-password">New password</label>
                        <input type="password" class="control" name="password" id="new-password" placeholder="New password" autofocus>
                      </div>
                      <div class="control-group">
                        <label class="required" for="confirm-password">Confirm password</label>
                        <input type="password" class="control" id="confirm-password" placeholder="Confirm password">
                      </div>
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" id="submit" onclick="changePassword(event)">Continue</button>
                    </div>
                  </form>`;
  showModal({ content, title: e.target.innerText });
  document.getElementById("current-password").focus();
};

const editNameModal = (e, user) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="firstname">Firstname</label>
                      <input type="text" class="control" name="firstname" id="firstname" placeholder="Firstname" value="${
                        user.firstname
                      }" autofocus>
                    </div>
                    <div class="control-group">
                      <label class="required" for="lastname">Lastname</label>
                      <input type="text" class="control" name="lastname" id="lastname" placeholder="Lastname" value="${
                        user.lastname
                      }">
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="updateName(event)">Save</button>
                    </div>
                  </form>`;
  showModal({ content, title: e.target.innerText });
};
