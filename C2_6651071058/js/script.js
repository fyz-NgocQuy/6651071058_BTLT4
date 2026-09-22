const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
};

window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  $('#scrollProgress').style.width = `${max ? (h.scrollTop / max) * 100 : 0}%`;
});

$('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  $('#themeToggle').textContent = document.body.classList.contains('dark-mode') ? '☾' : '☼';
  toast(document.body.classList.contains('dark-mode') ? 'Đã bật giao diện đêm 🌙' : 'Đã bật giao diện sáng ☀');
});

$('#fontToggle').addEventListener('click', () => {
  document.body.classList.toggle('larger-text');
  toast(document.body.classList.contains('larger-text') ? 'Đã tăng cỡ chữ' : 'Đã trở về cỡ chữ ban đầu');
});

let sparkles = true;
$('#sparkleToggle').addEventListener('click', () => {
  sparkles = !sparkles;
  toast(sparkles ? 'Hiệu ứng lấp lánh: BẬT ✦' : 'Hiệu ứng lấp lánh: TẮT');
});

document.addEventListener('click', (e) => {
  if (!sparkles || e.target.closest('button, a')) return;
  const s = document.createElement('span');
  s.className = 'sparkle';
  s.textContent = ['✦','♡','·'][Math.floor(Math.random()*3)];
  s.style.left = `${e.clientX}px`;
  s.style.top = `${e.clientY}px`;
  s.style.fontSize = `${12 + Math.random()*12}px`;
  s.style.color = ['#d86f9a','#8bbfd4','#79bcae'][Math.floor(Math.random()*3)];
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
});

const tick = () => {
  const now = new Date();
  $('#liveClock').textContent = now.toLocaleTimeString('vi-VN');
  $('#liveDate').textContent = now.toLocaleDateString('vi-VN', {weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'});
};
tick();
setInterval(tick, 1000);


// Opening curtain + falling/shooting stars
const curtain = $('#curtainIntro');
const starField = $('#starField');
if (starField) {
  for (let i = 0; i < 28; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = i % 4 === 0 ? '✦' : '·';
    star.style.left = `${8 + Math.random() * 84}%`;
    star.style.top = `${8 + Math.random() * 70}%`;
    star.style.fontSize = `${8 + Math.random() * 12}px`;
    star.style.animationDelay = `${0.15 + Math.random() * 1.25}s`;
    starField.appendChild(star);
  }
}
setTimeout(() => { if (curtain) curtain.remove(); }, 3500);

// Save checklist locally so it stays checked after refreshing the page
const todos = $$('.todo-check');
todos.forEach((item, index) => {
  const key = `quqi-todo-${index}`;
  item.checked = localStorage.getItem(key) === '1';
  item.addEventListener('change', () => localStorage.setItem(key, item.checked ? '1' : '0'));
});

// Simple 25-minute Pomodoro
let pomodoroSeconds = 25 * 60;
let pomodoroRunning = false;
let pomodoroTimer = null;
const renderPomodoro = () => {
  const m = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0');
  const s = String(pomodoroSeconds % 60).padStart(2, '0');
  $('#pomodoroTime').textContent = `${m}:${s}`;
};
$('#pomodoroBtn').addEventListener('click', () => {
  pomodoroRunning = !pomodoroRunning;
  $('#pomodoroBtn').textContent = pomodoroRunning ? 'Tạm dừng' : 'Tiếp tục';
  $('#pomodoroStatus').textContent = pomodoroRunning ? 'Đang tập trung… cố lên ♡' : 'Đã tạm dừng.';
  if (pomodoroRunning) {
    pomodoroTimer = setInterval(() => {
      if (pomodoroSeconds > 0) { pomodoroSeconds--; renderPomodoro(); }
      else {
        clearInterval(pomodoroTimer); pomodoroRunning = false;
        $('#pomodoroBtn').textContent = 'Bắt đầu lại';
        $('#pomodoroStatus').textContent = 'Hết giờ rồi! Nghỉ một chút nhé ✦';
        toast('Pomodoro hoàn thành! Nghỉ 5 phút nhé 🌷');
      }
    }, 1000);
  } else clearInterval(pomodoroTimer);
});
$('#pomodoroReset').addEventListener('click', () => {
  clearInterval(pomodoroTimer); pomodoroRunning = false; pomodoroSeconds = 25 * 60;
  renderPomodoro(); $('#pomodoroBtn').textContent = 'Bắt đầu';
  $('#pomodoroStatus').textContent = 'Tập trung 25 phút rồi nghỉ nhé.';
});
renderPomodoro();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.12});
$$('.reveal, .project-card, .timeline-item, .blog-post').forEach(el => { el.classList.add('reveal'); observer.observe(el); });

const modal = $('#projectModal');
$$('.project-open').forEach(btn => btn.addEventListener('click', e => {
  e.preventDefault();
  $('#modalTitle').textContent = btn.dataset.title;
  $('#modalText').textContent = btn.dataset.text;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
});

const words = ['sinh viên','UI learner','người thích code','người mê thiết kế'];
let wi=0, ci=0, deleting=false;
const typing = $('.typing-word');
const type = () => {
  if (!typing) return;
  const word=words[wi];
  typing.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
  if (!deleting && ci===word.length) { deleting=true; setTimeout(type,1100); return; }
  if (deleting && ci===0) { deleting=false; wi=(wi+1)%words.length; }
  setTimeout(type, deleting ? 55 : 90);
};
type();
