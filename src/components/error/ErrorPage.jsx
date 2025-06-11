import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

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
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vh',
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
          p: 4,
          width: '60vw',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <img src="/logo1.png" alt="לוגו" style={{ width: 100 }} />
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          שגיאה - הדף לא נמצא
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          מצטערים! הדף שחיפשת אינו קיים או שחלה שגיאה בטעינה.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/')}
          sx={{
            mt: 4,
            borderRadius: '50px',
        border: '2px solid #e91e63',
        color: '#e91e63',
        background: 'transparent',
        fontWeight: 600,
        fontSize: '1rem',
        boxShadow: '0 0 8px #e91e63',
        px: 4,
        py: 1.5,
        textTransform: 'none',
            '&:hover': {
             background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
          color: '#fff',
          borderColor: '#e91e63',
          boxShadow: '0 0 20px #e91e63',
            },
          }}
        >
          חזרה לדף הבית
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
