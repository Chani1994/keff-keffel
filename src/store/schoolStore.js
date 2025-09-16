import axios from 'axios';
import Swal from 'sweetalert2';
import userStore from './userStore'; // ייבוא של userStore כדי להוסיף תלמידים אוטומטית

import { makeAutoObservable, toJS, runInAction, reaction } from "mobx";

class SchoolStore {
  // משתנים עיקריים לניהול מוסדות, כיתות ותלמידים
  schools = [];
  loading = false;
  error = '';

  NameSchool = "";
  NumClass = 0;
  Barcode = "";
  NumStudent = 0;
  ClassList = [];
  students = [];  
  SchoolId = "";

  constructor() {
    // הופך את כל המתודות והפרופרטיז לתגובתיים (observable)
    makeAutoObservable(this, {
      setField: true,
      setNumClasses: true,
      updateClass: true,
      updateStudent: true,
      setNumStudentsInClass: true,
      resetSchoolData: true,
      addSchool: true,
      fetchSchools: true,
      updateSchool: true,
      deleteSchool: true,
      fetchSchoolIdFromBarcode: true
    });

    // תגובה שמופעלת כששמות הכיתות משתנים – מעדכנת גם את שמות הכיתות של התלמידים
    reaction(
      () => this.ClassList.map(cls => cls.name),
      () => {
        runInAction(() => {
          this.updateClassNamesForStudents();
        });
      }
    );
  }

  // עדכון שדה כללי כלשהו (לפי שם שדה)
  setField(field, value) {
    this[field] = value;

    // אם ברקוד משתנה – מעדכן את שדה בית הספר בכל הכיתות
    if (field === 'Barcode') {
      this.ClassList.forEach(cls => {
        cls.idSchool = value;
      });
    }

    // אם שם בית הספר משתנה – מעדכן את שדה school בכל התלמידים
    if (field === 'NameSchool') {
      this.ClassList.forEach(cls => {
        cls.students.forEach(stu => {
          stu.school = value;
        });
      });
    }
  }

  // מגדיר את מספר הכיתות, ומעדכן את ClassList בהתאם
  setNumClasses(num) {
    this.NumClass = num;
    if (num > this.ClassList.length) {
      // הוספת כיתות
      for (let i = this.ClassList.length; i < num; i++) {
        this.ClassList.push({
          id: i,
          year: new Date().getFullYear(),
          name: "",
          idSchool: this.Barcode,
          students: [],
        });
      }
    } else if (num < this.ClassList.length) {
      // הסרת כיתות
      this.ClassList.splice(num);
    }
  }

  // עדכון שדה בכיתה מסוימת
  updateClass(classIndex, field, value) {
    this.ClassList[classIndex][field] = value;
  }

  // עדכון שדה בתלמיד מסוים בתוך כיתה מסוימת
  updateStudent(classIndex, studentIndex, field, value) {
    runInAction(() => {
      this.ClassList[classIndex].students[studentIndex][field] = value;
    });
  }

  // מגדיר מספר תלמידים לכיתה מסוימת
  setNumStudentsInClass(classIndex, numStudents) {
    const cls = this.ClassList[classIndex];
    if (!cls.students) cls.students = [];

    // הוספת תלמידים ריקים
    while (cls.students.length < numStudents) {
      cls.students.push({
        name: "",
        school: this.NameSchool,
        classNum: cls.name || '',
        phone: "",
        points: 0,
        timeLessons: 0,
        success: false,
        index: cls.students.length,
        paymentStatus: 0,
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date().toISOString(),
        isActive: true,
      });
    }

    // מחיקת תלמידים עודפים
    if (cls.students.length > numStudents) {
      cls.students.splice(numStudents);
    }

    // עדכון שם כיתה אצל התלמידים
    this.updateClassNamesForStudents();
  }

  // מאפס את כל נתוני המוסד
  resetSchoolData() {
    this.NameSchool = "";
    this.NumClass = 0;
    this.Barcode = "";
    this.NumStudent = 0;
    this.ClassList = [];
  }

