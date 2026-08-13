const paper = document.querySelector('#paper');
const motionFrame = document.querySelector('#motionFrame');
const stepLabel = document.querySelector('#step');
const instruction = document.querySelector('#instruction');
const totalPointsLabel = document.querySelector('#totalPoints');
const numberButtons = [...document.querySelectorAll('[data-count]')];
const directionButtons = [...document.querySelectorAll('[data-dir]')];
const startButton = document.querySelector('#start');
const againButton = document.querySelector('#again');
const frames = ['motion-vertical.png', 'motion-horizontal.png', 'motion-vertical.png', 'motion-wide.png'];
const pointOptions = [10, 30, 50, 100, 200, 300, 500];

frames.forEach(name => { const img = new Image(); img.src = `assets/images/${name}`; });

let count = 0;
let step = 0;
let timer = null;
let choosing = false;
let totalPoints = Number(localStorage.getItem('eastWestPoints') || 0);
totalPointsLabel.textContent = `${totalPoints.toLocaleString()} P`;

function image(name) {
  motionFrame.src = `assets/images/${name}`;
  paper.classList.add('flash');
  setTimeout(() => paper.classList.remove('flash'), 130);
}

function selectCount(value) {
  if (timer || choosing) return;
  count = value;
  numberButtons.forEach(button => button.classList.toggle('selected', Number(button.dataset.count) === value));
  instruction.textContent = `${value}번 움직여 볼까요?`;
  startButton.disabled = false;
  navigator.vibrate?.(18);
}

function showPose() {
  step += 1;
  image(frames[(step - 1) % frames.length]);
  stepLabel.textContent = `${step} / ${count}`;
  navigator.vibrate?.(25);
  if (step === count) {
    clearInterval(timer);
    timer = null;
    setTimeout(enableChoice, 380);
  }
}

function startGame() {
  if (!count || timer || choosing) return;
  step = 0;
  startButton.disabled = true;
  numberButtons.forEach(button => button.disabled = true);
  instruction.textContent = '동 · 서 · 남 · 북!';
  showPose();
  if (count > 1) timer = setInterval(showPose, 430);
}

function enableChoice() {
  choosing = true;
  paper.classList.add('choose');
  directionButtons.forEach(button => button.disabled = false);
  instruction.textContent = '포인트를 받을 방향을 골라 보세요!';
  stepLabel.textContent = '선택!';
}

function reveal(direction) {
  if (!choosing) return;
  choosing = false;
  const earned = pointOptions[Math.floor(Math.random() * pointOptions.length)];
  totalPoints += earned;
  localStorage.setItem('eastWestPoints', String(totalPoints));
  totalPointsLabel.textContent = `${totalPoints.toLocaleString()} P`;
  paper.className = 'paper';
  image('motion-closed.png');
  directionButtons.forEach(button => button.disabled = true);
  instruction.innerHTML = `<span class="point-icon" aria-label="포인트">P</span><strong>${earned.toLocaleString()} P 적립!</strong>`;
  stepLabel.textContent = `+${earned} P`;
  startButton.hidden = true;
  againButton.hidden = false;
  navigator.vibrate?.([35, 35, 65]);
}

function resetGame() {
  count = 0; step = 0; choosing = false;
  image('motion-closed.png');
  paper.className = 'paper';
  numberButtons.forEach(button => { button.disabled = false; button.classList.remove('selected'); });
  directionButtons.forEach(button => button.disabled = true);
  instruction.textContent = '몇 번 움직일까요?';
  stepLabel.textContent = '준비!';
  startButton.hidden = false; startButton.disabled = true;
  againButton.hidden = true;
}

numberButtons.forEach(button => button.addEventListener('click', () => selectCount(Number(button.dataset.count))));
directionButtons.forEach(button => button.addEventListener('click', () => reveal(button.dataset.dir)));
startButton.addEventListener('click', startGame);
againButton.addEventListener('click', resetGame);
