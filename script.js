const CM_CONFIG = {
  mode: "portfolio",
  businessName: "C.M. Pulizie",
  phoneNumber: "3383861399",
  secondaryPhoneNumber: "3276623190",
  whatsappNumber: "393383861399",
  whatsappMessage: "Buongiorno, vorrei ricevere informazioni sui servizi di C.M. Pulizie.",
  email: "info@c.m.puliziesrl.it",
  websiteUrl: "https://vincenzomec97-ship-it.github.io/cm-pulizie/",
  formEndpoint: "",
  googleMapsUrl: "https://maps.app.goo.gl/mdHLhVkuGk9x565KA?g_st=ic",
  googleReviewsUrl: "https://share.google/IhgWBgoqe21N4Gkul",
  googleRating: null,
  googleReviewCount: null,
  facebookUrl: "https://www.facebook.com/share/1avRifo9CY/?mibextid=wwXIfr",
  yellowPagesUrl: "https://share.google/8ZzKNl85I47vZyRSR",
  googleBusinessUrl: "https://maps.app.goo.gl/mdHLhVkuGk9x565KA?g_st=ic",
  address: "Via G. Capaldo 7",
  addressLocality: "Napoli",
  areaServed: ["Vomero", "Napoli"],
  vatNumber: "09749501210",
  operatingHours: {
    start: "07:00",
    end: "15:00"
  },
  ...(window.CM_CONFIG || {})
};

const customerTypeInputs = document.querySelectorAll('input[name="customerType"]');
const SITE_CONFIG = {
  mode: CM_CONFIG.mode || "portfolio"
};
const PORTFOLIO_DEMO_MESSAGE = "Questa \u00e8 una versione dimostrativa del progetto. La richiesta non \u00e8 stata inviata n\u00e9 salvata.";
const FORM_NOT_CONNECTED_MESSAGE = "Il modulo non \u00e8 ancora collegato all'invio online. Puoi usare il riepilogo e inviare la richiesta tramite WhatsApp.";
const QUOTE_PREFILL_KEY = "cmPulizieQuotePrefill";
const QUOTE_PREFILL_TTL = 1000 * 60 * 60 * 6;

loadSiteConfig();
applyBusinessConfigToDom();
injectStructuredData();

async function loadSiteConfig() {
  try {
    const response = await fetch("data/site-config.json");
    if (!response.ok) return;
    const config = await response.json();
    if (config && typeof config.mode === "string") {
      SITE_CONFIG.mode = config.mode;
    }
  } catch {
    // The portfolio fallback keeps the public demo safe even when opened via file://.
  }
}

function applyBusinessConfigToDom() {
  const email = String(CM_CONFIG.email || "").trim();
  if (email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.href = `mailto:${email}`;
      if (link.textContent.includes("@")) link.textContent = email;
      link.setAttribute("aria-label", "Invia email a C.M. Pulizie");
    });
  }

  const whatsappUrl = buildWhatsAppUrl(CM_CONFIG.whatsappMessage);
  if (whatsappUrl) {
    document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  const mapsUrl = String(CM_CONFIG.googleMapsUrl || CM_CONFIG.googleBusinessUrl || "").trim();
  if (mapsUrl) {
    document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.app.goo.gl"]').forEach((link) => {
      link.href = mapsUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (!link.getAttribute("aria-label")) {
        link.setAttribute("aria-label", "Apri la scheda ufficiale C.M. Pulizie su Google Maps");
      }
    });
  }

  const facebookUrl = String(CM_CONFIG.facebookUrl || "").trim();
  if (facebookUrl) {
    document.querySelectorAll('a[href*="facebook.com"]').forEach((link) => {
      link.href = facebookUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  const reviewsUrl = String(CM_CONFIG.googleReviewsUrl || "").trim();
  if (reviewsUrl) {
    document.querySelectorAll('a[data-google-reviews-link]').forEach((link) => {
      link.href = reviewsUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  const yellowPagesUrl = String(CM_CONFIG.yellowPagesUrl || "").trim();
  if (yellowPagesUrl) {
    document.querySelectorAll('a[data-yellow-pages-link]').forEach((link) => {
      link.href = yellowPagesUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }
}

function injectStructuredData() {
  const robots = document.querySelector('meta[name="robots"]')?.content || "";
  if (/noindex/i.test(robots)) return;

  const pageUrl = new URL(window.location.pathname.split("/").pop() || "index.html", CM_CONFIG.websiteUrl || window.location.href).href;
  const businessData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: CM_CONFIG.businessName,
    url: CM_CONFIG.websiteUrl,
    image: new URL("assets/logo-cm-nuovo.png", CM_CONFIG.websiteUrl || window.location.href).href,
    telephone: CM_CONFIG.phoneNumber || undefined,
    email: CM_CONFIG.email || undefined,
    vatID: CM_CONFIG.vatNumber || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: CM_CONFIG.address,
      addressLocality: CM_CONFIG.addressLocality,
      addressCountry: "IT"
    },
    areaServed: Array.isArray(CM_CONFIG.areaServed) ? CM_CONFIG.areaServed : undefined,
    sameAs: [
      CM_CONFIG.facebookUrl,
      CM_CONFIG.yellowPagesUrl
    ].filter(Boolean),
    openingHoursSpecification: CM_CONFIG.operatingHours ? [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: CM_CONFIG.operatingHours.start,
      closes: CM_CONFIG.operatingHours.end
    }] : undefined
  };

  addJsonLd("cm-business-jsonld", removeUndefined(businessData));

  if (!/index\.html$|\/$/.test(pageUrl)) {
    addJsonLd("cm-breadcrumb-jsonld", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: new URL("index.html", CM_CONFIG.websiteUrl || window.location.href).href
        },
        {
          "@type": "ListItem",
          position: 2,
          name: document.title.replace(/\s*\|\s*C\.M\. Pulizie.*$/i, ""),
          item: pageUrl
        }
      ]
    });
  }

  const faqItems = Array.from(document.querySelectorAll(".faq-list details")).map((detail) => {
    const question = detail.querySelector("summary")?.textContent?.trim();
    const answer = detail.querySelector("p")?.textContent?.trim();
    if (!question || !answer) return null;
    return {
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    };
  }).filter(Boolean);

  if (faqItems.length) {
    addJsonLd("cm-faq-jsonld", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems
    });
  }
}

