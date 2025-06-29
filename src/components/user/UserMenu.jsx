import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UserMenu = ({ options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const containerRef = useRef(null);

  // סגירה בלחיצה מחוץ לתפריט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    onChange(value);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        minWidth: 170,
        userSelect: 'none',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
        borderRadius: '10px',
        px: 2,
        py: 0.5,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 0 30px #00bcd4ff',
        },
      }}
      onClick={() => setOpen(!open)}
      aria-haspopup="listbox"
      aria-expanded={open}
      tabIndex={0}
    >
      {/* הכותרת/הבחירה */}
      <Typography sx={{ lineHeight: '32px' }}>
        {selected ? options.find(o => o.value === selected)?.label : placeholder}
      </Typography>

      {/* רשימת אפשרויות */}
     {open && (
  <Paper
    elevation={6}
    sx={{
      position: 'absolute',
      top: 'calc(100% + 5px)',
      right: 0,
      width: '100%',
      maxHeight: 200,
      overflowY: 'auto',
      borderRadius: '10px',
      zIndex: 9999,
      // מסגרת גרדיאנט באמצעות רקע ו-padding
      background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      padding: '2px',
    }}
    role="listbox"
  >
    <Box
      sx={{
        borderRadius: '8px', // פחות מהחיצוני כדי לא להחתך
        backgroundColor: '#000',
        color: '#fff',
        maxHeight: 196,
        overflowY: 'auto',
      }}
    >
      {options.map(({ value, label, disabled }) => (
        <Box
          key={value}
          role="option"
          aria-disabled={disabled}
          onClick={() => !disabled && handleSelect(value)}
          sx={{
            px: 2,
            py: 1,
            cursor: disabled ? 'default' : 'pointer',
            backgroundColor: disabled ? 'rgba(255,255,255,0.2)' : 'transparent',
            '&:hover': !disabled ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {},
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
  </Paper>
)}

     
    </Box>
  );
};

export default UserMenu;
