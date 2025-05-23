import axios from 'axios';
import { makeAutoObservable, toJS, runInAction } from "mobx";

class SchoolStore {
  schools = [];
  loading = false;
  error = '';

  NameSchool = "";
  NumClass = 0;
  Barcode = "";
  NumStudent = 0;
  ClassList = [];

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
      deleteSchool: true
    });
  }

  setField(field, value) {
    this[field] = value;

    if (field === 'Barcode') {
      this.ClassList.forEach(cls => {
        cls.idSchool = value;
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
    this.ClassList[classIndex].students[studentIndex][field] = value;
  }

  setNumStudentsInClass(classIndex, numStudents) {
    let students = this.ClassList[classIndex].students;
    if (numStudents > students.length) {
      for (let i = students.length; i < numStudents; i++) {
        students.push({
          name: "",
          school: "",
          Classes: "",  
          phone: "",
          points: 0,
          timeLessons: 0,
          success: false,
        });
      }
    } else if (numStudents < students.length) {
      students.splice(numStudents);
    }
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
      const classListPlain = toJS(this.ClassList);

      const schoolData = {
        NameSchool: this.NameSchool,
        NumClass: this.NumClass,
        Barcode: this.Barcode,
        NumStudent: this.NumStudent,
        ClassList: classListPlain,
      };

      console.log("📤 שולח מוסד לשרת:", schoolData);

      const response = await axios.post('https://localhost:7245/api/School', schoolData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("✅ המוסד נוסף בהצלחה:", response.data);

      runInAction(() => {
        this.resetSchoolData();
      });

    } catch (error) {
      console.error("❌ שגיאה בשליחת המוסד:", error.response?.data || error.message || error);
      throw new Error(error?.response?.data?.message || "שליחה נכשלה");
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

  async updateSchool(id, updatedSchool) {
    try {
      console.log('Sending updated school:', updatedSchool);

      const response = await axios.put(`https://localhost:7245/api/School/${id}`, updatedSchool);
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
