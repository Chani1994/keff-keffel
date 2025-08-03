import { makeAutoObservable } from 'mobx';
import Swal from 'sweetalert2';
import { toJS } from 'mobx';
import { runInAction } from 'mobx';

import axios from 'axios';
function buildFullUser(user) {
  return {
    name: user.name,
    phone: user.phone,
    school: user.school || '',
    classes: user.classes || '',
    paymentStatus: user.paymentStatus !== undefined ? user.paymentStatus : 0,
    subscriptionStartDate: user.subscriptionStartDate || new Date().toISOString(),
    subscriptionEndDate: user.subscriptionEndDate || new Date().toISOString(),
    isActive: user.isActive !== undefined ? user.isActive : true,
    index: user.index !== undefined ? user.index : 0,
    success: user.success !== undefined ? user.success : 0,
  };
}
class UserStore {
  name = '';
  phone = '';
  error = '';
  users = [];
  currentUser = null;

school = '';
classes = '';
paymentStatus = 0;
subscriptionStartDate = new Date().toISOString();
subscriptionEndDate = new Date().toISOString();
isActive = true;
index = 0;
success = 0;


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
get isLoggedIn() {
  return !!this.currentUser;
}
autoLogin() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser && savedUser !== '""') {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.id) {
        this.currentUser = parsed;
      }
    } catch (error) {
      console.error('שגיאה בשחזור משתמש מהאחסון:', error);
      this.clearUser();
    }
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

  
async loginByPhone(phone, navigate) {
  try {
    console.log("Trying to login with phone:", phone);

    // לא שולחים טוקן כי זו התחברות ראשונית
    const response = await axios.get(
      `https://localhost:7245/api/Users/getByPhone/${encodeURIComponent(phone)}`
    );

    const { token, user } = response.data;

    // שמירת הטוקן שקיבלת מהשרת
   sessionStorage.setItem('jwtToken', token);
localStorage.setItem('token', token);


    this.setCurrentUser(user);

    Swal.fire({
      icon: 'success',
      title: 'התחברת בהצלחה!',
      text: `שלום ${user.name}`,
      timer: 1500,
      showConfirmButton: false,
    });

    navigate(`/user/details/${user.id}`);

  } catch (error) {
    const status = error.response?.status;

    console.error('Login error:', error);

    if (status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'לא נמצא משתמש עם מספר טלפון זה.',
        confirmButtonText: 'אישור',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'שגיאת שרת',
        text: error.message || 'שגיאה בהתחברות.',
        confirmButtonText: 'אישור',
      });
    }
  }
}
async addUser(user) {
  try {
    const exists = this.users.some(u => u.phone === user.phone);
    if (exists) {
      await Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'משתמש עם מספר טלפון זה כבר קיים',
        confirmButtonText: 'אישור',
      });
      return null;  // או throw אם רוצים לקטוע את הזרימה
    }

    console.log('משתמש שנשלח לשרת:', user);

    const response = await axios.post('https://localhost:7245/api/Users/AddUser', user);
    const addedUser = response.data;

    runInAction(() => {
      this.users.push(addedUser);
    });

    return addedUser;
  } catch (error) {
    console.error('שגיאה בהוספת משתמש:', error);
    throw error;
  }
}


 async register(user, navigate) {
  try {
    // שלב 1: טוען
    Swal.fire({
      title: 'מתבצעת הרשמה...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // שלב 2: בדיקה אם המשתמש כבר קיים לפי טלפון
    const usersResponse = await axios.get('https://localhost:7245/api/Users');
    const existingUser = usersResponse.data.find((u) => u.phone === user.phone);

    if (existingUser) {
      Swal.close();
      await Swal.fire({
        icon: 'error',
        title: 'משתמש כבר קיים',
        text: 'כבר קיים משתמש עם מספר טלפון זהה',
        confirmButtonText: 'אישור',
      });
      return;
    }

    // שלב 3: שמירת המשתמש לזיכרון זמני ולשלוח לתשלום
    localStorage.setItem('pendingUser', JSON.stringify(user));

    Swal.close();

    // שלב 4: הפניה לתשלום דרך השרת שלך
    const returnUrl = encodeURIComponent(window.location.origin + '/user/register?paid=true');

    // דוגמה לכתובת שרת שמחזיר לינק תשלום ייחודי (אם אתה בונה תהליך כזה)
    window.location.href =
      `https://www.matara.pro/nedarimplus/online/?S=VOgq&ReturnUrl=${returnUrl}`;

  } catch (error) {
    Swal.close();
    console.error('Register error:', error);

    const errorMessage =
      error.response?.data?.message || error.message || 'שגיאה בהרשמה.';

    await Swal.fire({
      icon: 'error',
      title: 'שגיאה',
      text: errorMessage,
      confirmButtonText: 'אישור',
    });
  }
}
async finishRegistration(user, navigate) {
  try {
    Swal.fire({
      title: 'מעדכן הרשמה...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // השתמש בפונקציה שמבנה את המשתמש המלא
    const fullUser = buildFullUser(user);

    console.log('Sending user to server:', fullUser);

    const result = await axios.post(
      'https://localhost:7245/api/Users/AddUser',
      fullUser
    );

    this.setCurrentUser?.(result.data);

    Swal.close();

    await Swal.fire({
      icon: 'success',
      title: 'נרשמת בהצלחה!',
      text: `ברוך הבא ${user.name || ''}`,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    navigate(`/user/details/${result.data.id}`);
  } catch (error) {
    Swal.close();
    console.error('Finish registration error:', error);
    console.error('Server response errors:', error.response?.data?.errors);

    const errorMessage =
      error.response?.data?.message || error.message || 'שגיאה בסיום הרשמה.';

    await Swal.fire({
      icon: 'error',
      title: 'שגיאה',
      text: errorMessage,
      confirmButtonText: 'אישור',
    });
  }
}




async updateUser(updatedUser, callback) {
  try {
    const { data: updatedUserFromServer } =
      await axios.put(`https://localhost:7245/api/Users/${updatedUser.id}`, updatedUser);

    runInAction(() => this.setCurrentUser(updatedUserFromServer));

    // ✨ מודאל עם טיימר ובלי כפתור אישור
    await Swal.fire({
      title: 'הצלחה!',
      text: 'הפרטים עודכנו בהצלחה.',
      icon: 'success',
      timer: 1500,          // נסגר אחרי 1.5 שניות
      showConfirmButton: false,
      customClass: { popup: 'custom-z-index' },
    });

    // ברגע שה‑Swal נסגר – נסגור גם את הדיאלוג
    if (callback) callback();

  } catch (error) {
    console.error('שגיאה בעדכון המשתמש:', error);
    Swal.fire({
      icon: 'error',
      title: 'אירעה שגיאה בעדכון',
      text: error.response?.data?.message || error.message || 'נסה שוב מאוחר יותר',
      confirmButtonText: 'סגור',
    });
  }
}




}
export default new UserStore();
