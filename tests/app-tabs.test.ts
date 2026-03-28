import { describe, expect, it } from 'vitest';
import { initApp } from '../src/app/App';

function clickByText(text: string): void {
  const button = Array.from(document.querySelectorAll('button')).find(
    (element) => element.textContent?.trim() === text,
  );

  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }

  button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('quiz and cheatsheet tab behavior', () => {
  it('returns to the in-progress quiz instead of starting over', () => {
    const root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);

    initApp(root);

    clickByText('Start Quiz');

    const mainBefore = document.querySelector('main');
    expect(mainBefore).not.toBeNull();

    const initialQuestion = mainBefore!.textContent ?? '';
    const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();

    input!.value = 'draft answer';
    input!.dispatchEvent(new Event('input', { bubbles: true }));

    clickByText('Cheatsheet');
    expect(document.querySelector('main')?.textContent).toContain('Cheatsheet');

    clickByText('Quiz');

    const resumedInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
    expect(resumedInput).not.toBeNull();
    expect(resumedInput!.value).toBe('draft answer');
    expect(document.querySelector('main')?.textContent).toContain(initialQuestion);
  });

  it('keeps cheatsheet state while switching back and forth', () => {
    const root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);

    initApp(root);

    clickByText('Start Quiz');
    clickByText('Cheatsheet');
    clickByText('to go');

    expect(document.querySelector('main')?.textContent).toContain('Select direction');

    clickByText('Quiz');
    clickByText('Cheatsheet');

    expect(document.querySelector('main')?.textContent).toContain('Select direction');
  });
});
