import React, { useState } from "react";
import "../../css/UserLearningReport.css" // ודא שהקובץ קיים
import { useNavigate } from "react-router-dom";

const UserLearningReport = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleClick = (key) => {
    setInput((prev) => prev + key.toString());
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    alert(`הקלט שלך הוא: ${input}`);
    if (input === "123") {
      alert("הצגת דוח למידה");
      // אפשר גם: navigate("/user/report");
    }
  };

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"];

  return (
    <div className="report-wrapper">
      <div className="phone-frame">
        <div className="display-container">
          <div className="display">{input || "—"}</div>
          <button onClick={handleDelete} className="delete-button" title="מחק">⌫</button>
        </div>

        <div className="keypad-grid">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className="key-button"
            >
              {key}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} className="submit-button">שלח</button>
      </div>
    </div>
  );
};

export default UserLearningReport;
