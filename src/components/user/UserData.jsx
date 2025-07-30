import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';
import { Box, Paper, Typography } from '@mui/material';

const UserData = observer(() => {
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [highestByInstitution, setHighestByInstitution] = useState(false);
  const [highestByLesson, setHighestByLesson] = useState(false);

  useEffect(() => {
    if (userStore.users.length === 0) {
      userStore.fetchUsers();
    }
  }, []);

  const getFilteredUsers = () => {
    let students = [...userStore.users];

    if (institutionFilter) {
      students = students.filter(s => s.school === institutionFilter);
    }

    if (classFilter) {
      students = students.filter(s => s.classes === classFilter);
    }

    if (highestByInstitution) {
      const map = {};
      students.forEach(s => {
        if (!map[s.school] || s.success > map[s.school].success) {
          map[s.school] = s;
        }
      });
      students = Object.values(map);
    }

    if (highestByLesson) {
      const map = {};
      students.forEach(s => {
        if (!map[s.classes] || s.success > map[s.classes].success) {
          map[s.classes] = s;
        }
      });
      students = Object.values(map);
    }

    return students;
  };

  const institutions = [...new Set(userStore.users.map(u => u.school).filter(Boolean))];
  const classes = [...new Set(userStore.users.map(u => u.classes).filter(Boolean))];
  const filteredUsers = getFilteredUsers();

  return (
    <Box
      sx={{
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'relative',
        p: 3,
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
          zIndex: 10,
        }}
      />

      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: 1000,
          maxHeight: '80vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          overflowY: 'auto',
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={2}
          > */}
            <img src="/logo1.png" alt="לוגו" style={{ width: 80 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background:
                  'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              נתוני תלמידים לפי קריטריונים
            </Typography>
          {/* </Box> */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              mt:1,
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

        <table style={tableStyle}>
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
      </Paper>
    </Box>
  );
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 20,
};

const thStyle = {
  padding: 12,
  background: '#263238',
  color: '#00bcd4',
  borderBottom: '1px solid #00bcd4',
  fontSize: 16,
};

const tdStyle = {
  padding: 12,
  color: '#333',
  borderBottom: '1px solid #ccc',
  textAlign: 'center',
  fontSize: 15,
};

export default UserData;
