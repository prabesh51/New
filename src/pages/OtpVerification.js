import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP verified successfully!");
      } else {
        setMessage(data.error || "Invalid OTP");
      }
    } catch (err) {
      setMessage("Server error while verifying OTP.");
    }

    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Verify OTP
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }} align="center">
          Enter the 6-digit OTP sent to your email.
        </Typography>

        <form onSubmit={handleVerify}>
          <TextField
            label="OTP"
            fullWidth
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained">
            Verify
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

export default OtpVerification;
