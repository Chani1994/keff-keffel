import axios from 'axios';
import Swal from 'sweetalert2';
import userStore from './userStore'; 

import { makeAutoObservable, toJS, runInAction,reaction  } from "mobx";

class SchoolStore {
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
     reaction(
      () => this.ClassList.map(cls => cls.name),
      () => {
        runInAction(() => {
          this.updateClassNamesForStudents();
        });
      }
    );

  }
 
  setField(field, value) {
  this[field] = value;

  if (field === 'Barcode') {
    this.ClassList.forEach(cls => {
      cls.idSchool = value;
    });
  }

  if (field === 'NameSchool') {
    this.ClassList.forEach(cls => {
      cls.students.forEach(stu => {
        stu.school = value;
      });
    });
  }
}


  setNumClasses(num) {
    this.NumClass = num;
    if (num > this.ClassList.length) {
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
      this.ClassList.splice(num);
    }
  }

  updateClass(classIndex, field, value) {
    this.ClassList[classIndex][field] = value;
  }
updateStudent(classIndex, studentIndex, field, value) {
  runInAction(() => {
    this.ClassList[classIndex].students[studentIndex][field] = value;
  });
}


setNumStudentsInClass(classIndex, numStudents) {
  const cls = this.ClassList[classIndex];
  if (!cls.students) cls.students = [];

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

  if (cls.students.length > numStudents) {
    cls.students.splice(numStudents);
  }

  this.updateClassNamesForStudents();
}

  resetSchoolData() {
    this.NameSchool = "";
    this.NumClass = 0;
    this.Barcode = "";
    this.NumStudent = 0;
    this.ClassList = [];
  }
async addSchool() {
  try {
    // בדיקת כפילות לפי שם מוסד
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
console.log('ClassList לפני שליחה:', this.ClassList);

    const schoolData = {
      NameSchool: this.NameSchool,
      NumClass: this.NumClass,
      Barcode: this.Barcode,
      NumStudent: this.NumStudent,
      ClassList: this.ClassList.length ? toJS(this.ClassList) : []
    };

    console.log("📤 שולח מוסד לשרת:", schoolData);

    const response = await axios.post('https://localhost:7245/api/School', schoolData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ המוסד נוסף בהצלחה:", response.data);
for (const cls of this.ClassList) {
  if (Array.isArray(cls.students)) {
    for (const student of cls.students) {
      console.log("Adding student:", student);
      // שאר הקוד
    }
  }
}

    // מוסיפים תלמידים ל-userStore עם await ולולאת for...of
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
                isActive: student.isActive !== undefined ? student.isActive : true,
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
    console.error("❌ שגיאה בשליחת המוסד:", error.response?.data || error.message || error);
    Swal.fire({
      icon: 'error',
      title: 'שגיאה',
      text: error?.response?.data?.message || "שליחה נכשלה",
    });
  }
}

async loadSchoolById(schoolId) {
  try {
    console.log('📥 טוען מוסד עם ID:', schoolId);
    const response = await axios.get(`https://localhost:7245/api/School/${schoolId}`);
    const data = response.data;
    console.log('✅ קיבלתי:', data);

    // בדיקות שמירה עם לוגים
    this.NameSchool = data.nameSchool;
    this.Barcode = data.barcode;
    this.NumClass = data.numClass;
    this.NumStudent = data.numStudent;

    this.ClassList = Array.isArray(data.classList) ? data.classList : [];
    this.students = Array.isArray(data.students) ? data.students : [];

    console.log('📦 ClassList אחרי:', this.ClassList);
    console.log('👨‍🎓 students אחרי:', this.students);

  } catch (error) {
    console.error('❌ שגיאה בטעינת מוסד:', error);
    throw error;
  }
}


  async fetchSchools() {
    runInAction(() => {
      this.loading = true;
      this.error = '';
    });

    try {
      console.log('📡 טוען מוסדות...');
      const response = await axios.get('https://localhost:7245/api/School');
      runInAction(() => {
        this.schools = response.data;
        console.log('✅ מוסדות נטענו:', this.schools);
        console.log('schools in store:', JSON.parse(JSON.stringify(schoolStore.schools)));

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
generateStudents() {
  this.students = [];

  this.ClassList.forEach((cls, index) => {
    for (let i = 0; i < cls.studentCount; i++) {
      this.students.push({
        name: '',
        classIndex: index, // קישור לכיתה לפי אינדקס
        checked: false,
      });
    }
  });
}
 updateClassNamesForStudents() {
    this.students.forEach(student => {
      const cls = this.ClassList[student.classIndex];
      if (cls) {
        student.classNum = cls.name || '';
      }
    });
  }

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

 async updateSchool(id, updatedSchool) {
  try {
    console.log('📤 שולח לעדכון:', id, updatedSchool);
    const response = await axios.put(`https://localhost:7245/api/School/${id}`, updatedSchool, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('✅ עדכון הצליח:', response.data);

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

const schoolStore = new SchoolStore();
export default schoolStore;
