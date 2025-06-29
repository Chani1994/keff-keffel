import { makeAutoObservable } from 'mobx';
import Swal from 'sweetalert2';
import { toJS } from 'mobx';
import { runInAction } from 'mobx';

import axios from 'axios';

class UserStore {
  name = '';
  phone = '';
  error = '';
  users = [];
  currentUser = null;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

 loadUserFromStorage() {
  const savedUser = localStorage.getItem('currentUser');
  console.log('Raw savedUser from localStorage:', savedUser);
  if (savedUser && savedUser !== '""') {
    try {
      this.currentUser = JSON.parse(savedUser);
      console.log('Parsed user:', this.currentUser);
    } catch (error) {
      console.error('Error parsing savedUser:', error);
      this.currentUser = null;
    }
  } else {
    this.currentUser = null;
  }
}

 saveUserToStorage(user) {
  if (user && typeof user === 'object' && Object.keys(user).length > 0) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}


  setName(value) {
    this.name = value;
  }

  setPhone(value) {
    this.phone = value;
  }
setCurrentUser(user) {
  this.currentUser = user; // או: makeAutoObservable(this) אם זה MobX
  localStorage.setItem('currentUser', JSON.stringify(user)); // לוודא שגם כאן זה מתעדכן
}


  clearUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  async fetchUsers() {
    try {
      const response = await axios.get('https://localhost:7245/api/Users');
      this.users = response.data;
    } catch (error) {
      this.error = 'שגיאה בעת טעינת משתמשים';
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
        this.setCurrentUser(matchedUser);
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
          text: 'יש כבר משתמש עם שם או טלפון זהים',
          confirmButtonText: 'אישור',
        });
        return;
      }

      const result = await axios.post('https://localhost:7245/api/Users/AddUser', user);

      console.log('Registered user for:', result.data);

      this.setCurrentUser(result.data);
      console.log('Registered user after:', result.data);


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
        confirmButtonText: 'אישור',
      });
    }
  }

async updateUser(updatedUser, callback) {
  try {
    const response = await axios.put(`https://localhost:7245/api/Users/${updatedUser.id}`, updatedUser);
    const updatedUserFromServer = response.data;

    runInAction(() => {
      this.setCurrentUser(updatedUserFromServer);
    });

    await Swal.fire({
      title: 'הצלחה!',
      text: 'הפרטים עודכנו בהצלחה.',
      icon: 'success',
      confirmButtonText: 'סגור',
      customClass: {
        popup: 'custom-z-index',
      },
    });

    if (callback) callback();

  } catch (error) {
    console.error('שגיאה בעדכון המשתמש:', error);
    Swal.fire({
      icon: 'error',
      title: 'אירעה שגיאה בעדכון',
      text: error.response?.data?.message || error.message || 'נסה שוב מאוחר יותר',
      confirmButtonText: 'סגור'
    });
  }
}



}
export default new UserStore();
