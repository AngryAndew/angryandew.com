import React from 'react';
import { render, within, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import LandingPage from './LandingPage';

/**
 * Property 1: Registry-to-cards count
 *
 * For any array of project objects used as the project registry, the rendered
 * LandingPage should display exactly as many ProjectCard components as there
 * are entries in the array.
 *
 * Validates: Requirements 1.2, 4.2
 */

const projectArb = () =>
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    description: fc.string({ minLength: 1, maxLength: 50 }),
    url: fc.webUrl(),
  });

describe('LandingPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 1: Registry-to-cards count', () => {
    fc.assert(
      fc.property(
        fc.array(projectArb(), { minLength: 0, maxLength: 50 }),
        (projects) => {
          cleanup();
          const { container, unmount } = render(
            <LandingPage projects={projects} />
          );

          // Each ProjectCard renders an h3 heading for the project name.
          // Count h3 elements to determine the number of rendered cards.
          const cards = container.querySelectorAll('h3');
          expect(cards.length).toBe(projects.length);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
