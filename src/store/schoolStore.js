import axios from 'axios';
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
async fetchSchoolIdFromBarcode() {
  try {
    const response = await axios.get(`https://13.51.154.134:7245/api/SchoolId?barcode=${this.Barcode}`);
    runInAction(() => {
      this.SchoolId = response.data; // או כל שם שדה מתאים
      // עדכון idSchool של כל כיתה לפי ה־Barcode שהוחזר
      this.ClassList.forEach(cls => {
        cls.idSchool = response.data;
      });
    });
  } catch (error) {
    console.error("❌ שגיאה בשליפת קוד מוסד לפי ברקוד:", error);
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
  let students = this.ClassList[classIndex].students;

  if (numStudents > students.length) {
    for (let i = students.length; i < numStudents; i++) {
     students.push({
  name: "",
  school: this.NameSchool,
  classNum: this.ClassList[classIndex].name || '',
  phone: "",
  points: 0,
  timeLessons: 0,
  success: false,
  index: 0,
});

    }
  } else if (numStudents < students.length) {
    // במקרה כזה נחתוך את הרשימה – אבל רק מהסוף, נשארים עם התלמידים שכבר מולאו
    this.ClassList[classIndex].students = students.slice(0, numStudents);
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

    const classListPlain = toJS(this.ClassList);

    const schoolData = {
      NameSchool: this.NameSchool,
      NumClass: this.NumClass,
      Barcode: this.Barcode,
      NumStudent: this.NumStudent,
      ClassList: classListPlain,
    };

    console.log("📤 שולח מוסד לשרת:", schoolData);

    const response = await axios.post('https://13.51.154.134:7245/api/School', schoolData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ המוסד נוסף בהצלחה:", response.data);

    runInAction(() => {
      this.resetSchoolData();
      this.schools.push(response.data); // אפשר לעדכן גם את הרשימה המקומית
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
async loadSchoolById(id) {
  try {
    const res = await axios.get(`https://13.51.154.134:7245/api/School/${id}`);
    const data = res.data;

    // עדכון בהתאמה לשמות השדות כפי שהם מגיעים מהשרת:
    this.NameSchool = data.nameSchool || '';
    this.Barcode = data.barcode || '';
    this.NumClass = data.numClass || 0;
    this.NumStudent = data.numStudent || 0;
    this.ClassList = data.classList || [];

  } catch (error) {
    console.error("שגיאה בטעינת המוסד:", error);
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
      const response = await axios.get('https://13.51.154.134:7245/api/School');
      runInAction(() => {
        this.schools = response.data;
        console.log('✅ מוסדות נטענו:', this.schools);
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
      console.log('Sending updated school:', updatedSchool);

      const response = await axios.put(`https://13.51.154.134:7245/api/School/${id}`, updatedSchool);
      console.log('Response from server:', response.data);

      runInAction(() => {
        const index = this.schools.findIndex(school => school.id === id);
        if (index > -1) {
          this.schools[index] = response.data;
        }
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update school');
    }
  }

  async deleteSchool(schoolId) {
    try {
      await axios.delete(`https://13.51.154.134:7245/api/School/${schoolId}`);
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
