import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../api";

// Styled Components for decoration only
const SettingsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const DangerCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `2px solid ${theme.palette.error.main}`,
  background: "rgba(244, 67, 54, 0.05)",
  marginBottom: theme.spacing(3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontWeight: 600,
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    background: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

// Original component logic remains 100% unchanged
export default function Settings() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nameForm, setNameForm] = useState({ name: "", lastName: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "", otp: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deleteForm, setDeleteForm] = useState({ currentPassword: "" });
  const [deleteOtpForm, setDeleteOtpForm] = useState({ otp: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });

  // Helper for API responses - ORIGINAL CODE
  const handleResponse = (res, redirectLogin = false) => {
    setMessage(res.data?.message || "Success");
    setError("");
    if (redirectLogin) {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const handleError = (err) => {
    console.error(err.response?.data || err);
    setError(err.response?.data?.message || "Something went wrong");
    setMessage("");
  };

  // ===== Update Name ===== - ORIGINAL CODE
  const updateName = async () => {
    try {
      const res = await api.put("/user/update-name", nameForm, { withCredentials: true });
      handleResponse(res);
    } catch (err) {
      handleError(err);
    }
  };

  // ===== Update Email ===== - ORIGINAL CODE
  const requestEmailUpdate = async () => {
    try {
      const res = await api.put("/user/update-email", { newEmail: emailForm.newEmail }, { withCredentials: true });
      handleResponse(res);
    } catch (err) {
      handleError(err);
    }
  };

  const verifyNewEmail = async () => {
    try {
      const res = await api.post("/user/verify-new-email", null, {
        params: { otp: emailForm.otp },
        withCredentials: true
      });
      handleResponse(res, true);
    } catch (err) {
      handleError(err);
    }
  };

  // ===== Update Password ===== - ORIGINAL CODE
  const updatePassword = async () => {
    try {
      const res = await api.put("/user/update-password", passwordForm, { withCredentials: true });
      handleResponse(res, true);
    } catch (err) {
      handleError(err);
    }
  };

  // ===== Delete Account ===== - ORIGINAL CODE
  const deleteAccount = async () => {
    try {
      const res = await api.delete("/user/delete", {
        data: deleteForm,
        withCredentials: true
      });
      handleResponse(res, true);
    } catch (err) {
      handleError(err);
    }
  };

  const requestDeleteOtp = async () => {
    try {
      const res = await api.post("/user/delete-forgot-request", {}, { withCredentials: true });
      handleResponse(res);
    } catch (err) {
      handleError(err);
    }
  };

  const verifyDeleteOtp = async () => {
    try {
      const res = await api.post("/user/delete-forgot-verify", deleteOtpForm, { withCredentials: true });
      handleResponse(res, true);
    } catch (err) {
      handleError(err);
    }
  };

  // Helper functions for decoration only - doesn't affect logic
  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Account Settings
        </Typography>
      </Box>

      {/* Messages - Decoration Only */}
      {message && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <SettingsPaper>
        {/* Update Name Section */}
        <SectionCard>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Update Name
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StyledInput
                  fullWidth
                  label="First Name"
                  value={nameForm.name}
                  onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })}
                  placeholder="Enter your first name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StyledInput
                  fullWidth
                  label="Last Name"
                  value={nameForm.lastName}
                  onChange={(e) => setNameForm({ ...nameForm, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 2, pt: 0 }}>
            <ActionButton
              variant="contained"
              onClick={updateName}
              sx={{ minWidth: 120 }}
            >
              Update Name
            </ActionButton>
          </CardActions>
        </SectionCard>

        {/* Update Email Section */}
        <SectionCard>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Update Email
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <StyledInput
              fullWidth
              label="New Email Address"
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
              placeholder="Enter new email address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <ActionButton
              variant="contained"
              onClick={requestEmailUpdate}
              sx={{ mb: 3 }}
            >
              Request Email Change
            </ActionButton>

            <StyledInput
              fullWidth
              label="Verification OTP"
              value={emailForm.otp}
              onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })}
              placeholder="Enter 6-digit OTP"
              sx={{ mt: 2 }}
            />
            <ActionButton
              variant="outlined"
              onClick={verifyNewEmail}
              sx={{ mb: 1 }}
            >
              Verify New Email
            </ActionButton>
          </CardContent>
        </SectionCard>

        {/* Update Password Section */}
        <SectionCard>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Update Password
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <StyledInput
              fullWidth
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("current")}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledInput
              fullWidth
              label="New Password"
              type={showPassword.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("new")}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledInput
              fullWidth
              label="Confirm New Password"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirm")}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
          <CardActions sx={{ p: 2, pt: 0, flexDirection: "column", alignItems: "flex-start" }}>
            <ActionButton
              variant="contained"
              onClick={updatePassword}
              sx={{ mb: 2 }}
            >
              Update Password
            </ActionButton>
            <Typography variant="body2" color="text.secondary">
              Forgot password?{" "}
              <Link href="/forgot-password" underline="hover" color="primary">
                Reset here
              </Link>
            </Typography>
          </CardActions>
        </SectionCard>

        {/* Delete Account Section */}
        <DangerCard>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DeleteIcon color="error" />
                <Typography variant="h6" fontWeight="bold" color="error">
                  Delete Account
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>

            <StyledInput
              fullWidth
              label="Current Password"
              type={showPassword.delete ? "text" : "password"}
              value={deleteForm.currentPassword}
              onChange={(e) => setDeleteForm({ currentPassword: e.target.value })}
              placeholder="Enter your password to confirm"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("delete")}
                      edge="end"
                    >
                      {showPassword.delete ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <ActionButton
              variant="contained"
              color="error"
              onClick={deleteAccount}
              sx={{ mb: 3 }}
              startIcon={<DeleteIcon />}
            >
              Delete Account
            </ActionButton>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Alternative Method
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <ActionButton
                variant="outlined"
                onClick={requestDeleteOtp}
                sx={{ flex: 1 }}
              >
                Request OTP to Delete
              </ActionButton>
            </Box>

            <StyledInput
              fullWidth
              label="Verification OTP"
              value={deleteOtpForm.otp}
              onChange={(e) => setDeleteOtpForm({ otp: e.target.value })}
              placeholder="Enter OTP sent to your email"
            />

            <ActionButton
              variant="contained"
              color="error"
              onClick={verifyDeleteOtp}
              startIcon={<DeleteIcon />}
            >
              Verify & Delete Account
            </ActionButton>
          </CardContent>
        </DangerCard>
      </SettingsPaper>
    </Container>
  );
}