import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Alert, Typography, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ForgotPassword() {
  const { sendOTP, verifyOTP, resetPassword, error } = useAuth();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      step === 1 ? emailSchema : step === 2 ? otpSchema : passwordSchema
    ),
  });

  const onSubmit = async (data) => {
    setMessage("");

    try {
      if (step === 1) {
        await sendOTP(data.email);
        setEmail(data.email);
        setMessage("OTP sent to your email");
        setStep(2);
      } else if (step === 2) {
        await verifyOTP(email, data.otp);
        setMessage("OTP verified! Please reset your password.");
        setStep(3);
      } else if (step === 3) {
        await resetPassword(email, data.password);
        setMessage("Password reset successfully");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      // Error is handled by useAuth
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="auth-container">
          <Box className="auth-header text-center mb-4">
            <Typography className="auth-title" variant="h5">
              Forgot Password
            </Typography>
            <Typography className="auth-subtitle" variant="body2">
              {step === 1 && "Enter your email"}
              {step === 2 && `Enter the OTP sent to ${email}`}
              {step === 3 && "Create a new password"}
            </Typography>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {step === 1 && (
              <TextField
                label="Email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {step === 2 && (
              <TextField
                label="OTP"
                fullWidth
                {...register("otp")}
                error={!!errors.otp}
                helperText={errors.otp?.message}
              />
            )}

            {step === 3 && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  sx={{ marginTop: "1rem" }}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
                marginTop: "1.5rem",
              }}
            >
              {step === 1
                ? "Send OTP"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </Button>
          </form>

          <div className="mt-4 d-flex justify-content-center">
            <Link to="/login" className="auth-link link-hover-underline">
              <Typography variant="body2">Back to Login</Typography>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
