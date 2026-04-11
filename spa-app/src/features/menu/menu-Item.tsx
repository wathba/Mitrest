import React, { useState } from "react";
import { MenuItem } from "../../types/menu-Item";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart, getCartId, saveCart } from "../../api/cart-api";
import { addItem } from "../../slices/Cart-slice";
import { CartItem, ShoppingCart } from "../../types/cart-type";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const [expanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
  const cartId = getCartId();

 
  dispatch(
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      pictureUrl: item.pictureUrl,
     
    })
  );

  try {
   
    const cart: ShoppingCart = await fetchCart(cartId);
    const existing = cart.items.find(
      (i: CartItem) => i.itemId === item.id
     
    );

    if (existing) {
      console.log("existing:", existing);
      existing.quantity++;
    } else {
      cart.items.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        pictureUrl: item.pictureUrl,
      });
    }

    
    await saveCart(cart);

  } catch (error) {
    console.error("Cart sync failed:", error);
  }
};
  return (
    <Card
      sx={{
            height: "100%",
        display: "flex",
            flexDirection: "column",
              mt: 2,
            mb: 2,
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      {/* IMAGE */}
      <CardMedia
        component="img"
        height="180"
        image={item.pictureUrl}
        alt={item.name}
      />

      {/* CONTENT */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {item.name}
        </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                  {expanded ? item.description : `${item.description.substring(0, 60)}...`}
        
        </Typography>

        {/* CATEGORY + PRICE */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Typography variant="caption" color="primary">
            {item.category}
          </Typography>

          <Typography variant="h6" color="green">
            ${item.price}
          </Typography>
        </Box>
      </CardContent>

      {/* ACTIONS */}
          <CardActions
              sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button size="small" variant="contained" onClick={() => { handleAddToCart() }}>
          Add to Cart
        </Button>
       
        <Button size="large" color="error" onClick={() => {
          console.log("Id:", `${item.id}`);
          navigate(`/menu/${item.id}`)
        }}>
          More Details
        </Button>
      </CardActions>
    </Card>
  );
}
