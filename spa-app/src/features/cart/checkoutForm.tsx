import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {  Box, Button } from "@mui/material";
import { checkout, CreatePaymentIntent, getCartId } from "../../api/cart-api";
import { useNavigate } from "react-router-dom";



export default function CheckoutForm() {
  const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

 const handleSubmit = async () => {
  const cartId = getCartId();

     const res = await CreatePaymentIntent(cartId);
     console.log("Payment Intent Response:", res);

  const data = await res

  
  const result = await stripe?.confirmCardPayment(data.clientSecret, {
    payment_method: {
      card: elements?.getElement(CardElement)!,
    },
  });

  
  if (result?.paymentIntent?.status === "succeeded") {
      await checkout(cartId);  
    alert("Payment successful! Your order has been placed.");
    setTimeout(() => {
      navigate(`/success?paymentIntentId=${result?.paymentIntent?.id}`);
    }, 2000);
      
  }
};

    return (
      <>
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 3,mb:5, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <CardElement options={{ style: { base: { fontSize: "16px" }} }}  />
     
      </Box>
       <Button variant="contained" onClick={handleSubmit}>
        Pay Now
            </Button>
        </>
  );
}