import React from 'react';
import { render, within, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import ProjectCard from './ProjectCard';

/**
 * Property 2: Card content and link correctness
 *
 * For any project object with a name, description, and url, the rendered
 * ProjectCard should contain the project name text, the description text,
 * and a native anchor element (<a>) whose href matches the project url
 * and whose target is "_blank".
 *
 * Validates: Requirements 1.3, 2.1, 6.3
 */

// Generator for visible text strings: printable ASCII, at least one character.
const visibleText = () =>
  fc.stringOf(
    fc.integer({ min: 33, max: 126 }).map((code) => String.fromCharCode(code)),
    { minLength: 1, maxLength: 30 }
  );

describe('ProjectCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 2: Card content and link correctness', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: visibleText(),
          description: visibleText(),
          url: fc.webUrl(),
        }),
        (project) => {
          cleanup();
          const { container, unmount } = render(<ProjectCard project={project} />);
          const scope = within(container);

          // Assert name text is rendered as an h3 heading
          const heading = scope.getByRole('heading', { level: 3 });
          expect(heading).toHaveTextContent(project.name);

          // Assert description text is rendered
          expect(scope.getByText(project.description, { exact: false })).toBeInTheDocument();

          // Assert an <a> element exists with matching href and target="_blank"
          const link = scope.getByRole('link', { name: /visit/i });
          expect(link.tagName).toBe('A');
          expect(link).toHaveAttribute('href', project.url);
          expect(link).toHaveAttribute('target', '_blank');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