function addJsonLd(id, data) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== "")
      .map(([key, entryValue]) => [key, removeUndefined(entryValue)])
  );
}

document.querySelectorAll("img").forEach((image) => {
  image.decoding = image.decoding || "async";
  if (!image.closest(".hero, .page-hero, .site-header")) {
    image.loading = image.loading || "lazy";
  }
});

customerTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) return;

    customerTypeInputs.forEach((otherInput) => {
      if (otherInput !== input) {
        otherInput.checked = false;
      }
    });
  });
});

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
  quoteForm.addEventListener("submit", handleHomeQuoteSubmit);
}

function handleHomeQuoteSubmit(event) {
  event.preventDefault();

  if (quoteForm.dataset.submitting === "true") return;

  clearHomeQuoteErrors();
  const formData = new FormData(quoteForm);
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const customerType = getSelectedCustomerType();
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    customerType,
    serviceType: String(formData.get("serviceType") || "").trim()
  };

  const errors = validateHomeQuotePayload(payload);
  if (Object.keys(errors).length) {
    renderHomeQuoteErrors(errors);
    focusFirstHomeQuoteError(errors);
    return;
  }

  saveQuotePrefill(payload);
  setQuoteFeedback("Perfetto, continuiamo con il modulo completo.", false);
  quoteForm.dataset.submitting = "true";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.textContent;
    submitButton.textContent = "Apro il preventivo...";
  }

  window.setTimeout(() => {
    window.location.href = quoteForm.getAttribute("action") || "prenota.html";
  }, 220);
}

function validateHomeQuotePayload(payload) {
  const errors = {};
  if (payload.name.length < 2) {
    errors.name = "Inserisci il nominativo.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Inserisci un indirizzo email valido.";
  }

  if (payload.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Inserisci un numero di telefono valido.";
  }

  if (!payload.customerType) {
    errors.customerType = "Seleziona azienda o privato.";
  }

  return errors;
}

function renderHomeQuoteErrors(errors) {
  setHomeFieldError("name", errors.name);
  setHomeFieldError("email", errors.email);
  setHomeFieldError("phone", errors.phone);

  const customerError = document.getElementById("homeCustomerTypeError");
  if (customerError) customerError.textContent = errors.customerType || "";

  setQuoteFeedback("Controlla i campi evidenziati prima di continuare.", false);
}

function clearHomeQuoteErrors() {
  ["name", "email", "phone"].forEach((name) => setHomeFieldError(name, ""));
  const customerError = document.getElementById("homeCustomerTypeError");
  if (customerError) customerError.textContent = "";
  setQuoteFeedback("", true);
}

function setHomeFieldError(name, message) {
  const field = quoteForm?.querySelector(`[name="${name}"]`);
  const error = document.getElementById(`home${name.charAt(0).toUpperCase()}${name.slice(1)}Error`);
  if (field) field.classList.toggle("is-invalid", Boolean(message));
  if (error) error.textContent = message || "";
}

function focusFirstHomeQuoteError(errors) {
  const firstError = Object.keys(errors)[0];
  const fieldName = firstError === "customerType" ? "customerType" : firstError;
  const field = quoteForm?.querySelector(`[name="${fieldName}"]`);
  field?.focus();
}

function getSelectedCustomerType() {
  return quoteForm?.querySelector('input[name="customerType"]:checked')?.value || "";
}

function setQuoteFeedback(message, hidden) {
  const feedback = document.getElementById("quoteFeedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = hidden || !message;
}

function saveQuotePrefill(payload) {
  const storage = getSessionStorage();
  if (!storage) return;

  const data = {
    expiresAt: Date.now() + QUOTE_PREFILL_TTL,
    data: {
      nome: payload.name,
      email: payload.email,
      telefono: payload.phone,
      tipo_cliente: payload.customerType,
      serviceType: payload.serviceType
    }
  };

  try {
    storage.setItem(QUOTE_PREFILL_KEY, JSON.stringify(data));
  } catch {
    // If sessionStorage is unavailable, the form still continues normally.
  }
}

function readQuotePrefill() {
  const storage = getSessionStorage();
  if (!storage) return null;

  try {
    const saved = JSON.parse(storage.getItem(QUOTE_PREFILL_KEY) || "null");
    if (!saved || typeof saved !== "object") return null;
    if (Number(saved.expiresAt || 0) < Date.now()) {
      removeQuotePrefill();
      return null;
    }
    return saved.data || null;
  } catch {
    removeQuotePrefill();
    return null;
  }
}

function removeQuotePrefill() {
  const storage = getSessionStorage();
  if (!storage) return;

  try {
    storage.removeItem(QUOTE_PREFILL_KEY);
  } catch {
    // Nothing to clean up when storage is blocked.
  }
}

function getSessionStorage() {
  try {
    const storage = window.sessionStorage;
    const testKey = "__cm_pulizie_storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

const navToggle = document.querySelector(".nav-toggle");
const mainMenu = document.querySelector(".main-menu");

if (navToggle && mainMenu) {
  const desktopMenuQuery = window.matchMedia("(min-width: 821px)");

  const closeMainMenu = (returnFocus = false) => {
    navToggle.classList.remove("is-open");
    mainMenu.classList.remove("is-open");
    document.body.classList.remove("nav-menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Apri menu principale");

    if (returnFocus) {
      navToggle.focus();
    }
  };

  const openMainMenu = () => {
    navToggle.classList.add("is-open");
    mainMenu.classList.add("is-open");
    document.body.classList.add("nav-menu-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Chiudi menu principale");
  };

  navToggle.addEventListener("click", () => {
    if (mainMenu.classList.contains("is-open")) {
      closeMainMenu();
    } else {
      openMainMenu();
    }
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMainMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainMenu.classList.contains("is-open")) {
      closeMainMenu(true);
    }
  });

  desktopMenuQuery.addEventListener?.("change", () => {
    if (desktopMenuQuery.matches) closeMainMenu();
  });
}

document.querySelectorAll(".page-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const feedback = form.querySelector(".form-feedback");
    if (feedback) {
      feedback.hidden = false;
    }
  });
});

