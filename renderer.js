const timeEl = document.getElementById('time');
const stateEl = document.getElementById('state');
const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const opacity = document.getElementById('opacity');
const opacityValue = document.getElementById('opacityValue');
const size = document.getElementById('size');
const sizeValue = document.getElementById('sizeValue');
const customMinutes = document.getElementById('customMinutes');
const applyCustom = document.getElementById('applyCustom');
const watch = document.querySelector('.watch');
const brand = document.getElementById('brand');
const barFill = document.getElementById('barFill');
const barChart = document.getElementById('barChart');
let total = 60, remaining = 60, running = false, endAt = 0, tick = null, flashTimer = null;
let colorIndex = 0;
const colors = ['blue', 'red', 'yellow'];
const colorValues = { blue: '#9fe0ff', red: '#ff8d8d', yellow: '#ffe277' };
function format(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
function render() {
  timeEl.textContent = format(Math.max(0, remaining));
  const progress = total ? remaining / total : 0;
  barFill.style.height = `${progress * 100}%`;
  barFill.classList.toggle('active', running && remaining > 0);
}
function setBarColor() {
  barChart.classList.remove(...colors);
  const color = colors[colorIndex];
  barChart.classList.add(color);
  brand.style.color = colorValues[color];
}
function setPreset(minutes) {
  total = remaining = minutes * 60; running = false; clearInterval(tick); clearInterval(flashTimer); watch.classList.remove('running', 'finished', 'flash-on');
  stateEl.textContent = 'Ready'; toggleBtn.textContent = 'Start';
  document.querySelectorAll('.preset').forEach((button) => button.classList.toggle('active', Number(button.dataset.min) === minutes)); render();
}
function finish() {
  running = false; clearInterval(tick); watch.classList.remove('running'); stateEl.textContent = 'Done'; toggleBtn.textContent = 'Restart'; render();
  let flashes = 0;
  clearInterval(flashTimer);
  flashTimer = setInterval(() => {
    watch.classList.toggle('flash-on');
    flashes += 1;
    if (flashes >= 10) { clearInterval(flashTimer); watch.classList.remove('flash-on'); watch.classList.add('finished'); }
  }, 220);
}
function start() {
  if (remaining <= 0) remaining = total; running = true; endAt = Date.now() + remaining * 1000; clearInterval(flashTimer); watch.classList.remove('finished', 'flash-on'); watch.classList.add('running'); stateEl.textContent = 'Focusing'; toggleBtn.textContent = 'Pause'; clearInterval(tick);
  tick = setInterval(() => { remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000)); render(); if (remaining === 0) finish(); }, 100); render();
}
function pause() { remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000)); running = false; clearInterval(tick); watch.classList.remove('running'); stateEl.textContent = 'Paused'; toggleBtn.textContent = 'Continue'; render(); }
toggleBtn.addEventListener('click', () => (running ? pause() : start()));
resetBtn.addEventListener('click', () => setPreset(Math.round(total / 60)));
document.querySelectorAll('.preset').forEach((button) => button.addEventListener('click', () => setPreset(Number(button.dataset.min))));
function applyCustomTime() {
  const minutes = Number(customMinutes.value);
  if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 999) setPreset(minutes);
}
applyCustom.addEventListener('click', applyCustomTime);
customMinutes.addEventListener('keydown', (event) => { if (event.key === 'Enter') applyCustomTime(); });
barChart.addEventListener('click', () => { colorIndex = (colorIndex + 1) % colors.length; setBarColor(); });
opacity.addEventListener('input', () => { const value = Number(opacity.value); opacityValue.textContent = `${value}%`; window.glassWatch.setOpacity(value / 100); });
size.addEventListener('input', () => { const value = Number(size.value); sizeValue.textContent = `${value}%`; document.documentElement.style.setProperty('--ui-scale', value / 100); window.glassWatch.setSize(value); });
document.getElementById('closeBtn').addEventListener('click', () => window.glassWatch.close());
document.documentElement.style.setProperty('--ui-scale', 1); setBarColor(); setPreset(1);
