import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

/* ===================== SAFE MESSAGE NORMALIZER ===================== */
const normalizeMessage = (data) => {
  if (!data) return "Something went wrong";

  if (typeof data === "string") return data;

  if (typeof data === "object") {
    return data.message || data.error || JSON.stringify(data);
  }

  return String(data);
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    tempEmail: "",
    phoneNumber: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* ===================== HELPERS ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const validateStep1 = () => {
    let count = 0;
    if (form.email.trim()) count++;
    if (form.tempEmail.trim()) count++;
    if (form.phoneNumber.trim()) count++;
    return count >= 2;
  };

  /* ===================== SEND OTP ===================== */
  const handleSendOtp = async () => {
    if (!validateStep1()) {
      showMessage("error", "Provide at least TWO recovery details");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/forgotpass/send-otp",
        {
          email: form.email || null,
          tempEmail: form.tempEmail || null,
          phoneNumber: form.phoneNumber || null,
        },
        { withCredentials: true }
      );

      showMessage("success", normalizeMessage(res.data));
      setStep(2);

    } catch (err) {
      showMessage("error", normalizeMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  /* ===================== VERIFY OTP ===================== */
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      showMessage("error", "OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/forgotpass/verify-otp",
        { otp },
        { withCredentials: true }
      );

      showMessage("success", normalizeMessage(res.data));
      setStep(3);

    } catch (err) {
      showMessage("error", normalizeMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  /* ===================== CHANGE PASSWORD ===================== */
  const handleChangePassword = async (password, repeatPassword) => {
    if (password !== repeatPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/forgotpass/change-password",
        { password, repeatPassword },
        { withCredentials: true }
      );

      showMessage("success", normalizeMessage(res.data));

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      showMessage("error", normalizeMessage(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" mb={2}>
        Forgot Password
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Temporary Email"
            name="tempEmail"
            value={form.tempEmail}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Send OTP
          </Button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Verify OTP
          </Button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <ChangePasswordForm
          onSubmit={handleChangePassword}
          loading={loading}
        />
      )}
    </Box>
  );
}

/* ===================== CHANGE PASSWORD FORM ===================== */
function ChangePasswordForm({ onSubmit, loading }) {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <>
      <TextField
        fullWidth
        margin="normal"
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Repeat Password"
        type="password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={() => onSubmit(password, repeatPassword)}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        Change Password
      </Button>
    </>
  );
}
