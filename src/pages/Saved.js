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
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "./CognitoConfig"; // Import from config file

const LoginPaper = styled(Paper)(({ theme }) => ({
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: Login, 1: Enter email, 2: Enter code + new password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cognitoUser, setCognitoUser] = useState(null); // Store Cognito user for password reset

  // Handle regular login
  const handleLogin = (e) => {
    e.preventDefault();

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
    });
  };

  // Initiate forgot password flow
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordStep(1); // Show email input for forgot password
    setError("");
  };

  // Send verification code to email
  const handleSendCode = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.forgotPassword({
      onSuccess: () => {
        setForgotPasswordStep(2); // Move to code + new password step
        setCognitoUser(user); // Store user for reset
        setError("");
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
    });
  };

  // Confirm new password with verification code
  const handleResetPassword = (e) => {
    e.preventDefault();

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setOpenSnackbar(true);
        setForgotPasswordStep(0); // Return to login form
        setUsername("");
        setPassword("");
        setVerificationCode("");
        setNewPassword("");
        setCognitoUser(null);
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err));
      },
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <LoginPaper>
        <StyledAvatar>
          <LockOutlinedIcon fontSize="large" />
        </StyledAvatar>

        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, color: "#2B7B8C" }}
        >
          {forgotPasswordStep === 0 ? "Sign In" : forgotPasswordStep === 1 ? "Forgot Password" : "Reset Password"}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: "8px" }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={
            forgotPasswordStep === 0
              ? handleLogin
              : forgotPasswordStep === 1
              ? handleSendCode
              : handleResetPassword
          }
          sx={{ width: "100%" }}
        >
          {forgotPasswordStep === 0 && (
            <>
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
              <StyledButton type="submit" fullWidth variant="contained">
                Sign In
              </StyledButton>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link
                  to="#"
                  onClick={handleForgotPassword}
                  style={{ color: "#2B7B8C" }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </>
          )}

          {forgotPasswordStep === 1 && (
            <>
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
              <StyledButton type="submit" fullWidth variant="contained">
                Send Verification Code
              </StyledButton>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link
                  to="#"
                  onClick={() => setForgotPasswordStep(0)}
                  style={{ color: "#2B7B8C" }}
                >
                  Back to Sign In
                </Link>
              </Typography>
            </>
          )}

          {forgotPasswordStep === 2 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Verification Code"
                variant="outlined"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <StyledButton type="submit" fullWidth variant="contained">
                Reset Password
              </StyledButton>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link
                  to="#"
                  onClick={() => setForgotPasswordStep(0)}
                  style={{ color: "#2B7B8C" }}
                >
                  Back to Sign In
                </Link>
              </Typography>
            </>
          )}
        </Box>

        {forgotPasswordStep === 0 && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#2B7B8C" }}>
              Sign up
            </Link>
          </Typography>
        )}
      </LoginPaper>

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
          {forgotPasswordStep === 2
            ? "Password reset successfully! Please sign in."
            : "Logged in successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;