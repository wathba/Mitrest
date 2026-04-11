import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../slices/account-slice";

export default function MobileDrawer({ open, setOpen }: any) {
  const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    


  const { user, isAuthenticated } = useSelector(
    (state: any) => state.account || {}
  );

  const handleClick = async (text: string) => {
    setOpen(false);

    switch (text) {
      case "Login":
        navigate("/login");
        break;

      case "Register":
        navigate("/login?mode=register");
        break;

      case "Logout":
        await dispatch(logoutUser());
        navigate("/login");
        break;

      case "Profile":
        navigate("/profile");
        break;

      default:
        navigate(`/${text.toLowerCase()}`);
    }
  };

  const menuItems = ["Menu", "Offers", "Contact"];

  if (isAuthenticated) {
    menuItems.push("Profile", "Logout");
  } else {
    menuItems.push("Login", "Register");
  }

  if (user?.role === "Admin") {
    menuItems.push("Admin");
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 250 }}>
        {/* User Info */}
        {isAuthenticated && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">
            Hi {user?.firstName || user?.email}
            </Typography>
          </Box>
        )}

        <List>
          {menuItems.map((text) => (
              <ListItem key={text} onClick={() => handleClick(text)} component={Link} to={`/${text.toLowerCase()}`}
              >
              <ListItemText primary={text}  />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}