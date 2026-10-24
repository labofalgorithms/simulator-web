import { SimulatorApp } from '../core/simulator-app.js';
import { tr } from '../core/i18n.js';
import { avlTreeModule } from '../modules/avl-trees/avl-tree-module.js';

try {
  new SimulatorApp(avlTreeModule).start();
} catch (error) {
  // Sem isto, um erro de inicialização deixaria a página em branco, sem pista do motivo.
  console.error(error);
  const banner = document.createElement('p');
  banner.setAttribute('role', 'alert');
  banner.style.cssText = 'margin:24px;padding:16px;border:1px solid #fb7185;border-radius:12px;color:#fb7185;font:14px/1.5 system-ui,sans-serif';
  banner.textContent = tr(`Não foi possível iniciar o simulador (${error.message}). Recarregue a página sem o cache (Ctrl+Shift+R); se o erro continuar, abra o console do navegador (F12) para ver os detalhes.`, `Could not start the simulator (${error.message}). Reload the page without the cache (Ctrl+Shift+R); if the error persists, open the browser console (F12) to see the details.`);
  document.querySelector('.main-content, #app, body').prepend(banner);
}
