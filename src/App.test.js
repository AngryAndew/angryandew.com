import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import projects from './data/projectRegistry';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

  // Req 1.1: Toggle button renders inside the header element
  it('renders the toggle button inside the header', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    const toggle = within(header).getByRole('button', {
      name: /toggle (dark|light) mode/i,
    });
    expect(toggle).toBeInTheDocument();
  });

  // Req 1.2: Clicking toggle switches theme (body background color changes)
  it('changes body background color when toggle is clicked', () => {
    render(<App />);
    const body = document.body;
    const initialBg = window.getComputedStyle(body).backgroundColor;

    const toggle = screen.getByRole('button', {
      name: /toggle (dark|light) mode/i,
    });
    fireEvent.click(toggle);

    const updatedBg = window.getComputedStyle(body).backgroundColor;
    expect(updatedBg).not.toBe(initialBg);
  });

  // Req 1.3: Components re-render with new palette without full page reload
  it('re-renders components with new palette without full page reload', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');

    const headerBgBefore = window.getComputedStyle(header).backgroundColor;
    const footerBgBefore = window.getComputedStyle(footer).backgroundColor;

    const toggle = screen.getByRole('button', {
      name: /toggle (dark|light) mode/i,
    });
    fireEvent.click(toggle);

    const headerBgAfter = window.getComputedStyle(header).backgroundColor;
    const footerBgAfter = window.getComputedStyle(footer).backgroundColor;

    // At least one section background should differ, confirming re-render
    const headerChanged = headerBgAfter !== headerBgBefore;
    const footerChanged = footerBgAfter !== footerBgBefore;
    expect(headerChanged || footerChanged).toBe(true);

    // Same DOM nodes still present (no full page reload)
    expect(container.querySelector('header')).toBe(header);
    expect(container.querySelector('footer')).toBe(footer);
  });
});
