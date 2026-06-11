const customerTypeInputs = document.querySelectorAll('input[name="customerType"]');

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
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = quoteForm.getAttribute("action") || "prenota.html";
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
      start: "08:00",
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
const GOOGLE_SCRIPT_WEB_APP_URL = "GOOGLE_SCRIPT_WEB_APP_URL";
const LOCAL_REQUESTS_KEY = "cmPulizieRequests";
const BUSINESS_VAT = "09749501210";
const REQUEST_STATUS_NEW = "Nuova";

if (estimateForm && serviceType) {
  applyPreventivoConfigToForm();
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
  try {
    const response = await fetch("data/preventivo-config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Configurazione preventivo non disponibile");

    const externalConfig = await response.json();
    PREVENTIVO_CONFIG = mergePreventivoConfig(externalConfig);
    SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);
    applyPreventivoConfigToForm();
  } catch {
    PREVENTIVO_CONFIG = FALLBACK_PREVENTIVO_CONFIG;
    SERVICE_CONFIG = buildServiceConfig(PREVENTIVO_CONFIG);
  }
}

function applyPreventivoConfigToForm() {
  const selected = serviceType.value;
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

function showServiceQuestions() {
  const selected = serviceType.value;

  document.querySelectorAll(".question-group").forEach((group) => {
    const active = group.dataset.service === selected;
    group.hidden = !active;
    group.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !active;
    });
  });

  if (serviceQuestions) {
    serviceQuestions.hidden = !selected;
  }
}

async function handleEstimateSubmit(event) {
  event.preventDefault();

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
    setSubmissionFeedback("Completa i dati indicati per inviare la richiesta. La stima resta indicativa e non vincolante.");
    return;
  }

  setSubmissionFeedback("Invio richiesta in corso...");

  try {
    const result = await submitQuoteRequest(technical);
    if (result?.pdfLink && pdfLink) {
      pdfLink.href = result.pdfLink;
      pdfLink.hidden = false;
    }
    setSubmissionFeedback(result?.mode === "local"
      ? "Richiesta preparata in anteprima. Configura GOOGLE_SCRIPT_WEB_APP_URL per salvarla su Google Sheet e inviare le email."
      : "Richiesta inviata correttamente. Riceverai una conferma e sarai ricontattato per i dettagli.");
  } catch {
    saveLocalRequest(technical);
    setSubmissionFeedback("Richiesta preparata. Non riesco a raggiungere l'endpoint configurato: controlla Google Apps Script nel README.");
  }
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
  const fieldNames = ["serviceType", ...GENERAL_FIELDS, "data_preferita", "orario", "note", ...activeQuestionFields];

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
  if (!isGoogleScriptConfigured()) {
    saveLocalRequest(request);
    return { mode: "local" };
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
  return GOOGLE_SCRIPT_WEB_APP_URL && GOOGLE_SCRIPT_WEB_APP_URL !== "GOOGLE_SCRIPT_WEB_APP_URL";
}

function saveLocalRequest(request) {
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
    const token = new FormData(adminForm).get("adminToken");
    setAdminFeedback("Caricamento richieste...");

    try {
      const requests = await loadAdminRequests(token);
      renderAdminRequests(requests);
      setAdminFeedback(requests.length ? "Richieste caricate." : "Nessuna richiesta trovata.");
    } catch {
      renderAdminRequests(getLocalRequests());
      setAdminFeedback("Endpoint admin non configurato o non raggiungibile. Mostro le richieste locali di prova.");
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
  try {
    return JSON.parse(localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
  } catch {
    return [];
  }
}

async function loadAdminRequests(token) {
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
    cell.textContent = "Nessuna richiesta disponibile. Configura l'endpoint protetto per leggere Google Sheet.";
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
      link.rel = "noopener";
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
    item.textContent = `+${value}`;
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
