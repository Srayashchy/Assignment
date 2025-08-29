let copycount = 0;
let heartCount = 0;
let coins = 100;
const historyItems = [];
function updateUI(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
function updateCounts() {
  updateUI('#heart-count, .heartCount, .heart-count', heartCount);
  updateUI('#coin-count, .coinCount, .coin-count', coins);
  updateUI('#copy-count, .copyCount, .copy-count', copycount);
}

function addHeart() {
  heartCount++;
  updateCounts();
}
function addHistoryEntry(name, number) {
  const ul = document.getElementById('history-list');
  const time = new Date().toLocaleTimeString();
  const li = document.createElement('li');
  li.className = 'history-item';
  li.innerHTML = `<div class="history-title">${escapeHtml(name)}</div>
                  <div class="history-number">${escapeHtml(number)}</div>
                  <div class="history-time">${time}</div>`;
  ul?.insertBefore(li, ul.firstChild);
  historyItems.unshift({ name, number, time });
}
function clearHistory() {
  historyItems.length = 0;
  const ul = document.getElementById('history-list');
  if (ul) ul.innerHTML = '';
}

function handleCallButton(e) {
  if (coins < 20) {
    alert('Not enough coins to make a call.');
    return;
  }
  const card = e.currentTarget.closest('.card');
  const name = card?.querySelector('h3')?.textContent.trim() ?? 'Unknown ';
  const number = card?.querySelector('.number')?.textContent.trim() ?? '';
  
  coins -= 20;
  updateCounts();
  alert(`Calling ${name} — ${number}`);
  addHistoryEntry(name, number);
}

async function handleCopyButton(e) {
  const card = e.currentTarget.closest('.card');
  const targetSelector = e.currentTarget.dataset.copyTarget ?? '.number';
  const text = card?.querySelector(targetSelector)?.textContent.trim() ?? '';
  
  if (!text) {
    alert('Nothing to copy');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    copycount++;
    updateCounts();
  } catch (err) {
    alert('Unable to copy ');
  }
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}
function init() {
  updateCounts();
  
  document.querySelectorAll('.btn.call').forEach(btn => btn.addEventListener('click', handleCallButton));
  document.querySelectorAll('.btn.copy').forEach(btn => btn.addEventListener('click', handleCopyButton));
  document.querySelector('.history-section button')?.addEventListener('click', clearHistory);
}
document.addEventListener('DOMContentLoaded', init);