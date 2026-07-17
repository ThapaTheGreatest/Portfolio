// --- Element references ------------------------------------------------
const boot = document.getElementById('boot');
const desktop = document.getElementById('desktop');
const landingVideo = document.getElementById('landingVideo');
const enterBtn = document.getElementById('enterBtn');
const music = document.getElementById('musicPlayer');

const recycleShortcut = document.getElementById('recycleShortcut');
const itunesShortcut = document.getElementById('itunesShortcut');
const itunesWindow = document.getElementById('itunesWindow');
const recycleWindow = document.getElementById('recycleWindow');
const closeItunes = document.getElementById('closeItunes');

const playPause = document.getElementById('playPause');
const prevTrack = document.getElementById('prevTrack');
const nextTrack = document.getElementById('nextTrack');
const nowPlaying = document.getElementById('nowPlaying');
const statusText = document.getElementById('statusText');
const itunesVolume = document.getElementById('itunesVolume');
const trackRows = [...document.querySelectorAll('.track')];

const speakerButton = document.getElementById('speakerButton');
const volumePopup = document.getElementById('volumePopup');
const volumeTrack = document.getElementById('volumeTrack');
const volumeSlot = volumeTrack.querySelector('.volume-slot');
const volumeFill = document.getElementById('volumeFill');
const volumeThumb = document.getElementById('volumeThumb');
const volumeReadout = document.getElementById('volumeReadout');
const muteButton = document.getElementById('muteButton');

const START_VOLUME = 30; // percent, 0-100
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

// --- Volume: numeric state + the Windows 7 tray flyout ------------------
function paintVolumeSlider(level) {
  if (!volumeSlot || !volumeFill || !volumeThumb) return;
  const trackRect = volumeTrack.getBoundingClientRect();
  const slotRect = volumeSlot.getBoundingClientRect();
  const travel = slotRect.height;
  const bottomOffset = trackRect.bottom - slotRect.bottom;
  const pct = Math.max(0, Math.min(100, level)) / 100;
  volumeFill.style.height = `${pct * travel}px`;
  volumeThumb.style.bottom = `${bottomOffset + pct * travel}px`;
}

function setVolume(percent) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));
  music.volume = safe / 100;
  music.muted = false;
  itunesVolume.value = String(safe);
  volumeReadout.textContent = String(safe);
  volumeTrack.setAttribute('aria-valuenow', String(safe));
  muteButton.classList.remove('muted');
  paintVolumeSlider(safe);
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

// --- Boot screen -> desktop, with the autoplay kickoff -------------------
enterBtn.addEventListener('click', async () => {
  landingVideo.pause();
  landingVideo.removeAttribute('src');
  landingVideo.load();
  boot.classList.add('hidden');
  desktop.classList.remove('hidden');
  setVolume(START_VOLUME);
  setTrack(0, false);
  try {
    await music.play();
    playPause.textContent = 'Ⅱ';
    statusText.textContent = `Now playing: ${tracks[0].title} — ${tracks[0].artist}`;
  } catch (error) {
    // Browser should allow this because it is click-triggered. If not, the user can hit play in iTunes.
    playPause.textContent = '▶';
  }
});

// --- System tray speaker + Windows 7 volume flyout ------------------------
speakerButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const opening = volumePopup.classList.contains('hidden');
  volumePopup.classList.toggle('hidden');
  if (opening) paintVolumeSlider(Number(itunesVolume.value));
});

document.addEventListener('click', (event) => {
  if (!volumePopup.contains(event.target) && event.target !== speakerButton) {
    volumePopup.classList.add('hidden');
  }
});

function setVolumeFromPointer(clientY) {
  const rect = volumeSlot.getBoundingClientRect();
  const pct = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  setVolume(Math.round(pct * 100));
}

let draggingVolume = false;
volumeTrack.addEventListener('pointerdown', (event) => {
  draggingVolume = true;
  if (volumeTrack.setPointerCapture) volumeTrack.setPointerCapture(event.pointerId);
  setVolumeFromPointer(event.clientY);
});
volumeTrack.addEventListener('pointermove', (event) => {
  if (draggingVolume) setVolumeFromPointer(event.clientY);
});
['pointerup', 'pointercancel'].forEach(evt => {
  volumeTrack.addEventListener(evt, () => { draggingVolume = false; });
});
volumeTrack.addEventListener('keydown', (event) => {
  const current = Number(itunesVolume.value);
  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') { setVolume(current + 5); event.preventDefault(); }
  else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') { setVolume(current - 5); event.preventDefault(); }
  else if (event.key === 'Home') { setVolume(0); event.preventDefault(); }
  else if (event.key === 'End') { setVolume(100); event.preventDefault(); }
});

muteButton.addEventListener('click', () => {
  music.muted = !music.muted;
  muteButton.classList.toggle('muted', music.muted);
});

itunesVolume.addEventListener('input', () => setVolume(itunesVolume.value));

// --- Opening/closing the iTunes and Recycle Bin windows -------------------
itunesShortcut.addEventListener('click', () => itunesWindow.classList.remove('hidden'));
closeItunes.addEventListener('click', () => itunesWindow.classList.add('hidden'));

recycleShortcut.addEventListener('click', () => recycleWindow.classList.remove('hidden'));
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.close);
    if (target) target.classList.add('hidden');
  });
});

// --- Transport controls --------------------------------------------------
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

// --- Initial state ---------------------------------------------------------
setVolume(START_VOLUME);
