/* eslint-disable no-unused-vars */

const checkAuth = async () => {
  let user;
  const token = localStorage.getItem("token");
  if (token) {
    user = await fetch(
      new Request("/api/v1/auth/verifyAuth", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: new Headers({
          token: JSON.stringify({ token }),
          Accept: "application/json",
          "Content-Type": "application/json"
        })
      })
    )
      .then(res => res.json())
      .then((res) => {
        if (res.data.user) {
          const { firstname, lastname, photoURL } = res.data.user;
          const elem = document.getElementById("name");
          const photo = document.getElementById("image");
          const avatar = document.getElementById("avatar");
          if (elem) {
            elem.innerHTML = `${firstname} ${lastname}`;
          }
          if (photo) {
            photo.src = photo && photoURL ? photoURL : "../images/avatar.png";
          }
          if (avatar && photoURL) {
            const img = document.createElement("img");
            img.src = photoURL;
            img.id = "avatar-img";
            img.addEventListener("click", (e) => {
              e.stopPropagation();
              e.target.parentNode.dispatchEvent(new Event('click'));
            });
            avatar.firstElementChild.replaceWith(img);
          }
          return res.data.user;
        }
      });
  }
  if (!user) {
    window.location.href = "/signin";
  }

  return user;
};
const authUser = checkAuth();
