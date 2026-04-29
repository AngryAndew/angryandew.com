import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ProjectCard from './ProjectCard';
import ThemeToggle from './ThemeToggle';
import defaultProjects from '../data/projectRegistry';

function LandingPage({ projects = defaultProjects, mode, onToggleColorMode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="header"
        sx={{
          py: 6,
          textAlign: 'center',
          bgcolor: 'background.paper',
          transition: 'background-color 300ms ease, color 300ms ease',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ThemeToggle mode={mode} onToggle={onToggleColorMode} />
          </Box>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, fontSize: '3rem' }}
          >
            Andrew
          </Typography>
          <Typography variant="body1">
            Software developer and creator of things on the web.
          </Typography>
        </Container>
      </Box>

      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Box component="section">
            <Typography variant="h4" component="h2" gutterBottom>
              Projects
            </Typography>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.name}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'background-color 300ms ease, color 300ms ease',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Andrew
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}


export default LandingPage;
