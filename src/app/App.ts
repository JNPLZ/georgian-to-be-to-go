import type { Screen, QuizState } from '../types/index';
import { initLang } from '../features/i18n/i18n';
import { loadSettings, saveSettings, createQuizState } from '../features/quiz/quiz';
import { createNav } from '../components/Nav/Nav';
import { createStartScreen } from '../components/StartScreen/StartScreen';
import { createQuizScreen } from '../components/QuizScreen/QuizScreen';
import type { QuizScreenInstance } from '../components/QuizScreen/QuizScreen';
import { createResultScreen } from '../components/ResultScreen/ResultScreen';
import { createCheatSheet } from '../components/CheatSheet/CheatSheet';
import { createFooter } from '../components/Footer/Footer';

export function initApp(root: HTMLElement): void {
  initLang();

  let currentScreen: Screen = 'start';
  let quizState: QuizState | null = null;
  let currentQuiz: QuizScreenInstance | null = null;
  let settings = loadSettings();

  const navContainer = document.createElement('div');
  const main = document.createElement('main');
  const footerContainer = document.createElement('div');
  root.append(navContainer, main, footerContainer);

  function renderNav(): void {
    navContainer.innerHTML = '';
    navContainer.appendChild(
      createNav(currentScreen, {
        onNavigate(screen) { navigateTo(screen); },
        onLangChange() {
          if (currentQuiz) { currentQuiz.destroy(); currentQuiz = null; }
          renderNav();
          renderScreen();
          renderFooter();
        },
      }),
    );
  }

  function renderFooter(): void {
    footerContainer.innerHTML = '';
    footerContainer.appendChild(createFooter());
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
      currentQuiz = createQuizScreen(quizState, {
        onComplete(finalState) {
          quizState = finalState;
          currentQuiz = null;
          navigateTo('result');
        },
        onStateChange(currentState) {
          quizState = currentState;
        },
      });
      main.appendChild(currentQuiz.element);
    } else if (currentScreen === 'result' && quizState) {
      main.appendChild(
        createResultScreen(quizState, {
          onNewRound() { navigateTo('start'); },
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
  renderFooter();
}
