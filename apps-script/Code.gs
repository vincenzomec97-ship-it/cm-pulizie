const SHEET_NAME = 'Richieste preventivo';
const TITOLARE_EMAIL = 'EMAIL_TITOLARE_DA_INSERIRE';
const ADMIN_TOKEN = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN') || 'ADMIN_AUTH_TOKEN_O_SOLUZIONE_SICURA';
const STATI_RICHIESTA = ['Nuova', 'Da ricontattare', 'Preventivo inviato', 'Confermata', 'Rifiutata', 'Completata'];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    if (payload.action === 'updateStatus') {
      return updateStatus_(payload);
    }

    if (payload.action === 'createRequest') {
      return createRequest_(payload.request || {});
    }

    return json_({ ok: false, error: 'Azione non riconosciuta' });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const token = e.parameter.token;

  if (action !== 'listRequests') {
    return json_({ ok: false, error: 'Azione non valida' });
  }

  if (!isAuthorized_(token)) {
    return json_({ ok: false, error: 'Non autorizzato' });
  }

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  const requests = values.map((row) => {
    return headers.reduce((item, header, index) => {
      item[header] = row[index];
      return item;
    }, {});
  }).reverse();

  return json_({ ok: true, requests });
}

function createRequest_(request) {
  request.id = request.id || createRequestId_();
  request.submitted_at = request.submitted_at || new Date().toISOString();
  request.status = 'Nuova';

  const pdf = createPdf_(request);
  request.pdf_link = pdf.url;

  appendRequest_(request);
  sendClientEmail_(request, pdf.blob);
  sendOwnerEmail_(request, pdf.blob);

  return json_({ ok: true, id: request.id, pdfLink: pdf.url });
}

function updateStatus_(payload) {
  if (!isAuthorized_(payload.token)) {
    return json_({ ok: false, error: 'Non autorizzato' });
  }

  if (STATI_RICHIESTA.indexOf(payload.status) === -1) {
    return json_({ ok: false, error: 'Stato non valido' });
  }

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  const statusIndex = headers.indexOf('status');

  for (let row = 1; row < values.length; row += 1) {
    if (values[row][idIndex] === payload.id) {
      sheet.getRange(row + 1, statusIndex + 1).setValue(payload.status);
      return json_({ ok: true });
    }
  }

  return json_({ ok: false, error: 'Richiesta non trovata' });
}

function appendRequest_(request) {
  const sheet = getSheet_();
  const headers = getHeaders_();
  ensureHeaders_(sheet, headers);

  const row = headers.map((header) => {
    if (header === 'service_details') {
      return JSON.stringify(request.service_details || []);
    }
    if (header === 'collected_data') {
      return JSON.stringify(request.collected_data || []);
    }
    if (header === 'missing_data') {
      return JSON.stringify(request.missing_data || []);
    }
    if (header === 'importo_stimato') {
      return request.importo_stimato || (request.indicative_estimate ? request.indicative_estimate.price_range : '');
    }
    return request[header] || '';
  });

  sheet.appendRow(row);
}

function getHeaders_() {
  return [
    'id',
    'submitted_at',
    'nome',
    'telefono',
    'email',
    'zona',
    'service_type',
    'frequenza',
    'data_preferita',
    'note',
    'status',
    'importo_stimato',
    'pdf_link',
    'service_details',
    'collected_data',
    'missing_data'
  ];
}

