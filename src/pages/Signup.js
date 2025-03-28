import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { userPool } from "./CognitoConfig";

const SignupPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  boxShadow: "0 8px 24px rgba(43, 123, 140, 0.12)",
  borderRadius: "16px",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: 56,
  height: 56,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0 4px 10px rgba(43, 123, 140, 0.2)",
  "&:hover": {
    backgroundColor: "#236C7D",
    boxShadow: "0 6px 14px rgba(43, 123, 140, 0.3)",
    transform: "translateY(-2px)",
  },
}));



const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Email as username
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    const attributeList = [];
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: username } }); // Redirect to OTP page with email
      }, 1500);
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <SignupPaper>
        <StyledAvatar>
          <LockOutlinedIcon fontSize="large" />
        </StyledAvatar>

        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, color: "#2B7B8C" }}
        >
          Sign Up
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: "8px" }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSignup} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            autoFocus
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            sx={{ mb: 2 }}
          />

          <StyledButton type="submit" fullWidth variant="contained">
            Sign Up
          </StyledButton>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2B7B8C" }}>
            Log in
          </Link>
        </Typography>
      </SignupPaper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ borderRadius: "8px" }}
        >
          Successfully signed up! Please verify your email with OTP.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;