import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Swal from 'sweetalert2';

// מחלקת Store לניהול מנהלים במערכת
class AdminStore {
  // שדות סטייט
  name = '';
  password = '';
  error = '';
  admins = []; // כל המנהלים
  currentAdmin = null; // המנהל המחובר כרגע
  adminType = null; // סוג מנהל (0 = רגיל, 1 = סופר אדמין)

  isLoading = true; // עבור autoLogin

  constructor() {
    // הופך את כל המאפיינים ל־observable ואת הפונקציות ל־actions
    makeAutoObservable(this);
  }

  // בודק אם המנהל הנוכחי הוא סופר־אדמין
  get isSuperAdmin() {
    return this.adminType === 1;
  }

  // בודק האם מנהל מחובר
  get isLoggedIn() {
    return !!this.currentAdmin;
  }

  // שליפת מנהל נוכחי מתוך localStorage לפי ID
  fetchCurrentAdmin() {
    const adminId = localStorage.getItem('adminId');
    const adminType = Number(localStorage.getItem('adminType'));
    if (!adminId) return;

    axios.get(`https://localhost:7245/api/Admin/${adminId}`)
      .then(res => {
        runInAction(() => {
          this.currentAdmin = res.data;
          this.adminType = adminType;
        });
      })
      .catch(err => {
        console.error('שגיאה בשליפת המנהל הנוכחי:', err);
      });
  }

  // עדכון שדות טופס
  setName(value) {
    this.name = value;
  }

  setPassword(value) {
    this.password = value;
  }

