// src/components/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Fade,
  Zoom,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Login as LoginIcon,
  Google,
  Facebook,
  GitHub,
  ArrowForward,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import api from "../api";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// Styled Components
const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[10],
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "linear-gradient(90deg, #1976d2 0%, #9c27b0 50%, #2196f3 100%)",
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .2)",
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0 30%, #1EAEDB 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px 2px rgba(33, 203, 243, .3)",
  },
  transition: "all 0.3s ease",
}));

const SocialButton = styled(Button)(({ theme, provider }) => ({
  padding: theme.spacing(1.2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  textTransform: "none",
  fontWeight: 500,
  backgroundColor: "white",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-1px)",
  },
  transition: "all 0.2s ease",
  ...(provider === "google" && {
    borderColor: "#DB4437",
    "&:hover": {
      backgroundColor: "rgba(219, 68, 55, 0.04)",
    },
  }),
  ...(provider === "facebook" && {
    borderColor: "#4267B2",
    "&:hover": {
      backgroundColor: "rgba(66, 103, 178, 0.04)",
    },
  }),
  ...(provider === "github" && {
    borderColor: "#333",
    "&:hover": {
      backgroundColor: "rgba(51, 51, 51, 0.04)",
    },
  }),
}));

const WelcomeIllustration = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(5),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.05)",
  },
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
}));

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: "", 
    password: "",
    rememberMe: false 
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // Clear any existing messages
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const normalizedEmail = form.email.trim().toLowerCase();
      const payload = {
        email: normalizedEmail,
        password: form.password,
      };

      const res = await api.post("/auth/login", payload, {
        withCredentials: true 
      });

      if (res.data.success) {
        // Save remember me preference
        if (form.rememberMe) {
          localStorage.setItem("rememberedEmail", normalizedEmail);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        // Role-based redirect with delay for better UX
        setTimeout(() => {
          const role = res.data.role; // ROLE_USER, ROLE_ADMIN, ROLE_MANAGER
          if (role === "ROLE_ADMIN") {
            navigate("/dashboard");
          } else if (role === "ROLE_MANAGER") {
            navigate("/manager/dashboard");
          } else {
            navigate("/home");
          }
        }, 1500);

      } else {
        setMessage({
          type: "error",
          text: res.data.message || "Login failed. Please try again.",
        });
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      const responseData = err.response?.data;
      const errorMessage = (typeof responseData === "string"
        ? responseData
        : responseData?.message ||
          responseData?.error ||
          responseData?.detail ||
          responseData?.title) || "Unable to connect to server. Please try again.";
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    setMessage({
      type: "info",
      text: `Redirecting to ${provider} login...`,
    });
    // Implement actual social login redirect here
    // window.location.href = `/auth/${provider}`;
  };

  // Pre-fill remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Grid container spacing={4}>
            {/* Left Side - Welcome/Illustration */}
            <Grid size={{ xs: 12, md: 5 }}>
              <WelcomeIllustration>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <FloatingIcon>
                    <LoginIcon sx={{ fontSize: "inherit" }} />
                  </FloatingIcon>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                    Sign in to access your personalized dashboard, manage your account, 
                    and explore all the features we have for you.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Don't have an account yet?
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        background: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      Create New Account
                    </Button>
                  </Box>
                </Box>
              </WelcomeIllustration>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <LoginPaper>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  <Typography
                    component="h1"
                    variant="h4"
                    gutterBottom
                    color="primary.main"
                    fontWeight="bold"
                  >
                    Sign In to Your Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to continue
                  </Typography>
                </Box>

                {/* Message Alert */}
                {message.text && (
                  <Fade in={true}>
                    <Alert
                      severity={message.type}
                      sx={{ mb: 3 }}
                      onClose={() => setMessage({ type: "", text: "" })}
                      variant="filled"
                    >
                      {message.text}
                    </Alert>
                  </Fade>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="you@example.com"
                        disabled={loading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                                disabled={loading}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Enter your password"
                        disabled={loading}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center" 
                      }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={form.rememberMe}
                              onChange={handleChange}
                              name="rememberMe"
                              color="primary"
                              disabled={loading}
                            />
                          }
                          label="Remember me"
                        />
                        <Link
                          component={RouterLink}
                          to="/forgot-password"
                          color="primary"
                          underline="hover"
                          sx={{ fontWeight: 500 }}
                        >
                          Forgot password?
                        </Link>
                      </Box>
                    </Grid>

                    <Grid size={12}>
                      <LoginButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Person />
                          )
                        }
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </LoginButton>
                    </Grid>
                  </Grid>
                </form>

                {/* Divider */}
                <Box sx={{ my: 4, position: "relative" }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      Or continue with
                    </Typography>
                  </Divider>
                </Box>

                {/* Social Login Options */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SocialButton
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={() => handleSocialLogin("google")}
                      disabled={loading}
                      provider="google"
                    >
                      Google
                    </SocialButton>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SocialButton
                      fullWidth
                      variant="outlined"
                      startIcon={<Facebook />}
                      onClick={() => handleSocialLogin("facebook")}
                      disabled={loading}
                      provider="facebook"
                    >
                      Facebook
                    </SocialButton>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SocialButton
                      fullWidth
                      variant="outlined"
                      startIcon={<GitHub />}
                      onClick={() => handleSocialLogin("github")}
                      disabled={loading}
                      provider="github"
                    >
                      GitHub
                    </SocialButton>
                  </Grid>
                </Grid>

                {/* Sign Up Link */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    New to our platform?{" "}
                    <Link
                      component={RouterLink}
                      to="/signup"
                      color="primary"
                      underline="hover"
                      fontWeight="bold"
                    >
                      Create an account
                    </Link>
                  </Typography>
                </Box>

                {/* Demo Credentials (Remove in production) */}
                <Box sx={{ 
                  mt: 4, 
                  p: 2, 
                  bgcolor: "action.hover", 
                  borderRadius: 2 
                }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Demo Credentials:</strong> user@example.com / password123
                  </Typography>
                </Box>
              </LoginPaper>
            </Grid>
          </Grid>
        </Zoom>

        {/* Footer */}
        <Box sx={{ 
          position: "fixed", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          py: 2, 
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider"
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}>
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Link 
                  href="/privacy" 
                  variant="caption" 
                  color="text.secondary" 
                  underline="hover"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  variant="caption" 
                  color="text.secondary" 
                  underline="hover"
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/contact" 
                  variant="caption" 
                  color="text.secondary" 
                  underline="hover"
                >
                  Contact Support
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Container>
  );
}
