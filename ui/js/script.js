
let oDropdown;
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
dropdown = function(id) {
  oDropdown = document.getElementById(id);
  oDropdown.classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {

  if (event.target == modal) {
    modal.style.display = "none";
  }

  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn i')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
  
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


// // Get the modal
let modal;

// // When the user clicks the button, open the modal 
showModal = function(modalId) {
  modal = document.getElementById(modalId);
  modal.style.display = "block";
}

hideModal = function() {
    modal.style.display = "none";
}
