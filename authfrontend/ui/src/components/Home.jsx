// src/components/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Badge,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fab,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Drawer,
  ListItemAvatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Notifications as NotificationsIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  Today as TodayIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Cloud as CloudIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import api from "../api";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

// Styled Components
const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: theme.shadows[2],
  animation: `${fadeIn} 0.6s ease-out`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-4px)",
  },
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
  color: "white",
  borderRadius: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "300px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    transform: "translate(30%, -30%)",
  },
}));

const StatCard = styled(Card)(({ theme, color = "primary" }) => ({
  borderRadius: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette[color].main}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  animation: `${pulse} 2s infinite`,
  background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
  color: "white",
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: "white",
    animation: `${pulse} 2s infinite`,
  },
}));

const TaskProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    background: value > 70 ? "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)" :
              value > 40 ? "linear-gradient(45deg, #FFC107 30%, #FF9800 90%)" :
              "linear-gradient(45deg, #F44336 30%, #E91E63 90%)",
  },
}));

export default function Home() {
  const navigate = useNavigate();
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  // Mock data for demonstration
  const mockData = {
    welcomeMessage: "Welcome back,! 👋",
    notifications: 7,
    tasks: 12,
    completedTasks: 8,
    upcomingEvents: 3,
    teamMembers: 5,
    revenue: "$24,580",
    storageUsed: 75,
    recentActivities: [
      { id: 1, type: "task", title: "Project Review", time: "10:30 AM", status: "completed" },
      { id: 2, type: "meeting", title: "Team Standup", time: "11:00 AM", status: "pending" },
      { id: 3, type: "upload", title: "Document Uploaded", time: "Yesterday", status: "completed" },
      { id: 4, type: "message", title: "New Message", time: "2 days ago", status: "pending" },
    ],
    quickStats: [
      { label: "Projects", value: 18, change: "+12%", icon: <BarChartIcon />, color: "primary" },
      { label: "Tasks", value: 124, change: "+8%", icon: <TaskIcon />, color: "secondary" },
      { label: "Team", value: 24, change: "+5%", icon: <GroupIcon />, color: "info" },
      { label: "Revenue", value: "$45.2K", change: "+23%", icon: <AttachMoneyIcon />, color: "success" },
    ],
    upcomingTasks: [
      { id: 1, title: "Design Review Meeting", priority: "high", due: "Today" },
      { id: 2, title: "Monthly Report", priority: "medium", due: "Tomorrow" },
      { id: 3, title: "Client Presentation", priority: "low", due: "Dec 15" },
    ],
  };

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/me", { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load dashboard");
          // Use mock data for demo purposes
          setData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    if (!mobileOpen && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setMobileOpen(!mobileOpen);
  };

  const resolveMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${backendBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const taskProgress = data ? Math.round((data.completedTasks / data.tasks) * 100) : 0;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <DashboardIcon sx={{ fontSize: 60, color: "primary.main", animation: `${float} 2s ease-in-out infinite` }} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading your dashboard...
          </Typography>
          <LinearProgress sx={{ mt: 2, width: 200, mx: "auto" }} />
        </Box>
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <WarningIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")} sx={{ mt: 2 }}>
          Back to Login
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #1976d2 0%, #21CBF3 100%)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <DashboardIcon sx={{ mr: 2, animation: `${float} 3s ease-in-out infinite` }} />
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Search">
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationsOpen}>
                <NotificationBadge badgeContent={data?.notifications || 0} color="error">
                  <NotificationsIcon />
                </NotificationBadge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleNotificationsClose}
            >
              <MenuItem>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="You have 7 new notifications" />
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemText primary="View all notifications" />
              </MenuItem>
            </Menu>

            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  slotProps={{
                    img: {
                      crossOrigin: "use-credentials",
                    },
                  }}
                  src={data?.profilePhotoUrl ? resolveMediaUrl(data.profilePhotoUrl) : undefined}
                  sx={{ width: 40, height: 40, border: "2px solid white" }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Navigation
          </Typography>
          <List>
            {["Dashboard", "Projects", "Tasks", "Calendar", "Team", "Reports"].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <WelcomeCard sx={{ mb: 4 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    {data?.welcomeMessage || "Welcome back!"}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                    Here's what's happening with your projects today. You have{" "}
                    {data?.notifications || 0} new notifications and{" "}
                    {data?.tasks || 0} tasks to complete.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<TodayIcon />}
                      label={`${data?.upcomingEvents || 0} Upcoming Events`}
                      sx={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                    />
                    <Chip
                      icon={<GroupIcon />}
                      label={`${data?.teamMembers || 0} Team Members`}
                      sx={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      animation: `${float} 3s ease-in-out infinite`,
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 60, color: "white" }} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </WelcomeCard>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {data?.quickStats?.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <StatCard color={stat.color}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: (theme) => theme.palette[stat.color].light,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: (theme) => theme.palette[stat.color].main,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Chip
                        label={stat.change}
                        size="small"
                        color={stat.change.includes("+") ? "success" : "error"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </StatCard>
              </Grid>
            ))}
          </Grid>

          {/* Main Content Grid */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {/* Tasks Overview */}
              <DashboardPaper sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Tasks Overview
                  </Typography>
                  <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate("/tasks")}>
                    View All
                  </Button>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {taskProgress}%
                    </Typography>
                  </Box>
                  <TaskProgress variant="determinate" value={taskProgress} />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "success.light", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold" color="success.dark">
                        {data?.completedTasks || 0}
                      </Typography>
                      <Typography variant="body2" color="success.dark">
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "warning.light", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold" color="warning.dark">
                        {data?.tasks ? data.tasks - data.completedTasks : 0}
                      </Typography>
                      <Typography variant="body2" color="warning.dark">
                        Pending
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "info.light", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight="bold" color="info.dark">
                        {data?.upcomingTasks?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="info.dark">
                        Upcoming
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DashboardPaper>

              {/* Recent Activity */}
              <DashboardPaper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {data?.recentActivities?.map((activity, index) => (
                    <div key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: activity.status === "completed" ? "success.main" : "warning.main" }}>
                            {activity.type === "task" && <AssignmentIcon />}
                            {activity.type === "meeting" && <CalendarIcon />}
                            {activity.type === "upload" && <CloudIcon />}
                            {activity.type === "message" && <EmailIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" color="text.secondary">
                                {activity.time}
                              </Typography>
                              <Chip
                                label={activity.status}
                                size="small"
                                color={activity.status === "completed" ? "success" : "warning"}
                              />
                            </Box>
                          }
                        />
                        <IconButton edge="end">
                          <MoreVertIcon />
                        </IconButton>
                      </ListItem>
                      {index < data.recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </div>
                  ))}
                </List>
              </DashboardPaper>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              {/* Upcoming Tasks */}
              <DashboardPaper sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upcoming Tasks
                </Typography>
                <List>
                  {data?.upcomingTasks?.map((task) => (
                    <ListItem key={task.id} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <TaskIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                            <Chip
                              label={task.priority}
                              size="small"
                              color={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "info"}
                            />
                            <Typography variant="caption" color="text.secondary">
                              <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: "text-bottom", mr: 0.5 }} />
                              {task.due}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Button fullWidth variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Add New Task
                </Button>
              </DashboardPaper>

              {/* Storage Usage */}
              <DashboardPaper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Storage Usage
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {data?.storageUsed || 75}% used
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      250 GB / 1 TB
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={data?.storageUsed || 75} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                <Button fullWidth variant="contained" startIcon={<CloudIcon />}>
                  Upgrade Storage
                </Button>
              </DashboardPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => navigate("/tasks/new")}>
        <AddIcon />
      </FloatingActionButton>
    </Box>
  );
}
