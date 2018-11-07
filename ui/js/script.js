
let openDropdown;
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
dropdown = function(id) {
  openDropdown = document.getElementById(id);
  openDropdown.classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {

  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn i')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");

    for (let i = 0; i < dropdowns.length; i++) {
      let oDropdown = dropdowns[i];
      if (oDropdown.classList.contains('show')) {
        oDropdown.classList.remove('show');
      }
    }
  }
}


// Get the modal
let modal;

// When the user clicks the button, open the modal 
showModal = function(modalId) {
  if (openDropdown != null && openDropdown.classList.contains('show')) {
    openDropdown.classList.remove('show');
  }
  modal = document.getElementById(modalId);
  modal.style.display = "block";
}

hideModal = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}