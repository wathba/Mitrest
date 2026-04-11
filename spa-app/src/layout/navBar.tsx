import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  Badge,
} from "@mui/material";
import DiningIcon from "@mui/icons-material/Dining";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DehazeIcon from "@mui/icons-material/Dehaze";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/account-slice";
import MobileDrawer from "./mobileDrower";


export default function Navbar() {
  const isMobile = useMediaQuery("(max-width:741px)");
  const [open, setOpen] = useState(false);
  const cartItems = useSelector((state: any) => state.cart.items || []);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user, isAuthenticated } = useSelector(
    (state: any) => state.account || {},
  );
      
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };
  const cartItemCount = cartItems.reduce(
    (count: number, item: any) => count + item.quantity,
    0,
  );
  useEffect(() => {console.log("user:", user)}, [user]); 
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#60a5fa", // Tailwind blue-400
          boxShadow: 3,
          padding: 1,
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1536px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {!isMobile && (
            <Box
              sx={
                isMobile
                  ? { textAlign: "center" }
                  : {
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }
              }
            >
              <DiningIcon sx={{ fontSize: 30, marginRight: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                MitREST
              </Typography>
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component="a" href="/menu">
                Menu
              </Button>
              <Button color="inherit">Offers</Button>
              <Button color="inherit" component={Link} to="/contact">Contact</Button>
              {user?.role === "admin" && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
              {user?.roles === "Admin" && (
                <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button> 
              )}
             
            </Box>
          )}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit">
                <ArrowDropDownIcon />
              </IconButton>
              {!isAuthenticated ? (
                
                  <Button color="inherit" component={Link} to="/login">
                    Login OR Register
                  </Button>
                 
                
              ) : (
                <>
                    <Box display="flex" alignItems="center" gap={2}>
            <Typography>
              Hi {user?.firstName || user?.email}
            </Typography>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <DehazeIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <MobileDrawer open={open} setOpen={setOpen} />
    </>
  );
}