const FALLBACK_PREVENTIVO_CONFIG = {
  assistant_role: "Esperto consulente commerciale per un'impresa di pulizie professionali",
  business: {
    name: "C.M. Pulizie",
    location: "Napoli",
    main_area: "Vomero",
    service_area: ["Vomero", "Napoli citt\u00e0"],
    operating_hours: {
      start: "07:00",
      end: "15:00"
    }
  },
  goal: "Aiutare i potenziali clienti a ottenere un preventivo di massima raccogliendo le informazioni corrette e guidandoli nel processo.",
  services_offered: [
    "Pulizie condomini",
    "Pulizie appartamenti",
    "Pulizie uffici",
    "Sanificazione ambienti",
    "Disinfestazione",
    "Giardinaggio"
  ],
  interaction_rules: {
    first_step: "Chiedere sempre all'utente di identificare il tipo di servizio tra quelli offerti.",
    question_strategy: "Fare solo le domande necessarie in base al servizio scelto.",
    tone: ["professionale", "cordiale", "chiaro", "orientato alla vendita"],
    missing_data_rule: "Se manca un dato essenziale, chiederlo gentilmente prima di elaborare la stima."
  },
  questions_by_service: {
    pulizia_condomini: {
      required_questions: [
        "Quanti piani ha il condominio?",
        "Quante scale ci sono?",
        "\u00c8 presente ascensore?",
        "\u00c8 presente androne?",
        "\u00c8 presente un cortile?",
        "\u00c8 presente un garage?",
        "Sono presenti vetri da pulire?",
        "Quanti giorni a settimana \u00e8 richiesto il servizio?"
      ],
      essential_fields: [
        "numero_piani",
        "numero_scale",
        "presenza_ascensore",
        "presenza_androne",
        "presenza_cortile",
        "presenza_garage",
        "presenza_vetri",
        "giorni_settimana"
      ]
    },
    pulizia_appartamenti: {
      required_questions: [
        "Quanti metri quadri \u00e8 l'appartamento?",
        "Quante stanze ci sono?",
        "Quanti bagni ci sono?",
        "Serve una pulizia ordinaria o profonda?",
        "Il livello di sporcizia \u00e8 basso, medio o alto?"
      ],
      essential_fields: ["metri_quadri", "numero_stanze", "numero_bagni", "tipo_pulizia", "livello_sporcizia"]
    },
    pulizia_uffici: {
      required_questions: [
        "Quanti metri quadri \u00e8 l'ufficio?",
        "Quanti bagni ci sono?",
        "Quante stanze o postazioni ci sono?",
        "Quanti giorni a settimana \u00e8 richiesto il servizio?",
        "Ci sono orari preferiti?"
      ],
      essential_fields: ["metri_quadri", "numero_bagni", "numero_stanze_o_postazioni", "giorni_settimana", "orari_preferiti"]
    },
    sanificazione: {
      required_questions: [
        "Quanti metri quadri totali bisogna sanificare?",
        "Che tipo di ambiente bisogna sanificare?",
        "Che livello di intervento serve?",
        "Quanto \u00e8 urgente?"
      ],
      essential_fields: ["metri_quadri_totali", "tipo_ambiente", "livello_intervento", "urgenza"]
    },
    disinfestazione: {
      required_questions: [
        "Che tipo di infestante ha riscontrato?",
        "Quale zona \u00e8 interessata?",
        "Il problema \u00e8 interno o esterno?",
        "Quanto \u00e8 grave il problema?"
      ],
      essential_fields: ["tipo_infestante", "zona_interessata", "interno_esterno", "gravita_problema"]
    },
    giardinaggio: {
      required_questions: [
        "Quanto \u00e8 grande circa l'area verde?",
        "Che tipo di intervento serve?",
        "Sono presenti siepi?",
        "Sono presenti prato o aiuole?",
        "Serve potatura?",
        "Con quale frequenza serve il servizio?"
      ],
      essential_fields: ["metratura_area_verde", "tipo_intervento_giardino", "presenza_siepi", "presenza_prato", "potatura", "frequenza_giardino"]
    }
  },
  critical_constraints: {
    never_give_final_price: true,
    always_use_disclaimer: "Questa \u00e8 una stima indicativa basata sui dati forniti, il preventivo finale sar\u00e0 confermato dopo sopralluogo tecnico.",
    ask_missing_essential_data_before_estimate: true,
    automatic_sending: true,
    human_review_required: true
  },
  estimate_output_format: {
    service_type: "tipo_servizio_scelto",
    collected_data: {},
    missing_data: [],
    indicative_estimate: {
      price_range: "fascia indicativa",
      notes: "eventuali elementi che possono modificare il prezzo"
    },
    mandatory_disclaimer: "Questa \u00e8 una stima indicativa basata sui dati forniti, il preventivo finale sar\u00e0 confermato dopo sopralluogo tecnico.",
    status: "Nuova"
  },
  first_message_to_user: "Buongiorno, certo. Per aiutarla al meglio con un preventivo di massima, mi dica prima quale servizio le interessa tra: pulizie condomini, pulizie appartamenti, pulizie uffici, sanificazione ambienti, disinfestazione o giardinaggio."
};

const SERVICE_LABELS = {
  pulizia_condomini: "Pulizie condomini",
  pulizia_appartamenti: "Pulizie appartamenti",
  pulizia_uffici: "Pulizie uffici",
  sanificazione: "Sanificazione ambienti",
  disinfestazione: "Disinfestazione",
  giardinaggio: "Giardinaggio"
};

