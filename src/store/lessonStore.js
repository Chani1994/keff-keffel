import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

// מחלקה לניהול נתוני שיעורים
class LessonStore {
  lessonRecords = []; // רשימת נתוני שיעורים עבור המשתמשים
  loading = false;    // מצב טעינה בעת בקשות API
  error = null;       // מאחסן שגיאות אם משהו נכשל

  constructor() {
    // הפיכת כל השדות והפונקציות ל-observable ואוטומטית ל-action
    makeAutoObservable(this);
  }

  // פונקציה לטעינת נתוני שיעורים עבור משתמש ספציפי
  async fetchLessonRecords(_userId) {
    this.loading = true; // מציין שהטעינה התחילה
    this.error = null;   // איפוס שגיאות קודמות

    // שליפת טוקן JWT מה-sessionStorage
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      this.error = "אין טוקן, יש להתחבר"; // אם אין טוקן – מציג הודעה
      this.loading = false;
      return;
    }

    try {
      const lessons = []; // מערך זמני לשמירת נתוני השיעורים

      // לולאה על שיעורים מספר 2 עד 9
      for (let i = 2; i <= 9; i++) {
        try {
          // בקשת נתוני השיעור מה-API
          const { data: lessonData } = await axios.get(
            `https://localhost:7245/api/Lessons/by-phone-and-lesson/${i}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // קבלת מזהה השיעור
          const lessonId = lessonData.lessonId || lessonData.id;
          if (!lessonId) continue; // אם אין מזהה, דילוג על השיעור

          // בקשה נוספת לקבלת נקודות SI
          const { data: siData } = await axios.get(
            `https://localhost:7245/api/Users/getPointsLessonSi/${i}`
          );

          // חישוב סכום הנקודות הכולל ובדיקת הישג
          const totalPoints = (lessonData.points ?? 0) + (lessonData.pointsTest ?? 0);
          const isRecord = totalPoints === siData;

          // הוספת רשומה למערך השיעורים
          lessons.push({
            ...lessonData,
            totalPoints,
            isRecord,
            statusText: "", // ריק כשיש נתונים
          });
        } catch (innerError) {
          if (innerError.response?.status === 404) {
            // במקרה שהשיעור לא נמצא – מוסיפים רשומה עם הודעה "לא נלמד"
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
            throw innerError; // אחרת מעבירים את השגיאה החוצה
          }
        }
      }

      // שמירת הנתונים ב-store בתוך action
      runInAction(() => {
        this.lessonRecords = lessons;
      });
    } catch (err) {
      // טיפול בשגיאות כלליות (לא 404)
      if (err.response?.status !== 404) {
        console.error("שגיאה בטעינת נתוני שיעורים", err);
        runInAction(() => {
          this.error = "שגיאה בטעינת נתוני שיעורים";
        });
      }
      // שגיאת 404 אינה מדווחת כ-error
    } finally {
      // סיום מצב טעינה
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // עדכון רשומות שיעורים מבחוץ
  setLessonRecords(records) {
    this.lessonRecords = records;
  }

  /**
   * פונקציה לסינון והצגת תלמידים לפי פרמטרים שונים
   * לא משנה את ה-store אלא מחזירה עותק מסונן
   */
  getFilteredUsers(users, { institutionFilter, classFilter, highestByInstitution, highestByLesson }) {
    let students = [...users]; // עותק כדי לא לשנות את המקור

    // סינון לפי מוסד
    if (institutionFilter) {
      students = students.filter(s => s.school === institutionFilter);
    }

    // סינון לפי כיתה
    if (classFilter) {
      students = students.filter(s => s.classes === classFilter);
    }

    // חישוב התלמיד עם הניקוד הגבוה ביותר בכל מוסד
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

    // חישוב התלמיד עם הניקוד הגבוה ביותר בכל שיעור
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

    return students; // החזרת רשימת התלמידים המסוננת
  }
}

// יצירת מופע יחיד של ה-store
const lessonStore = new LessonStore();
export default lessonStore;
