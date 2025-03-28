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
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./CognitoConfig";

const ForgotPasswordPaper = styled(Paper)(({ theme }) => ({
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password field
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code + passwords
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);

  // Send verification code to email
  const handleSendCode = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.forgotPassword({
      onSuccess: () => {
        setStep(2); // Move to code + passwords step
        setCognitoUser(user);
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

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/login"); // Redirect to login after reset
        }, 1500);
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
      <ForgotPasswordPaper>
        <StyledAvatar>
          <LockOutlinedIcon fontSize="large" />
        </StyledAvatar>

        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: 700, color: "#2B7B8C" }}
        >
          {step === 1 ? "Forgot Password" : "Reset Password"}
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
          onSubmit={step === 1 ? handleSendCode : handleResetPassword}
          sx={{ width: "100%" }}
        >
          {step === 1 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                autoFocus
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <StyledButton type="submit" fullWidth variant="contained">
                Send Verification Code
              </StyledButton>
            </>
          )}

          {step === 2 && (
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <StyledButton type="submit" fullWidth variant="contained">
                Reset Password
              </StyledButton>
            </>
          )}
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          <Link to="/login" style={{ color: "#2B7B8C" }}>
            Back to Sign In
          </Link>
        </Typography>
      </ForgotPasswordPaper>

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
          Password reset successfully! Redirecting to login...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword;