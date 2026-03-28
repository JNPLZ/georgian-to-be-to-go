import { describe, expect, it } from 'vitest';
import { createCheatSheet } from '../src/components/CheatSheet/CheatSheet';

function clickByText(root: HTMLElement, text: string): void {
  const button = Array.from(root.querySelectorAll('button')).find(
    (element) => element.textContent?.trim() === text,
  );

  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }

  button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('cheatsheet go table', () => {
  it('uses მი- in the present but წა- in past and future for the combined entry', () => {
    const screen = createCheatSheet();
    document.body.appendChild(screen);

    clickByText(screen, 'to go');

    const text = screen.textContent ?? '';
    expect(text).toContain('მივდივარ');
    expect(text).toContain('წავედი');
    expect(text).toContain('წავალ');
    expect(text).not.toContain('მივედი');
    expect(text).not.toContain('მივალ');
  });
});