  // שליפת כל המנהלים מהשרת
  async fetchAdmins() {
    try {
      const response = await axios.get('https://localhost:7245/api/Admin');
      runInAction(() => {
        this.admins = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'שגיאה בעת טעינת מנהלים';
      });
      console.error('שגיאה:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאת שרת',
        text: error.message,
        confirmButtonText: 'אישור'
      });
    }
  }

  // התחברות אוטומטית מבוססת localStorage
  autoLogin = async () => {
    const adminId = localStorage.getItem('adminId');
    const adminType = Number(localStorage.getItem('adminType'));

    if (!adminId) {
      this.isLoading = false;
      return;
    }

    try {
      const response = await axios.get(`https://localhost:7245/api/Admin/${adminId}`);
      runInAction(() => {
        this.currentAdmin = response.data;
        this.adminType = adminType;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.currentAdmin = null;
        this.adminType = null;
        this.isLoading = false;
      });
      console.error('שגיאה בשחזור התחברות:', error);
    }
  };

  // התחברות רגילה עם שם משתמש וסיסמה
  async login({ nameAdmin, password }, navigate) {
    const trimmedName = nameAdmin?.toLowerCase().trim();
    const trimmedPassword = password;

    await this.fetchAdmins(); // טוען את רשימת המנהלים

    // חיפוש התאמה מדויקת
    const exact = this.admins.find(
      (a) => {
        const nameMatch = a.nameAdmin?.toLowerCase().trim() === trimmedName;
        const passwordMatch = a.password === trimmedPassword;
        return nameMatch && passwordMatch;
      }
    );

    if (exact) {
      // שמירת פרטי ההתחברות ב־localStorage
      localStorage.setItem('adminId', exact.id);
      localStorage.setItem('adminType', exact.adminType);
      localStorage.setItem('adminName', exact.nameAdmin);

      this.currentAdmin = exact;
      this.adminType = exact.adminType;

      await Swal.fire({
        icon: 'success',
        title: 'ברוך הבא!',
        text: `שלום ${exact.nameAdmin}, התחברת בהצלחה.`,
        confirmButtonText: 'המשך'
      });

      navigate('/admin/admin-home');
      return;
    }

    // אם אין התאמה מדויקת, בודקים התאמה חלקית
    const partial = this.admins.find(
      (a) =>
        a.nameAdmin?.toLowerCase().trim() === trimmedName ||
        a.password === trimmedPassword
    );

    await Swal.fire({
      icon: partial ? 'error' : 'warning',
      title: partial ? 'שגיאה' : 'מנהל לא רשום',
      text: partial
        ? 'שם משתמש או סיסמה שגויים'
        : 'שם המשתמש והסיסמה אינם רשומים במערכת',
      confirmButtonText: 'אישור'
    });
  }

  // הוספת מנהל חדש
  async addAdmin(newAdmin, navigate) {
    try {
      const existing = this.admins.find(
        (admin) => admin.nameAdmin === newAdmin.nameAdmin
      );

      if (existing) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'מנהל עם שם זה כבר קיים',
          confirmButtonText: 'אישור'
        });
        return;
      }

      const response = await axios.post('https://localhost:7245/api/Admin', newAdmin);
      runInAction(() => {
        this.admins.push(response.data);
      });

      Swal.fire({
        icon: 'success',
        title: 'המנהל נוסף בהצלחה!',
        confirmButtonText: 'המשך'
      });

      navigate('/admin');
    } catch (error) {
      console.error('שגיאה בהוספת מנהל:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: error.response?.data?.title || error.response?.data?.detail || 'אירעה שגיאה בהוספת מנהל.',
        confirmButtonText: 'אישור'
      });
    }
  }

  // מחיקת מנהל
  async deleteAdmin(adminId) {
    try {
      const result = await Swal.fire({
        title: 'האם אתה בטוח?',
        text: 'לא תוכל לשחזר את המנהל לאחר המחיקה!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'כן, מחק!',
        cancelButtonText: 'ביטול'
      });

      if (result.isConfirmed) {
        await axios.delete(`https://localhost:7245/api/Admin/${adminId}`);
        runInAction(() => {
          this.admins = this.admins.filter(admin => admin.id !== adminId);
        });

        Swal.fire({
          icon: 'success',
          title: 'המנהל נמחק בהצלחה',
          confirmButtonText: 'סגור'
        });
      }
    } catch (error) {
      console.error('שגיאה במחיקת מנהל:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'לא ניתן היה למחוק את המנהל',
        confirmButtonText: 'אישור'
      });
    }
  }

  // החזרת מנהל לפי מזהה
  getAdminById(id) {
    return this.admins.find(admin => admin.id === Number(id));
  }

  // עדכון נתוני מנהל
  async updateAdmin(updatedAdmin) {
    try {
      await axios.put(`https://localhost:7245/api/Admin/${updatedAdmin.id}`, updatedAdmin, {
        headers: { 'Content-Type': 'application/json' }
      });

      runInAction(() => {
        const index = this.admins.findIndex(a => a.id === updatedAdmin.id);
        if (index !== -1) {
          this.admins[index] = updatedAdmin;
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'הנתונים עודכנו בהצלחה',
        confirmButtonText: 'אישור'
      });
    } catch (error) {
      console.error('שגיאה בעדכון מנהל:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'אירעה שגיאה בעת עדכון המנהל',
        confirmButtonText: 'סגור'
      });
    }
  }

  // שחזור סיסמה לפי שם משתמש
  async forgotPassword(nameInput) {
    await this.fetchAdmins();

    const admin = this.admins.find(a => a.nameAdmin === nameInput);

    if (admin) {
      try {
        const response = await axios.post(`${this.baseUrl}/admins/send-password`, {
          name: nameInput,
          email: admin.email,
        });

        Swal.fire({
          icon: 'success',
          title: 'נשלח מייל',
          text: 'הסיסמה נשלחה לכתובת המייל שלך',
          confirmButtonText: 'אישור'
        });
      } catch (error) {
        console.error('שגיאה בשליחת האימייל', error);
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'אירעה שגיאה בעת שליחת הסיסמה למייל',
          confirmButtonText: 'אישור'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'שם המשתמש לא נמצא במערכת',
        confirmButtonText: 'אישור'
      });
    }
  }
}

// ייצוא מופע אחד  
const adminStore = new AdminStore();
export default adminStore;

