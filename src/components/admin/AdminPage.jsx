import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddSchool from '../school/AddSchool'; 
const AdminPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

  const toggleOptions = () => setShowOptions(prev => !prev);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <div>
      <h2>ברוכה הבאה לניהול</h2>
      <button onClick={toggleOptions}>ניהול מוסד</button>

      {showOptions && (
        <div>
         <button onClick={() => setShowDialog(true)}>הוספת מוסד</button>

{showDialog && <AddSchool onClose={() => setShowDialog(false)} />}
          <button onClick={() => navigate('/admin/school-edit')}>עריכה/שינוי מוסד</button>
          <button onClick={() => navigate('/admin/school-delete')}>מחיקת מוסד</button>
        </div>
      )}

      <button>הצגת נתונים ע"פ קריטריונים</button>

      {/* דיאלוג של הוספת מוסד */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>הוספת מוסד</DialogTitle>
        <DialogContent>
          <AddSchool />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">סגור</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;