const SERVICE_URL_ALIASES = {
  condominio: "pulizia_condomini",
  condomini: "pulizia_condomini",
  pulizia_condomini: "pulizia_condomini",
  appartamento: "pulizia_appartamenti",
  appartamenti: "pulizia_appartamenti",
  pulizia_appartamenti: "pulizia_appartamenti",
  ufficio: "pulizia_uffici",
  uffici: "pulizia_uffici",
  pulizia_uffici: "pulizia_uffici",
  sanificazione: "sanificazione",
  sanificazione_ambienti: "sanificazione",
  disinfestazione: "disinfestazione",
  giardinaggio: "giardinaggio"
};

const SERVICE_RULES = {
  pulizia_condomini: {
    calculate(data) {
      const piani = numberValue(data.numero_piani);
      const scale = numberValue(data.numero_scale);
      const giorni = numberValue(data.giorni_settimana);
      const optional =
        yesNoCost(data.presenza_ascensore, 35) +
        yesNoCost(data.presenza_androne, 25) +
        yesNoCost(data.presenza_garage, 45) +
        yesNoCost(data.presenza_vetri, 35) +
        yesNoCost(data.presenza_cortile, 45);
      const base = 95 + piani * 28 + Math.max(scale, 1) * 45 + giorni * 65 + optional;
      return rangeFromBase(base, 0.18, "mensile indicativa");
    }
  },
  pulizia_appartamenti: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri);
      const stanze = numberValue(data.numero_stanze);
      const bagni = numberValue(data.numero_bagni);
      const dirtMultiplier = { basso: 1, medio: 1.25, alto: 1.55 }[data.livello_sporcizia] || 1;
      const typeMultiplier = { ordinaria: 1, profonda: 1.35 }[data.tipo_pulizia] || 1;
      const balconies = yesNoCost(data.presenza_balconi, 25);
      const base = (45 + mq * 1.35 + stanze * 8 + bagni * 18 + balconies) * dirtMultiplier * typeMultiplier;
      return rangeFromBase(base, 0.2, "indicativa per intervento");
    }
  },
  pulizia_uffici: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri);
      const bagni = numberValue(data.numero_bagni);
      const postazioni = numberValue(data.numero_stanze_o_postazioni);
      const giorni = numberValue(data.giorni_settimana);
      const orarioExtra = String(data.orari_preferiti || "").toLowerCase().includes("sera") ? 45 : 0;
      const base = 90 + mq * 0.85 + bagni * 20 + postazioni * 5 + giorni * 58 + orarioExtra;
      return rangeFromBase(base, 0.18, "mensile indicativa");
    }
  },
  sanificazione: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri_totali);
      const level = { ordinario: 1, approfondito: 1.3, urgente: 1.45 }[data.livello_intervento] || 1;
      const urgency = { bassa: 0, media: 25, alta: 45 }[data.urgenza] || 0;
      const base = Math.max(80, (45 + mq * 1.45) * level + urgency);
      return rangeFromBase(base, 0.18, "indicativa per intervento");
    }
  },
  disinfestazione: {
    calculate(data) {
      const problemCost = {
        insetti: 25,
        blatte: 55,
        formiche: 30,
        zanzare: 45,
        altro: 60
      }[data.tipo_infestante] || 0;
      const areaCost = String(data.interno_esterno || "").includes("esterno") ? 35 : 15;
      const severity = { bassa: 0, media: 35, alta: 70 }[data.gravita_problema] || 0;
      const base = Math.max(90, 75 + problemCost + areaCost + severity);
      return rangeFromBase(base, 0.22, "indicativa per intervento");
    }
  },
  giardinaggio: {
    calculate(data) {
      const area = numberValue(data.metratura_area_verde);
      const text = `${data.tipo_intervento_giardino}`.toLowerCase();
      const potatura = yesNoCost(data.potatura, 45);
      const siepi = yesNoCost(data.presenza_siepi, 35);
      const prato = yesNoCost(data.presenza_prato, 25);
      const pulizia = text.includes("pulizia") ? 25 : 0;
      const frequency = { settimanale: 40, mensile: 20, stagionale: 15 }[data.frequenza_giardino] || 0;
      const base = 65 + (area ? area * 0.9 : 90) + potatura + siepi + prato + pulizia + frequency;
      return rangeFromBase(base, 0.24, "indicativa per intervento");
    }
  }
};

const GENERAL_FIELDS = ["nome", "telefono", "email", "zona", "frequenza"];
const GENERAL_FIELD_LABELS = {
  serviceType: "tipo servizio scelto",
  tipo_cliente: "tipo cliente",
  nome: "nome",
  telefono: "telefono",
  email: "email",
  zona: "zona",
  frequenza: "frequenza del servizio",
  data_preferita: "data preferita",
  orario: "preferenza oraria",
  note: "note sull'intervento",
  privacy: "accettazione informativa privacy"
};

let PREVENTIVO_CONFIG = FALLBACK_PREVENTIVO_CONFIG;
let SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);

const estimateForm = document.getElementById("estimateForm");
const serviceType = document.getElementById("serviceType");
const serviceQuestions = document.getElementById("serviceQuestions");
const output = document.getElementById("estimateOutput");
const manualReview = document.getElementById("manualReview");
const copyMessage = document.getElementById("copyMessage");
const clientMessage = document.getElementById("clientMessage");
const submissionFeedback = document.getElementById("submissionFeedback");
const requestSummary = document.getElementById("requestSummary");
const pdfLink = document.getElementById("pdfLink");
const whatsappFallback = document.getElementById("whatsappFallback");
const GOOGLE_SCRIPT_WEB_APP_URL = String(CM_CONFIG.formEndpoint || "").trim();
const LOCAL_REQUESTS_KEY = "cmPulizieRequests";
const BUSINESS_VAT = CM_CONFIG.vatNumber || "09749501210";
const REQUEST_STATUS_NEW = "Nuova";
const serviceQuestionGroups = new Map();

if (estimateForm && serviceType) {
  initServiceQuestionGroups();
  applyPreventivoConfigToForm();
  applyHomepagePrefill();
  applyServiceFromUrlParameter();
  loadPreventivoConfig();
  serviceType.addEventListener("change", showServiceQuestions);
  estimateForm.addEventListener("submit", handleEstimateSubmit);
  estimateForm.addEventListener("reset", () => {
    setTimeout(() => {
      showServiceQuestions();
      if (output) output.hidden = true;
      if (manualReview) manualReview.checked = false;
      if (copyMessage) copyMessage.disabled = true;
    }, 0);
  });
}

