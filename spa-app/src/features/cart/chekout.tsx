
import { Box, Typography } from "@mui/material";
import CheckoutForm from "./checkoutForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function CheckoutPage() {
    const {  isAuthenticated } = useSelector(
    (state: any) => state.account || {},
  );
  
    if (!isAuthenticated) {    
        return <Navigate to="/login" />;
      }

    return (
  
    <Box sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h5" mb={2}>
        Payment
      </Typography>
    
      <CheckoutForm />
        </Box>
  
       
  );
}