function createPdf_(request) {
  const doc = DocumentApp.create(`Preventivo ${request.id} - CM Pulizie`);
  const body = doc.getBody();

  body.appendParagraph('C.M. Pulizie').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Impresa di pulizie professionali - Vomero, Napoli');
  body.appendParagraph('P.IVA: 09749501210');
  body.appendParagraph(`Numero richiesta: ${request.id}`);
  body.appendParagraph(`Data richiesta: ${formatDate_(request.submitted_at)}`);

  body.appendParagraph('Dati cliente').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Nome: ${request.nome || '-'}`);
  body.appendParagraph(`Telefono: ${request.telefono || '-'}`);
  body.appendParagraph(`Email: ${request.email || '-'}`);
  body.appendParagraph(`Zona: ${request.zona || '-'}`);

  body.appendParagraph('Servizio richiesto').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Servizio: ${request.service_type || '-'}`);
  body.appendParagraph(`Frequenza: ${request.frequenza || '-'}`);
  body.appendParagraph(`Data preferita: ${request.data_preferita || 'da concordare'}`);
  body.appendParagraph(`Fascia stimata: ${request.indicative_estimate ? request.indicative_estimate.price_range : '-'}`);

  body.appendParagraph('Dettagli intervento').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  (request.service_details || []).forEach((item) => {
    body.appendParagraph(`${item.label}: ${item.value}`);
  });
  body.appendParagraph(`Note: ${request.note || '-'}`);

  body.appendParagraph('Nota').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('La presente stima e indicativa e non vincolante. Il prezzo finale sara confermato dopo verifica dei dettagli o sopralluogo.');

  doc.saveAndClose();

  const file = DriveApp.getFileById(doc.getId());
  const blob = file.getAs(MimeType.PDF).setName(`CM-Pulizie-${request.id}.pdf`);
  const pdfFile = DriveApp.createFile(blob);

  return {
    url: pdfFile.getUrl(),
    blob
  };
}

function sendClientEmail_(request, pdfBlob) {
  if (!request.email) return;

  const subject = 'Richiesta ricevuta — CM Pulizie Napoli';
  const body = `Ciao ${request.nome || ''},
abbiamo ricevuto la tua richiesta di preventivo.

Ti ricontatteremo per confermare prezzo, disponibilita e dettagli dell'intervento.

Riepilogo richiesta:

* Servizio: ${request.service_type || '-'}
* Zona: ${request.zona || '-'}
* Frequenza: ${request.frequenza || '-'}
* Data preferita: ${request.data_preferita || 'da concordare'}
* Note: ${request.note || '-'}

La richiesta non e vincolante.

Grazie,
CM Pulizie`;

  MailApp.sendEmail({
    to: request.email,
    subject,
    body,
    attachments: [pdfBlob]
  });
}

function sendOwnerEmail_(request, pdfBlob) {
  const subject = 'Nuova richiesta preventivo dal sito — CM Pulizie';
  const details = (request.service_details || []).map((item) => `* ${item.label}: ${item.value}`).join('\n');
  const body = `E arrivata una nuova richiesta dal sito.

Dati cliente:

* Nome: ${request.nome || '-'}
* Telefono: ${request.telefono || '-'}
* Email: ${request.email || '-'}
* Zona: ${request.zona || '-'}
* Tipo servizio: ${request.service_type || '-'}
* Metratura indicativa: ${findDetail_(request, 'metri quadri') || findDetail_(request, 'metratura area verde') || '-'}
* Frequenza: ${request.frequenza || '-'}
* Data preferita: ${request.data_preferita || 'da concordare'}
* Note: ${request.note || '-'}

Dettagli specifici:
${details || '-'}

Stato richiesta: Nuova

Contatta il cliente il prima possibile.`;

  MailApp.sendEmail({
    to: TITOLARE_EMAIL,
    subject,
    body,
    attachments: [pdfBlob]
  });
}

function findDetail_(request, labelPart) {
  const item = (request.service_details || []).find((detail) => String(detail.label).toLowerCase().indexOf(labelPart) !== -1);
  return item ? item.value : '';
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('') === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function isAuthorized_(token) {
  return token && token === ADMIN_TOKEN && ADMIN_TOKEN !== 'ADMIN_AUTH_TOKEN_O_SOLUZIONE_SICURA';
}

function createRequestId_() {
  return `CMP-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function formatDate_(value) {
  return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