if (manualReview && copyMessage) {
  manualReview.addEventListener("change", () => {
    copyMessage.disabled = !manualReview.checked;
  });
}

if (copyMessage && clientMessage) {
  copyMessage.addEventListener("click", async () => {
    if (copyMessage.disabled) return;

    try {
      await navigator.clipboard.writeText(clientMessage.value);
      copyMessage.textContent = "Messaggio copiato";
      setTimeout(() => {
        copyMessage.textContent = "Copia messaggio";
      }, 1600);
    } catch {
      clientMessage.select();
      document.execCommand("copy");
    }
  });
}

async function loadPreventivoConfig() {
  if (window.location.protocol === "file:") {
    PREVENTIVO_CONFIG = FALLBACK_PREVENTIVO_CONFIG;
    SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);
    applyPreventivoConfigToForm();
    applyHomepagePrefill();
    applyServiceFromUrlParameter();
    showServiceQuestions();
    return;
  }

  try {
    const response = await fetch("data/preventivo-config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Configurazione preventivo non disponibile");

    const externalConfig = await response.json();
    PREVENTIVO_CONFIG = mergePreventivoConfig(externalConfig);
    SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);
    applyPreventivoConfigToForm();
    applyHomepagePrefill();
    applyServiceFromUrlParameter();
  } catch {
    PREVENTIVO_CONFIG = FALLBACK_PREVENTIVO_CONFIG;
    SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);
    applyPreventivoConfigToForm();
    applyHomepagePrefill();
    applyServiceFromUrlParameter();
  }
}

function applyPreventivoConfigToForm() {
  const selected = serviceType.value || getServiceFromUrlParameter();
  const services = getConfiguredServiceKeys();
  serviceType.innerHTML = '<option value="">Scegli un servizio</option>';

  services.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = SERVICE_CONFIG[key].label;
    serviceType.appendChild(option);
  });

  if (selected && SERVICE_CONFIG[selected]) {
    serviceType.value = selected;
  }

  showServiceQuestions();
}

function applyServiceFromUrlParameter() {
  const serviceFromUrl = getServiceFromUrlParameter();
  if (!serviceFromUrl || !SERVICE_CONFIG[serviceFromUrl]) return;

  serviceType.value = serviceFromUrl;
  showServiceQuestions();
}

function applyHomepagePrefill() {
  if (!estimateForm) return;

  const prefill = readQuotePrefill();
  if (!prefill) return;

  Object.entries({
    nome: prefill.nome,
    email: prefill.email,
    telefono: prefill.telefono,
    tipo_cliente: prefill.tipo_cliente
  }).forEach(([name, value]) => {
    const field = estimateForm.querySelector(`[name="${name}"]`);
    if (field && value) field.value = value;
  });

  if (prefill.serviceType && SERVICE_CONFIG[prefill.serviceType] && !getServiceFromUrlParameter()) {
    serviceType.value = prefill.serviceType;
    showServiceQuestions();
  }
}

function getServiceFromUrlParameter() {
  const params = new URLSearchParams(window.location.search);
  const rawService = params.get("servizio") || params.get("service");
  if (!rawService) return "";

  const normalized = normalizeServiceKey(rawService);
  return SERVICE_URL_ALIASES[normalized] || "";
}

function mergePreventivoConfig(config) {
  const business = config.business || {};
  const fallbackBusiness = FALLBACK_PREVENTIVO_CONFIG.business;
  const estimateFormat = config.estimate_output_format || {};
  const fallbackFormat = FALLBACK_PREVENTIVO_CONFIG.estimate_output_format;

  return {
    ...FALLBACK_PREVENTIVO_CONFIG,
    ...config,
    business: {
      ...fallbackBusiness,
      ...business,
      operating_hours: {
        ...fallbackBusiness.operating_hours,
        ...(business.operating_hours || {})
      }
    },
    interaction_rules: {
      ...FALLBACK_PREVENTIVO_CONFIG.interaction_rules,
      ...(config.interaction_rules || {})
    },
    questions_by_service: {
      ...FALLBACK_PREVENTIVO_CONFIG.questions_by_service,
      ...(config.questions_by_service || {})
    },
    critical_constraints: {
      ...FALLBACK_PREVENTIVO_CONFIG.critical_constraints,
      ...(config.critical_constraints || {})
    },
    estimate_output_format: {
      ...fallbackFormat,
      ...estimateFormat,
      indicative_estimate: {
        ...fallbackFormat.indicative_estimate,
        ...(estimateFormat.indicative_estimate || {})
      }
    }
  };
}

function buildServiceConfig(config) {
  const questions = config.questions_by_service || {};
  const keys = Object.keys(questions).filter((key) => SERVICE_RULES[key]);
  const serviceKeys = keys.length ? keys : Object.keys(SERVICE_RULES);

  return serviceKeys.reduce((services, key) => {
    services[key] = {
      ...SERVICE_RULES[key],
      label: deriveServiceLabel(key, config),
      fields: Array.isArray(questions[key]?.essential_fields)
        ? questions[key].essential_fields
        : FALLBACK_PREVENTIVO_CONFIG.questions_by_service[key].essential_fields
    };
    return services;
  }, {});
}

function getConfiguredServiceKeys() {
  return Object.keys(SERVICE_CONFIG);
}

function deriveServiceLabel(key, config) {
  const offered = Array.isArray(config.services_offered) ? config.services_offered : [];
  return offered.find((label) => normalizeServiceKey(label) === key) || SERVICE_LABELS[key] || key.replace(/_/g, " ");
}

