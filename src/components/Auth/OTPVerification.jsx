import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Typography, Box } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function OTPVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { verifyOTP, error } = useAuth();

  const email = sessionStorage.getItem("otp_email");

  useEffect(() => {
    if (!email) {
      navigate("/register", {
        state: { error: "Session expired. Please sign up again." },
      });
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    setMessage("");
    setVerifying(true);
    const otpString = otp.join("");

    try {
      const isValid = await verifyOTP(email, otpString);
      if (isValid) {
        setMessage("OTP verified successfully!");
        sessionStorage.removeItem("otp_email");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch {
      // Error is already handled by AuthContext
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <Box
          className="auth-container"
          sx={{ padding: "1rem", maxWidth: "400px", margin: "0 auto" }}
        >
          <div className="auth-header text-center mb-3">
            <Typography className="auth-title mb-2" variant="h5">
              OTP Verification
            </Typography>
            <Typography className="auth-subtitle" variant="body2">
              Enter the OTP sent to{" "}
              {email ? `your email (${email})` : "your email"}.
            </Typography>
          </div>

          {message && (
            <Alert
              severity="success"
              className="mb-2"
              sx={{ padding: "0.5rem" }}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" className="mb-2" sx={{ padding: "0.5rem" }}>
              {error}
            </Alert>
          )}

          <div className="otp-input-wrapper">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="otp-box"
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="primary-button mt-4"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={handleVerify}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </Box>
      </main>
    </div>
  );
}
