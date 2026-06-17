(function () {
  "use strict";

  if (window.__cmPulizieChatbotLoaded) return;
  window.__cmPulizieChatbotLoaded = true;

  const CONFIG_URL = "data/chatbot-config.json";
  const EMERGENCY_MESSAGE = "Al momento alcune risposte automatiche non sono disponibili. Puoi usare il modulo preventivo o contattare CM Pulizie su WhatsApp.";
  const DEFAULT_WHATSAPP_MESSAGE = "Buongiorno, vorrei ricevere informazioni sui servizi di C.M. Pulizie.";
  const SIGNIFICANT_SINGLE_WORDS = new Set([
    "appartamento",
    "appartamenti",
    "casa",
    "condominio",
    "condomini",
    "contatti",
    "costo",
    "disinfestazione",
    "giardinaggio",
    "napoli",
    "prezzo",
    "preventivo",
    "sanificazione",
    "ufficio",
    "uffici",
    "vomero",
    "whatsapp"
  ]);
  const STOP_WORDS = new Set([
    "anche",
    "avrei",
    "ciao",
    "come",
    "cosa",
    "della",
    "delle",
    "dello",
    "devo",
    "fare",
    "fate",
    "info",
    "informazioni",
    "per",
    "posso",
    "potete",
    "sono",
    "una",
    "uno",
    "vorrei"
  ]);

  const FALLBACK_CONFIG = {
    assistant: {
      name: "Assistente CM Pulizie",
      welcomeMessage: "Ciao, sono l'assistente virtuale di CM Pulizie. Posso aiutarti a scegliere il servizio giusto o a richiedere un preventivo.",
      fallbackMessage: "Non sono riuscito a capire bene la richiesta. Posso aiutarti con i servizi, le zone coperte o il preventivo. In alternativa puoi parlare direttamente con CM Pulizie su WhatsApp.",
      typingMessage: "Sto scrivendo..."
    },
    company: {
      name: "CM Pulizie",
      phone: "3383861399",
      whatsappUrl: "https://wa.me/393383861399",
      quotePage: "prenota.html",
      servicesPage: "servizi.html",
      privacyPage: "privacy.html"
    },
    ui: {
      buttonLabel: "Hai bisogno di aiuto?",
      showOnPages: ["index.html", "servizi.html", "prenota.html"],
      hideOnPages: ["admin.html"]
    },
    behavior: {
      maximumMessageLength: 300
    },
    privacy: {
      message: "Non inserire dati sensibili nella chat. Per inviare nome, telefono ed email utilizza il modulo preventivo."
    },
    quickActions: [
      { id: "services", label: "Scopri i servizi", type: "message", value: "Quali servizi offrite?" },
      { id: "choose-service", label: "Aiutami a scegliere", type: "flow", value: "service-selector" },
      { id: "quote", label: "Richiedi preventivo", type: "link", value: "prenota.html" },
      { id: "whatsapp", label: "Scrivici su WhatsApp", type: "external-link", value: "https://wa.me/393383861399" }
    ],
    fallbackActions: [
      { id: "services", label: "Scopri i servizi", type: "message", value: "Quali servizi offrite?" },
      { id: "quote", label: "Richiedi preventivo", type: "link", value: "prenota.html" },
      { id: "whatsapp", label: "WhatsApp", type: "external-link", value: "https://wa.me/393383861399" }
    ],
    suggestedActions: {
      quote: [
        { id: "quote", label: "Apri modulo preventivo", type: "link", value: "prenota.html" },
        { id: "whatsapp", label: "WhatsApp", type: "external-link", value: "https://wa.me/393383861399" }
      ],
      whatsapp: [
        { id: "whatsapp", label: "Scrivici su WhatsApp", type: "external-link", value: "https://wa.me/393383861399" }
      ]
    },
    whatsapp: {
      message: DEFAULT_WHATSAPP_MESSAGE
    },
    serviceSelector: {
      intro: "Ti aiuto a scegliere il percorso piu adatto. Seleziona il tipo di ambiente o servizio:",
      options: [
        { label: "Condominio", description: "Per scale, androne, ascensore e spazi comuni.", url: "prenota.html?servizio=pulizia_condomini" },
        { label: "Appartamento", description: "Per pulizie ordinarie o profonde di case e appartamenti.", url: "prenota.html?servizio=pulizia_appartamenti" },
        { label: "Ufficio", description: "Per studi, postazioni, bagni e sale riunioni.", url: "prenota.html?servizio=pulizia_uffici" },
        { label: "Sanificazione", description: "Per ambienti da valutare in base alla metratura.", url: "prenota.html?servizio=sanificazione" },
        { label: "Disinfestazione", description: "Per insetti, blatte, formiche, zanzare o altri infestanti.", url: "prenota.html?servizio=disinfestazione" },
        { label: "Giardinaggio", description: "Per prato, siepi, aiuole, potature e aree verdi.", url: "prenota.html?servizio=giardinaggio" }
      ]
    },
    faqs: [
      {
        id: "services",
        keywords: ["servizi", "servizi offrite", "che servizi", "cosa fate", "sanificazione", "disinfestazione", "giardinaggio"],
        answer: "CM Pulizie offre pulizie per condomini, appartamenti e uffici, oltre a sanificazione ambienti, disinfestazione e giardinaggio.",
        actions: "quote"
      },
      {
        id: "areas",
        keywords: ["zone", "zona", "dove lavorate", "vomero", "napoli", "aree coperte"],
        answer: "CM Pulizie e operativa al Vomero e a Napoli. Per verificare la disponibilita in una zona specifica puoi inviare una richiesta o contattare il titolare su WhatsApp.",
        actions: "quote"
      },
      {
        id: "condominiums",
        keywords: ["condominio", "condomini", "pulizie condomini", "scale condominiali", "androne", "ascensore", "cortile", "garage"],
        answer: "Si. Il servizio puo comprendere scale, androni, ascensori, cortili, garage e altri spazi comuni. La stima cambia in base al numero di piani, scale, spazi presenti e frequenza richiesta.",
        actions: [{ id: "quote-condominio", label: "Preventivo condominio", type: "link", value: "prenota.html?servizio=pulizia_condomini" }]
      },
      {
        id: "apartments",
        keywords: ["appartamento", "appartamenti", "casa", "case", "pulizie appartamenti", "pulizia casa", "pulizia profonda", "balconi"],
        answer: "Si. Sono disponibili pulizie ordinarie e profonde per case e appartamenti. La stima puo considerare metratura, stanze, bagni, balconi e tipo di intervento.",
        actions: [{ id: "quote-appartamento", label: "Preventivo appartamento", type: "link", value: "prenota.html?servizio=pulizia_appartamenti" }]
      },
      {
        id: "offices",
        keywords: ["ufficio", "uffici", "pulizie uffici", "studio", "postazioni", "sale riunioni"],
        answer: "Si. CM Pulizie organizza interventi per uffici, studi e ambienti di lavoro. La stima puo considerare metratura, numero di bagni, postazioni, frequenza e orari disponibili.",
        actions: [{ id: "quote-ufficio", label: "Preventivo ufficio", type: "link", value: "prenota.html?servizio=pulizia_uffici" }]
      },
      {
        id: "sanitization",
        keywords: ["sanificazione", "sanificazioni", "sanificare", "sanificazione ambienti", "igienizzazione"],
        answer: "Si. La richiesta viene valutata in base alla metratura, al tipo di ambiente, al livello di intervento e all'urgenza.",
        actions: [{ id: "quote-sanificazione", label: "Preventivo sanificazione", type: "link", value: "prenota.html?servizio=sanificazione" }]
      },
      {
        id: "pest-control",
        keywords: ["disinfestazione", "disinfestazioni", "insetti", "blatte", "formiche", "zanzare", "infestanti"],
        answer: "Si. Per preparare una stima servono informazioni come tipo di infestante, ambiente interno o esterno, zona interessata e gravita del problema.",
        actions: [{ id: "quote-disinfestazione", label: "Preventivo disinfestazione", type: "link", value: "prenota.html?servizio=disinfestazione" }]
      },
      {
        id: "gardening",
        keywords: ["giardinaggio", "giardino", "aree verdi", "taglio erba", "prato", "siepi", "aiuole", "potatura"],
        answer: "Si. Il servizio puo comprendere cura del prato, siepi, aiuole, potature e manutenzione delle aree verdi. La stima cambia in base alla superficie e al tipo di intervento.",
        actions: [{ id: "quote-giardinaggio", label: "Preventivo giardinaggio", type: "link", value: "prenota.html?servizio=giardinaggio" }]
      },
      {
        id: "prices",
        keywords: ["quanto costa", "costo", "prezzo", "prezzi", "tariffe", "listino"],
        answer: "Il prezzo dipende dal servizio, dalle dimensioni dell'ambiente, dalla frequenza e dalle condizioni del luogo. Compila il modulo per ricevere una prima stima indicativa.",
        actions: "quote"
      },
      {
        id: "quote",
        keywords: ["preventivo", "richiedere preventivo", "prima stima", "stima indicativa", "modulo preventivo"],
        answer: "Certo. Il modulo cambia automaticamente in base al servizio scelto, cosi vengono richieste soltanto le informazioni utili per preparare una stima.",
        actions: "quote"
      },
      {
        id: "non-binding",
        keywords: ["vincolante", "non vincolante", "definitivo", "prezzo finale", "stima definitiva"],
        answer: "No. La richiesta e la prima stima non sono vincolanti. Il prezzo finale viene confermato dopo la verifica dei dettagli o un eventuale sopralluogo.",
        actions: "quote"
      },
      {
        id: "contacts",
        keywords: ["contatto", "contatti", "contattarvi", "whatsapp", "telefono", "numero", "scrivervi"],
        answer: "Puoi compilare il modulo preventivo oppure contattare CM Pulizie direttamente tramite WhatsApp.",
        actions: "whatsapp"
      },
      {
        id: "availability",
        keywords: ["disponibilita", "aperti oggi", "oggi", "domani", "orari", "appuntamento"],
        answer: "La disponibilita deve essere confermata dal titolare. Puoi inviare una richiesta di preventivo o contattare CM Pulizie su WhatsApp.",
        actions: "whatsapp"
      },
      {
        id: "booking",
        keywords: ["prenotare", "prenotazione", "appuntamento", "fissare", "confermare intervento", "prenota"],
        answer: "Puoi inviare una richiesta tramite il modulo preventivo. La disponibilita e l'appuntamento saranno confermati successivamente dal titolare.",
        actions: "quote"
      },
      {
        id: "direct-booking",
        keywords: ["prenotare in chat", "direttamente in chat", "conferma appuntamento", "confermare appuntamento", "prenotazione diretta"],
        answer: "Non posso confermare direttamente una prenotazione. Posso accompagnarti al modulo preventivo oppure metterti in contatto tramite WhatsApp.",
        actions: "quote"
      }
    ]
  };

  const state = {
    config: FALLBACK_CONFIG,
    isOpen: false,
    hasWelcomed: false,
    typingTimer: null,
    elements: {},
    configLoadFailed: false
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startChatbot, { once: true });
  } else {
    startChatbot();
  }

  async function startChatbot() {
    if (!document.body) return;

    const loaded = await loadConfig();
    state.config = normalizeConfig(loaded.config);
    state.configLoadFailed = loaded.failed;

    if (!shouldShowOnThisPage(state.config)) return;

    createWidget();
    bindEvents();
    renderQuickActions();
  }

  async function loadConfig() {
    if (window.location.protocol === "file:") {
      return { config: FALLBACK_CONFIG, failed: true };
    }

    try {
      const response = await fetch(CONFIG_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Chatbot config unavailable");
      const config = await response.json();
      return { config, failed: false };
    } catch {
      return { config: FALLBACK_CONFIG, failed: true };
    }
  }

  function normalizeConfig(config) {
    const merged = {
      ...FALLBACK_CONFIG,
      ...config,
      assistant: { ...FALLBACK_CONFIG.assistant, ...(config.assistant || {}) },
      company: { ...FALLBACK_CONFIG.company, ...(config.company || {}) },
      ui: { ...FALLBACK_CONFIG.ui, ...(config.ui || {}) },
      behavior: { ...FALLBACK_CONFIG.behavior, ...(config.behavior || {}) },
      privacy: { ...FALLBACK_CONFIG.privacy, ...(config.privacy || {}) },
      security: { ...FALLBACK_CONFIG.security, ...(config.security || {}) },
      whatsapp: { ...FALLBACK_CONFIG.whatsapp, ...(config.whatsapp || {}) }
    };

    merged.quickActions = Array.isArray(config.quickActions) ? config.quickActions : FALLBACK_CONFIG.quickActions;
    merged.fallbackActions = Array.isArray(config.fallbackActions) ? config.fallbackActions : FALLBACK_CONFIG.fallbackActions;
    merged.faqs = Array.isArray(config.faqs) ? config.faqs : FALLBACK_CONFIG.faqs;
    merged.serviceSelector = config.serviceSelector || FALLBACK_CONFIG.serviceSelector;
    merged.suggestedActions = {
      ...FALLBACK_CONFIG.suggestedActions,
      ...(config.suggestedActions || {})
    };

    return merged;
  }

  function shouldShowOnThisPage(config) {
    const page = getCurrentPageName();
    const hidden = Array.isArray(config.ui.hideOnPages) ? config.ui.hideOnPages : [];
    const shown = Array.isArray(config.ui.showOnPages) ? config.ui.showOnPages : [];

    if (hidden.includes(page)) return false;
    if (!shown.length) return true;
    return shown.includes(page);
  }

  function getCurrentPageName() {
    const page = window.location.pathname.split("/").pop();
    return page || "index.html";
  }

  function createWidget() {
    const root = document.createElement("div");
    root.className = "cm-chatbot-root";

    const panel = document.createElement("section");
    panel.className = "cm-chatbot-panel";
    panel.id = "cmChatbotPanel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "cmChatbotTitle");
    panel.hidden = true;

    const header = document.createElement("div");
    header.className = "cm-chatbot-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "cm-chatbot-title";
    const title = document.createElement("strong");
    title.id = "cmChatbotTitle";
    title.textContent = state.config.assistant.name;
    const subtitle = document.createElement("span");
    subtitle.className = "cm-chatbot-availability";
    subtitle.textContent = "Assistente virtuale disponibile";
    titleWrap.append(title, subtitle);

    const closeButton = document.createElement("button");
    closeButton.className = "cm-chatbot-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Chiudi Assistente CM Pulizie");
    closeButton.appendChild(createSvgIcon("close"));
    header.append(titleWrap, closeButton);

    const messages = document.createElement("div");
    messages.className = "cm-chatbot-messages";
    messages.setAttribute("role", "log");
    messages.setAttribute("aria-live", "polite");
    messages.setAttribute("aria-relevant", "additions text");

    const actions = document.createElement("div");
    actions.className = "cm-chatbot-actions";
    actions.setAttribute("aria-label", "Azioni rapide assistente");

    const form = document.createElement("form");
    form.className = "cm-chatbot-form";
    form.setAttribute("novalidate", "");

    const input = document.createElement("textarea");
    input.className = "cm-chatbot-input";
    input.name = "chatbotMessage";
    input.rows = 1;
    input.maxLength = getMaxMessageLength();
    input.placeholder = "Scrivi una domanda...";
    input.setAttribute("aria-label", "Scrivi una domanda all'assistente");

    const send = document.createElement("button");
    send.className = "cm-chatbot-send";
    send.type = "submit";
    send.setAttribute("aria-label", "Invia messaggio");
    send.appendChild(createSvgIcon("send"));

    const counter = document.createElement("span");
    counter.className = "cm-chatbot-counter";
    counter.textContent = `0/${getMaxMessageLength()}`;
    form.append(input, send, counter);

    const privacy = document.createElement("p");
    privacy.className = "cm-chatbot-privacy";
    privacy.textContent = state.config.privacy.message;

    panel.append(header, messages, actions, form, privacy);

    const toggleWrap = document.createElement("div");
    toggleWrap.className = "cm-chatbot-toggle-wrap";

    const toggle = document.createElement("button");
    toggle.className = "cm-chatbot-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Apri Assistente CM Pulizie");
    toggle.setAttribute("aria-controls", panel.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.appendChild(createSvgIcon("chat"));

    const status = document.createElement("span");
    status.className = "cm-chatbot-status-dot";
    status.setAttribute("aria-hidden", "true");
    toggle.appendChild(status);

    const tooltip = document.createElement("span");
    tooltip.className = "cm-chatbot-tooltip";
    tooltip.textContent = state.config.ui.buttonLabel || "Hai bisogno di aiuto?";

    toggleWrap.append(toggle, tooltip);
    root.append(panel, toggleWrap);
    document.body.appendChild(root);

    state.elements = {
      root,
      panel,
      messages,
      actions,
      form,
      input,
      send,
      closeButton,
      toggle,
      counter
    };
  }

  function bindEvents() {
    const { toggle, closeButton, form, input } = state.elements;

    toggle.addEventListener("click", () => {
      state.isOpen ? closeChat() : openChat();
    });

    closeButton.addEventListener("click", closeChat);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendUserMessage(input.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendUserMessage(input.value);
      }
    });

    input.addEventListener("input", () => {
      updateCounter();
      autoResizeInput();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.isOpen) {
        closeChat();
      }
    });
  }

  function openChat() {
    const { panel, toggle, input } = state.elements;
    state.isOpen = true;
    panel.hidden = false;
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Chiudi Assistente CM Pulizie");

    if (!state.hasWelcomed) {
      appendMessage("assistant", state.config.assistant.welcomeMessage);
      if (state.configLoadFailed) {
        appendMessage("assistant notice", EMERGENCY_MESSAGE, state.config.fallbackActions);
      }
      state.hasWelcomed = true;
    }

    window.setTimeout(() => input.focus(), 80);
  }

  function closeChat() {
    const { panel, toggle } = state.elements;
    state.isOpen = false;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri Assistente CM Pulizie");
    window.setTimeout(() => {
      if (!state.isOpen) panel.hidden = true;
    }, 190);
    toggle.focus();
  }

  function sendUserMessage(rawValue) {
    const value = String(rawValue || "").trim();
    const maxLength = getMaxMessageLength();
    if (!value) return;

    const safeValue = value.length > maxLength ? value.slice(0, maxLength) : value;
    appendMessage("user", safeValue);
    state.elements.input.value = "";
    updateCounter();
    autoResizeInput();
    respondToUser(safeValue);
  }

  function respondToUser(message) {
    clearTyping();
    showTyping();

    const delay = 460 + Math.min(360, message.length * 4);
    state.typingTimer = window.setTimeout(() => {
      clearTyping();

      const matched = findBestFaq(message);
      if (!matched) {
        appendMessage("assistant", state.config.assistant.fallbackMessage, state.config.fallbackActions);
        return;
      }

      appendMessage("assistant", matched.answer, getActions(matched.actions));
    }, delay);
  }

  function findBestFaq(message) {
    const normalizedMessage = normalizeText(message);
    const messageTokens = tokenize(normalizedMessage);
    let best = null;

    state.config.faqs.forEach((faq, index) => {
      const score = scoreFaq(faq, normalizedMessage, messageTokens);
      if (!score.significant) return;

      if (!best || score.value > best.score.value || (score.value === best.score.value && score.exact > best.score.exact)) {
        best = { faq, score, index };
      }
    });

    return best ? best.faq : null;
  }

  function scoreFaq(faq, normalizedMessage, messageTokens) {
    let value = 0;
    let exact = 0;
    let matchedTokens = 0;
    let matchedStrongSingle = false;

    const questions = Array.isArray(faq.questions) ? faq.questions : [];
    questions.forEach((question) => {
      const normalizedQuestion = normalizeText(question);
      if (!normalizedQuestion) return;
      if (normalizedQuestion === normalizedMessage) {
        value += 24;
        exact += 5;
      } else if (normalizedQuestion.length > 8 && normalizedMessage.includes(normalizedQuestion)) {
        value += 12;
        exact += 2;
      }
    });

    const keywords = Array.isArray(faq.keywords) ? faq.keywords : [];
    keywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      const keywordTokens = tokenize(normalizedKeyword);
      if (!keywordTokens.length) return;

      if (keywordTokens.length > 1 && normalizedMessage.includes(normalizedKeyword)) {
        value += 4 + keywordTokens.length;
        exact += keywordTokens.length;
        matchedTokens += keywordTokens.length;
        return;
      }

      keywordTokens.forEach((token) => {
        if (messageTokens.includes(token)) {
          value += SIGNIFICANT_SINGLE_WORDS.has(token) ? 2 : 1;
          matchedTokens += 1;
          if (SIGNIFICANT_SINGLE_WORDS.has(token)) matchedStrongSingle = true;
        }
      });
    });

    return {
      value,
      exact,
      significant: value >= 2 && (exact > 0 || matchedTokens >= 2 || matchedStrongSingle)
    };
  }

  function appendMessage(type, text, actions) {
    const message = document.createElement("div");
    message.className = `cm-chatbot-message ${type}`;
    message.textContent = text;

    const actionList = getActions(actions);
    if (actionList.length) {
      message.appendChild(createActionGroup(actionList, true));
    }

    state.elements.messages.appendChild(message);
    scrollMessagesToEnd();
    return message;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "cm-chatbot-message assistant";
    typing.dataset.typing = "true";

    const label = document.createElement("span");
    label.className = "cm-chatbot-typing";
    label.append(document.createTextNode(state.config.assistant.typingMessage || "Sto scrivendo..."));
    label.append(createTypingDot(), createTypingDot(), createTypingDot());
    typing.appendChild(label);

    state.elements.messages.appendChild(typing);
    scrollMessagesToEnd();
  }

  function createTypingDot() {
    const dot = document.createElement("span");
    dot.setAttribute("aria-hidden", "true");
    return dot;
  }

  function clearTyping() {
    if (state.typingTimer) {
      window.clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }
    state.elements.messages?.querySelectorAll("[data-typing='true']").forEach((node) => node.remove());
  }

  function renderQuickActions() {
    state.elements.actions.textContent = "";
    const actions = Array.isArray(state.config.quickActions) ? state.config.quickActions : [];
    const group = createActionGroup(actions, false);
    state.elements.actions.appendChild(group);
  }

  function createActionGroup(actions, compact) {
    const group = document.createElement("div");
    group.className = compact ? "cm-chatbot-message-actions" : "cm-chatbot-actions-inner";

    actions.forEach((action) => {
      const actionElement = createActionElement(action);
      if (actionElement) group.appendChild(actionElement);
    });

    return group;
  }

  function createActionElement(action) {
    if (!action || !action.label || !action.type) return null;

    if (action.type === "link" || action.type === "external-link") {
      const href = resolveActionUrl(action);
      if (!href) return null;

      const link = document.createElement("a");
      link.className = "cm-chatbot-action";
      link.href = href;
      link.textContent = action.label;

      if (action.type === "external-link") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      return link;
    }

    const button = document.createElement("button");
    button.className = "cm-chatbot-action";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => handleAction(action));
    return button;
  }

  function handleAction(action) {
    if (action.type === "message") {
      sendUserMessage(action.value || action.label);
      return;
    }

    if (action.type === "flow" && action.value === "service-selector") {
      appendMessage("user", action.label);
      window.setTimeout(() => appendServiceSelector(), 250);
    }
  }

  function appendServiceSelector() {
    const selector = state.config.serviceSelector || FALLBACK_CONFIG.serviceSelector;
    const message = appendMessage("assistant", selector.intro || "Scegli il servizio piu adatto:");
    const list = document.createElement("div");
    list.className = "cm-chatbot-choice-list";

    const options = Array.isArray(selector.options) ? selector.options : [];
    options.forEach((option) => {
      const href = safeUrl(option.url, false);
      if (!href) return;

      const item = document.createElement("article");
      item.className = "cm-chatbot-choice";

      const title = document.createElement("strong");
      title.textContent = option.label || "Servizio";

      const description = document.createElement("p");
      description.textContent = option.description || "";

      const link = document.createElement("a");
      link.className = "cm-chatbot-choice-link";
      link.href = href;
      link.textContent = "Apri preventivo";

      item.append(title, description, link);
      list.appendChild(item);
    });

    message.appendChild(list);
    scrollMessagesToEnd();
  }

  function getActions(actions) {
    if (!actions) return [];
    if (Array.isArray(actions)) return actions;
    if (typeof actions === "string") {
      return state.config.suggestedActions?.[actions] || [];
    }
    return [];
  }

  function resolveActionUrl(action) {
    if (action.id === "whatsapp" || action.type === "external-link") {
      return resolveWhatsappUrl(action.value);
    }

    return safeUrl(action.value, false);
  }

  function resolveWhatsappUrl(value) {
    const base = value || state.config.company.whatsappUrl || "";
    if (!base || base.includes("INSERIRE_NUMERO_WHATSAPP")) return "";

    const url = safeUrl(base, true);
    if (!url) return "";

    try {
      const parsed = new URL(url);
      if (parsed.hostname !== "wa.me" && parsed.hostname !== "api.whatsapp.com") return "";
      if (!parsed.searchParams.has("text")) {
        parsed.searchParams.set("text", state.config.whatsapp?.message || DEFAULT_WHATSAPP_MESSAGE);
      }
      return parsed.toString();
    } catch {
      return "";
    }
  }

  function safeUrl(value, external) {
    if (!value || typeof value !== "string") return "";

    try {
      const url = new URL(value, window.location.href);
      if (external) {
        return url.protocol === "https:" ? url.href : "";
      }

      if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "file:") {
        return url.href;
      }
    } catch {
      return "";
    }

    return "";
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(value) {
    return normalizeText(value)
      .split(" ")
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  }

  function updateCounter() {
    const value = state.elements.input.value || "";
    state.elements.counter.textContent = `${value.length}/${getMaxMessageLength()}`;
  }

  function autoResizeInput() {
    const input = state.elements.input;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 92)}px`;
  }

  function scrollMessagesToEnd() {
    const messages = state.elements.messages;
    messages.scrollTop = messages.scrollHeight;
  }

  function getMaxMessageLength() {
    return Number(state.config.behavior?.maximumMessageLength) || 300;
  }

  function createSvgIcon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    if (name === "chat") {
      appendSvgPath(svg, "M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H12l-4.5 4v-4A3.5 3.5 0 0 1 4 11.5v-5Z");
      appendSvgPath(svg, "M8 8h8M8 11h5");
      return svg;
    }

    if (name === "send") {
      appendSvgPath(svg, "M4 12 20 4l-5 16-3-7-8-1Z");
      appendSvgPath(svg, "m12 13 8-9");
      return svg;
    }

    appendSvgPath(svg, "M6 6l12 12M18 6 6 18");
    return svg;
  }

  function appendSvgPath(svg, d) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
  }
})();
