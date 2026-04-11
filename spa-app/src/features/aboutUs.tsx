import { Box, Typography } from '@mui/material'
import React from 'react'

export default function AboutUs() {
  return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h4">About Us</Typography>  
          <Typography variant="body1">This is a food ordering app</Typography>
          <Typography variant="body1">Version 1.0.0</Typography>
   </Box>
  )
}
