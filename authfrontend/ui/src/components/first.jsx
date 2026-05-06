import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Chip,
  Divider,
  alpha
} from '@mui/material';
import {
  RocketLaunch,
  Lock,
  Email,
  Code,
  Security,
  ArrowForward,
  Login,
  PersonAdd,
  Dashboard,
  Terminal,
  Cloud,
  Bolt,
  CheckCircle,
  GitHub,
  LinkedIn,
  Twitter
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './SoloLaunchPage.css';

const SoloLaunchPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(0);

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'JWT', color: '#000000' },
    { name: 'Material-UI', color: '#007FFF' },
    { name: 'Node.js', color: '#339933' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'Redis', color: '#DC382D' }
  ];

  const features = [
    {
      icon: <Security />,
      title: 'JWT Authentication',
      description: 'Industry-standard JSON Web Tokens with secure HTTP-only cookies',
      details: 'Stateless authentication with automatic refresh tokens'
    },
    {
      icon: <Email />,
      title: 'Email OTP Verification',
      description: 'Two-factor authentication via email OTP',
      details: 'Secure login codes delivered to registered email'
    },
    {
      icon: <Lock />,
      title: 'Session Management',
      description: 'Smart session handling with persistent login',
      details: 'Automatic token refresh and secure cookie storage'
    },
    {
      icon: <Dashboard />,
      title: 'User Dashboard',
      description: 'Personalized user interface',
      details: 'Custom dashboard for managing your account'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ overflow: 'hidden', minHeight: '100vh', bgcolor: '#0a192f' }}>
      {/* Navigation Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#0a192f', 0.9),
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <RocketLaunch sx={{ color: '#64ffda', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #64ffda, #00a8cc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                AuthPortal
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#ccd6f6',
                  borderColor: '#64ffda',
                  '&:hover': {
                    borderColor: '#64ffda',
                    bgcolor: alpha('#64ffda', 0.1)
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: '#64ffda',
                  color: '#0a192f',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#52d7c1',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 15, md: 20 }, pb: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Chip
                  icon={<Bolt />}
                  label="Individual Project"
                  sx={{
                    bgcolor: alpha('#64ffda', 0.1),
                    color: '#64ffda',
                    mb: 3,
                    fontWeight: 500
                  }}
                />
                
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    color: '#ccd6f6',
                    lineHeight: 1.2
                  }}
                >
                  Professional Authentication
                  <Box component="span" sx={{ color: '#64ffda', display: 'block' }}>
                    Built Solo
                  </Box>
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: '#8892b0',
                    fontWeight: 300,
                    lineHeight: 1.6
                  }}
                >
                  A production-ready authentication system featuring JWT tokens, 
                  secure cookies, and email OTP verification. Built from scratch 
                  by a single developer.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: '#64ffda',
                      color: '#0a192f',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#52d7c1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(100, 255, 218, 0.3)'
                      }
                    }}
                  >
                    Start Building
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    startIcon={<Login />}
                    sx={{
                      borderColor: '#64ffda',
                      color: '#64ffda',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        borderColor: '#64ffda',
                        bgcolor: alpha('#64ffda', 0.1)
                      }
                    }}
                  >
                    Demo Access
                  </Button>
                </Stack>

                {/* Tech Stack */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: '#8892b0', mb: 2 }}>
                    BUILT WITH
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {techStack.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech.name}
                        size="small"
                        sx={{
                          bgcolor: alpha(tech.color, 0.1),
                          color: tech.color,
                          border: `1px solid ${alpha(tech.color, 0.3)}`,
                          mb: 1
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1500}>
              <Box sx={{ position: 'relative' }}>
                {/* Code Terminal Preview */}
                <Paper
                  elevation={24}
                  sx={{
                    borderRadius: 4,
                    bgcolor: '#112240',
                    color: '#e6f1ff',
                    overflow: 'hidden',
                    border: '1px solid rgba(100, 255, 218, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Terminal Header */}
                  <Box
                    sx={{
                      bgcolor: '#0a192f',
                      px: 3,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)'
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27ca3f' }} />
                    </Stack>
                    <Typography variant="caption" sx={{ ml: 2, color: '#64ffda' }}>
                      auth-system.js
                    </Typography>
                  </Box>

                  {/* Terminal Content */}
                  <Box sx={{ p: 3, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#64ffda' }}>
                        $ npm init auth-system
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#e6f1ff' }}>
                        <span style={{ color: '#ff6b6b' }}>→</span> Initializing JWT authentication...
                      </Typography>
                      <Typography sx={{ color: '#4ecdc4' }}>
                        ✓ Secure token generation enabled
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#e6f1ff' }}>
                        <span style={{ color: '#ff6b6b' }}>→</span> Configuring OTP system...
                      </Typography>
                      <Typography sx={{ color: '#4ecdc4' }}>
                        ✓ Email verification setup complete
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#e6f1ff' }}>
                        <span style={{ color: '#ff6b6b' }}>→</span> Setting up secure cookies...
                      </Typography>
                      <Typography sx={{ color: '#4ecdc4' }}>
                        ✓ HTTP-only cookies configured
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography sx={{ color: '#64ffda', fontWeight: 'bold' }}>
                        Authentication system ready!
                      </Typography>
                      <Typography sx={{ color: '#8892b0' }}>
                        Visit http://localhost:3000 to get started
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Floating Elements */}
                <Box
                  className="floating-element"
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: alpha('#64ffda', 0.1),
                    border: `1px solid ${alpha('#64ffda', 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle sx={{ color: '#64ffda', fontSize: 24 }} />
                </Box>
                
                <Box
                  className="floating-element"
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#ff6b6b', 0.1),
                    border: `1px solid ${alpha('#ff6b6b', 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Code sx={{ color: '#ff6b6b', fontSize: 32 }} />
                </Box>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#112240' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#ccd6f6',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Solo-Developed Features
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 6, color: '#8892b0', maxWidth: 600, mx: 'auto' }}
          >
            Built with attention to detail and modern security practices
          </Typography>

          {/* Feature Cards */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Slide in={true} direction="up" timeout={500 + index * 200}>
                  <Card
                    onMouseEnter={() => setActiveFeature(index)}
                    sx={{
                      bgcolor: index === activeFeature ? '#0a192f' : 'transparent',
                      border: `1px solid ${alpha('#64ffda', index === activeFeature ? 0.3 : 0.1)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: alpha('#64ffda', 0.5)
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            bgcolor: alpha('#64ffda', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          {React.cloneElement(feature.icon, { 
                            sx: { color: '#64ffda', fontSize: 24 } 
                          })}
                        </Box>
                        <Typography variant="h5" sx={{ color: '#ccd6f6', fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      
                      <Typography sx={{ color: '#8892b0', mb: 2 }}>
                        {feature.description}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#64ffda' }}>
                        {feature.details}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 15 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: '#112240',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 200,
              height: 200,
              bgcolor: alpha('#64ffda', 0.05),
              borderRadius: '50%',
              transform: 'translate(50%, -50%)'
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <RocketLaunch sx={{ fontSize: 60, color: '#64ffda', mb: 3 }} />
            
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#ccd6f6' }}>
              Ready to Secure Your Project?
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, color: '#8892b0' }}>
              Built by a solo developer, engineered for production
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#64ffda',
                  color: '#0a192f',
                  py: 1.5,
                  px: 5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#52d7c1',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Create Account
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                startIcon={<Login />}
                sx={{
                  borderColor: '#64ffda',
                  color: '#64ffda',
                  py: 1.5,
                  px: 5,
                  '&:hover': {
                    borderColor: '#64ffda',
                    bgcolor: alpha('#64ffda', 0.1)
                  }
                }}
              >
                Sign In Now
              </Button>
            </Stack>
            
            <Typography variant="body2" sx={{ color: '#8892b0' }}>
              No teams, no committees — just clean, professional authentication
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <RocketLaunch sx={{ color: '#64ffda' }} />
                <Typography variant="h6" sx={{ color: '#ccd6f6', fontWeight: 700 }}>
                  AuthPortal
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#8892b0', mt: 1 }}>
                A solo developer project showcasing modern authentication practices
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <IconButton
                  sx={{
                    color: '#8892b0',
                    '&:hover': { color: '#64ffda' }
                  }}
                >
                  <GitHub />
                </IconButton>
                <IconButton
                  sx={{
                    color: '#8892b0',
                    '&:hover': { color: '#64ffda' }
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  sx={{
                    color: '#8892b0',
                    '&:hover': { color: '#64ffda' }
                  }}
                >
                  <Twitter />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Typography variant="body2" align="center" sx={{ color: '#8892b0' }}>
            © {new Date().getFullYear()} AuthPortal. Built with ❤️ by a solo developer.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SoloLaunchPage;