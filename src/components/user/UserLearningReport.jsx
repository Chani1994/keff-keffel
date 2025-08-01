// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Typography,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
// } from "@mui/material";

// const UserLearningReport = ({ userId }) => {
//   const [lessonRecords, setLessonRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLessons = async () => {
//       setLoading(true);
//       setError(null);
//       const token = sessionStorage.getItem("jwtToken");

//       if (!token) {
//         setError("אין טוקן, יש להתחבר");
//         setLoading(false);
//         return;
//       }

//       try {
//         const lessons = [];
//         for (let i = 2; i <= 9; i++) {
//           try {
//             const { data: lessonData } = await axios.get(
//               `https://localhost:7245/api/Lessons/by-phone-and-lesson/${i}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             const lessonId = lessonData.lessonId || lessonData.id;
//             if (!lessonId) continue;

//             const { data: siData } = await axios.get(
//               `https://localhost:7245/api/Users/getPointsLessonSi/${i}`
//             );

//             const totalPoints = (lessonData.points ?? 0) + (lessonData.pointsTest ?? 0);
//             const isRecord = totalPoints === siData;

//             lessons.push({
//               ...lessonData,
//               totalPoints,
//               isRecord,
//             });
//           } catch (innerError) {
//             if (innerError.response?.status === 404) continue;
//             else throw innerError;
//           }
//         }
//         setLessonRecords(lessons);
//       } catch (err) {
//         setError("שגיאה בטעינת נתוני שיעורים");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) fetchLessons();
//   }, [userId]);

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", mt: 4 }}>
//         <CircularProgress />
//         <Typography>טוען נתוני שיעורים...</Typography>
//       </Box>
//     );
//   if (error)
//     return (
//       <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
//         {error}
//       </Typography>
//     );

//   if (lessonRecords.length === 0)
//     return (
//       <Typography sx={{ mt: 4, textAlign: "center" }}>
//         אין נתוני שיעורים להצגה
//       </Typography>
//     );

//   return (
//     <TableContainer
//       component={Box}
//       sx={{ maxWidth: "100%", mt: 4, overflowX: "auto" }}
//       elevation={3}
//     >
//       <Table aria-label="User learning report" size="small" sx={{ tableLayout: "fixed" }}>
//         <TableHead>
//           <TableRow>
//             <TableCell align="center" sx={{ fontWeight: "bold" }}>
//               כפולה
//             </TableCell>
//             <TableCell align="center" sx={{ fontWeight: "bold" }}>
//               תרגול
//             </TableCell>
//             <TableCell align="center" sx={{ fontWeight: "bold" }}>
//               מבחן
//             </TableCell>
//             <TableCell align="center" sx={{ fontWeight: "bold" }}>
//               סה"כ
//             </TableCell>
//             <TableCell align="center" sx={{ fontWeight: "bold" }}>
//               סטטוס
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {lessonRecords.map((lesson, idx) => (
//             <TableRow
//               key={lesson.lessonId || lesson.id || idx}
//               sx={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
//             >
//               <TableCell align="center">
//                 {lesson.numLesson || lesson.lessonNumber || idx + 1}
//               </TableCell>
//               <TableCell align="center">{lesson.points ?? "-"}</TableCell>
//               <TableCell align="center">{lesson.pointsTest ?? "-"}</TableCell>
//               <TableCell align="center">{lesson.totalPoints ?? "-"}</TableCell>
//               <TableCell
//                 align="center"
//                 sx={
//                   lesson.isRecord
//                     ? {
//                         color: "#FFD700",
//                         fontWeight: "bold",
//                         textShadow: "0 0 8px #FFD700",
//                       }
//                     : { color: "#777" }
//                 }
//               >
//                 {lesson.isRecord ? "שיא!" : "-"}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default UserLearningReport;

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import lessonStore from "../../store/lessonStore";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

const UserLearningReport = observer(({ userId }) => {
  useEffect(() => {
    if (userId) {
      lessonStore.fetchLessonRecords(userId);
    }
  }, [userId]);

  if (lessonStore.loading)
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>טוען נתוני שיעורים...</Typography>
      </Box>
    );

  if (lessonStore.error)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {lessonStore.error}
      </Typography>
    );

  if (lessonStore.lessonRecords.length === 0)
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        אין נתוני שיעורים להצגה
      </Typography>
    );

  return (
    <TableContainer
      component={Box}
      sx={{ maxWidth: "100%", mt: 4, overflowX: "auto" }}
      elevation={3}
    >
      <Table aria-label="User learning report" size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>כפולה</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>תרגול</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>מבחן</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>סה"כ</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>סטטוס</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessonStore.lessonRecords.map((lesson, idx) => (
            <TableRow
              key={lesson.lessonId || lesson.id || idx}
              sx={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
            >
              <TableCell align="center">{lesson.numLesson || lesson.lessonNumber || idx + 1}</TableCell>
              <TableCell align="center">{lesson.points ?? "-"}</TableCell>
              <TableCell align="center">{lesson.pointsTest ?? "-"}</TableCell>
              <TableCell align="center">{lesson.totalPoints ?? "-"}</TableCell>
              <TableCell
                align="center"
                sx={
                  lesson.isRecord
                    ? { color: "#FFD700", fontWeight: "bold", textShadow: "0 0 8px #FFD700" }
                    : { color: "#777" }
                }
              >
                {lesson.isRecord ? "שיא!" : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default UserLearningReport;
