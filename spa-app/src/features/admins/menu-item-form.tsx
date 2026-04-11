

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  
} from "@mui/material";
import { createMenuItem, updateMenuItem } from "../../api/menu-api";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "../../types/menu-Item";
type FormState = {
  name: string;
  price: number | null;
  category: string;
  description: string;
  pictureUrl: string;
};
type Prop = {
  item?: MenuItem;
};
export default function MenuItemForm({item}: Prop) {
  const [form, setForm] = useState<FormState>({
    name: "",
    price: 0,
    category: "",
    description: "",
    pictureUrl: "",
  });
    const navigate = useNavigate();
    const location = useLocation();

    const editItem = location.state as MenuItem | null;
    const isEditMode = !!editItem
    useEffect(() => {
        if (editItem) {
            setForm({    
                name: editItem.name,
                price: editItem.price,
                category: editItem.category,
                description: editItem.description,
                pictureUrl: editItem.pictureUrl,
            });
        }
    }, [editItem]);
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await createMenuItem({
      ...form,
      price: Number(form.price), 
    });

    alert("Menu item created");

    setForm({
      name: "",
      price: 0,
      category: "",
      description: "",
        pictureUrl
            : "",
    });
    navigate("/admin");
  } catch (error) {
    console.error(error);
  }
};
const handleUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await updateMenuItem(editItem?.id!, {
      ...form,
      price: Number(form.price), 
    });

    alert("Menu item updated");

    setForm({
      name: "",
      price: 0,
      category: "",
      description: "",
        pictureUrl
            : "",
    });
    navigate("/admin");
  } catch (error) {
    console.error(error);
  }
};
    return (
    
    <Box
      component="form"
      onSubmit={isEditMode?handleUpdate:handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 15 }}
    >
     
          
    {isEditMode?(
      <Typography variant="subtitle1" mb={2}>
        Editing: {editItem?.name}
      </Typography>
    ):( <Typography variant="h5" mb={2}>
        Add Menu Item
          </Typography>)}
        
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={form.name}
        onChange={handleChange}
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        fullWidth
        margin="normal"
        value={form.price}
        onChange={handleChange}
      />

      <TextField
        label="Category"
        name="category"
        fullWidth
        margin="normal"
        value={form.category}
        onChange={handleChange}
      />
       <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        value={form.description}
        onChange={handleChange}
      />
      <TextField
        label="Picture URL"
        name="pictureUrl"
        fullWidth
        margin="normal"
        value={form.pictureUrl}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
                
      >
        Submit
      </Button>
        </Box >
        
  );
}