function normalizeServiceKey(label) {
  return String(label)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function initServiceQuestionGroups() {
  if (!serviceQuestions) return;

  serviceQuestions.querySelectorAll(".question-group").forEach((group) => {
    serviceQuestionGroups.set(group.dataset.service, group);
    setQuestionGroupActive(group, false);
    group.remove();
  });
}

function setQuestionGroupActive(group, active) {
  group.hidden = !active;
  group.querySelectorAll("input, select, textarea").forEach((field) => {
    field.disabled = !active;
  });
}

function clearQuestionGroup(group) {
  group.querySelectorAll("input, select, textarea").forEach((field) => {
    if (field.type === "checkbox" || field.type === "radio") {
      field.checked = false;
    } else {
      field.value = "";
    }
  });
}

function showServiceQuestions() {
  const selected = serviceType.value;

  Array.from(serviceQuestions?.querySelectorAll(".question-group") || []).forEach((group) => {
    if (group.dataset.service !== selected) {
      setQuestionGroupActive(group, false);
      clearQuestionGroup(group);
      group.remove();
    }
  });

  if (serviceQuestions) {
    serviceQuestions.hidden = !selected;
  }

  if (!selected || !serviceQuestions) return;

  const activeGroup = serviceQuestionGroups.get(selected);
  if (!activeGroup) {
    serviceQuestions.hidden = true;
    return;
  }

  if (!activeGroup.isConnected) {
    serviceQuestions.appendChild(activeGroup);
  }

  setQuestionGroupActive(activeGroup, true);
}

async function handleEstimateSubmit(event) {
  event.preventDefault();
  if (estimateForm.dataset.submitting === "true") return;

  const formData = new FormData(estimateForm);
  const data = Object.fromEntries(formData.entries());
  const selected = data.serviceType;
  const service = SERVICE_CONFIG[selected];
  const missing = [];
  const privacyAccepted = estimateForm.querySelector('[name="privacy"]')?.checked === true;

  setSubmissionFeedback("", true);

  if (!selected) {
    missing.push("tipo di servizio");
  }

  GENERAL_FIELDS.forEach((name) => {
    if (!isFilled(data[name])) missing.push(labelForField(name));
  });

  if (service) {
    service.fields.forEach((name) => {
      if (!isFilled(data[name])) missing.push(labelForField(name));
    });
  }

  if (!privacyAccepted) {
    missing.push("accettazione informativa privacy");
  }

  const collected = collectFilledData(data, service);
  const range = missing.length || !service
    ? "Da stimare dopo i dati mancanti"
    : service.calculate(data);
  const requestId = createRequestId();
  const submittedAt = new Date().toISOString();
  const message = buildClientMessage({ data, service, missing, range, requestId });
  const technical = buildTechnicalJson({ data, service, missing, range, collected, requestId, submittedAt });

  renderEstimate({ data, service, missing, collected, range, message, technical });

  if (missing.length) {
    if (whatsappFallback) {
      whatsappFallback.hidden = true;
      whatsappFallback.removeAttribute("href");
    }
    setSubmissionFeedback("Completa i dati indicati per inviare la richiesta. La stima resta indicativa e non vincolante.");
    return;
  }

  setSubmissionFeedback("Richiesta pronta. Premi il pulsante qui sotto per inviarla realmente tramite WhatsApp.");
}

function renderEstimate({ data, service, missing, collected, range, message, technical }) {
  document.getElementById("serviceOutput").textContent = service ? service.label : "Da indicare";
  document.getElementById("zoneOutput").textContent = data.zona || "Da indicare";
  document.getElementById("rangeOutput").textContent = range;
  document.getElementById("clientMessage").value = message;
  if (requestSummary) requestSummary.textContent = buildReadableRequestSummary(technical);

  const requestIdOutput = document.getElementById("requestIdOutput");
  if (requestIdOutput) requestIdOutput.textContent = technical.id;
  if (pdfLink) {
    pdfLink.hidden = true;
    pdfLink.removeAttribute("href");
  }
  updateWhatsAppFallbackLink(message);

  renderList(document.getElementById("collectedOutput"), collected.map((item) => `${item.label}: ${item.value}`));
  renderList(
    document.getElementById("missingOutput"),
    missing.length ? missing.map((item) => `Per preparare la stima serve anche: ${item}.`) : ["Nessun dato essenziale mancante."]
  );

  if (manualReview) manualReview.checked = false;
  if (copyMessage) copyMessage.disabled = true;
  if (output) {
    output.hidden = false;
    output.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateWhatsAppFallbackLink(message) {
  if (!whatsappFallback) return;

  const url = buildWhatsAppUrl(message);
  if (!url) {
    whatsappFallback.hidden = true;
    whatsappFallback.removeAttribute("href");
    return;
  }

  whatsappFallback.href = url;
  whatsappFallback.hidden = false;
}

function buildClientMessage({ data, service, missing, range, requestId }) {
  const greeting = data.nome ? `Ciao ${data.nome},` : "Ciao,";
  const operationSentence = getOperationSentence();
  const notice = getEstimateNotice();

  if (missing.length) {
    return `${greeting}

per preparare una prima stima corretta per ${service ? service.label : "il servizio richiesto"} servono ancora questi dati:
${missing.map((item) => `- ${item}`).join("\n")}

${operationSentence}.

${notice}`;
  }

  return `${greeting}

abbiamo preparato il riepilogo della tua richiesta di preventivo.

Numero richiesta: ${requestId}
Servizio: ${service.label}
Zona: ${data.zona}
Frequenza: ${data.frequenza}
Data preferita: ${data.data_preferita || "da concordare"}
Fascia stimata: ${range}

${operationSentence}.

Ti ricontatteremo per confermare prezzo, disponibilit\u00e0 e dettagli dell'intervento.
La richiesta non \u00e8 vincolante.

${notice}`;
}

function buildTechnicalJson({ data, service, missing, range, collected, requestId, submittedAt }) {
  const serviceDetails = collectServiceDetails(data);

  return {
    id: requestId,
    submitted_at: submittedAt,
    assistant_role: PREVENTIVO_CONFIG.assistant_role,
    business: PREVENTIVO_CONFIG.business,
    goal: PREVENTIVO_CONFIG.goal,
    partita_iva: BUSINESS_VAT,
    status: REQUEST_STATUS_NEW,
    service_key: data.serviceType || null,
    service_type: service ? service.label : null,
    tipo_cliente: data.tipo_cliente || null,
    zona: data.zona || null,
    nome: data.nome || null,
    telefono: data.telefono || null,
    email: data.email || null,
    frequenza: data.frequenza || null,
    data_preferita: data.data_preferita || null,
    note: data.note || null,
    collected_data: collected,
    service_details: serviceDetails,
    missing_data: missing,
    indicative_estimate: {
      price_range: range,
      notes: missing.length
        ? "La stima resta sospesa finch\u00e9 non vengono raccolti tutti i dati essenziali."
        : "Fascia indicativa da confermare dopo sopralluogo tecnico."
    },
    importo_stimato: range,
    mandatory_disclaimer: getEstimateNotice(),
    critical_constraints: PREVENTIVO_CONFIG.critical_constraints,
    pdf_link: "",
    payload: data
  };
}

function collectFilledData(data, service) {
  const activeQuestionFields = Array.from(estimateForm.querySelectorAll('.question-group:not([hidden]) [name]')).map((field) => field.name);
  const fieldNames = ["serviceType", "tipo_cliente", ...GENERAL_FIELDS, "data_preferita", "orario", "note", ...activeQuestionFields];

  return [...new Set(fieldNames)]
    .filter((name) => isFilled(data[name]))
    .map((name) => ({
      campo: name,
      label: name === "serviceType" ? "tipo servizio scelto" : labelForField(name),
      value: name === "serviceType" && SERVICE_CONFIG[data[name]] ? SERVICE_CONFIG[data[name]].label : data[name]
    }));
}

function collectServiceDetails(data) {
  return Array.from(estimateForm.querySelectorAll('.question-group:not([hidden]) [name]'))
    .filter((field) => isFilled(data[field.name]))
    .map((field) => ({
      campo: field.name,
      label: labelForField(field.name),
      value: data[field.name]
    }));
}

function buildReadableRequestSummary(request) {
  const serviceLines = request.service_details.length
    ? request.service_details.map((item) => `- ${item.label}: ${item.value}`).join("\n")
    : "- Nessun dettaglio specifico inserito";

  return `Numero richiesta: ${request.id}
Data invio: ${formatDateTime(request.submitted_at)}
Nome: ${request.nome || "-"}
Telefono: ${request.telefono || "-"}
Email: ${request.email || "-"}
Zona: ${request.zona || "-"}
Servizio: ${request.service_type || "-"}
Frequenza: ${request.frequenza || "-"}
Data preferita: ${request.data_preferita || "da concordare"}
Fascia stimata: ${request.indicative_estimate.price_range}

Dettagli servizio:
${serviceLines}

Note: ${request.note || "-"}

${request.mandatory_disclaimer}`;
}

async function submitQuoteRequest(request) {
  if (isPortfolioMode()) {
    return { mode: "portfolio" };
  }

  if (!isGoogleScriptConfigured()) {
    return { mode: "not_configured" };
  }

  const response = await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "createRequest",
      request
    })
  });

  if (!response.ok) {
    throw new Error("Invio richiesta non riuscito");
  }

  const result = await response.json().catch(() => ({}));
  saveLocalRequest({ ...request, pdf_link: result.pdfLink || request.pdf_link });
  return {
    mode: "remote",
    pdfLink: result.pdfLink || ""
  };
}