  // הוספת מוסד חדש
  async addSchool() {
    try {
      // בדיקה אם קיים מוסד עם אותו שם
      const existing = this.schools.find(
        (school) => school.NameSchool.trim() === this.NameSchool.trim()
      );

      if (existing) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'קיים כבר מוסד עם שם זהה',
        });
        return;
      }

      // הכנת אובייקט המוסד
      const schoolData = {
        NameSchool: this.NameSchool,
        NumClass: this.NumClass,
        Barcode: this.Barcode,
        NumStudent: this.NumStudent,
        ClassList: this.ClassList.length ? toJS(this.ClassList) : []
      };

      // שליחת POST לשרת
      const response = await axios.post('https://localhost:7245/api/School', schoolData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // הוספת כל תלמיד ל-userStore אם הוא לא קיים כבר
      for (const cls of this.ClassList) {
        if (Array.isArray(cls.students)) {
          for (const student of cls.students) {
            const exists = userStore.users.some(u => u.phone === student.phone);
            if (!exists) {
              try {
                await userStore.addUser({
                  name: student.name,
                  phone: student.phone,
                  school: this.NameSchool,
                  classes: cls.name,
                  paymentStatus: student.paymentStatus || 0,
                  subscriptionStartDate: student.subscriptionStartDate || new Date().toISOString(),
                  subscriptionEndDate: student.subscriptionEndDate || new Date().toISOString(),
                  isActive: student.isActive !== undefined ? student.isActive : false,
                  index: student.index || 0,
                  success: student.success || 0,
                });
              } catch (err) {
                console.error('שגיאה בהוספת תלמיד:', err);
              }
            }
          }
        }
      }

      // הוספה לסטייט ואיפוס
      runInAction(() => {
        this.resetSchoolData();
        this.schools.push(response.data);
      });

      Swal.fire({
        icon: 'success',
        title: 'הצלחה',
        text: 'המוסד נוסף בהצלחה!',
      });

    } catch (error) {
      console.error("❌ שגיאה בשליחת המוסד:", error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: error?.response?.data?.message || "שליחה נכשלה",
      });
    }
  }

  // טעינת מוסד לפי מזהה
  async loadSchoolById(schoolId) {
    try {
      const response = await axios.get(`https://localhost:7245/api/School/${schoolId}`);
      const data = response.data;

      // עדכון נתוני המוסד בטופס
      this.NameSchool = data.nameSchool;
      this.Barcode = data.barcode;
      this.NumClass = data.numClass;
      this.NumStudent = data.numStudent;

      this.ClassList = Array.isArray(data.classList) ? data.classList : [];
      this.students = Array.isArray(data.students) ? data.students : [];

    } catch (error) {
      console.error('❌ שגיאה בטעינת מוסד:', error);
      throw error;
    }
  }

  // טעינת כל המוסדות מהשרת
  async fetchSchools() {
    runInAction(() => {
      this.loading = true;
      this.error = '';
    });

    try {
      const response = await axios.get('https://localhost:7245/api/School');
      runInAction(() => {
        this.schools = response.data;
      });
    } catch (err) {
      console.error('❌ שגיאה בטעינת מוסדות:', err);
      runInAction(() => {
        this.error = 'אירעה שגיאה בעת טעינת המוסדות';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // מחולל תלמידים לפי מספר בכל כיתה
  generateStudents() {
    this.students = [];

    this.ClassList.forEach((cls, index) => {
      for (let i = 0; i < cls.studentCount; i++) {
        this.students.push({
          name: '',
          classIndex: index,
          checked: false,
        });
      }
    });
  }

  // עדכון שמות כיתות אצל תלמידים
  updateClassNamesForStudents() {
    this.students.forEach(student => {
      const cls = this.ClassList[student.classIndex];
      if (cls) {
        student.classNum = cls.name || '';
      }
    });
  }

  // איפוס כולל לכל השדות
  reset = () => {
    this.setField('NameSchool', '');
    this.setField('Barcode', '');
    this.setField('NumClass', 0);
    this.setField('NumStudent', 0);
    this.setNumClasses(0);
    this.ClassList = [];
    this.students = [];
    this.SchoolId = '';
  };

  // עדכון מוסד בשרת
  async updateSchool(id, updatedSchool) {
    try {
      const response = await axios.put(`https://localhost:7245/api/School/${id}`, updatedSchool, {
        headers: { 'Content-Type': 'application/json' },
      });

      // עדכון ברשימת המוסדות
      runInAction(() => {
        const index = this.schools.findIndex((s) => s.id === id);
        if (index > -1) {
          this.schools[index] = response.data;
        }
      });
    } catch (error) {
      console.error('❌ שגיאה בעדכון:', error);
      throw error;
    }
  }

  // מחיקת מוסד
  async deleteSchool(schoolId) {
    try {
      await axios.delete(`https://localhost:7245/api/School/${schoolId}`);
      runInAction(() => {
        this.schools = this.schools.filter((school) => school.id !== schoolId);
      });
    } catch (err) {
      console.error('❌ שגיאה במחיקת מוסד:', err);
      runInAction(() => {
        this.error = 'אירעה שגיאה בעת מחיקת מוסד';
      });
    }
  }
}

// ייצוא של מופע בודד מהמחלקה לשימוש בפרויקט
const schoolStore = new SchoolStore();
export default schoolStore;

