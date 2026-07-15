const boot = document.getElementById('boot');
const desktop = document.getElementById('desktop');
const itunesPage = document.getElementById('itunesPage');
const landingVideo = document.getElementById('landingVideo');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('musicPlayer');
const volumeSlider = document.getElementById('volumeSlider');
const volumeReadout = document.getElementById('volumeReadout');
const volumePopup = document.getElementById('volumePopup');
const speakerButton = document.getElementById('speakerButton');
const itunesShortcut = document.getElementById('itunesShortcut');
const backToDesktop = document.getElementById('backToDesktop');
const playPause = document.getElementById('playPause');
const prevTrack = document.getElementById('prevTrack');
const nextTrack = document.getElementById('nextTrack');
const nowPlaying = document.getElementById('nowPlaying');
const statusText = document.getElementById('statusText');
const itunesVolume = document.getElementById('itunesVolume');
const trackRows = [...document.querySelectorAll('.track')];

const START_VOLUME = 0.30;
let currentTrack = 0;

const tracks = [
  {
    title: 'Patchmade',
    artist: 'xaviersobased',
    srcs: ['assets/audio/Patchmade.mp3', 'assets/audio/patchmade.mp3']
  },
  {
    title: 'ACOG',
    artist: 'chanelfather',
    srcs: ['assets/audio/ACOG.mp3']
  }
];

function setVolume(percent) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  music.volume = safe / 100;
  volumeSlider.value = String(safe);
  itunesVolume.value = String(safe);
  volumeReadout.textContent = String(safe);
}

function setTrack(index, shouldPlay = true) {
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];
  const oldVolume = music.volume;
  music.innerHTML = track.srcs.map(src => `<source src="${src}" type="audio/mpeg">`).join('');
  music.load();
  music.volume = oldVolume;

  nowPlaying.textContent = `${track.title} — ${track.artist}`;
  statusText.textContent = `${track.title} is loaded.`;
  trackRows.forEach(row => row.classList.toggle('active', Number(row.dataset.track) === currentTrack));

  if (shouldPlay) {
    music.play().then(() => {
      playPause.textContent = 'Ⅱ';
      statusText.textContent = `Now playing: ${track.title} — ${track.artist}`;
    }).catch(() => {
      statusText.textContent = `Could not play ${track.title}. Check that the file exists.`;
      playPause.textContent = '▶';
    });
  }
}

enterBtn.addEventListener('click', async () => {
  landingVideo.pause();
  landingVideo.removeAttribute('src');
  landingVideo.load();
  boot.classList.add('hidden');
  desktop.classList.remove('hidden');
  setVolume(30);
  setTrack(0, false);
  try {
    await music.play();
    playPause.textContent = 'Ⅱ';
  } catch (error) {
    // Browser should allow this because it is click-triggered. If not, the user can hit play in iTunes.
    playPause.textContent = '▶';
  }
});

speakerButton.addEventListener('click', (event) => {
  event.stopPropagation();
  volumePopup.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!volumePopup.contains(event.target) && event.target !== speakerButton) {
    volumePopup.classList.add('hidden');
  }
});

volumeSlider.addEventListener('input', () => setVolume(volumeSlider.value));
itunesVolume.addEventListener('input', () => setVolume(itunesVolume.value));

itunesShortcut.addEventListener('click', () => {
  desktop.classList.add('hidden');
  itunesPage.classList.remove('hidden');
});

backToDesktop.addEventListener('click', () => {
  itunesPage.classList.add('hidden');
  desktop.classList.remove('hidden');
});

playPause.addEventListener('click', async () => {
  if (music.paused) {
    try {
      await music.play();
      playPause.textContent = 'Ⅱ';
      statusText.textContent = `Now playing: ${tracks[currentTrack].title} — ${tracks[currentTrack].artist}`;
    } catch (error) {
      statusText.textContent = `Could not play ${tracks[currentTrack].title}. Check that the file exists.`;
    }
  } else {
    music.pause();
    playPause.textContent = '▶';
    statusText.textContent = 'Paused.';
  }
});

prevTrack.addEventListener('click', () => setTrack(currentTrack - 1, true));
nextTrack.addEventListener('click', () => setTrack(currentTrack + 1, true));
trackRows.forEach(row => row.addEventListener('dblclick', () => setTrack(Number(row.dataset.track), true)));
trackRows.forEach(row => row.addEventListener('click', () => {
  trackRows.forEach(item => item.classList.remove('active'));
  row.classList.add('active');
  statusText.textContent = 'Double-click a song to play it.';
}));

music.addEventListener('ended', () => setTrack(currentTrack + 1, true));
setVolume(30);
