import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Avatar,
  Box,
  Button
} from "@mui/material";
import { MenuItem } from "../../types/menu-Item";
import { useParams } from "react-router-dom";
import { getMenuById } from "../../api/menu-api";
import { getCartId, saveCart } from "../../api/cart-api";
import { addItem } from "../../slices/Cart-slice";


export default function MenuItemById() {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const id = useParams().id;
  const handleAddToCart = async () => {
    const cartId = getCartId();
    if (!cartId) {
      console.error("No cart ID found");
      return;
    }
    if (!menuItem) {
      console.error("No menu item found");
      return;
    }
    try {
    await  saveCart({
        id: cartId,
        items: [
          {
            itemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            pictureUrl: menuItem.pictureUrl,
          },
        ],
    });
      addItem({
        itemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        pictureUrl: menuItem.pictureUrl,
      });
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error(error);
    }
  };
 
  useEffect(() => {
    const getMenuItem = async () => { 
    try {
      const response = await getMenuById(Number(id));
     
      setMenuItem(response);
      
    } catch (error) {
      console.error(error);
    }
  }
    getMenuItem();
 },[id] );
  
  return (
    <>
    <TableContainer component={Paper} sx={{ mt: 15 ,width: "50%", mx: "auto"}}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><strong>Image</strong></TableCell>
            <TableCell>
              <Avatar
                src={menuItem?.pictureUrl}
                alt={menuItem?.name}
                variant="rounded"
                sx={{ width: 80, height: 80 }}
              />
            </TableCell>
          </TableRow>

          {/* NAME */}
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell>{menuItem?.name}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell>{menuItem?.description}</TableCell>
          </TableRow>

         
          <TableRow>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell>{menuItem?.category}</TableCell>
          </TableRow>

        
          <TableRow>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell sx={{ color: "green", fontWeight: "bold" }}>
              ${menuItem?.price}
            </TableCell>
          </TableRow>

        </TableBody>
      </Table>
      
    </TableContainer>
   <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Button onClick={handleAddToCart} variant="contained"> Add to Cart</Button>  
      </Box>
    </>
  );
}