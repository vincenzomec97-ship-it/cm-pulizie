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
