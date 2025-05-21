import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';

import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

const EditAdmin = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    id: 0,
    nameAdmin: '',
    password: '',
    phoneAdmin: '',
    email: '',
    fax: '',
    adminType: 1,
    nameSchool: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    adminStore.fetchAdmins().then(() => {
      const current = adminStore.getAdminById(id);
      if (current) {
        setAdminData({ ...current });
      }
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: name === 'adminType' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminStore.updateAdmin(adminData);
    navigate('/admin');
  };

  const toggleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const isSuperAdmin = adminStore.currentAdmin?.adminType === 1;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, textAlign: 'center' }}>
      <Typography variant="h5" mb={3}>עריכת מנהל</Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="שם מנהל"
          name="nameAdmin"
          value={adminData.nameAdmin}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="סיסמה"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={adminData.password}
          onChange={handleChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="טלפון"
          name="phoneAdmin"
          value={adminData.phoneAdmin}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="אימייל"
          name="email"
          type="email"
          value={adminData.email}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="פקס"
          name="fax"
          value={adminData.fax}
          onChange={handleChange}
          required
        />

        {isSuperAdmin && adminData.adminType !== 1 && (
          <TextField
            fullWidth
            margin="normal"
            label="שם מוסד"
            name="nameSchool"
            value={adminData.nameSchool || ''}
            onChange={handleChange}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          💾 שמור שינויים
        </Button>
      </form>
    </Box>
  );
});

export default EditAdmin;
