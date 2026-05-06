// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard", { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
        // If JWT expired or not authorized, redirect to login
        if (err.response?.status === 401) navigate("/login");
        else setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (error) return (
    <div style={styles.container}>
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{error}</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div style={styles.container}>
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <div style={styles.userActions}>
          <button 
            style={styles.profileButton}
            onClick={() => navigate("/profile")}
          >
            <span style={styles.buttonIcon}>👤</span>
            Go to Profile
          </button>
        </div>
      </div>

      <div style={styles.welcomeCard}>
        <div style={styles.welcomeIcon}>🏠</div>
        <div>
          <h3 style={styles.welcomeTitle}>Welcome Back!</h3>
          <p style={styles.welcomeMessage}>{data.welcomeMessage}</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>🔔</div>
            <h3 style={styles.statTitle}>Notifications</h3>
          </div>
          <p style={styles.statValue}>{data.notifications}</p>
          <div style={styles.statFooter}>
            <span style={styles.statTrend}>Pending alerts</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>✅</div>
            <h3 style={styles.statTitle}>Tasks</h3>
          </div>
          <p style={styles.statValue}>{data.tasks}</p>
          <div style={styles.statFooter}>
            <span style={styles.statTrend}>Active items</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>📊</div>
            <h3 style={styles.statTitle}>Overview</h3>
          </div>
          <p style={styles.statValue}>All Systems</p>
          <div style={styles.statFooter}>
            <span style={styles.statTrend}>Operational</span>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>Last updated: Just now</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "24px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e1e5eb",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  userActions: {
    display: "flex",
    gap: "12px",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
  },
  buttonIcon: {
    fontSize: "16px",
  },
  welcomeCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    borderLeft: "4px solid #4f46e5",
  },
  welcomeIcon: {
    fontSize: "48px",
  },
  welcomeTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0 0 8px 0",
  },
  welcomeMessage: {
    fontSize: "16px",
    color: "#718096",
    margin: "0",
    lineHeight: "1.5",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    borderTop: "3px solid #4f46e5",
  },
  statCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  statIcon: {
    fontSize: "24px",
  },
  statTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#4a5568",
    margin: "0",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#2d3748",
    margin: "0 0 8px 0",
  },
  statFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTrend: {
    fontSize: "14px",
    color: "#718096",
    padding: "4px 12px",
    backgroundColor: "#f7fafc",
    borderRadius: "16px",
  },
  footer: {
    textAlign: "center",
    padding: "16px",
    color: "#a0aec0",
    fontSize: "14px",
  },
  footerText: {
    margin: "0",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e1e5eb",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#718096",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  errorText: {
    fontSize: "18px",
    color: "#e53e3e",
    maxWidth: "500px",
    lineHeight: "1.5",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);