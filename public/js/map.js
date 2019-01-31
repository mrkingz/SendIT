/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable no-extra-semi */
let map;
const initMap = () => {
  const options = {
    zoom: 6
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  codeAddress(`20, Church Street, Oke-isagun, Ipaja`);
};

const codeAddress = address => {
  getAddress("data-from-address");
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });
    }
  });
};

const getAddress = addressType => {
  elems = document.getElementById(`${addressType}`);
  alert(elems.innerHTML);
};

google.maps.event.addDomListener(window, "load", initMap);
