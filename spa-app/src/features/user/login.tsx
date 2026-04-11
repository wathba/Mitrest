import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../slices/account-slice";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const dispatch = useDispatch<any>();
  const { loading, error } = useSelector((state: any) => state.account);
    const { isAuthenticated } = useSelector((state: any) => state.account);
    
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

 const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

 const handleSubmit = async () => {
  if (isLogin) {
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      console.log("✅ Login success");
    } else {
      console.log("❌ Login failed");
    }
  } else {
    await dispatch(registerUser({ email, password, firstName, lastName }));
    setIsLogin(true);
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        mt: 5,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          {isLogin ? "Login" : "Register"}
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
              />
        {!isLogin && (
          <>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />                              
          </>
        )}

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </Paper>
    </Box>
  );
}
