import React, { useState } from "react";

const UserRegister = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    school: "",
    grade: "",
    idNumber: "",
    phone: "",
    paymentMethod: "",
  });

  const paymentOptions = [
    "מזומן",
    "אשראי",
    "העברה בנקאית",
    "אחר",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // שליחת הנתונים לשרת
    console.log("Submitted form:", form);
    alert("הרשמה בוצעה בהצלחה!");
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>טופס הרשמה</h2>

        <label style={styles.label}>
          שם משתמש
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          סיסמה
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          שם פרטי
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          שם משפחה
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          בית ספר
          <input
            type="text"
            name="school"
            value={form.school}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          כיתה
          <input
            type="text"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          ת.ז.
          <input
            type="text"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          מספר טלפון
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          צורת תשלום
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">בחר...</option>
            {paymentOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" style={styles.button}>
          הירשם
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
    color: "#555",
  },
  input: {
    marginTop: "0.25rem",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "0.5rem",
    border: "none",
    background: "linear-gradient(to bottom right, #3b82f6, #2563eb)",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 0.1s ease-in-out",
  },
};

export default UserRegister;
