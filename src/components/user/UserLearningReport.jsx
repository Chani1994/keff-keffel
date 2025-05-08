import React, { useState } from "react";

const UserLearningReport = () => {
  const [input, setInput] = useState("");

  const handleClick = (key) => {
    setInput((prev) => prev + key.toString());
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    // כאן אתה יכול לבצע פעולה אחרת כמו שליחת הקוד לשרת
    alert(`הקלט שלך הוא: ${input}`);

    // דוגמה לבדוק אם הקוד שהוקש הוא 123 ולהציג הודעה על דוח למידה
    if (input === "123") {
      alert("הצגת דוח למידה");
    }
  };

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"];

  return (
    <div style={styles.wrapper}>
      <div style={styles.phoneFrame}>
        {/* תצוגת המסך */}
        <div style={styles.displayContainer}>
          <div style={styles.display}>{input || "—"}</div>
          <button onClick={handleDelete} style={styles.deleteButton}>
            ⌫
          </button>
        </div>

        {/* מקלדת */}
        <div style={styles.grid}>
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              style={styles.button}
            >
              {key}
            </button>
          ))}
        </div>

        {/* כפתור לשליחה */}
        <button onClick={handleSubmit} style={styles.submitButton}>
          שלח
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  phoneFrame: {
    width: "18rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "1.5rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    border: "1px solid #d1d5db",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  displayContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  display: {
    flexGrow: 1,
    minHeight: "2.5rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    padding: "0.25rem 0.5rem",
    fontSize: "1.25rem",
    textAlign: "right",
    border: "1px solid #d1d5db",
    marginRight: "0.5rem",
  },
  deleteButton: {
    width: "3rem",
    height: "2.5rem",
    borderRadius: "0.5rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "1.25rem",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // הכפתורים יוצגו משמאל לימין
    gap: "0.75rem",
    direction: "ltr", // נוסיף את הכיוון כאן לשמאל לימין
  },
  button: {
    width: "4.5rem",
    height: "4.5rem",
    borderRadius: "9999px",
    background: "linear-gradient(to bottom right, #f43f5e, #be123c)",
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
  },
  submitButton: {
    width: "4.5rem",
    height: "4.5rem",
    borderRadius: "9999px",
    background: "#10b981",
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: "bold",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
    marginTop: "1rem",
  },
};

export default UserLearningReport;

