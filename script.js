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
    "Pulizia condomini",
    "Pulizia appartamenti",
    "Pulizia uffici",
    "Sanificazione",
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
        "Sono presenti vetri da pulire?",
        "Com'\u00e8 l'ingresso? Piccolo, medio o grande?",
        "\u00c8 presente un cortile?",
        "Sono presenti cantinole?",
        "Quanti interventi extra al mese servono?",
        "Quante spolverature mensili servono?",
        "Quanti giorni a settimana \u00e8 richiesto il servizio?"
      ],
      essential_fields: [
        "numero_piani",
        "presenza_vetri",
        "caratteristiche_ingresso",
        "presenza_cortile",
        "presenza_cantinole",
        "interventi_extra_mensili",
        "spolverature_mensili",
        "giorni_settimana"
      ]
    },
    pulizia_appartamenti: {
      required_questions: [
        "Quanti bagni ci sono?",
        "Quanti metri quadri \u00e8 l'appartamento?",
        "Il livello di sporcizia \u00e8 basso, medio o alto?"
      ],
      essential_fields: ["numero_bagni", "metri_quadri", "livello_sporcizia"]
    },
    pulizia_uffici: {
      required_questions: [
        "Quanti metri quadri \u00e8 l'ufficio?",
        "Quanti bagni ci sono?",
        "Quante stanze o postazioni ci sono?",
        "Quanti giorni a settimana \u00e8 richiesto il servizio?"
      ],
      essential_fields: ["metri_quadri", "numero_bagni", "numero_stanze_o_postazioni", "giorni_settimana"]
    },
    sanificazione: {
      required_questions: ["Quanti metri quadri totali bisogna sanificare?"],
      essential_fields: ["metri_quadri_totali"]
    },
    disinfestazione: {
      required_questions: [
        "Quanti metri quadri totali bisogna trattare?",
        "Che tipo di problema ha riscontrato? Insetti, blatte, formiche, zanzare o altro?"
      ],
      essential_fields: ["metri_quadri_totali", "tipo_problema"]
    },
    giardinaggio: {
      required_questions: [
        "Che tipo di lavorazione serve? Taglio erba, potatura, pulizia giardino, manutenzione o altro?",
        "Quanto \u00e8 grande circa l'area verde?"
      ],
      essential_fields: ["tipo_lavorazione", "dimensione_area"]
    }
  },
  critical_constraints: {
    never_give_final_price: true,
    always_use_disclaimer: "Questa \u00e8 una stima indicativa basata sui dati forniti, il preventivo finale sar\u00e0 confermato dopo sopralluogo tecnico.",
    ask_missing_essential_data_before_estimate: true,
    automatic_sending: false,
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
    status: "da_revisionare"
  },
  first_message_to_user: "Buongiorno, certo. Per aiutarla al meglio con un preventivo di massima, mi dica prima quale servizio le interessa tra: pulizia condomini, appartamenti, uffici, sanificazione, disinfestazione o giardinaggio."
};

const SERVICE_LABELS = {
  pulizia_condomini: "Pulizia condomini",
  pulizia_appartamenti: "Pulizia appartamenti",
  pulizia_uffici: "Pulizia uffici",
  sanificazione: "Sanificazione",
  disinfestazione: "Disinfestazione",
  giardinaggio: "Giardinaggio"
};

const SERVICE_RULES = {
  pulizia_condomini: {
    calculate(data) {
      const piani = numberValue(data.numero_piani);
      const giorni = numberValue(data.giorni_settimana);
      const extra = numberValue(data.interventi_extra_mensili);
      const spolverature = numberValue(data.spolverature_mensili);
      const ingresso = { piccolo: 20, medio: 45, grande: 75 }[data.caratteristiche_ingresso] || 0;
      const optional =
        yesNoCost(data.presenza_vetri, 35) +
        yesNoCost(data.presenza_cortile, 45) +
        yesNoCost(data.presenza_cantinole, 35);
      const base = 95 + piani * 28 + giorni * 65 + extra * 30 + spolverature * 16 + ingresso + optional;
      return rangeFromBase(base, 0.18, "mensile indicativa");
    }
  },
  pulizia_appartamenti: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri);
      const bagni = numberValue(data.numero_bagni);
      const multiplier = { basso: 1, medio: 1.25, alto: 1.55 }[data.livello_sporcizia] || 1;
      const base = (45 + mq * 1.35 + bagni * 18) * multiplier;
      return rangeFromBase(base, 0.2, "indicativa per intervento");
    }
  },
  pulizia_uffici: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri);
      const bagni = numberValue(data.numero_bagni);
      const postazioni = numberValue(data.numero_stanze_o_postazioni);
      const giorni = numberValue(data.giorni_settimana);
      const base = 90 + mq * 0.85 + bagni * 20 + postazioni * 5 + giorni * 58;
      return rangeFromBase(base, 0.18, "mensile indicativa");
    }
  },
  sanificazione: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri_totali);
      const base = Math.max(80, 45 + mq * 1.45);
      return rangeFromBase(base, 0.18, "indicativa per intervento");
    }
  },
  disinfestazione: {
    calculate(data) {
      const mq = numberValue(data.metri_quadri_totali);
      const problemCost = {
        insetti: 25,
        blatte: 55,
        formiche: 30,
        zanzare: 45,
        altro: 60
      }[data.tipo_problema] || 0;
      const base = Math.max(90, 55 + mq * 1.2 + problemCost);
      return rangeFromBase(base, 0.22, "indicativa per intervento");
    }
  },
  giardinaggio: {
    calculate(data) {
      const area = numberFromText(data.dimensione_area);
      const text = `${data.tipo_lavorazione} ${data.dimensione_area}`.toLowerCase();
      const potatura = text.includes("potatura") ? 45 : 0;
      const pulizia = text.includes("pulizia") ? 25 : 0;
      const base = 65 + (area ? area * 0.9 : 90) + potatura + pulizia;
      return rangeFromBase(base, 0.24, "indicativa per intervento");
    }
  }
};

