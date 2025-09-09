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
  // קומפוננטה להצגת דו"ח שיעורים למשתמש
  // observer – מאפשרת לעקוב אחרי שינויים ב-MobX store

  useEffect(() => {
    // אם התקבל userId, נטען נתוני השיעורים עבור המשתמש
    if (userId) {
      lessonStore.fetchLessonRecords(userId);
    }
  }, [userId]); // תלוי בשינוי של userId

  if (lessonStore.loading)
    // אם הנתונים עדיין בטעינה, מציג סרגל טעינה והודעה
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>טוען נתוני שיעורים...</Typography>
      </Box>
    );

  if (lessonStore.error)
    // אם התרחשה שגיאה בטעינת הנתונים, מציג הודעת שגיאה
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {lessonStore.error}
      </Typography>
    );

  if (lessonStore.lessonRecords.length === 0)
    // אם אין שיעורים להצגה, מציג הודעה מתאימה
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        אין נתוני שיעורים להצגה
      </Typography>
    );

  return (
<TableContainer sx={{ overflowX: 'hidden', width: '100%' }}>
  <Table>
    <TableHead >
      <TableRow>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          כפולה
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          תרגול
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          מבחן
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          סה"כ
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          סטטוס
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {lessonStore.lessonRecords.map((lesson, idx) => (
        <TableRow
          key={lesson.lessonId || lesson.id || idx}
          sx={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
        >
          <TableCell align="center">
            {lesson.numLesson || lesson.lessonNumber || idx + 1}
          </TableCell>
          <TableCell align="center">{lesson.points ?? "-"}</TableCell>
          <TableCell align="center">{lesson.pointsTest ?? "-"}</TableCell>
          <TableCell align="center">{lesson.totalPoints ?? "-"}</TableCell>
          <TableCell
            align="center"
            sx={
              lesson.isRecord
                ? {
                    color: "#FFD700",
                    fontWeight: "bold",
                    textShadow: "0 0 8px #FFD700",
                  }
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
