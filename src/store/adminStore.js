import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Swal from 'sweetalert2';

class AdminStore {
  name = '';
  password = '';
  error = '';
  admins = [];
  currentAdmin = null;

  constructor() {
    makeAutoObservable(this);
  }

  setName(value) {
    this.name = value;
  }

  setPassword(value) {
    this.password = value;
  }

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

  async fetchCurrentAdmin() {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) return;

    try {
      const response = await axios.get(`https://localhost:7245/api/Admin/${adminId}`);
      runInAction(() => {
        this.currentAdmin = response.data;
      });
    } catch (error) {
      console.error('שגיאה בשליפת המנהל הנוכחי:', error);
    }
  }

  async login(navigate) {
    await this.fetchAdmins();

    const exact = this.admins.find(
      (a) => a.nameAdmin === this.name && a.password === this.password
    );

    if (exact) {
      localStorage.setItem('adminId', exact.id);
      localStorage.setItem('adminType', exact.adminType);
      localStorage.setItem('adminName', exact.nameAdmin);
      this.currentAdmin = exact;

      await Swal.fire({
        icon: 'success',
        title: 'ברוך הבא!',
        text: `שלום ${exact.nameAdmin}, התחברת בהצלחה.`,
        confirmButtonText: 'המשך'
      });

      navigate('/admin');
      return;
    }

    const partial = this.admins.find(
      (a) => a.nameAdmin === this.name || a.password === this.password
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
        text: error.response?.data || 'אירעה שגיאה בהוספת מנהל.',
        confirmButtonText: 'אישור'
      });
    }
  }
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
  async fetchAdmins() {
    try {
      const response = await axios.get('https://localhost:7245/api/Admin');
      runInAction(() => {
        this.admins = response.data;
      });
    } catch (error) {
      console.error('שגיאה בטעינת מנהלים:', error);
    }
  }

  getAdminById(id) {
    return this.admins.find(admin => admin.id === Number(id));
  }

  async updateAdmin(updatedAdmin) {
    try {
      await axios.put(`https://localhost:7245/api/Admin/${updatedAdmin.id}`, updatedAdmin, {
        headers: {
          'Content-Type': 'application/json'
        }
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
}

const adminStore = new AdminStore();
export default adminStore;
