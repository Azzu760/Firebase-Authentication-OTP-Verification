import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
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

export default function Register() {
  const { signup, googleLogin, checkEmailRegistered, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await checkEmailRegistered(data.email);
      await signup(data.email, data.password, data.name);
      navigate("/verify-otp");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogleSignup() {
    setLoading(true);
    try {
      await googleLogin();
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <Box className="auth-container">
          <Box className="auth-header text-center mb-4">
            <Typography className="auth-title" variant="h5">
              Create Account
            </Typography>
            <Typography className="auth-subtitle" variant="body2">
              Join us by creating your account
            </Typography>
          </Box>

          {/* Display auth error if it exists */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-input">
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser className="input-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="form-input">
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
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
            </div>
            <div className="form-input">
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="form-input">
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock className="input-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="primary-button custom-button"
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            <Divider className="divider-text">OR</Divider>
            <Button
              fullWidth
              variant="outlined"
              className="outlined-button"
              startIcon={<FaGoogle />}
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign up with Google"}
            </Button>

            <div className="d-flex justify-content-center mt-4">
              <Link to="/login" className="auth-link link-hover-underline">
                <Typography variant="body2">
                  Already have an account? Login
                </Typography>
              </Link>
            </div>
          </form>
        </Box>
      </main>
    </div>
  );
}
