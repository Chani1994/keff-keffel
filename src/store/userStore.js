import { makeAutoObservable } from 'mobx';
import Swal from 'sweetalert2';
import { runInAction } from 'mobx';
import axios from 'axios';


// פונקציה שבונה אובייקט משתמש שלם לפי מבנה נדרש, כולל תאריכי מנוי ודיפולטים
function buildFullUser(user) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3); // מוסיף 3 חודשים למנוי

  return {
    name: user.name,
    phone: user.phone,
    school: user.school || '',
    classes: user.classes || '',
    paymentStatus: user.paymentStatus !== undefined ? user.paymentStatus : 0,
    subscriptionStartDate: startDate.toISOString(),
    subscriptionEndDate: endDate.toISOString(),
    isActive: true,
    index: user.index !== undefined ? user.index : 0,
    success: user.success !== undefined ? user.success : 0,
  };
}


// מחלקת store לניהול משתמשים באמצעות MobX
class UserStore {
  // שדות הנתונים של המשתמש
  name = '';
  phone = '';
  error = '';
  users = []; // כל המשתמשים
  currentUser = null; // המשתמש המחובר כרגע

  school = '';
  classes = '';
  paymentStatus = 0;
  subscriptionStartDate = new Date().toISOString();
  subscriptionEndDate = new Date().toISOString();
  isActive = true;
  index = 0;
  success = 0;

  constructor() {
    makeAutoObservable(this); // הופך את המשתנה לאוטומטי לניהול תגובתי של MobX
    this.loadUserFromStorage(); // טוען משתמש מזיכרון מקומי אם יש
  }

  // טוען את המשתמש מה-localStorage אם קיים
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

  // בודק אם יש משתמש מחובר
  get isLoggedIn() {
    return !!this.currentUser;
  }

  // נסיון להתחבר אוטומטית מהזיכרון
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

