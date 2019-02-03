/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable no-extra-semi */
let map;
const displayMap = props => {
  // const { from, to, presentLocation } = props;
  const options = {
    zoom: 6
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  Object.keys(props).forEach(key => codeAddress(props[key]));
};

const codeAddress = options => {
  const { address, viewType } = options;
  getAddress("data-from-address");
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="info-window">
                    <h3>${viewType}</h3>
                    <p>${address}</p>
                  </div>`,
        maxWidth: 150
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  });
};

const getAddress = addressType => {
  elems = document.getElementById(`${addressType}`);
};
