import './styles/global.css';
import { initApp } from './app/App';

const root = document.getElementById('app');
if (!root) throw new Error('#app element not found');

initApp(root);
