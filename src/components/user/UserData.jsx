import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite"; // מאפשר למרכיב לעקוב אחרי שינויים ב-store
import userStore from "../../store/userStore";
import lessonStore from "../../store/lessonStore";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const UserData = observer(() => {
  // מצבים מקומיים של סינון ומיון
  const [institutionFilter, setInstitutionFilter] = useState(""); // סינון לפי מוסד
  const [classFilter, setClassFilter] = useState(""); // סינון לפי כיתה
  const [highestByInstitution, setHighestByInstitution] = useState(false); // הצגת שיא לפי מוסד
  const [highestByLesson, setHighestByLesson] = useState(false); // הצגת שיא לפי שיעור

  // טעינת משתמשים מה-store אם הרשימה עדיין ריקה
  useEffect(() => {
    if (userStore.users.length === 0) {
      userStore.fetchUsers();
    }
  }, []);

  // קריאה לפונקציה ב-lessonStore לסינון המשתמשים לפי הקריטריונים שנבחרו
  const filteredUsers = lessonStore.getFilteredUsers(userStore.users, {
    institutionFilter,
    classFilter,
    highestByInstitution,
    highestByLesson,
  });

  // יצירת רשימות ייחודיות של מוסדות וכיתות מתוך המשתמשים
  const institutions = [...new Set(userStore.users.map(u => u.school).filter(Boolean))];
  const classes = [...new Set(userStore.users.map(u => u.classes).filter(Boolean))];

  // פונקציה למחיקת משתמש עם אישור מהמשתמש
  const handleDelete = (id, name) => {
    if (window.confirm(`אתה בטוח שברצונך למחוק את ${name}?`)) {
      userStore.deleteUser(id);
    }
  };

  return (
    <Box
      sx={{
        direction: 'rtl', // מימין לשמאל
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        position: 'relative',
        p: 3,
        overflow: 'auto', // מאפשר גלילה אנכית
      }}
    >
      {/* סימן מים ברקע */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          backgroundImage: 'url("/logo3.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          opacity: 0.05,
          pointerEvents: 'none', // לא מפריע לאינטראקציה
          zIndex: 0,
        }}
      />

      {/* כרטיס עוטף את הטבלה */}
      <Paper
        elevation={6}
        sx={{
          p: 0,
          width: 1000,
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
          zIndex: 2,
        }}
      >
        {/* אזור הכותרת והסינון - קבוע למעלה */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 3,
            p: 3,
            borderBottom: '1px solid #ccc',
          }}
        >
          {/* לוגו וכותרת */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src="/logo1.png" alt="לוגו" style={{ width: 80 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              נתוני תלמידים לפי קריטריונים
            </Typography>
          </Box>

          {/* אזור הסינון */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* סינון לפי מוסד */}
            <label>
              מוסד:
              <select
                value={institutionFilter}
                onChange={(e) => setInstitutionFilter(e.target.value)}
                style={{ marginRight: 8, padding: '6px 10px', borderRadius: 6 }}
              >
                <option value="">הכל</option>
                {institutions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </label>

            {/* סינון לפי כיתה */}
            <label>
              כיתה:
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                style={{ marginRight: 8, padding: '6px 10px', borderRadius: 6 }}
              >
                <option value="">הכל</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* שיא לפי מוסד */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <input
                type="checkbox"
                checked={highestByInstitution}
                onChange={(e) => {
                  setHighestByInstitution(e.target.checked);
                  if (e.target.checked) setHighestByLesson(false);
                }}
              />
              שיא גבוה לפי מוסד
            </label>

            {/* שיא לפי שיעור */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <input
                type="checkbox"
                checked={highestByLesson}
                onChange={(e) => {
                  setHighestByLesson(e.target.checked);
                  if (e.target.checked) setHighestByInstitution(false);
                }}
              />
              שיא גבוה לפי שיעור
            </label>
          </Box>
        </Box>

        {/* אזור הגלילה של הטבלה */}
        <Box sx={{ width: '95%', overflowX: 'auto' }}>
          <table style={tableStyle} sx={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th style={thStyle}>שם</th>
                <th style={thStyle}>טלפון</th>
                <th style={thStyle}>מוסד</th>
                <th style={thStyle}>כיתה</th>
                <th style={thStyle}>מין</th>
                <th style={thStyle}>נקודות</th> {/* כאן יופיע סכום נקודות תרגול + מבחן */}
                <th style={thStyle}>פעיל</th> {/* סטטוס משתמש */}
                <th style={thStyle}>פעולות</th> {/* כפתור מחיקה */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.phone}</td>
                  <td style={tdStyle}>{user.school}</td>
                  <td style={tdStyle}>{user.classes}</td>
                  <td style={tdStyle}>{user.paymentStatus}</td>

                  {/* עמודת נקודות - סה"כ תרגול + מבחן */}
                  <td style={tdStyle}>
                    {(() => {
                      const lessonRecord = lessonStore.lessonRecords.find(lr => lr.userId === user.id);
                      return lessonRecord ? lessonRecord.totalPoints : '-';
                    })()}
                  </td>

                  {/* סטטוס פעילות */}
                  <td style={tdStyle}>
                    {user.isActive ? '✓ ' : '✗ '}
                  </td>

                  {/* כפתור מחיקה */}
                  <td style={tdStyle}>
                    <IconButton
                      onClick={() => handleDelete(user.id, user.name)}
                      sx={deleteButtonStyle}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}

              {/* שורה במקרה שאין משתמשים */}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: 16, color: '#999', textAlign: 'center' }}>
                    אין משתמשים לפי הקריטריונים שנבחרו
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
});

// סגנונות כלליים לטבלה
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  padding: 12,
  background: '#263238',
  color: '#00bcd4',
  borderBottom: '1px solid #00bcd4',
  fontSize: 16,
  position: 'sticky', // הכותרת נשארת גלויה בגלילה
  top: 0,
  zIndex: 2,
};

const tdStyle = {
  padding: 12,
  color: '#333',
  borderBottom: '1px solid #ccc',
  textAlign: 'center',
  fontSize: 15,
};

const deleteButtonStyle = {
  borderRadius: '50%',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#e91e63',
  color: '#e91e63',
  background: 'transparent',
  boxShadow: '0 0 8px #e91e63',
  p: 1,
  ml: 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#ffc107',
    boxShadow: '0 0 20px #e91e63',
  },
};

export default UserData;
