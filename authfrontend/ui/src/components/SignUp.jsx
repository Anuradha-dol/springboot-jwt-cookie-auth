// src/components/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
  AlternateEmail,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../api";

// Styled components for better customization
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
}));

const steps = ["Personal Information", "Contact Details", "Account Security"];

export default function Signup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    tempEmail: "",
    role: "ROLE_USER",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "First name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "First name must be at least 2 characters";
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const phoneRegex = /^[0][0-9]{9,10}$|^[\+]?[1-9][\d]{0,15}$/;

    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(form.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (form.tempEmail && !emailRegex.test(form.tempEmail)) {
      newErrors.tempEmail = "Please enter a valid temporary email";
    }
    
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }
    
    return newErrors;
  };

  // Handle next step
  const handleNext = () => {
    let validationErrors = {};
    
    switch (activeStep) {
      case 0:
        validationErrors = validateStep1();
        break;
      case 1:
        validationErrors = validateStep2();
        break;
      case 2:
        validationErrors = validateStep3();
        break;
      default:
        break;
    }
    
    if (Object.keys(validationErrors).length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      if (res.data.success) {
        setMessage({
          type: "success",
          text: res.data.message,
        });
        setTimeout(() => {
          navigate("/verify");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: res.data.message,
        });
      }
    } catch (err) {
      console.error("Backend error:", err.response?.data);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Get step content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StyledTextField
                fullWidth
                label="First Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your first name"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StyledTextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your last name"
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <StyledTextField
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
                placeholder="your.email@example.com"
              />
            </Grid>
            <Grid size={12}>
              <StyledTextField
                fullWidth
                label="Temporary Email (Optional)"
                name="tempEmail"
                type="email"
                value={form.tempEmail}
                onChange={handleChange}
                error={!!errors.tempEmail}
                helperText={errors.tempEmail || "Use this if you need a temporary contact email"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="temp.email@example.com"
              />
            </Grid>
            <Grid size={12}>
              <StyledTextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="0777-123-4567"
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Minimum 8 characters with uppercase, lowercase, and numbers"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Create a strong password"
              />
            </Grid>
            <Grid size={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" underline="hover">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" underline="hover">Privacy Policy</Link>
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );
      
      default:
        return "Unknown step";
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            color="primary.main"
            fontWeight="bold"
          >
            Create Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our platform in just 3 simple steps
          </Typography>
        </Box>

        <StyledPaper elevation={3}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Message Alert */}
          {message.text && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 3 }}
              onClose={() => setMessage({ type: "", text: "" })}
            >
              {message.text}
            </Alert>
          )}

          {/* Form Content */}
          <form onSubmit={activeStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                {steps[activeStep]}
              </Typography>
              {getStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ textTransform: "none", px: 4 }}
              >
                Back
              </Button>
              
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {activeStep === steps.length - 1 ? (
                  <SubmitButton
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Account"
                    )}
                  </SubmitButton>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ textTransform: "none", px: 4 }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>

          {/* Login Link */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{" "}
              <Link href="/login" underline="hover" fontWeight="medium">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </StyledPaper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
