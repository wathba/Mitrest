import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, getCartId, saveCart } from "../../api/cart-api";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CartItem, ShoppingCart } from "../../types/cart-type";
import { setCart } from "../../slices/Cart-slice";
import { useNavigate } from "react-router-dom";

export default function ShoppingCartComponent() {
  const cartItems = useSelector((state: any) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleIncrease = async (item: CartItem) => {
    const cartId = getCartId();
    const cart = await fetchCart(cartId);
    const itemIndex = cart.items.findIndex(
      (i: any) => i.itemId === item.itemId,
    );
    const existing = cart.items[itemIndex];
    console.log("existing:", existing);

    if (!existing) return;

    existing.quantity++;

    await saveCart(cart);

    dispatch(setCart(cart.items));
  };
  const handleDecrease = async (item: CartItem) => {
    const cartId = getCartId();
    const cart: ShoppingCart = await fetchCart(cartId);

    const existing = cart.items.find((i: any) => i.itemId === item.itemId);

    if (!existing) return;

    existing.quantity--;

    if (existing.quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i.itemId !== item.itemId);
    }

    await saveCart(cart);

    dispatch(setCart(cart.items));
  };
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );

  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  const total = subtotal + tax;

  useEffect(() => {
    const loadCart = async () => {
      const cartId = getCartId();
      const cart = await fetchCart(cartId);
      console.log("Loaded cart items:", cart.items);

      dispatch(setCart(cart.items));
    };

    loadCart();
  }, [dispatch]);
  return (
    <>
      {cartItems.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 15 }}>
          Your cart is empty
        </Typography>
      ) : 
      (<TableContainer
        component={Paper}
        sx={{ mt: 15, width: "80%", mx: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item: CartItem) => (
              <TableRow
                key={item.itemId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{item.itemId}</TableCell>
                <TableCell>
                  <Avatar alt={item.name} src={item.pictureUrl} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ mr: 1 }}
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </Button>
                  {item.quantity}
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ ml: 1 }}
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            mt: 3,
            width: "300px",
            ml: "auto",
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1">
            Subtotal: ${subtotal.toFixed(2)}
          </Typography>

          <Typography variant="body1">Tax (8%): ${tax.toFixed(2)}</Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="h6" fontWeight="bold">
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            onClick={() => navigate("/checkout")}
            variant="contained"
            color="primary"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              mr: "10%",
            }}
          >
            Checkout
          </Button>
        </Box>
        </TableContainer>
      )
      }
    </>
  );
}
