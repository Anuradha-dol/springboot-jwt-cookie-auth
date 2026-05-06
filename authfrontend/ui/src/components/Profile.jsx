// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Avatar,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Fab,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedUserIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  CameraAlt as CameraAltIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
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
    transform: translateY(-5px);
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
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: theme.shadows[2],
  animation: `${fadeIn} 0.6s ease-out`,
}));

const ProfileHeader = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
  color: "white",
  borderRadius: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    transform: "translate(30%, -30%)",
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "fit-content",
  margin: "0 auto",
}));

const EditAvatarButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  animation: `${pulse} 2s infinite`,
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  minHeight: 48,
}));

const StatBadge = styled(Box)(({ theme, color = "primary" }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(4),
  backgroundColor: theme.palette[color].light,
  color: theme.palette[color].dark,
  fontWeight: 600,
  fontSize: "0.875rem",
}));

export default function Profile() {
  const navigate = useNavigate();
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Mock data for demonstration
  const mockProfile = {
    id: "USR-001",
    name: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phoneNumber: "0777911402",
    role: "Senior Developer",
    profilePhotoUrl: null,
    coverPhotoUrl: null,
    bio: "Passionate full-stack developer with 5+ years of experience in building scalable web applications.",
    location: "San Francisco, CA",
    company: "TechCorp Inc.",
    website: "https://alexjohnson.dev",
    joinDate: "2022-03-15",
    lastActive: "2023-10-26 14:30",
    verified: true,
    notifications: 7,
    tasksCompleted: 124,
    projects: 18,
    teamMembers: 24,
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB"],
    recentActivities: [
      { id: 1, action: "Completed project review", time: "2 hours ago" },
      { id: 2, action: "Updated profile settings", time: "1 day ago" },
      { id: 3, action: "Added new team member", time: "3 days ago" },
    ],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/me", { withCredentials: true });
        setProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
        setError(err.response?.data?.message || "Failed to fetch profile");
        // Use mock data for demo purposes
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setEditMode(true);
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Call API to update profile
      const res = await api.put("/user/me", editedProfile, { withCredentials: true });
      setProfile(res.data);
      setEditMode(false);
      setEditDialogOpen(false);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setEditMode(false);
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const resolveMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${backendBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const handleAvatarUpload = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setAvatarDialogOpen(true);
  };

  const handleProfilePhotoUpload = async () => {
    if (!selectedProfilePhoto) {
      setError("Please select a profile image first");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");
      const formData = new FormData();
      formData.append("file", selectedProfilePhoto);
      const res = await api.post("/user/me/profile-photo", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setEditedProfile(res.data);
      setAvatarDialogOpen(false);
      setSelectedProfilePhoto(null);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCoverPhotoUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/user/me/cover-photo", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setEditedProfile(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to upload cover photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <PersonIcon sx={{ fontSize: 60, color: "primary.main", animation: `${float} 2s ease-in-out infinite` }} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading your profile...
          </Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/home")}
          sx={{ textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={uploadingPhoto}
            sx={{ textTransform: "none" }}
          >
            Upload Cover
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                handleCoverPhotoUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/settings")}
            sx={{ textTransform: "none" }}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
            sx={{ textTransform: "none" }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Profile Header */}
      <ProfileHeader
        sx={
          profile?.coverPhotoUrl
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(25, 118, 210, 0.82) 0%, rgba(33, 203, 243, 0.72) 100%), url(${resolveMediaUrl(profile.coverPhotoUrl)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <AvatarContainer>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid white",
                    fontSize: "2.5rem",
                    bgcolor: "primary.dark",
                  }}
                  slotProps={{
                    img: {
                      crossOrigin: "use-credentials",
                    },
                  }}
                  src={profile?.profilePhotoUrl ? resolveMediaUrl(profile.profilePhotoUrl) : undefined}
                >
                  {getInitials(profile?.name, profile?.lastName)}
                </Avatar>
                <EditAvatarButton onClick={handleAvatarUpload}>
                  <CameraAltIcon />
                </EditAvatarButton>
              </AvatarContainer>
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  {profile?.name} {profile?.lastName}
                </Typography>
                {profile?.verified && (
                  <Tooltip title="Verified Account">
                    <VerifiedUserIcon sx={{ color: "#4CAF50" }} />
                  </Tooltip>
                )}
                <Chip
                  label={profile?.role}
                  color="primary"
                  sx={{ color: "white", fontWeight: "bold" }}
                />
              </Box>

              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                {profile?.bio || "No bio available"}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <StatBadge>
                  <BadgeIcon sx={{ mr: 1, fontSize: 16 }} />
                  {profile?.id}
                </StatBadge>
                <StatBadge color="secondary">
                  <WorkIcon sx={{ mr: 1, fontSize: 16 }} />
                  {profile?.company || "Not specified"}
                </StatBadge>
                <StatBadge color="info">
                  <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
                  {profile?.location || "Location not set"}
                </StatBadge>
                <StatBadge color="success">
                  <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                  Joined {new Date(profile?.joinDate || Date.now()).toLocaleDateString()}
                </StatBadge>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileHeader>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Personal Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ProfilePaper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              <StyledTab icon={<PersonIcon />} label="Personal Info" />
              <StyledTab icon={<DescriptionIcon />} label="Activity" />
              <StyledTab icon={<SecurityIcon />} label="Security" />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoCard>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <EmailIcon color="action" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email Address
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {profile?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoCard>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <PhoneIcon color="action" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone Number
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {profile?.phoneNumber || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoCard>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <WorkIcon color="action" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Role
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {profile?.role}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoCard>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <PublicIcon color="action" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Website
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {profile?.website || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  </Grid>
                </Grid>

                {/* Skills Section */}
                {profile?.skills && profile.skills.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Skills & Expertise
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {profile.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Activity
                </Typography>
                <List>
                  {profile?.recentActivities?.map((activity) => (
                    <ListItem key={activity.id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Security Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LockIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password"
                      secondary="Last changed 30 days ago"
                    />
                    <Button variant="outlined" size="small">
                      Change
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security"
                    />
                    <Button variant="outlined" size="small">
                      Enable
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Active Sessions"
                      secondary="Manage your logged-in devices"
                    />
                    <Button variant="outlined" size="small">
                      View All
                    </Button>
                  </ListItem>
                </List>
              </Box>
            )}
          </ProfilePaper>
        </Grid>

        {/* Right Column - Stats & Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardHeader
              title="Profile Statistics"
              titleTypographyProps={{ fontWeight: "bold" }}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Badge sx={{ bgcolor: "primary.main", color: "white", borderRadius: 1 }}>
                      {profile?.tasksCompleted || 0}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Tasks Completed" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Badge sx={{ bgcolor: "secondary.main", color: "white", borderRadius: 1 }}>
                      {profile?.projects || 0}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Active Projects" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Badge sx={{ bgcolor: "success.main", color: "white", borderRadius: 1 }}>
                      {profile?.teamMembers || 0}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Team Members" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader
              title="Quick Actions"
              titleTypographyProps={{ fontWeight: "bold" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleAvatarUpload}
                  >
                    Upload Photo
                  </Button>
                </Grid>
                <Grid size={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<NotificationsIcon />}
                    onClick={() => navigate("/notifications")}
                  >
                    Notification Settings
                  </Button>
                </Grid>
                <Grid size={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Edit Profile
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                name="name"
                value={editedProfile?.name || ""}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editedProfile?.lastName || ""}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editedProfile?.email || ""}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={editedProfile?.phoneNumber || ""}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={editedProfile?.bio || ""}
                onChange={handleInputChange}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={editedProfile?.location || ""}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCancelEdit}
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Avatar Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CameraAltIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Update Profile Picture
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 3,
                border: "3px dashed",
                borderColor: "primary.main",
              }}
              slotProps={{
                img: {
                  crossOrigin: "use-credentials",
                },
              }}
              src={profile?.profilePhotoUrl ? resolveMediaUrl(profile.profilePhotoUrl) : undefined}
            >
              {getInitials(profile?.name, profile?.lastName)}
            </Avatar>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload a new profile picture
            </Typography>
            {selectedProfilePhoto && (
              <Typography variant="caption" color="text.secondary">
                {selectedProfilePhoto.name}
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setSelectedProfilePhoto(e.target.files?.[0] || null)}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setAvatarDialogOpen(false);
              setSelectedProfilePhoto(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleProfilePhotoUpload}
            disabled={!selectedProfilePhoto || uploadingPhoto}
          >
            {uploadingPhoto ? <CircularProgress size={18} color="inherit" /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
