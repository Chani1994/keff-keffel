import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Swal from 'sweetalert2';

class SchoolStore {
  schools = [];
  loading = false;
  error = null;

  constructor() {
    // autoBind + auto action recognition
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async addSchool(schoolData) {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.post('https://localhost:7245/api/School', schoolData);
      runInAction(() => {
        if (res && res.data) {
          this.schools.push(res.data);
        }
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'שגיאה לא ידועה';
        this.loading = false;
      });
    }
  }

  async fetchSchools() {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.get('https://localhost:7245/api/School');
      runInAction(() => {
        if (res && res.data) {
          this.schools = res.data;
        }
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'שגיאה לא ידועה';
        this.loading = false;
      });
    }
  }

  async deleteSchool(schoolId) {
    this.loading = true;
    this.error = null;

    const result = await Swal.fire({
      title: 'האם אתה בטוח?',
      text: "לא ניתן לשחזר את המוסד לאחר המחיקה!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'כן, אני בטוח!',
      cancelButtonText: 'ביטול'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://localhost:7245/api/School/${schoolId}`);
        runInAction(() => {
          this.schools = this.schools.filter(s => s.id !== schoolId);
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'המוסד נמחק בהצלחה!',
            showConfirmButton: false,
            timer: 2000
          });
        });
      } catch (err) {
        runInAction(() => {
          this.error = err.response?.data?.message || err.message || 'שגיאה לא ידועה';
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'שגיאה',
            text: this.error
          });
        });
      }
    } else {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateSchool(schoolId, updatedData) {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.put(`https://localhost:7245/api/School/${schoolId}`, updatedData);
      runInAction(() => {
        const index = this.schools.findIndex(s => s.id === schoolId);
        if (index !== -1) {
          this.schools[index] = res.data;
        }
        this.loading = false;
      });

      Swal.fire({
        title: 'הצלחה!',
        text: 'המוסד עודכן בהצלחה.',
        icon: 'success',
        confirmButtonText: 'אישור',
      });

    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.message || err.message || 'שגיאה לא ידועה';
        this.loading = false;
      });

      Swal.fire({
        title: 'שגיאה',
        text: this.error,
        icon: 'error',
        confirmButtonText: 'אישור',
      });
    }
  }
}

export default new SchoolStore();
