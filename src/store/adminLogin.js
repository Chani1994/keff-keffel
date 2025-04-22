import axios from 'axios';
import Swal from 'sweetalert2';
import DataStore from './dataStore.js';
function timerAlert() {
  let timerInterval;
  Swal.fire({
    title: 'Login operation...',
    html: "You will immediately log in as an administrator",
    timer: 500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      if (timer) {
        timer.textContent = `${Swal.getTimerLeft()}`;
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 250);
      }
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
}

function showAlert() {
  Swal.fire({
    title: 'Oops',
    text: 'Username or password is incorrect',
    icon: 'error',
    confirmButtonText: 'OK'
  });
}

export async function CheckLogin(name, password) {
  try {
    const isValid = await axios.post("http://localhost:8787/login", { name, password });
    if (isValid.status === 200) {
      timerAlert()

      store.setIsLogin(true);

    }
  }
  catch (error) {
    if (error.response && error.response.status === 401) {
      showAlert()

    } else {
      showAlert()

    }
  }
}