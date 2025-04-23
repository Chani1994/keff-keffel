import React, { useState } from 'react';

const AddSchool= ({ onClose }) => {
  const [school, setSchool] = useState({
    name: '',
    code: '',
    grades: []
  });

  const handleChange = (e) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  const addGrade = () => {
    setSchool({
      ...school,
      grades: [...school.grades, { year: '', classes: [] }]
    });
  };

  const removeGrade = (index) => {
    const newGrades = [...school.grades];
    newGrades.splice(index, 1);
    setSchool({ ...school, grades: newGrades });
  };

  const updateGrade = (index, key, value) => {
    const updatedGrades = [...school.grades];
    updatedGrades[index][key] = value;
    setSchool({ ...school, grades: updatedGrades });
  };

  const addClass = (gradeIndex) => {
    const updatedGrades = [...school.grades];
    updatedGrades[gradeIndex].classes.push({ classNumber: '', studentCount: '' });
    setSchool({ ...school, grades: updatedGrades });
  };

  const updateClass = (gradeIndex, classIndex, key, value) => {
    const updatedGrades = [...school.grades];
    updatedGrades[gradeIndex].classes[classIndex][key] = value;
    setSchool({ ...school, grades: updatedGrades });
  };

  const removeClass = (gradeIndex, classIndex) => {
    const updatedGrades = [...school.grades];
    updatedGrades[gradeIndex].classes.splice(classIndex, 1);
    setSchool({ ...school, grades: updatedGrades });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('School submitted:', school);
    onClose(); // סגירה אחרי שליחה
  };

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <button onClick={onClose} style={closeButtonStyle}>✖</button>
        <form onSubmit={handleSubmit}>
          <h2>הוספת מוסד</h2>

          <div>
            <label>שם מוסד:</label>
            <input name="name" value={school.name} onChange={handleChange} required />
          </div>

          <div>
            <label>קוד מוסד:</label>
            <input name="code" value={school.code} onChange={handleChange} required />
          </div>

          <hr />

          {school.grades.map((grade, gradeIndex) => (
            <div key={gradeIndex} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <label>שנתון:</label>
              <input
                value={grade.year}
                onChange={(e) => updateGrade(gradeIndex, 'year', e.target.value)}
                required
              />
              <button type="button" onClick={() => removeGrade(gradeIndex)}>הסר שנתון</button>

              <div>
                {grade.classes.map((cls, classIndex) => (
                  <div key={classIndex}>
                    <label>כיתה מס':</label>
                    <input
                      value={cls.classNumber}
                      onChange={(e) => updateClass(gradeIndex, classIndex, 'classNumber', e.target.value)}
                      required
                    />
                    <label>מס' תלמידים:</label>
                    <input
                      value={cls.studentCount}
                      onChange={(e) => updateClass(gradeIndex, classIndex, 'studentCount', e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => removeClass(gradeIndex, classIndex)}>הסר כיתה</button>
                  </div>
                ))}
                <button type="button" onClick={() => addClass(gradeIndex)}>הוסף כיתה</button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addGrade}>הוסף שנתון</button>

          <br /><br />
          <button type="submit">שמור מוסד</button>
        </form>
      </div>
    </div>
  );
};

export default AddSchool;


// מחוץ ל־AddSchoolDialog או בתחילת הקובץ

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const dialogStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  direction: 'rtl', // אם אתה רוצה ימין לשמאל
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
};
