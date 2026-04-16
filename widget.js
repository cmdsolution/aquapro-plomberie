(function() {
  'use strict';

  const PHONE = '33677218787';
  const PHONE_DISPLAY = '06.77.21.87.87';
  const WA_MSG = encodeURIComponent('Bonjour Aquapro Plombier, je souhaite un renseignement.');

  // CSS injection
  const style = document.createElement('style');
  style.textContent = `
    .wa-bubble { position: fixed; bottom: 96px; right: 24px; z-index: 9990; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .wa-tooltip { background: #fff; color: #333; font-size: .82rem; padding: 8px 14px; border-radius: 20px 20px 4px 20px; box-shadow: 0 4px 16px rgba(0,0,0,.15); white-space: nowrap; opacity: 0; transform: translateX(10px); transition: .3s; pointer-events: none; }
    .wa-bubble:hover .wa-tooltip { opacity: 1; transform: translateX(0); }
    .wa-btn { width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(37,211,102,.45); cursor: pointer; animation: waPulse 2.5s infinite; text-decoration: none; }
    .wa-btn svg { width: 30px; height: 30px; fill: #fff; }
    @keyframes waPulse { 0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,.45); } 50% { box-shadow: 0 4px 30px rgba(37,211,102,.75); } }
    .chat-launcher { position: fixed; bottom: 24px; right: 24px; z-index: 9991; width: 56px; height: 56px; background: #2f66c6; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(47,102,198,.45); border: none; transition: .3s; }
    .chat-launcher:hover { background: #1e4fa0; transform: scale(1.08); }
    .chat-launcher svg { width: 26px; height: 26px; fill: #fff; }
    .chat-launcher .chat-close { display: none; }
    .chat-launcher.open .chat-icon { display: none; }
    .chat-launcher.open .chat-close { display: block; }
    .chat-window { position: fixed; bottom: 92px; right: 24px; z-index: 9990; width: 340px; max-height: 500px; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,.18); display: flex; flex-direction: column; overflow: hidden; transform: scale(.9) translateY(20px); opacity: 0; pointer-events: none; transition: .3s cubic-bezier(.4,0,.2,1); }
    .chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    @media(max-width:400px){ .chat-window { width: calc(100vw - 32px); right: 16px; } }
    .chat-header { background: #2f66c6; color: #fff; padding: 16px 18px; display: flex; align-items: center; gap: 12px; }
    .chat-avatar { width: 38px; height: 38px; background: rgba(255,255,255,.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .chat-header-info strong { display: block; font-size: .95rem; }
    .chat-header-info span { font-size: .75rem; opacity: .8; }
    .chat-online { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-left: auto; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 14px 14px 8px; display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth; }
    .msg { max-width: 84%; padding: 10px 13px; border-radius: 12px; font-size: .84rem; line-height: 1.55; }
    .msg.bot { background: #f0f4fc; color: #333; align-self: flex-start; border-radius: 4px 12px 12px 12px; }
    .msg.user { background: #2f66c6; color: #fff; align-self: flex-end; border-radius: 12px 4px 12px 12px; }
    .chat-suggestions { padding: 6px 14px 10px; display: flex; flex-wrap: wrap; gap: 6px; }
    .chat-chip { background: #e8f0fd; color: #2f66c6; border: none; padding: 5px 12px; border-radius: 100px; font-size: .78rem; font-weight: 600; cursor: pointer; }
    .chat-chip:hover { background: #2f66c6; color: #fff; }
    .chat-input-row { display: flex; border-top: 1px solid #eef1f8; padding: 10px 12px; gap: 8px; }
    .chat-input { flex: 1; border: 1px solid #dde5f5; border-radius: 100px; padding: 9px 14px; font-size: .84rem; outline: none; }
    .chat-input:focus { border-color: #2f66c6; }
    .chat-send { width: 36px; height: 36px; background: #2f66c6; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .chat-send:hover { background: #1e4fa0; }
    .chat-send svg { width: 16px; height: 16px; fill: #fff; }
    .chat-wa-link { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 10px 14px; background: #f0f4fc; font-size: .8rem; color: #2f66c6; text-decoration: none; font-weight: 600; border-top: 1px solid #eef1f8; }
    .chat-wa-link:hover { background: #e8f0fd; }
    .cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; background: #17224d; color: rgba(255,255,255,.85); padding: 18px 24px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 -4px 24px rgba(0,0,0,.25); transform: translateY(100%); transition: transform .4s ease; }
    .cookie-banner.visible { transform: translateY(0); }
    .cookie-text { flex: 1; min-width: 220px; font-size: .84rem; }
    .cookie-text a { color: #5585d4; text-decoration: underline; }
    .cookie-btns { display: flex; gap: 10px; flex-wrap: wrap; }
    .cookie-accept { background: #2f66c6; color: #fff; border: none; padding: 10px 22px; font-weight: 700; font-size: .85rem; cursor: pointer; border-radius: 4px; }
    .cookie-accept:hover { background: #1e4fa0; }
    .cookie-refuse { background: transparent; color: rgba(255,255,255,.65); border: 1px solid rgba(255,255,255,.25); padding: 10px 22px; font-weight: 600; font-size: .85rem; cursor: pointer; border-radius: 4px; }
    .cookie-refuse:hover { border-color: rgba(255,255,255,.5); color: #fff; }
    .cookie-settings { background: transparent; color: rgba(255,255,255,.5); border: none; font-size: .78rem; cursor: pointer; text-decoration: underline; }
  `;
  document.head.appendChild(style);

  // WhatsApp bubble
  const waBubble = document.createElement('div');
  waBubble.className = 'wa-bubble';
  waBubble.innerHTML = `
    <div class="wa-tooltip">Contactez-nous sur WhatsApp</div>
    <a class="wa-btn" href="https://wa.me/${PHONE}?text=${WA_MSG}" target="_blank" rel="noopener">
      <svg viewBox="0 0 32 32"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.44-1.73A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.2 0-4.25-.6-6-1.64l-.43-.26-4.43 1.03 1.05-4.3-.28-.45A11.5 11.5 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.6c-.34-.17-2.02-.99-2.33-1.1-.32-.12-.55-.17-.78.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.68-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.32.34-1.2 1.17-1.2 2.85s1.22 3.3 1.4 3.53c.17.23 2.4 3.67 5.83 5.14.82.35 1.45.56 1.95.72.82.26 1.56.22 2.15.13.66-.1 2.02-.82 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.23-.65-.4z"/></svg>
    </a>`;
  document.body.appendChild(waBubble);

  // Chatbot
  let chatData = null;
  fetch('./chatbot-data.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => { chatData = d; })
    .catch(() => { chatData = null; });

  const chatLauncher = document.createElement('button');
  chatLauncher.className = 'chat-launcher';
  chatLauncher.innerHTML = `<svg class="chat-icon" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.92 2 11.7c0 2.8 1.44 5.28 3.69 6.93L4.5 21l3.2-1.56A10.7 10.7 0 0012 20.4c5.52 0 10-3.92 10-8.7S17.52 3 12 3z"/></svg><svg class="chat-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
  chatWindow.innerHTML = `
    <div class="chat-header"><div class="chat-avatar">🔧</div><div class="chat-header-info"><strong>Aquapro Plombier</strong><span>Assistant en ligne</span></div><div class="chat-online"></div></div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-suggestions" id="chat-suggestions"></div>
    <a class="chat-wa-link" href="https://wa.me/${PHONE}?text=${WA_MSG}" target="_blank"><svg viewBox="0 0 32 32" style="width:16px;height:16px;fill:#25D366"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.44-1.73A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.2 0-4.25-.6-6-1.64l-.43-.26-4.43 1.03 1.05-4.3-.28-.45A11.5 11.5 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5z"/></svg> Continuer sur WhatsApp</a>
    <div class="chat-input-row"><input class="chat-input" id="chat-input" type="text" placeholder="Écrivez votre question…"><button class="chat-send" id="chat-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button></div>`;

  document.body.appendChild(chatLauncher);
  document.body.appendChild(chatWindow);

  const messagesEl = document.getElementById('chat-messages');
  const suggestionsEl = document.getElementById('chat-suggestions');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  function addMsg(text, type) {
    const m = document.createElement('div');
    m.className = 'msg ' + type;
    m.textContent = text;
    messagesEl.appendChild(m);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showSuggestions(list) {
    suggestionsEl.innerHTML = '';
    list.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = s;
      btn.addEventListener('click', () => handleInput(s));
      suggestionsEl.appendChild(btn);
    });
  }

  function findAnswer(text) {
    if (!chatData) return "Je charge mes données... Réessayez dans un instant, ou appelez le " + PHONE_DISPLAY;
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const item of chatData.faq) {
      if (item.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
        return item.answer;
      }
    }
    return chatData.fallback;
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setTimeout(() => {
      const answer = findAnswer(text);
      addMsg(answer, 'bot');
      if (chatData) showSuggestions(chatData.suggestions.slice(0, 3));
    }, 400);
  }

  function initChat() {
    if (messagesEl.childElementCount > 0) return;
    addMsg("Bonjour ! Je suis l'assistant Aquapro Plombier 👋 Comment puis-je vous aider ?", 'bot');
    if (chatData) showSuggestions(chatData.suggestions);
    else setTimeout(() => { if (chatData) showSuggestions(chatData.suggestions); }, 1500);
  }

  chatLauncher.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatLauncher.classList.toggle('open');
    if (chatWindow.classList.contains('open')) initChat();
  });

  sendBtn.addEventListener('click', () => handleInput(inputEl.value));
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(inputEl.value); });

  // Cookie banner
  const COOKIE_KEY = 'aquapro_cookie_consent';
  if (!localStorage.getItem(COOKIE_KEY)) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `<div class="cookie-text">🍪 Ce site utilise des cookies pour améliorer votre expérience. <a href="politique-de-confidentialite.html">En savoir plus</a></div><div class="cookie-btns"><button class="cookie-accept" id="cookie-accept">Accepter</button><button class="cookie-refuse" id="cookie-refuse">Refuser</button></div><button class="cookie-settings" id="cookie-settings">Paramètres</button>`;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 800);
    function hideBanner(choice) { localStorage.setItem(COOKIE_KEY, choice); banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 400); }
    document.getElementById('cookie-accept').addEventListener('click', () => hideBanner('accepted'));
    document.getElementById('cookie-refuse').addEventListener('click', () => hideBanner('refused'));
    document.getElementById('cookie-settings').addEventListener('click', () => window.location.href = 'politique-de-confidentialite.html');
  }
})();