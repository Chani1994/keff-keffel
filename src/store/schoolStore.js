import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

class SchoolStore {
  schools = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async addSchool(schoolData) {
    this.loading = true;
    this.error = null;
    try {
      const res = await axios.post('https://localhost:7245/api/School', schoolData);
      runInAction(() => {
        this.schools.push(res.data); // אם מחזיר את המוסד החדש
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || 'שגיאה לא ידועה';
        this.loading = false;
      });
    }
  }

  async fetchSchools() {
    this.loading = true;
    try {
      const res = await axios.get('https://localhost:7245/api/School');
      runInAction(() => {
        this.schools = res.data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  }
}

export default new SchoolStore();
