const SHEET_NAME = 'Richieste preventivo';
const SPREADSHEET_FILE_NAME = 'C.M. Pulizie - Richieste preventivo';
const PDF_FOLDER_NAME = 'Preventivi CM Pulizie';
const DEFAULT_OWNER_EMAIL = 'info@c.m.puliziesrl.it';
const STATI_RICHIESTA = ['Nuova', 'Da ricontattare', 'Preventivo inviato', 'Confermata', 'Rifiutata', 'Completata'];

function doPost(e) {
  try {
    const payload = parsePayload_(e);

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
  try {
    const action = e.parameter.action;
    const token = e.parameter.token;

    if (action !== 'listRequests') {
      return json_({ ok: false, error: 'Azione non valida' });
    }

    if (!isAuthorized_(token)) {
      return json_({ ok: false, error: 'Non autorizzato' });
    }

    const sheet = getSheet_();
    ensureHeaders_(sheet, getHeaders_());
    const values = sheet.getDataRange().getValues();
    const headers = values.shift() || [];
    const requests = values
      .filter((row) => row.some((cell) => cell !== ''))
      .map((row) => headers.reduce((item, header, index) => {
        item[header] = row[index];
        return item;
      }, {}))
      .reverse();

    return json_({ ok: true, requests });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function createRequest_(request) {
  validateRequest_(request);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    request.id = request.id || createRequestId_();
    request.submitted_at = request.submitted_at || new Date().toISOString();
    request.status = 'Nuova';

    const pdf = createPdf_(request);
    request.pdf_link = pdf.url;

    appendRequest_(request);
    sendClientEmail_(request, pdf.blob);
    sendOwnerEmail_(request, pdf.blob);

    return json_({ ok: true, id: request.id, pdfLink: pdf.url });
  } finally {
    lock.releaseLock();
  }
}

function updateStatus_(payload) {
  if (!isAuthorized_(payload.token)) {
    return json_({ ok: false, error: 'Non autorizzato' });
  }

  if (STATI_RICHIESTA.indexOf(payload.status) === -1) {
    return json_({ ok: false, error: 'Stato non valido' });
  }

  const sheet = getSheet_();
  ensureHeaders_(sheet, getHeaders_());
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  const statusIndex = headers.indexOf('status');

  for (let row = 1; row < values.length; row += 1) {
    if (String(values[row][idIndex]) === String(payload.id)) {
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
    if (['service_details', 'collected_data', 'missing_data'].indexOf(header) !== -1) {
      return JSON.stringify(request[header] || []);
    }
    if (header === 'importo_stimato') {
      return request.importo_stimato || getPriceRange_(request);
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
  body.appendParagraph('Via G. Capaldo 7 - P.IVA 09749501210');
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
  body.appendParagraph(`Fascia stimata: ${getPriceRange_(request) || '-'}`);

  body.appendParagraph('Dettagli intervento').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const details = Array.isArray(request.service_details) ? request.service_details : [];
  if (details.length) {
    details.forEach((item) => body.appendParagraph(`${item.label || item.campo}: ${item.value}`));
  } else {
    body.appendParagraph('Nessun dettaglio specifico inserito.');
  }
  body.appendParagraph(`Note: ${request.note || '-'}`);

  body.appendParagraph('Nota').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(request.mandatory_disclaimer || 'Questa stima e indicativa e non vincolante. Il prezzo finale sara confermato dopo verifica dei dettagli o sopralluogo tecnico.');

  doc.saveAndClose();

  const file = DriveApp.getFileById(doc.getId());
  const blob = file.getAs(MimeType.PDF).setName(`CM-Pulizie-${request.id}.pdf`);
  const folder = getPdfFolder_();
  const pdfFile = folder.createFile(blob);
  file.setTrashed(true);

  return {
    url: pdfFile.getUrl(),
    blob
  };
}

function sendClientEmail_(request, pdfBlob) {
  if (!request.email) return;

  const subject = 'Richiesta ricevuta - CM Pulizie Napoli';
  const body = `Ciao ${request.nome || ''},
abbiamo ricevuto la tua richiesta di preventivo.

Ti ricontatteremo per confermare prezzo, disponibilita e dettagli dell'intervento.

Riepilogo richiesta:

* Servizio: ${request.service_type || '-'}
* Zona: ${request.zona || '-'}
* Frequenza: ${request.frequenza || '-'}
* Data preferita: ${request.data_preferita || 'da concordare'}
* Fascia stimata: ${getPriceRange_(request) || '-'}
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
  const ownerEmail = getOwnerEmail_();
  const subject = 'Nuova richiesta preventivo dal sito - CM Pulizie';
  const details = (request.service_details || []).map((item) => `* ${item.label || item.campo}: ${item.value}`).join('\n');
  const body = `E arrivata una nuova richiesta dal sito.

Dati cliente:

* Numero richiesta: ${request.id}
* Nome: ${request.nome || '-'}
* Telefono: ${request.telefono || '-'}
* Email: ${request.email || '-'}
* Zona: ${request.zona || '-'}
* Tipo servizio: ${request.service_type || '-'}
* Fascia stimata: ${getPriceRange_(request) || '-'}
* Frequenza: ${request.frequenza || '-'}
* Data preferita: ${request.data_preferita || 'da concordare'}
* Note: ${request.note || '-'}

Dettagli specifici:
${details || '-'}

Stato richiesta: Nuova`;

  MailApp.sendEmail({
    to: ownerEmail,
    subject,
    body,
    attachments: [pdfBlob]
  });
}

function validateRequest_(request) {
  const required = ['nome', 'telefono', 'email', 'zona', 'service_type', 'frequenza'];
  const missing = required.filter((key) => !request[key]);
  if (missing.length) {
    throw new Error(`Campi obbligatori mancanti: ${missing.join(', ')}`);
  }
}

function parsePayload_(e) {
  return JSON.parse((e && e.postData && e.postData.contents) || '{}');
}

function getSheet_() {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function getSpreadsheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  const files = DriveApp.getFilesByName(SPREADSHEET_FILE_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.openById(files.next().getId());
  }

  return SpreadsheetApp.create(SPREADSHEET_FILE_NAME);
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('') === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  headers.forEach((header, index) => {
    if (current[index] !== header) {
      sheet.getRange(1, index + 1).setValue(header);
    }
  });
}

function getPdfFolder_() {
  const folders = DriveApp.getFoldersByName(PDF_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(PDF_FOLDER_NAME);
}

function getOwnerEmail_() {
  return PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || DEFAULT_OWNER_EMAIL;
}

function isAuthorized_(token) {
  const adminToken = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
  return Boolean(token && adminToken && token === adminToken);
}

function getPriceRange_(request) {
  return request.importo_stimato || (request.indicative_estimate ? request.indicative_estimate.price_range : '');
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
