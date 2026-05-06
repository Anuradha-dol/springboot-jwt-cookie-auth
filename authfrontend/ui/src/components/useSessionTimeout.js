import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function useSessionTimeout(timeoutMinutes = 25) {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = timeoutMinutes * 60 * 1000;

    const timer = setTimeout(async () => {
      try {
        await api.post("/auth/logout", {}, { withCredentials: true });
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        alert("Session expired. Please login again.");
        navigate("/login", { replace: true });
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, timeoutMinutes]);
}