function isGoogleScriptConfigured() {
  return Boolean(GOOGLE_SCRIPT_WEB_APP_URL);
}

function isPortfolioMode() {
  return SITE_CONFIG.mode === "portfolio";
}

function saveLocalRequest(request) {
  if (isPortfolioMode() || !CM_CONFIG.enableLocalRequestStorage) return;

  try {
    const current = JSON.parse(localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
    const withoutDuplicate = current.filter((item) => item.id !== request.id);
    withoutDuplicate.unshift(request);
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(withoutDuplicate.slice(0, 80)));
  } catch {
    // Local storage is only a development fallback.
  }
}

function createRequestId() {
  const date = new Date();
  const day = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CMP-${day}-${random}`;
}

function setSubmissionFeedback(message, hidden = false) {
  if (!submissionFeedback) return;
  submissionFeedback.textContent = message;
  submissionFeedback.hidden = hidden || !message;
}

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function renderList(list, items) {
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function labelForField(name) {
  const field = estimateForm?.querySelector(`[name="${name}"]:not(:disabled)`) || estimateForm?.querySelector(`[name="${name}"]`);
  return field?.dataset?.label || GENERAL_FIELD_LABELS[name] || name.replace(/_/g, " ");
}

function isFilled(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function numberValue(value) {
  return Number(String(value || "0").replace(",", ".")) || 0;
}

function normalizePhoneForWhatsApp(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("39") ? digits : `39${digits}`;
}

function buildWhatsAppUrl(message) {
  const phone = normalizePhoneForWhatsApp(CM_CONFIG.whatsappNumber || CM_CONFIG.phoneNumber);
  if (!phone) return "";

  const text = encodeURIComponent(message || CM_CONFIG.whatsappMessage || "Ciao, vorrei ricevere informazioni da C.M. Pulizie.");
  return `https://wa.me/${phone}?text=${text}`;
}

