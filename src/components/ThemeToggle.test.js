import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  // Req 1.4: Correct icon renders for light mode (Brightness4 = moon)
  it('renders Brightness4Icon (moon) in light mode', () => {
    const { container } = render(<ThemeToggle mode="light" onToggle={() => {}} />);
    expect(container.querySelector('[data-testid="Brightness4Icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="Brightness7Icon"]')).not.toBeInTheDocument();
  });

  // Req 1.4: Correct icon renders for dark mode (Brightness7 = sun)
  it('renders Brightness7Icon (sun) in dark mode', () => {
    const { container } = render(<ThemeToggle mode="dark" onToggle={() => {}} />);
    expect(container.querySelector('[data-testid="Brightness7Icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="Brightness4Icon"]')).not.toBeInTheDocument();
  });

  // Req 1.4: aria-label reflects current mode
  it('has aria-label "toggle dark mode" in light mode', () => {
    render(<ThemeToggle mode="light" onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'toggle dark mode' })).toBeInTheDocument();
  });

  it('has aria-label "toggle light mode" in dark mode', () => {
    render(<ThemeToggle mode="dark" onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'toggle light mode' })).toBeInTheDocument();
  });

  // Req 1.4: onToggle callback is called on click
  it('calls onToggle when clicked', () => {
    const handleToggle = jest.fn();
    render(<ThemeToggle mode="light" onToggle={handleToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  // Req 1.5: Button is keyboard focusable (renders as <button>, so Enter/Space work natively)
  it('is keyboard focusable and renders as a native button element', () => {
    render(<ThemeToggle mode="light" onToggle={() => {}} />);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
    // MUI IconButton renders as <button>, which natively supports Enter/Space activation
    expect(button.tagName).toBe('BUTTON');
    // Verify it is not disabled, so keyboard activation works
    expect(button).not.toBeDisabled();
  });
});
