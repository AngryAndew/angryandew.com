import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function ProjectCard({ project }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3">
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
