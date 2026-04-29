import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function ProjectCard({ project }) {
  return (
    <Card
      elevation={2}
      sx={{
        transition: 'box-shadow 300ms ease, background-color 300ms ease',
        '&:hover': {
          boxShadow: 6,
          backgroundColor: 'action.hover',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
          {project.name}
        </Typography>
        <Typography variant="body2">
          {project.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component="a"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;
