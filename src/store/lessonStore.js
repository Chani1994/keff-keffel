import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class LessonStore {
  lessonRecords = []; // רשימת נתוני שיעורים
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

async fetchLessonRecords(userId) {
  this.loading = true;
  this.error = null;

  const token = sessionStorage.getItem("jwtToken");
  if (!token) {
    this.error = "אין טוקן, יש להתחבר";
    this.loading = false;
    return;
  }

  try {
    const lessons = [];
    for (let i = 2; i <= 9; i++) {
      try {
        const { data: lessonData } = await axios.get(
          `https://localhost:7245/api/Lessons/by-phone-and-lesson/${i}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const lessonId = lessonData.lessonId || lessonData.id;
        if (!lessonId) continue;

        const { data: siData } = await axios.get(
          `https://localhost:7245/api/Users/getPointsLessonSi/${i}`
        );

        const totalPoints = (lessonData.points ?? 0) + (lessonData.pointsTest ?? 0);
        const isRecord = totalPoints === siData;

        lessons.push({
          ...lessonData,
          totalPoints,
          isRecord,
          statusText: "", // ריק כשיש נתונים
        });
      } catch (innerError) {
        if (innerError.response?.status === 404) {
          // במקום לדלג, הוסף שורה עם הודעה "לא נלמד"
          lessons.push({
            id: i,
            numLesson: i,
            points: "-",
            pointsTest: "-",
            totalPoints: "-",
            isRecord: false,
            statusText: "לא נלמד",
          });
        } else {
          throw innerError;
        }
      }
    }

    runInAction(() => {
      this.lessonRecords = lessons;
    });
  } catch (err) {
    if (err.response?.status !== 404) {
      console.error("שגיאה בטעינת נתוני שיעורים", err);
      runInAction(() => {
        this.error = "שגיאה בטעינת נתוני שיעורים";
      });
    }
    // אם זה 404, לא מדפיסים כלום ולא מעדכנים את ה-error
  } finally {
    runInAction(() => {
      this.loading = false;
    });
  }
}

  setLessonRecords(records) {
    this.lessonRecords = records;
  }

  // הפונקציה מקבלת את רשימת המשתמשים מבחוץ, לא שומרת אותם ב-store
  getFilteredUsers(users, { institutionFilter, classFilter, highestByInstitution, highestByLesson }) {
    let students = [...users];

    if (institutionFilter) {
      students = students.filter(s => s.school === institutionFilter);
    }

    if (classFilter) {
      students = students.filter(s => s.classes === classFilter);
    }

    if (highestByInstitution) {
      const map = {};
      students.forEach(s => {
        const userRecord = this.lessonRecords.find(lr => lr.userId === s.id);
        const userSuccess = userRecord ? userRecord.totalPoints : 0;

        if (!map[s.school] || userSuccess > map[s.school].success) {
          map[s.school] = { ...s, success: userSuccess };
        }
      });
      students = Object.values(map);
    }

    if (highestByLesson) {
      const map = {};
      students.forEach(s => {
        const userRecord = this.lessonRecords.find(lr => lr.userId === s.id);
        const userSuccess = userRecord ? userRecord.totalPoints : 0;

        if (!map[s.classes] || userSuccess > map[s.classes].success) {
          map[s.classes] = { ...s, success: userSuccess };
        }
      });
      students = Object.values(map);
    }

    return students;
  }
}

const lessonStore = new LessonStore();
export default lessonStore;

