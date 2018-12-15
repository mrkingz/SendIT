const editDestinationModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="address">Address</label>
                      <input type="text" class="control" name="destinationAddress" id="address" placeholder="Address">
                    </div>
                    <div class="control-group">
                      <label class="required" for="state">State</label>
                      <select name="destinationState" id="state" class="control">
                      <option value="Imo">Imo</option>
                        <option value="Kano">Kano</option>
                        <option value="Lagos">Lagos</option>
                      </select>
                    </div>
                    <div class="control-group">
                      <label class="required" for="city">City/Town</label>
                      <input type="text" class="control" name="destinationCity" id="city" placeholder="City/Town">
                    </div>
                    <div class="control-group">
                      <button class="btn btn-primary" onclick="editDestination(event)">Save</button>
                    </div>
                </div>
                </form>`;
  showModal({
    content, 
    title: e.target.innerText, 
    callback: () => {
      const state = document.getElementById('state');
      document.getElementById('address').value = parcel.destinationaddress;
      state.value = parcel.destinationstate;
      document.getElementById('city').value = parcel.destinationcity;
      state.style.color = 'initial';
    }
  });
  document.getElementById('address').focus();
};

const editParcelModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="weight">Parcel weight</label>
                        <input type="text" id="weight" class="control" name="weight" placeholder="Parcel weight">
                      </div>
                      <div class="control-group">
                        <label for="description">Description</label>
                        <input type="text" class="control" name="description" id="description" placeholder="Description">
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
      document.querySelector('.control-group #weight').value = parcel.weight;
      document.querySelector('.control-group #description').value = parcel.description;
      document.querySelector(`.control-group #${parcel.deliverymethod.toLowerCase()}`).checked = true;
    }
  });
  document.querySelector('.control-group #weight').focus();
};

const editPickupModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="pick-up-address">Address</label>
                      <input type="text" class="control" name="pickupAddress" id="pick-up-address" placeholder="Address">
                    </div>
                    <div class="control-group">
                      <label class="required" for="pick-up-state">State</label>
                      <select id="pick-up-state" name="pickupState" class="control">
                        <option value="Abuja">Abuja</option>
                        <option value="Lagos">Lagos</option>
                      </select>
                    </div>
                    <div class="control-group">
                      <label class="required" for="pick-up-city">City/Town</label>
                      <input type="text" class="control" name="pickupCity" id="pick-up-city" placeholder="City/Town">
                    </div>
                    <div class="control-group">
                      <label class="required" for="pick-up-date">Pick up date</label>
                      <input type="date" class="control" name="pickupDate" id="pick-up-date" autocomplete="off">
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="editPickup(event)">Save</button>
                    </div>
                  </form>`;
  showModal({
    content, 
    title: e.target.innerText, 
    callback: () => {
      document.querySelector('.control-group #pick-up-address').value = parcel.pickupaddress;
      document.querySelector('.control-group #pick-up-state').value = parcel.pickupstate;
      document.querySelector('.control-group #pick-up-city').value = parcel.pickupcity;
      document.querySelector('.control-group #pick-up-date').value = parcel.pickupdate;
      $('select').css({ color: 'initial' });
    }
  });
  document.getElementById('pick-up-address').focus();
};

const editReceiverModal = (e, parcel) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="receiver-name">Receicver's full name</label>
                      <input type="text" class="control" name="receiverName" id="receiver-name" placeholder="Full name">
                    </div>         
                    <div class="control-group">
                      <label class="required" for="receiver-phone">Receicver's phone</label>
                      <input type="text" class="control" name="receiverPhone" id="receiver-phone" placeholder="Phone">
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="editReceiver(event)">Save</button>
                    </div>
                  </form>`;
  showModal({
    content, 
    title: e.target.innerText, 
    callback: () => {
      document.querySelector('.control-group #receiver-name').value = parcel.receivername;
      document.querySelector('.control-group #receiver-phone').value = parcel.receiverphone;
    }
  });
  document.getElementById('receiver-name').focus();
};

const updateLocationModal = (e) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label for="current-delivery-status">Delivery status</label>
                      <select name="deliveryStatus" id="current-delivery-status" class="control">
                        <option value="Delivered">Delivered</option>
                        <option value="Transiting">Transiting</option>
                      </select>
                    </div>
                    <div class="control-group">
                      <label class="required" for="present-state">State</label>
                      <select name="state" id="state" class="control">
                        <option value="">Select state</option>
                        <option value="Lagos">Lagos</option>
                      </select>
                    </div>
                    <div class="control-group">
                      <label class="required" for="present-city">City/Town</label>
                      <input type="text" class="control" name="city" id="city" placeholder="City/Town">
                    </div>
                    <div class="control-group mb-0">
                      <button class="btn btn-primary" onclick="updatePresentLocation(event)">Save</button>
                    </div>
                  </form>`;
  showModal({ content, title: e.target.innerText });
  selectStatus();
  document.getElementById('state').focus();
};

const updateStatusModal = (e) => {
  const content = `<form class="form">
                    <div class="control-group">
                      <label class="required" for="new-delivery-status">Delivery status</label>
                      <select name="deliveryStatus" id="new-delivery-status" class="control">
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
  document.getElementById('receiver-name').focus();
};