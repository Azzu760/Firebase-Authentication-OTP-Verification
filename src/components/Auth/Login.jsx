import { useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import {
  FaGoogle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const { login, googleLogin, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      setLoading(false);
      navigate("/dashboard");
    } catch {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <Box className="auth-container">
          <Box className="auth-header text-center mb-4">
            <Typography className="auth-title" variant="h5">
              Welcome Back
            </Typography>
            <Typography className="auth-subtitle" variant="body2">
              Please login to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                        className="icon-button"
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
            >
              Login
            </Button>

            <Divider className="divider-text">OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              className="outlined-button"
              startIcon={<FaGoogle />}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign up with Google"}
            </Button>

            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/forgot-password"
                className="auth-link link-hover-underline"
              >
                <Typography variant="body2">Forgot password?</Typography>
              </Link>
              <Link to="/register" className="auth-link link-hover-underline">
                <Typography variant="body2">Create account</Typography>
              </Link>
            </div>
          </form>
        </Box>
      </main>
    </div>
  );
}
