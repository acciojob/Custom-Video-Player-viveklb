const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Play / Pause video
function togglePlay() {
  if (video.paused) {
    video.play().catch((error) => {
      console.error('Unable to play video:', error);
    });
  } else {
    video.pause();
  }
}

// Update play/pause button icon
function updateButton() {
  toggle.textContent = video.paused ? '►' : '❚ ❚';
}

// Skip forward or backward
function skip() {
  const skipAmount = parseFloat(this.dataset.skip);

  if (Number.isFinite(video.duration)) {
    video.currentTime = Math.min(
      Math.max(video.currentTime + skipAmount, 0),
      video.duration
    );
  }
}

// Volume and playback speed
function handleRangeUpdate() {
  video[this.name] = parseFloat(this.value);
}

// Update progress bar
function handleProgress() {
  if (!Number.isFinite(video.duration) || video.duration === 0) {
    progressBar.style.flexBasis = '0%';
    return;
  }

  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// Seek video using progress bar
function scrub(event) {
  if (!Number.isFinite(video.duration)) return;

  const rect = progress.getBoundingClientRect();

  const position = Math.min(
    Math.max(event.clientX - rect.left, 0),
    rect.width
  );

  const scrubTime = (position / rect.width) * video.duration;

  video.currentTime = scrubTime;
}

// Events

// Clicking video toggles play/pause
video.addEventListener('click', togglePlay);

// Play/Pause button
toggle.addEventListener('click', togglePlay);

// Update button icon
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// Update progress while playing
video.addEventListener('timeupdate', handleProgress);

// Skip buttons
skipButtons.forEach(button => {
  button.addEventListener('click', skip);
});

// Volume and speed sliders
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('input', handleRangeUpdate);
});

// Progress-bar seeking
let mouseDown = false;

progress.addEventListener('click', scrub);

progress.addEventListener('mousemove', (event) => {
  if (mouseDown) {
    scrub(event);
  }
});

progress.addEventListener('mousedown', () => {
  mouseDown = true;
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
});

// Video load error handling
video.addEventListener('error', () => {
  console.error('Video could not be loaded. Check that download.mp4 exists.');

  toggle.textContent = '⚠';

  toggle.title =
    'Video failed to load. Please check the download.mp4 file.';
});

// Set initial button state
updateButton();