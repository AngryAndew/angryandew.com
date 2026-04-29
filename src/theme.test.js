import { getTheme } from './theme';

/**
 * Parse a hex color (#rrggbb) to its RGB components and compute
 * relative luminance per WCAG 2.1.
 */
function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('getTheme', () => {
  const light = getTheme('light');
  const dark = getTheme('dark');

  // Requirement 3.1 — light background is off-white, not pure white
  test('light theme background is off-white (not #ffffff)', () => {
    expect(light.palette.background.default).not.toBe('#ffffff');
    expect(light.palette.background.default).not.toBe('#FFFFFF');
  });

  // Requirement 4.1 — dark background is not pure black
  test('dark theme background is not pure black (not #000000)', () => {
    expect(dark.palette.background.default).not.toBe('#000000');
  });

  // Requirements 3.2, 3.3, 4.2, 4.3 — both themes define primary and secondary
  test('both themes define primary.main and secondary.main', () => {
    expect(light.palette.primary.main).toBeDefined();
    expect(light.palette.secondary.main).toBeDefined();
    expect(dark.palette.primary.main).toBeDefined();
    expect(dark.palette.secondary.main).toBeDefined();
  });

  // Requirement 3.4 — light body text contrast ≥ 4.5:1
  test('light theme body text contrast ratio ≥ 4.5:1 against background.default', () => {
    const ratio = contrastRatio(light.palette.text.primary, light.palette.background.default);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  // Requirement 3.5 — light large text contrast ≥ 3:1
  test('light theme large text contrast ratio ≥ 3:1 against background.default', () => {
    const ratio = contrastRatio(light.palette.text.secondary, light.palette.background.default);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  // Requirement 4.4 — dark body text contrast ≥ 4.5:1
  test('dark theme body text contrast ratio ≥ 4.5:1 against background.default', () => {
    const ratio = contrastRatio(dark.palette.text.primary, dark.palette.background.default);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  // Requirement 4.5 — dark large text contrast ≥ 3:1
  test('dark theme large text contrast ratio ≥ 3:1 against background.default', () => {
    const ratio = contrastRatio(dark.palette.text.secondary, dark.palette.background.default);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  // Requirement 8.1 — transition overrides with background-color and color, 200–400ms
  test('theme includes transition overrides with duration between 200ms and 400ms', () => {
    const bodyStyle = light.components.MuiCssBaseline.styleOverrides.body;
    expect(bodyStyle.transition).toContain('background-color');
    expect(bodyStyle.transition).toContain('color');

    const match = bodyStyle.transition.match(/(\d+)ms/);
    expect(match).not.toBeNull();
    const duration = parseInt(match[1], 10);
    expect(duration).toBeGreaterThanOrEqual(200);
    expect(duration).toBeLessThanOrEqual(400);

    // Also verify MuiCard and MuiPaper have transitions
    expect(light.components.MuiCard.styleOverrides.root.transition).toContain('background-color');
    expect(light.components.MuiPaper.styleOverrides.root.transition).toContain('background-color');
  });
});
