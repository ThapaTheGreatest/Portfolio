const login = document.getElementById('login');
const desktop = document.getElementById('desktop');
const profileButton = document.getElementById('profileButton');
const welcomeMessage = document.getElementById('welcomeMessage');
 let isEntering = false;
 if (new URLSearchParams(window.location.search).get('desktop') === '1') {
login.classList.add('hidden');
desktop.classList.remove('hidden');
}
 const enterDesktop = () => {
if (isEntering) {
return;
}
  isEntering = true;
profileButton.classList.add('is-hidden');
welcomeMessage.classList.remove('hidden');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const welcomeDelay = reducedMotion ? 0 : 650;
const fadeDelay = reducedMotion ? 0 : 280;
  window.setTimeout(() => {
login.classList.add('login-fade');
  window.setTimeout(() => {
login.classList.add('hidden');
desktop.classList.remove('hidden');
desktop.classList.add('desktop-entering');
}, fadeDelay);
}, welcomeDelay);
};
 profileButton.addEventListener('click', enterDesktop);
