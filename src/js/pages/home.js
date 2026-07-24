import { icons } from '../core/icons.js';
import { storage } from '../core/storage.js';

const themeButton = document.querySelector('#theme-button');
let lightTheme = storage.get('loa-theme', 'dark') === 'light';

function renderTheme() {
  document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark';
  themeButton.innerHTML = lightTheme ? icons.moon : icons.sun;
  storage.set('loa-theme', lightTheme ? 'light' : 'dark');
}

themeButton.addEventListener('click', () => {
  lightTheme = !lightTheme;
  renderTheme();
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
renderTheme();
