import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Box, CircularProgress } from "@mui/material";
import { fetchOrderStatus } from "../../api/cart-api";


export default function SuccessPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");

  const paymentIntentId = params.get("paymentIntentId");

  useEffect(() => {
    const checkStatus = async () => {
        const res = await fetchOrderStatus(paymentIntentId!);
        console.log("Order status response:", res);

      setStatus(res.status);
    };

      if (paymentIntentId) {
         checkStatus();
     
    }
  }, [paymentIntentId]);

  if (status === "loading") {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 15, textAlign: "center" }}>
      {status === "Paid" ? (
        <>
          <Typography variant="h4">✅ Payment Successful</Typography>
          <Typography>Your order has been placed.</Typography>
        </>
      ) : status === "Failed" ? (
        <>
          <Typography variant="h4"> Payment Failed</Typography>
          <Typography>Please try again.</Typography>
        </>
      ) : (
        <Typography>Processing...</Typography>
      )}
    </Box>
  );
}