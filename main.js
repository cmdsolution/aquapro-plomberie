(function () {
  'use strict';

  // ========== CAROUSEL ==========
  const slides = document.querySelectorAll('.carousel-slide');
  let current = 0;
  function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
  }
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
  if (slides.length) setInterval(() => showSlide(current + 1), 5000);

  // ========== NAVBAR STICKY SHADOW ==========
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,.12)' : '0 2px 12px rgba(0,0,0,.08)';
    });
  }

  // ========== BURGER MENU ==========
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) navMenu.classList.remove('open');
    });
  }

  // ========== DROPDOWN MOBILE ==========
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        link.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  // ========== BACK TO TOP ==========
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 300));
    btt.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ========== COUNTERS ==========
  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let count = 0;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { el.textContent = target.toLocaleString('fr'); clearInterval(timer); }
      else el.textContent = Math.floor(count).toLocaleString('fr');
    }, 16);
  }

  // ========== INTERSECTION OBSERVER (fade-in + counters) ==========
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('fade-in')) {
        el.classList.add('visible');
      }
      if (el.classList.contains('counter')) {
        animateCounter(el);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in, .counter').forEach(el => io.observe(el));

  // ========== FORMULAIRE SUBMIT ==========
  ['booking-form', 'contact-form', 'booking-page-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .form-submit, .btn-primary');
      if (btn) { btn.textContent = 'Envoi en cours...'; btn.disabled = true; }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          form.style.display = 'none';
          const success = document.getElementById('form-success');
          if (success) success.style.display = 'block';
        } else {
          alert('Une erreur est survenue. Veuillez réessayer ou nous appeler directement.');
          if (btn) { btn.textContent = 'Réserver maintenant'; btn.disabled = false; }
        }
      } catch {
        alert('Erreur de connexion. Veuillez réessayer.');
        if (btn) { btn.textContent = 'Réserver maintenant'; btn.disabled = false; }
      }
    });
  });

  // ========== BULLE WHATSAPP ==========
  const whatsappNumber = "33677218787"; // Numéro sans les espaces ni +
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  
  // Création de la bulle WhatsApp si elle n'existe pas déjà
  if (!document.querySelector('.whatsapp-float')) {
    const whatsappDiv = document.createElement('a');
    whatsappDiv.className = 'whatsapp-float';
    whatsappDiv.href = whatsappUrl;
    whatsappDiv.target = '_blank';
    whatsappDiv.rel = 'noopener noreferrer';
    whatsappDiv.innerHTML = '<i class="fab fa-whatsapp"></i><span class="wa-label">WhatsApp</span>';
    whatsappDiv.setAttribute('aria-label', 'Contactez-nous sur WhatsApp');
    document.body.appendChild(whatsappDiv);
  }

  // ========== CHATBOT HYBRIDE ==========
  // Base de connaissances (questions/réponses fréquentes)
  const faqData = {
    "prix": "Nos tarifs varient selon l'intervention. Un devis gratuit vous sera fourni avant tout travail. Comptez environ 80-120€ HT pour un débouchage simple.",
    "devis": "Oui, tous nos devis sont gratuits et sans engagement. Notre technicien vous établit un devis clair avant de commencer.",
    "delai": "Pour les interventions standards, nous intervenons sous 24-48h. Pour les urgences, nous nous déplaçons dans l'heure si disponible.",
    "urgence": "Notre service d'urgence est disponible 7j/7, 24h/24 pour les vrais urgences (fuite d'eau, canalisation bouchée, etc.). Appelez notre numéro d'urgence.",
    "garantie": "Toutes nos interventions sont garanties 1 an (pièces et main d'œuvre).",
    "horaires": "Notre standard est ouvert du lundi au vendredi de 8h à 20h. Les interventions d'urgence peuvent être programmées 7j/7.",
    "contact": "Vous pouvez nous contacter par téléphone au 06 77 21 87 87, par email ou via notre formulaire de contact.",
    "paiement": "Nous acceptons les espèces, chèques et virements bancaires. Paiement à la fin de l'intervention.",
    "zone": "Nous intervenons dans toute la région parisienne (Paris, petite couronne, et jusqu'à 30km autour de Neuilly Plaisance).",
    "merci": "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊"
  };

  // Fonction pour trouver la meilleure réponse
  function getBotReply(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // Recherche par mots-clés
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('coût')) return faqData["prix"];
    if (msg.includes('devis') || msg.includes('gratuit')) return faqData["devis"];
    if (msg.includes('délai') || msg.includes('attente') || msg.includes('quand')) return faqData["delai"];
    if (msg.includes('urgence') || msg.includes('rapide') || msg.includes('vite')) return faqData["urgence"];
    if (msg.includes('garantie')) return faqData["garantie"];
    if (msg.includes('horaire') || msg.includes('ouverture')) return faqData["horaires"];
    if (msg.includes('contact') || msg.includes('joindre')) return faqData["contact"];
    if (msg.includes('paiement') || msg.includes('carte') || msg.includes('payer')) return faqData["paiement"];
    if (msg.includes('zone') || msg.includes('secteur') || msg.includes('intervention') && msg.includes('où')) return faqData["zone"];
    
    // Réponse par défaut
    return "Je suis désolé, je n'ai pas bien compris. Pour toute question précise, n'hésitez pas à nous appeler au 06 77 21 87 87 ou à remplir le formulaire de contact. Un conseiller vous répondra rapidement. 😊";
  }

  // Création du DOM du chatbot s'il n'existe pas
  if (!document.querySelector('.chatbot-float')) {
    const chatbotHTML = `
      <div class="chatbot-float">
        <div class="chatbot-toggle" id="chatbot-toggle">
          <i class="fas fa-comment-dots"></i>
          <span class="cb-label">Assistance</span>
        </div>
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <span>💬 AquaPro Assistant</span>
            <button class="chatbot-close" id="chatbot-close">&times;</button>
          </div>
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="message bot">Bonjour ! 👋 Je suis l'assistant AquaPro. Posez-moi vos questions sur nos services, tarifs, délais... Ou cliquez sur un sujet ci-dessous.</div>
          </div>
          <div class="quick-buttons" id="quick-buttons">
            <button class="quick-btn" data-question="prix">💰 Tarifs</button>
            <button class="quick-btn" data-question="devis">📄 Devis gratuit</button>
            <button class="quick-btn" data-question="delai">⏱️ Délais</button>
            <button class="quick-btn" data-question="urgence">🚨 Urgence</button>
            <button class="quick-btn" data-question="garantie">🛡️ Garantie</button>
            <button class="quick-btn" data-question="horaires">⏰ Horaires</button>
            <button class="quick-btn" data-question="zone">🗺️ Zone</button>
          </div>
          <div class="chatbot-input-area">
            <input type="text" id="chatbot-input" placeholder="Écrivez votre message...">
            <button id="chatbot-send">Envoyer</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  // Initialisation du chatbot après ajout au DOM
  setTimeout(() => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const sendBtn = document.getElementById('chatbot-send');
    const userInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const quickBtns = document.querySelectorAll('.quick-btn');

    if (!toggleBtn || !chatWindow) return;

    // Ouvrir/Fermer le chat
    const openChat = () => {
      chatWindow.classList.add('open');
    };
    const closeChat = () => {
      chatWindow.classList.remove('open');
    };
    toggleBtn.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    // Ajouter un message
    function addMessage(text, isUser) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
      msgDiv.textContent = text;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Gérer l'envoi
    function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage(text, true);
      userInput.value = '';
      // Réponse du bot (simulation d'attente)
      setTimeout(() => {
        const reply = getBotReply(text);
        addMessage(reply, false);
      }, 400);
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) {
      userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    // Boutons rapides
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const questionKey = btn.getAttribute('data-question');
        const questionText = btn.textContent.replace(/[💰📄⏱️🚨🛡️⏰🗺️]/g, '').trim();
        addMessage(questionText, true);
        setTimeout(() => {
          const reply = faqData[questionKey] || "Je n'ai pas d'information sur ce sujet. Contactez-nous directement pour plus de détails.";
          addMessage(reply, false);
        }, 300);
      });
    });
  }, 100);

  // ========== BANNIÈRE COOKIE RGPD ==========
  function initCookieBanner() {
    // Vérifier si le consentement a déjà été donné
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted' || cookieConsent === 'refused') return;

    // Créer la bannière
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <p>🍪 Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En poursuivant votre navigation, vous acceptez notre <a href="politique-de-confidentialite.html" style="color:#fff; text-decoration:underline;">politique de confidentialité</a>.</p>
      <div class="cookie-buttons">
        <button class="cookie-btn cookie-accept" id="cookie-accept">Accepter</button>
        <button class="cookie-btn cookie-refuse" id="cookie-refuse">Refuser</button>
      </div>
    `;
    document.body.appendChild(banner);

    // Afficher la bannière avec animation
    setTimeout(() => banner.classList.add('show'), 100);

    // Gestion des boutons
    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
      // Activer les cookies analytiques ici si besoin (Google Analytics, etc.)
      console.log('Cookies acceptés');
    });

    document.getElementById('cookie-refuse').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'refused');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
      console.log('Cookies refusés');
    });
  }

  initCookieBanner();

})();
