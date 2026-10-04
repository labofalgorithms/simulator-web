// Contagem anônima de acessos com o GoatCounter (https://www.goatcounter.com):
// sem cookies, sem armazenamento no navegador e sem guardar o IP. O site continua
// hospedado no GitHub Pages; o GoatCounter só recebe o aviso de que a página abriu.
// Para trocar de serviço, basta alterar este arquivo.

const GOATCOUNTER_CODE = 'labofalgorithms';
const SCRIPT_URL = 'https://gc.zgo.at/count.js';
const PRIVACY_URL = 'https://www.goatcounter.com/privacy';

const isLocal = () => location.protocol === 'file:'
  || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
  || location.hostname.endsWith('.localhost');

let active = false;

function addPrivacyNote() {
  const footer = document.querySelector('.site-footer, .home-footer');
  if (!footer || footer.querySelector('.privacy-note')) return;
  const note = document.createElement('p');
  note.className = 'privacy-note';
  note.append('Contamos os acessos de forma anônima com o GoatCounter: sem cookies e sem guardar o seu IP. ');
  const link = document.createElement('a');
  link.href = PRIVACY_URL;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Saiba mais';
  note.append(link);
  footer.append(note);
}

/** Liga a contagem de acessos. Não faz nada em localhost, para os testes não entrarem nos números. */
export function initAnalytics() {
  if (active || isLocal()) return;
  active = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = SCRIPT_URL;
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.append(script);
  addPrivacyNote();
}

/**
 * Registra uma ação dentro da página, como trocar de simulador no menu lateral,
 * que não recarrega a página e por isso não vira um acesso. O nome do evento
 * não pode começar com "/" e deve incluir o módulo, porque o GoatCounter não
 * guarda o caminho da página junto com o evento.
 */
export function trackEvent(name, title) {
  if (!active) return;
  try {
    window.goatcounter?.count({ event: true, path: name, title });
  } catch {
    // A contagem nunca pode atrapalhar o simulador.
  }
}
