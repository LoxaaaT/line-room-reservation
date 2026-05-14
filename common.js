// common.js — LIFF init, API client, helpers (shared by all pages)

let LIFF_USER = null;

function setStatus(s) {
  const el = document.getElementById('loader');
  if (el) el.textContent = 'กำลังโหลด... [' + s + ']';
}

function withTimeout_(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout: ' + label + ' (' + ms + 'ms)')), ms))
  ]);
}

async function initLiff() {
  try {
    if (!window.CONFIG || !CONFIG.LIFF_ID || CONFIG.LIFF_ID.startsWith('PASTE_')) {
      throw new Error('Missing LIFF_ID in config.js');
    }
    setStatus('liff.init');
    await withTimeout_(liff.init({ liffId: CONFIG.LIFF_ID }), 10000, 'liff.init');
    setStatus('check login');
    if (!liff.isLoggedIn()) {
      if (liff.isInClient()) { liff.login(); return null; }
      // browser ปกติ — login จะ redirect ไป LINE
      liff.login({ redirectUri: location.href });
      return null;
    }
    setStatus('getProfile');
    const profile = await withTimeout_(liff.getProfile(), 8000, 'getProfile');
    LIFF_USER = profile;
    setStatus('liff ok');
    return profile;
  } catch (e) {
    document.body.innerHTML = '<div class="wrap"><div class="alert alert-error">LIFF init error: ' + (e.message || e) + '</div></div>';
    throw e;
  }
}

/**
 * Call backend API via POST with text/plain (simple request, no CORS preflight).
 * Backend (GAS doPost) routes by body.api.
 */
async function rpc(api, args) {
  if (!CONFIG.GAS_API_URL || CONFIG.GAS_API_URL.startsWith('PASTE_')) {
    throw new Error('Missing GAS_API_URL in config.js');
  }
  setStatus('rpc:' + api);
  const res = await withTimeout_(
    fetch(CONFIG.GAS_API_URL, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ api: api, args: args || {} })
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }),
    20000,
    'rpc:' + api
  );
  return res;
}

function $(id) { return document.getElementById(id); }
function show(el, on) { el.style.display = on ? '' : 'none'; }
function alertBox(msg, ok) {
  const div = document.createElement('div');
  div.className = 'alert ' + (ok ? 'alert-ok' : 'alert-error');
  div.textContent = msg;
  return div;
}

function qs(name) {
  const m = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function fmtDateLocal(d) {
  const z = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' + z(d.getDate())
       + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()) + ':00';
}
