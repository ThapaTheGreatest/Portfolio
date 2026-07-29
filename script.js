const login = document.getElementById('login');
const desktop = document.getElementById('desktop');
const profileButton = document.getElementById('profileButton');
const welcomeMessage = document.getElementById('welcomeMessage');
const godheadShortcut = document.getElementById('godheadShortcut');
const godheadWindow = document.getElementById('godheadWindow');
const closeGodhead = document.getElementById('closeGodhead');
 let isEntering = false;
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
 const openGodhead = () => {
godheadWindow.classList.remove('hidden');
godheadShortcut.classList.add('is-selected');
};
 godheadShortcut.addEventListener('click', openGodhead);
godheadShortcut.addEventListener('dblclick', openGodhead);
closeGodhead.addEventListener('click', () => {godheadWindow.classList.add('hidden');
godheadShortcut.classList.remove('is-selected');
});
