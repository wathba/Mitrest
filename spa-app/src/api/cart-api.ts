const API_URL = process.env.APP_URL || 'https://localhost:5001'; 

export const fetchCart = async (cartId: string) => {
  const res = await fetch(`${API_URL}/api/cart/${cartId}`);
  return await res.json();
};

export const saveCart = async (cart: any) => {
  const res = await fetch(API_URL + "/api/cart", {
    method: "POST",
    body: JSON.stringify(cart),
    headers: { "Content-Type": "application/json" },
  });

  return await res.json();
};
export const getCartId = () => {
  let id = localStorage.getItem("cartId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cartId", id);
  }

  return id;
};
export const checkout = async (cartId: string) => {
  const res = await fetch(API_URL + "/api/orders/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId }),
  });

  return res;
};
export const CreatePaymentIntent = async (cartId: string) => {
  const res = await fetch(`${API_URL}/api/orders/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId }),
  });

  return res.json();
};
export const fetchOrderStatus = async (paymentIntentId: string) => {
  const res = await fetch(`${API_URL}/api/orders/status/${paymentIntentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
}