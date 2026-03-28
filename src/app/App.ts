import type { Screen, QuizState } from '../types/index';
import { initLang } from '../features/i18n/i18n';
import { loadSettings, saveSettings, createQuizState } from '../features/quiz/quiz';
import { createNav } from '../components/Nav/Nav';
import { createStartScreen } from '../components/StartScreen/StartScreen';
import { createQuizScreen } from '../components/QuizScreen/QuizScreen';
import { createResultScreen } from '../components/ResultScreen/ResultScreen';
import { createCheatSheet } from '../components/CheatSheet/CheatSheet';

export function initApp(root: HTMLElement): void {
  initLang();

  let currentScreen: Screen = 'start';
  let quizState: QuizState | null = null;
  let settings = loadSettings();

  const navContainer = document.createElement('div');
  const main = document.createElement('main');
  root.append(navContainer, main);

  function renderNav(): void {
    navContainer.innerHTML = '';
    navContainer.appendChild(
      createNav(currentScreen, {
        onNavigate(screen) {
          navigateTo(screen);
        },
        onLangChange() {
          // Re-render everything in the new language
          renderNav();
          renderScreen();
        },
      }),
    );
  }

  function renderScreen(): void {
    main.innerHTML = '';

    if (currentScreen === 'start') {
      main.appendChild(
        createStartScreen(settings, {
          onStart(newSettings) {
            settings = newSettings;
            saveSettings(settings);
            quizState = createQuizState(settings);
            navigateTo('quiz');
          },
        }),
      );
    } else if (currentScreen === 'quiz' && quizState) {
      main.appendChild(
        createQuizScreen(quizState, {
          onComplete(finalState) {
            quizState = finalState;
            navigateTo('result');
          },
        }),
      );
    } else if (currentScreen === 'result' && quizState) {
      main.appendChild(
        createResultScreen(quizState, {
          onNewRound() {
            navigateTo('start');
          },
        }),
      );
    } else if (currentScreen === 'cheatsheet') {
      main.appendChild(createCheatSheet());
    }
  }

  function navigateTo(screen: Screen): void {
    currentScreen = screen;
    renderNav();
    renderScreen();
  }

  renderNav();
  renderScreen();
}