function numberFromText(value) {
  const match = String(value || "").replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function yesNoCost(value, cost) {
  return String(value).toLowerCase() === "si" ? cost : 0;
}

function rangeFromBase(base, variance, label) {
  const low = Math.max(45, Math.round((base * (1 - variance)) / 10) * 10);
  const high = Math.max(low + 20, Math.round((base * (1 + variance)) / 10) * 10);
  return `\u20ac ${low} - \u20ac ${high} ${label}`;
}

function getEstimateNotice() {
  return PREVENTIVO_CONFIG.critical_constraints?.always_use_disclaimer
    || PREVENTIVO_CONFIG.estimate_output_format?.mandatory_disclaimer
    || FALLBACK_PREVENTIVO_CONFIG.critical_constraints.always_use_disclaimer;
}

function getEstimateStatus() {
  return PREVENTIVO_CONFIG.estimate_output_format?.status || REQUEST_STATUS_NEW;
}

function getOperationSentence() {
  const business = PREVENTIVO_CONFIG.business || FALLBACK_PREVENTIVO_CONFIG.business;
  const hours = business.operating_hours || FALLBACK_PREVENTIVO_CONFIG.business.operating_hours;
  const mainArea = business.main_area || "Vomero";
  const serviceAreas = Array.isArray(business.service_area) ? business.service_area : ["Napoli"];
  const widerAreas = serviceAreas.filter((area) => normalizeServiceKey(area) !== normalizeServiceKey(mainArea));
  const widerAreaText = widerAreas.length ? widerAreas.join(", ") : business.location || "Napoli";

  return `Operiamo principalmente in zona ${mainArea} e anche su ${widerAreaText}, con fascia operativa ${hours.start} - ${hours.end}`;
}

const adminForm = document.getElementById("adminLoadForm");
const adminFeedback = document.getElementById("adminFeedback");
const adminTableBody = document.getElementById("adminRequestsBody");
const adminDetail = document.getElementById("adminDetail");

if (adminForm && adminTableBody) {
  renderAdminRequests(getLocalRequests());

  adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isPortfolioMode()) {
      renderAdminRequests([]);
      setAdminFeedback("Versione dimostrativa: l'area admin non Ã¨ collegata a dati reali.");
      return;
    }

    const token = new FormData(adminForm).get("adminToken");
    setAdminFeedback("Caricamento richieste...");

    try {
      const requests = await loadAdminRequests(token);
      renderAdminRequests(requests);
      setAdminFeedback(requests.length ? "Richieste caricate." : "Nessuna richiesta trovata.");
    } catch {
      renderAdminRequests(getLocalRequests());
      setAdminFeedback("Area demo: nessuna richiesta reale disponibile.");
    }
  });

  adminTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const status = button.dataset.status;
    const request = getLocalRequests().find((item) => item.id === id);

    if (action === "details") {
      if (adminDetail) {
        adminDetail.hidden = false;
        adminDetail.textContent = request ? buildReadableRequestSummary(request) : "Dettagli disponibili dall'endpoint protetto.";
      }
      return;
    }

    if (action === "status" && status) {
      await updateRequestStatus(id, status, new FormData(adminForm).get("adminToken"));
      setAdminFeedback(`Stato aggiornato: ${status}`);
    }
  });
}

function getLocalRequests() {
  if (isPortfolioMode()) return [];

  try {
    return JSON.parse(localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
  } catch {
    return [];
  }
}

async function loadAdminRequests(token) {
  if (isPortfolioMode()) {
    return [];
  }

  if (!isGoogleScriptConfigured()) {
    return getLocalRequests();
  }

  const url = `${GOOGLE_SCRIPT_WEB_APP_URL}?action=listRequests&token=${encodeURIComponent(token || "")}`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) throw new Error("Admin non disponibile");
  const result = await response.json();
  return Array.isArray(result.requests) ? result.requests : [];
}

async function updateRequestStatus(id, status, token) {
  if (isPortfolioMode()) {
    setAdminFeedback("Versione dimostrativa: nessuno stato reale Ã¨ stato modificato.");
    return;
  }

  const localRequests = getLocalRequests();
  const nextRequests = localRequests.map((request) => request.id === id ? { ...request, status } : request);
  localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(nextRequests));
  renderAdminRequests(nextRequests);

  if (!isGoogleScriptConfigured()) return;

  await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "updateStatus",
      token,
      id,
      status
    })
  });
}

function renderAdminRequests(requests) {
  if (!adminTableBody) return;
  adminTableBody.innerHTML = "";

  if (!requests.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 9;
    cell.textContent = isPortfolioMode()
      ? "Versione portfolio: nessuna richiesta reale disponibile nella demo pubblica."
      : "Nessuna richiesta disponibile.";
    row.appendChild(cell);
    adminTableBody.appendChild(row);
    return;
  }

  requests.forEach((request) => {
    const row = document.createElement("tr");
    [
      formatDateTime(request.submitted_at),
      request.nome || "-",
      request.telefono || "-",
      request.email || "-",
      request.zona || "-",
      request.service_type || "-",
      request.status || REQUEST_STATUS_NEW
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const pdfCell = document.createElement("td");
    if (request.pdf_link) {
      const link = document.createElement("a");
      link.href = request.pdf_link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "PDF";
      pdfCell.appendChild(link);
    } else {
      pdfCell.textContent = "-";
    }
    row.appendChild(pdfCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "admin-actions";
    const detailButton = document.createElement("button");
    detailButton.type = "button";
    detailButton.dataset.action = "details";
    detailButton.dataset.id = request.id;
    detailButton.textContent = "Dettagli";
    actionsCell.appendChild(detailButton);

    ["Da ricontattare", "Preventivo inviato", "Confermata", "Completata"].forEach((status) => {
      const statusButton = document.createElement("button");
      statusButton.type = "button";
      statusButton.dataset.action = "status";
      statusButton.dataset.id = request.id;
      statusButton.dataset.status = status;
      statusButton.textContent = status;
      actionsCell.appendChild(statusButton);
    });

    row.appendChild(actionsCell);
    adminTableBody.appendChild(row);
  });
}

function setAdminFeedback(message) {
  if (!adminFeedback) return;
  adminFeedback.textContent = message;
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
const counterItems = document.querySelectorAll("[data-count]");

if (revealItems.length) {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

if (counterItems.length) {
  const setCounterValue = (item, value) => {
    item.textContent = `${value}+`;
  };

  const animateCounter = (item) => {
    if (item.dataset.animated === "true") return;

    item.dataset.animated = "true";
    const target = Number(item.dataset.count || "0");
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounterValue(item, Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCounterValue(item, target);
      }
    };

    requestAnimationFrame(tick);
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counterItems.forEach((item) => {
      item.dataset.animated = "true";
      setCounterValue(item, Number(item.dataset.count || "0"));
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counterItems.forEach((item) => counterObserver.observe(item));
  }
}
