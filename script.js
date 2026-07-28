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
 // Pixel coordinates in the original 1672 × 941 desktop image. The wallpaper
// uses background-size: cover, so plain percentages drift whenever the
// viewport aspect ratio differs from the source.
const WALLPAPER = {
width: 1672,
height: 941,
taskbarTop: 883,
speaker: { x: 1524, y: 894, width: 36, height: 41 }
};
 const tracks = [{
title: 'Patchmade',
artist: 'xaviersobased',
srcs: ['assets/audio/Patchmade.mp3']
},
{
title: 'ACOG',
artist: 'chanelfather',
srcs: ['assets/audio/ACOG.mp3']
}
];
 function positionWallpaperControls() {
const width = desktop.clientWidth;
const height = desktop.clientHeight;
if (!width || !height) return;
  const scale = Math.max(width / WALLPAPER.width, height / WALLPAPER.height);
const renderedWidth = WALLPAPER.width * scale;
const renderedHeight = WALLPAPER.height * scale;
const offsetX = (width - renderedWidth) / 2;
const offsetY = (height - renderedHeight) / 2;
const speaker = WALLPAPER.speaker;
  const speakerLeft = offsetX + speaker.x * scale;
const speakerTop = offsetY + speaker.y * scale;
const speakerWidth = speaker.width * scale;
const speakerHeight = speaker.height * scale;
const taskbarTop = offsetY + WALLPAPER.taskbarTop * scale;
const taskbarHeight = Math.max(0, height - taskbarTop);
const popupWidth = 76;
const popupLeft = Math.max(
6,
Math.min(width - popupWidth - 6, speakerLeft + speakerWidth / 2 - popupWidth / 2)
);
  desktop.style.setProperty('--speaker-left', `${speakerLeft}px`);
desktop.style.setProperty('--speaker-top', `${speakerTop}px`);
desktop.style.setProperty('--speaker-width', `${speakerWidth}px`);
desktop.style.setProperty('--speaker-height', `${speakerHeight}px`);
desktop.style.setProperty('--taskbar-height', `${taskbarHeight}px`);
desktop.style.setProperty('--volume-popup-left', `${popupLeft}px`);
desktop.style.setProperty('--volume-popup-right', 'auto');
desktop.style.setProperty('--volume-popup-bottom', `${taskbarHeight + 4}px`);}
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
trackRows.forEach(row => row.classList.toggle('active', Number(row.dataset.track) ===
currentTrack));
  if (shouldPlay) {
music.play().then(() => {
playPause.textContent = 'Ⅱ';
statusText.textContent = `Now playing: ${track.title} — ${track.artist}`;
}).catch(() => {
statusText.textContent = `Could not play ${track.title}. Check that the file exists.`;playPause.textContent = '▶';
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
positionWallpaperControls();
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
} let draggingVolume = false;
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
if (event.key === 'ArrowUp' || event.key === 'ArrowRight') { setVolume(current + 5);
event.preventDefault(); }
else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') { setVolume(current - 5);
event.preventDefault(); }
else if (event.key === 'Home') { setVolume(0); event.preventDefault(); }
else if (event.key === 'End') { setVolume(100); event.preventDefault(); }
});
 muteButton.addEventListener('click', () => {
music.muted = !music.muted;
muteButton.classList.toggle('muted', music.muted);
});
 itunesVolume.addEventListener('input', () => setVolume(itunesVolume.value));
 // --- Opening/closing the iTunes and Recycle Bin windows -------------------
function selectDesktopShortcut(shortcut) {
document.querySelectorAll('.desktop-icon').forEach(icon => {
icon.classList.toggle('selected', icon === shortcut);
});
}
 [itunesShortcut, recycleShortcut].forEach(shortcut => {
shortcut.addEventListener('click', event => {
event.stopPropagation();
selectDesktopShortcut(shortcut);
});
});
itunesShortcut.addEventListener('dblclick', () => itunesWindow.classList.remove('hidden'));
closeItunes.addEventListener('click', () => itunesWindow.classList.add('hidden'));
 recycleShortcut.addEventListener('dblclick', () => recycleWindow.classList.remove('hidden'));
desktop.addEventListener('click', event => {
if (!event.target.closest('.desktop-icon') && !event.target.closest('.win7-window, .itunes-window,
.win7-volume-popup')) {
selectDesktopShortcut(null);
}
});
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
statusText.textContent = `Now playing: ${tracks[currentTrack].title} — 
{tracks[currentTrack].artist}`;
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
trackRows.forEach(row => row.addEventListener('dblclick', () => setTrack(Number(row.dataset.track),
true)));
trackRows.forEach(row => row.addEventListener('click', () => {
trackRows.forEach(item => item.classList.remove('active'));
row.classList.add('active');
statusText.textContent = 'Double-click a song to play it.';
})); music.addEventListener('ended', () => setTrack(currentTrack + 1, true));
 // --- Initial state ---------------------------------------------------------
window.addEventListener('resize', positionWallpaperControls);
if ('ResizeObserver' in window) {
new ResizeObserver(positionWallpaperControls).observe(desktop);
}
setVolume(START_VOLUME);
