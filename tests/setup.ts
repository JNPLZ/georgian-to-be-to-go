import { afterEach, vi } from 'vitest';

vi.stubGlobal(
  'requestAnimationFrame',
  (callback: FrameRequestCallback): number =>
    setTimeout(() => callback(performance.now()), 0) as unknown as number,
);

vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});
