import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import projects from './data/projectRegistry';

describe('App', () => {
  // Req 1.1: LandingPage renders the owner's name and introduction
  it('renders the owner name and introduction', () => {
    render(<App />);
    expect(screen.getByText('Andrew')).toBeInTheDocument();
    expect(
      screen.getByText('Software developer and creator of things on the web.')
    ).toBeInTheDocument();
  });

  // Req 2.2: Parm is present in the project registry with correct url
  it('includes Parm in the project registry with correct url', () => {
    const parm = projects.find((p) => p.name === 'Parm');
    expect(parm).toBeDefined();
    expect(parm.url).toBe('https://parm.angryandew.com');
  });

  // Req 6.1: Semantic HTML elements (header, main, footer) are present
  it('renders semantic HTML elements', () => {
    const { container } = render(<App />);
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
