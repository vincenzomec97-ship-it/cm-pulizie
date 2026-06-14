# C.M. Pulizie - sito statico con preventivo dinamico

Sito multi-pagina per C.M. Pulizie, pensato per GitHub Pages. Il sito resta statico: il salvataggio delle richieste, l'invio email e la generazione PDF devono essere gestiti da Google Apps Script o da un backend separato.

## File principali

- `index.html` - homepage
- `servizi.html` - servizi
- `chi-siamo.html` - azienda
- `prenota.html` - modulo preventivo dinamico
- `candidati.html` - candidatura
- `aiuto.html` - FAQ
- `privacy.html` - informativa privacy
- `admin.html` - area richieste pronta per endpoint protetto
- `script.js` - animazioni, preventivo dinamico e invio richiesta
- `style.css` - stile del sito
- `data/preventivo-config.json` - configurazione servizi e campi essenziali
- `apps-script/Code.gs` - codice da copiare in Google Apps Script

## Placeholder da sostituire

- `GOOGLE_SCRIPT_WEB_APP_URL` in `script.js`
- `EMAIL_TITOLARE_DA_INSERIRE` in `apps-script/Code.gs`
- `ADMIN_AUTH_TOKEN_O_SOLUZIONE_SICURA` tramite Script Properties di Google Apps Script
- `09749501210` e footer, se la Partita IVA dovesse cambiare

## Configurare Google Sheet

1. Crea un nuovo Google Sheet.
2. Rinomina il foglio in `Richieste preventivo`.
3. Apri `Estensioni > Apps Script`.
4. Incolla il contenuto di `apps-script/Code.gs`.
5. Sostituisci `EMAIL_TITOLARE_DA_INSERIRE` con l'email reale del titolare.
6. In Apps Script apri `Impostazioni progetto > Proprietà script`.
7. Aggiungi una proprieta:
   - Nome: `ADMIN_TOKEN`
   - Valore: un token lungo e non pubblico
8. Distribuisci come Web App:
   - Esegui come: te stesso
   - Chi ha accesso: chiunque abbia il link
9. Copia l'URL della Web App.
10. In `script.js` sostituisci `GOOGLE_SCRIPT_WEB_APP_URL` con quell'URL.

## Cosa fa Apps Script

- Salva ogni richiesta nel Google Sheet.
- Crea un PDF riepilogativo.
- Invia email di conferma al cliente.
- Invia email al titolare con allegato PDF.
- Permette alla pagina `admin.html` di leggere le richieste e aggiornare lo stato usando token.

## Sicurezza admin

`admin.html` non deve contenere password vere nel codice pubblico. La protezione reale deve stare nell'endpoint Apps Script usando `ADMIN_TOKEN` salvato nelle Proprietà script.

Non rendere pubblico il Google Sheet con dati dei clienti. La pagina admin deve leggere i dati solo dall'endpoint protetto.

## Stati richiesta

- Nuova
- Da ricontattare
- Preventivo inviato
- Confermata
- Rifiutata
- Completata

## Note sul PDF

Il PDF viene generato da Google Apps Script con:

- nome C.M. Pulizie
- dati aziendali
- P.IVA
- numero richiesta
- data richiesta
- dati cliente
- servizio richiesto
- dettagli specifici del servizio
- fascia stimata indicativa
- nota di non vincolativita

## GitHub Pages

Questo sito puo essere pubblicato su GitHub Pages caricando tutti i file del progetto. GitHub Pages non esegue backend: per ricevere richieste vere devi configurare Google Apps Script o un backend serverless.

## Assistente virtuale

L'assistente virtuale e un widget statico e deterministico. Non usa AI esterna, non invia i messaggi a server esterni, non usa cookie e non salva dati personali. Le risposte arrivano solo dalla configurazione controllata.

File aggiunti:

- `assets/css/chatbot.css` - stile isolato del pulsante flottante e della finestra chat.
- `assets/js/chatbot.js` - logica frontend sicura, senza API key e senza backend.
- `data/chatbot-config.json` - FAQ, parole chiave, risposte controllate, azioni rapide e percorso guidato.

La chat e caricata in:

- `index.html`
- `servizi.html`
- `prenota.html`

Non viene caricata in `admin.html`.

### Modificare risposte e FAQ

Apri `data/chatbot-config.json` e aggiorna l'array `faqs`.

Ogni FAQ puo avere:

- `questions` - esempi di domande.
- `keywords` - parole chiave usate dal matching.
- `answer` - risposta controllata mostrata al cliente.
- `actions` - pulsanti suggeriti dopo la risposta.

Non inserire prezzi, disponibilita o promesse non verificabili se non sono confermati manualmente.

### Modificare WhatsApp

Il numero attuale usato dalla chat e `3383861399`.

Per cambiarlo aggiorna in `data/chatbot-config.json`:

- `company.phone`
- `company.whatsappUrl`
- il link dell'azione rapida `whatsapp`
- eventuali azioni suggerite con `wa.me`

Il messaggio precompilato si modifica in `whatsapp.message`.

### Percorso guidato servizi

Il percorso "Aiutami a scegliere" si trova in `serviceSelector.options`.

I link puntano a `prenota.html?servizio=...` e aprono il modulo dinamico sul servizio corretto. I valori gestiti dal sito sono:

- `pulizia_condomini`
- `pulizia_appartamenti`
- `pulizia_uffici`
- `sanificazione`
- `disinfestazione`
- `giardinaggio`

### Testare la chat

1. Apri `index.html`, `servizi.html` o `prenota.html`.
2. Clicca il pulsante flottante in basso a destra.
3. Prova:
   - "Quali servizi offrite?"
   - "Quanto costa?"
   - "Fate pulizie condomini?"
   - "Posso prenotare?"
   - una domanda non riconosciuta
4. Verifica che il prezzo non venga inventato e che le richieste sconosciute rimandino a modulo o WhatsApp.
5. Apri `prenota.html?servizio=pulizia_uffici` e controlla che il servizio sia gia selezionato.

Su GitHub Pages il file `data/chatbot-config.json` viene caricato via `fetch`. Aprendo il sito direttamente con `file://`, il browser puo bloccare il caricamento JSON: in quel caso la chat usa una configurazione interna di emergenza e mostra un messaggio semplice.

### Privacy

La chat non deve essere usata per inviare nome, telefono, email o dati sensibili. Per i dati personali usa sempre il modulo preventivo con checkbox privacy.
