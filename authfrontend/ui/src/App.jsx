// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp";
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import useSessionTimeout from "./components/useSessionTimeout";
import LandingPage from"./components/first";


function AppRoutes() {
  useSessionTimeout(25); // ✅ now inside Router context

  return (
    <Routes>
       <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
