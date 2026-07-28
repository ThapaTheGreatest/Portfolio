const boot = document.getElementById('boot');
const desktop = document.getElementById('desktop');
const landingVideo = document.getElementById('landingVideo');
const enterBtn = document.getElementById('enterBtn');
 enterBtn.addEventListener('click', () => {
landingVideo.pause();
landingVideo.removeAttribute('src');
landingVideo.querySelectorAll('source').forEach(source => source.remove());
landingVideo.load();
  boot.classList.add('hidden');
desktop.classList.remove('hidden');
});