const GENERAL_FIELDS = ["nome", "telefono", "email", "zona", "orario"];
const GENERAL_FIELD_LABELS = {
  serviceType: "tipo servizio scelto",
  nome: "nome cliente",
  telefono: "telefono",
  email: "email",
  zona: "zona di Napoli",
  orario: "preferenza oraria",
  note: "note aggiuntive"
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

function handleEstimateSubmit(event) {
  event.preventDefault();

  const formData = new FormData(estimateForm);
  const data = Object.fromEntries(formData.entries());
  const selected = data.serviceType;
  const service = SERVICE_CONFIG[selected];
  const missing = [];

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

  const collected = collectFilledData(data, service);
  const range = missing.length || !service
    ? "Da stimare dopo i dati mancanti"
    : service.calculate(data);
  const message = buildClientMessage({ data, service, missing, range });
  const technical = buildTechnicalJson({ data, service, missing, range, collected });

  renderEstimate({ data, service, missing, collected, range, message, technical });
}

function renderEstimate({ data, service, missing, collected, range, message, technical }) {
  document.getElementById("serviceOutput").textContent = service ? service.label : "Da indicare";
  document.getElementById("zoneOutput").textContent = data.zona || "Da indicare";
  document.getElementById("rangeOutput").textContent = range;
  document.getElementById("clientMessage").value = message;
  document.getElementById("technicalJson").textContent = JSON.stringify(technical, null, 2);

  const status = getEstimateStatus();
  const statusOutput = document.getElementById("statusOutput");
  const statusGridOutput = document.getElementById("statusGridOutput");
  if (statusOutput) statusOutput.textContent = status;
  if (statusGridOutput) statusGridOutput.textContent = status;

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

function buildClientMessage({ data, service, missing, range }) {
  const greeting = data.nome ? `Buongiorno ${data.nome},` : "Buongiorno,";
  const operationSentence = getOperationSentence();
  const notice = getEstimateNotice();

  if (missing.length) {
    return `${greeting}

grazie per aver contattato C.M. Pulizie. Per preparare una stima indicativa corretta per ${service ? service.label : "il servizio richiesto"} ci servono ancora questi dati:
${missing.map((item) => `- ${item}`).join("\n")}

${operationSentence}.

${notice}`;
  }

  return `${greeting}

grazie per aver contattato C.M. Pulizie. In base ai dati forniti, il servizio richiesto \u00e8 ${service.label} in zona ${data.zona}.

Fascia stimata: ${range}.
Preferenza oraria indicata: ${data.orario}.

${operationSentence}.

${notice}`;
}

function buildTechnicalJson({ data, service, missing, range, collected }) {
  return {
    assistant_role: PREVENTIVO_CONFIG.assistant_role,
    business: PREVENTIVO_CONFIG.business,
    goal: PREVENTIVO_CONFIG.goal,
    service_type: service ? service.label : null,
    zona: data.zona || null,
    collected_data: collected,
    missing_data: missing,
    indicative_estimate: {
      price_range: range,
      notes: missing.length
        ? "La stima resta sospesa finch\u00e9 non vengono raccolti tutti i dati essenziali."
        : "Fascia indicativa da confermare dopo sopralluogo tecnico."
    },
    mandatory_disclaimer: getEstimateNotice(),
    status: getEstimateStatus(),
    critical_constraints: PREVENTIVO_CONFIG.critical_constraints,
    automatic_sending: PREVENTIVO_CONFIG.critical_constraints.automatic_sending === true,
    human_review_required: PREVENTIVO_CONFIG.critical_constraints.human_review_required !== false,
    payload: data
  };
}

function collectFilledData(data, service) {
  const fieldNames = ["serviceType", ...GENERAL_FIELDS, "note"];
  if (service) fieldNames.push(...service.fields);

  return fieldNames
    .filter((name) => isFilled(data[name]))
    .map((name) => ({
      campo: name,
      label: name === "serviceType" ? "tipo servizio scelto" : labelForField(name),
      value: name === "serviceType" && SERVICE_CONFIG[data[name]] ? SERVICE_CONFIG[data[name]].label : data[name]
    }));
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
  return PREVENTIVO_CONFIG.estimate_output_format?.status || "da_revisionare";
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
