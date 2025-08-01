import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import userStore from "../../store/userStore";
import lessonStore from "../../store/lessonStore";
import { Box, Paper, Typography } from "@mui/material";

const UserData = observer(() => {
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [highestByInstitution, setHighestByInstitution] = useState(false);
  const [highestByLesson, setHighestByLesson] = useState(false);

  useEffect(() => {
    if (userStore.users.length === 0) {
      userStore.fetchUsers();
    }
  }, []);

  // קוראת ל־lessonStore לסינון המשתמשים על בסיס users מ־userStore
  const filteredUsers = lessonStore.getFilteredUsers(userStore.users, {
    institutionFilter,
    classFilter,
    highestByInstitution,
    highestByLesson,
  });

  // רשימות לסינון (מסוננות על users)
  const institutions = [...new Set(userStore.users.map(u => u.school).filter(Boolean))];
  const classes = [...new Set(userStore.users.map(u => u.classes).filter(Boolean))];

  return (
    <Box
      sx={{
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        position: 'relative',
        p: 3,
        overflow: 'auto',
      }}
    >
      {/* סימן מים */}
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
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

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

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
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

        {/* אזור הגלילה של הטבלה בלבד */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <table style={tableStyle} sx={{ minWidth: 800 /* או יותר */ }}>
            <thead>
              <tr>
                <th style={thStyle}>שם</th>
                <th style={thStyle}>טלפון</th>
                <th style={thStyle}>מוסד</th>
                <th style={thStyle}>כיתה</th>
                <th style={thStyle}>מין</th>
                <th style={thStyle}>נקודות</th>
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
                  <td style={tdStyle}>{user.success}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: 16, color: '#999', textAlign: 'center' }}>
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
  position: 'sticky',
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

export default UserData;