  // שמירה של המשתמש בזיכרון מקומי
  saveUserToStorage(user) {
    if (user && typeof user === 'object' && Object.keys(user).length > 0) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  // סטים לשם וטלפון
  setName(value) {
    this.name = value;
  }

  setPhone(value) {
    this.phone = value;
  }

  // מגדיר את המשתמש הנוכחי
  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // ניקוי המשתמש הנוכחי מהזיכרון
  clearUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // טעינת כל המשתמשים מהשרת
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

  // התחברות לפי טלפון
  async loginByPhone(phone, navigate) {
    try {
      const response = await axios.get(
        `https://localhost:7245/api/Users/getByPhone/${encodeURIComponent(phone)}`
      );
      const { token, user } = response.data;

      sessionStorage.setItem('jwtToken', token);
      localStorage.setItem('token', token);
      this.setCurrentUser(user);

      await Swal.fire({
        icon: 'success',
        title: 'התחברת בהצלחה!',
        text: `שלום ${user.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(`/user/details/${user.id}`);
    } catch (error) {
      const status = error.response?.status;

      if (status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'לא נמצא משתמש עם מספר טלפון זה.',
          confirmButtonText: 'אישור',
        });
      } else if (status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'המשתמש לא פעיל.',
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

  // הוספת משתמש חדש
 async addUser(user) {
  try {
    // בדיקה מול השרת אם כבר קיים משתמש עם אותו טלפון
    const checkResponse = await axios.get(`https://localhost:7245/api/Users/getByPhone/${encodeURIComponent(user.phone)}`);
    if (checkResponse.data) {
      await Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'משתמש עם מספר טלפון זה כבר קיים',
        confirmButtonText: 'אישור',
      });
      return null;
    }
  } catch (error) {
    if (error.response?.status !== 404) { // 404 = לא נמצא, כלומר אפשר להוסיף
      console.error('שגיאה בבדיקת משתמש קיים:', error);
      throw error;
    }
  }

  // אם עברנו את הבדיקה – מוסיפים את המשתמש
  try {
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


  // הרשמה ראשונית לפני תשלום
  async register(user, navigate) {
    try {
      await Swal.fire({
        title: 'בודק פרטים...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

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

      localStorage.setItem('pendingUser', JSON.stringify(user));
      Swal.close();

      // הפנייה לתשלום באתר חיצוני
      const returnUrl = encodeURIComponent(window.location.origin + '/user/register?paid=true');
      window.location.href = `https://www.matara.pro/nedarimplus/online/?S=VOgq&ReturnUrl=${returnUrl}`;

    } catch (error) {
      Swal.close();
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'שגיאה בהרשמה.';

      await Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: errorMessage,
        confirmButtonText: 'אישור',
      });
    }
  }

  // סיום הרשמה אחרי תשלום
  async finishRegistration(user, navigate) {
    try {
      Swal.fire({
        title: 'מעדכן הרשמה...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

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

      const fullUser = buildFullUser(user);
      const result = await axios.post('https://localhost:7245/api/Users/AddUser', fullUser);

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
      const errorMessage = error.response?.data?.message || error.message || 'שגיאה בסיום הרשמה.';

      await Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: errorMessage,
        confirmButtonText: 'אישור',
      });
    }
  }

  // עדכון פרטי משתמש
  async updateUser(updatedUser, callback) {
    try {
      const { data: updatedUserFromServer } =
        await axios.put(`https://localhost:7245/api/Users/${updatedUser.id}`, updatedUser);

      runInAction(() => this.setCurrentUser(updatedUserFromServer));

      await Swal.fire({
        title: 'הצלחה!',
        text: 'הפרטים עודכנו בהצלחה.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'custom-z-index' },
      });

      if (callback) callback(); // סגירת דיאלוג או פעולה נוספת

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

  // מחיקת משתמש לפי ID
  deleteUser = async (id) => {
    try {
      await axios.delete(`https://localhost:7245/api/Users/${id}`);
      runInAction(() => {
        this.users = this.users.filter(user => user.id !== id);
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("אירעה שגיאה במחיקת המשתמש");
    }
  };

  // טעינת משתמש לפי ID
  async fetchUserById(id) {
    try {
      const response = await axios.get(`https://localhost:7245/api/Users/${id}`);
      runInAction(() => {
        this.currentUser = response.data;
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
}

export default new UserStore(); // יצוא של מופע מוכן לשימוש

// import { makeAutoObservable } from 'mobx';
// import Swal from 'sweetalert2';
// import { runInAction } from 'mobx';

// import axios from 'axios';
// function buildFullUser(user) {
//   const startDate = new Date();
//   const endDate = new Date();
//   endDate.setMonth(endDate.getMonth() + 3); // מוסיף 3 חודשים

//   return {
//     name: user.name,
//     phone: user.phone,
//     school: user.school || '',
//     classes: user.classes || '',
//     paymentStatus: user.paymentStatus !== undefined ? user.paymentStatus : 0,
//     subscriptionStartDate: startDate.toISOString(),
//     subscriptionEndDate: endDate.toISOString(),
//     isActive: true,
//     index: user.index !== undefined ? user.index : 0,
//     success: user.success !== undefined ? user.success : 0,
//   };
// }

// class UserStore {
//   name = '';
//   phone = '';
//   error = '';
//   users = [];
//   currentUser = null;

// school = '';
// classes = '';
// paymentStatus = 0;
// subscriptionStartDate = new Date().toISOString();
// subscriptionEndDate = new Date().toISOString();
// isActive = true;
// index = 0;
// success = 0;


//   constructor() {
//     makeAutoObservable(this);
//     this.loadUserFromStorage();
//   }

//  loadUserFromStorage() {
//   const savedUser = localStorage.getItem('currentUser');
//   console.log('Raw savedUser from localStorage:', savedUser);
//   if (savedUser && savedUser !== '""') {
//     try {
//       this.currentUser = JSON.parse(savedUser);
//       console.log('Parsed user:', this.currentUser);
//     } catch (error) {
//       console.error('Error parsing savedUser:', error);
//       this.currentUser = null;
//     }
//   } else {
//     this.currentUser = null;
//   }
// }
// get isLoggedIn() {
//   return !!this.currentUser;
// }
// autoLogin() {
//   const savedUser = localStorage.getItem('currentUser');
//   if (savedUser && savedUser !== '""') {
//     try {
//       const parsed = JSON.parse(savedUser);
//       if (parsed && parsed.id) {
//         this.currentUser = parsed;
//       }
//     } catch (error) {
//       console.error('שגיאה בשחזור משתמש מהאחסון:', error);
//       this.clearUser();
//     }
//   }
// }


//  saveUserToStorage(user) {
//   if (user && typeof user === 'object' && Object.keys(user).length > 0) {
//     localStorage.setItem('currentUser', JSON.stringify(user));
//   }
// }


//   setName(value) {
//     this.name = value;
//   }

//   setPhone(value) {
//     this.phone = value;
//   }
// setCurrentUser(user) {
//   this.currentUser = user; // או: makeAutoObservable(this) אם זה MobX
//   localStorage.setItem('currentUser', JSON.stringify(user)); // לוודא שגם כאן זה מתעדכן
// }


//   clearUser() {
//     this.currentUser = null;
//     localStorage.removeItem('currentUser');
//   }

//   async fetchUsers() {
//     try {
//       const response = await axios.get('https://localhost:7245/api/Users');
//       this.users = response.data;
//     } catch (error) {
//       this.error = 'שגיאה בעת טעינת משתמשים';
//       console.error('שגיאה:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאת שרת',
//         text: error.message,
//         confirmButtonText: 'אישור',
//       });
//     }
//   }

// async loginByPhone(phone, navigate) {
//   try {
//     const response = await axios.get(
//       `https://localhost:7245/api/Users/getByPhone/${encodeURIComponent(phone)}`
//     );
//     const { token, user } = response.data;

//     sessionStorage.setItem('jwtToken', token);
//     localStorage.setItem('token', token);
//     this.setCurrentUser(user);

//     await Swal.fire({
//       icon: 'success',
//       title: 'התחברת בהצלחה!',
//       text: `שלום ${user.name}`,
//       timer: 1500,
//       showConfirmButton: false,
//     });

//     navigate(`/user/details/${user.id}`);
//   } catch (error) {
//     const status = error.response?.status;

//     if (status === 404) {
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'לא נמצא משתמש עם מספר טלפון זה.',
//         confirmButtonText: 'אישור',
//       });
//     } else if (status === 401) {
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'המשתמש לא פעיל.',
//         confirmButtonText: 'אישור',
//       });
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאת שרת',
//         text: error.message || 'שגיאה בהתחברות.',
//         confirmButtonText: 'אישור',
//       });
//     }
//   }
// }



// async addUser(user) {
//   try {
//     const exists = this.users.some(u => u.phone === user.phone);
//     if (exists) {
//       await Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'משתמש עם מספר טלפון זה כבר קיים',
//         confirmButtonText: 'אישור',
//       });
//       return null;  // או throw אם רוצים לקטוע את הזרימה
//     }

//     console.log('משתמש שנשלח לשרת:', user);

//     const response = await axios.post('https://localhost:7245/api/Users/AddUser', user);
//     const addedUser = response.data;

//     runInAction(() => {
//       this.users.push(addedUser);
//     });

//     return addedUser;
//   } catch (error) {
//     console.error('שגיאה בהוספת משתמש:', error);
//     throw error;
//   }
// }


// async register(user, navigate) {
//   try {
//     // הצגת טעינה
//     await Swal.fire({
//       title: 'בודק פרטים...',
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     // בדיקה אם קיים משתמש
//     const usersResponse = await axios.get('https://localhost:7245/api/Users');
//     const existingUser = usersResponse.data.find((u) => u.phone === user.phone);

//     if (existingUser) {
//       // סגור טעינה, אל תמשיך
//       Swal.close();
//       await Swal.fire({
//         icon: 'error',
//         title: 'משתמש כבר קיים',
//         text: 'כבר קיים משתמש עם מספר טלפון זהה',
//         confirmButtonText: 'אישור',
//       });
//       return;
//     }

//     // אם לא קיים – שמור בזיכרון מקומי
//     localStorage.setItem('pendingUser', JSON.stringify(user));

//     // סגור טעינה
//     Swal.close();

//     // שלב אחרון: הפניה לתשלום – רק אחרי שעברנו את כל הבדיקות
//     const returnUrl = encodeURIComponent(window.location.origin + '/user/register?paid=true');
//     window.location.href = `https://www.matara.pro/nedarimplus/online/?S=VOgq&ReturnUrl=${returnUrl}`;

//   } catch (error) {
//     Swal.close();
//     console.error('Register error:', error);
//     const errorMessage =
//       error.response?.data?.message || error.message || 'שגיאה בהרשמה.';

//     await Swal.fire({
//       icon: 'error',
//       title: 'שגיאה',
//       text: errorMessage,
//       confirmButtonText: 'אישור',
//     });
//   }
// }


// async finishRegistration(user, navigate) {
//   try {
//     Swal.fire({
//       title: 'מעדכן הרשמה...',
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     // בדיקה כפולה שהמשתמש לא קיים
//     const usersResponse = await axios.get('https://localhost:7245/api/Users');
//     const existingUser = usersResponse.data.find((u) => u.phone === user.phone);

//     if (existingUser) {
//       Swal.close();
//       await Swal.fire({
//         icon: 'error',
//         title: 'משתמש כבר קיים',
//         text: 'כבר קיים משתמש עם מספר טלפון זהה',
//         confirmButtonText: 'אישור',
//       });
//       return;
//     }

//     const fullUser = buildFullUser(user);

//     const result = await axios.post(
//       'https://localhost:7245/api/Users/AddUser',
//       fullUser
//     );

//     this.setCurrentUser?.(result.data);

//     Swal.close();

//     await Swal.fire({
//       icon: 'success',
//       title: 'נרשמת בהצלחה!',
//       text: `ברוך הבא ${user.name || ''}`,
//       timer: 2000,
//       showConfirmButton: false,
//       timerProgressBar: true,
//     });

//     navigate(`/user/details/${result.data.id}`);
//   } catch (error) {
//     Swal.close();
//     console.error('Finish registration error:', error);
//     const errorMessage =
//       error.response?.data?.message || error.message || 'שגיאה בסיום הרשמה.';

//     await Swal.fire({
//       icon: 'error',
//       title: 'שגיאה',
//       text: errorMessage,
//       confirmButtonText: 'אישור',
//     });
//   }
// }

// async updateUser(updatedUser, callback) {
//   try {
//     const { data: updatedUserFromServer } =
//       await axios.put(`https://localhost:7245/api/Users/${updatedUser.id}`, updatedUser);

//     runInAction(() => this.setCurrentUser(updatedUserFromServer));

//     // ✨ מודאל עם טיימר ובלי כפתור אישור
//     await Swal.fire({
//       title: 'הצלחה!',
//       text: 'הפרטים עודכנו בהצלחה.',
//       icon: 'success',
//       timer: 1500,          // נסגר אחרי 1.5 שניות
//       showConfirmButton: false,
//       customClass: { popup: 'custom-z-index' },
//     });

//     // ברגע שה‑Swal נסגר – נסגור גם את הדיאלוג
//     if (callback) callback();

//   } catch (error) {
//     console.error('שגיאה בעדכון המשתמש:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'אירעה שגיאה בעדכון',
//       text: error.response?.data?.message || error.message || 'נסה שוב מאוחר יותר',
//       confirmButtonText: 'סגור',
//     });
//   }
// }

// //מחיקת משתמש
//   deleteUser = async (id) => {
//     try {
//       await axios.delete(`https://localhost:7245/api/Users/${id}`);
//       runInAction(() => {
//         // מסירים את המשתמש מהרשימה אחרי המחיקה
//         this.users = this.users.filter(user => user.id !== id);
//       });
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       alert("אירעה שגיאה במחיקת המשתמש");
//     }
//   };

//   async fetchUserById(id) {
//   try {
//     const response = await axios.get(`https://localhost:7245/api/Users/${id}`);
//     runInAction(() => {
//       this.currentUser = response.data;
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//   }
// }

// }
// export default new UserStore();
