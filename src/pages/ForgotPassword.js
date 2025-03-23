// ForgotPassword.js
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }

    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter your email to receive a reset link.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Send Reset Link
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword;
