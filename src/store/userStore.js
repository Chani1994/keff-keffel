import { makeAutoObservable, runInAction } from 'mobx';
import Swal from 'sweetalert2';
import axios from 'axios';

class UserStore {
  name = '';
  phone = '';
  error = '';
  users = [];
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
  }

  setName(value) {
    this.name = value;
  }

  setPhone(value) {
    this.phone = value;
  }

  async fetchUsers() {
    try {
      const response = await axios.get('https://localhost:7245/api/Users');
      runInAction(() => {
        this.users = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'שגיאה בעת טעינת משתמשים';
      });
      console.error('שגיאה:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאת שרת',
        text: error.message,
        confirmButtonText: 'אישור',
      });
    }
  }

  async login(user, navigate) {
    try {
      const response = await axios.get('https://localhost:7245/api/Users');
      const users = response.data;

      const userByName = users.find(u => u.name === user.username);
      const matchedUser = users.find(
        u => u.name === user.username && u.phone === user.phone
      );

      if (matchedUser) {
        runInAction(() => {
          this.currentUser = matchedUser;
        });

        localStorage.setItem("currentUser", JSON.stringify(matchedUser));

        Swal.fire({
          icon: 'success',
          title: 'התחברת בהצלחה!',
          text: `שלום ${matchedUser.name}`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/user/details');

      } else if (userByName) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'מספר הטלפון שגוי.',
          confirmButtonText: 'אישור',
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'משתמש לא קיים במערכת',
          text: 'אנא ודא שהזנת את הפרטים הנכונים או בצע הרשמה.',
          confirmButtonText: 'אישור',
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאת שרת',
        text: error.message || 'שגיאה בהתחברות.',
        confirmButtonText: 'אישור',
      });
    }
  }

  async register(user, navigate) {
    try {
      const response = await axios.get('https://localhost:7245/api/Users');
      const existingUser = response.data.find(
        (u) => u.name === user.name && u.phone === user.phone
      );

      if (existingUser) {
        Swal.fire({
          icon: 'error',
          title: 'משתמש כבר קיים',
          text: 'יש כבר משתמש עם שם וטלפון זהים',
          confirmButtonText: 'אישור',
        });
        return;
      }

      const result = await axios.post('https://localhost:7245/api/Users/AddUser', user);
      runInAction(() => {
        this.currentUser = result.data;
      });

      Swal.fire({
        icon: 'success',
        title: 'נרשמת בהצלחה!',
        text: `ברוך הבא ${user.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/user/details');

    } catch (error) {
      console.error('Register error:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: error.message || 'שגיאה בהרשמה.',
      });
    }
  }
}

export default new UserStore();



