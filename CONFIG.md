# Configurazione C.M. Pulizie

Il sito usa una configurazione frontend centralizzata in `assets/js/config.js`.

## Dati modificabili

Aggiorna questi valori quando il sito passa da demo portfolio a produzione:

- `mode`: usa `"portfolio"` per la demo pubblica, `"production"` solo quando il modulo e gli account reali sono configurati.
- `businessName`: nome pubblico dell'attivita.
- `phoneNumber`: numero principale.
- `secondaryPhoneNumber`: numero secondario.
- `whatsappNumber`: numero WhatsApp in formato internazionale, senza spazi.
- `whatsappMessage`: testo precompilato del messaggio WhatsApp.
- `email`: email aziendale.
- `websiteUrl`: URL pubblico definitivo.
- `formEndpoint`: endpoint sicuro per ricevere richieste dal modulo.
- `googleMapsUrl`: scheda ufficiale Google Maps.
- `googleReviewsUrl`: collegamento ufficiale alle recensioni Google.
- `facebookUrl`: pagina Facebook ufficiale.
- `yellowPagesUrl`: collegamento Pagine Gialle fornito dall'azienda.
- `googleBusinessUrl`: profilo Google dell'attivita, se disponibile.
- `address`: indirizzo.
- `addressLocality`: citta.
- `vatNumber`: partita IVA.
- `analyticsId`: ID analytics, da usare solo dopo corretta configurazione privacy.

## Modulo preventivo

La demo non invia e non salva dati personali. Per attivare l'invio reale con Google Sheets:

1. Crea un Google Sheet dedicato alle richieste.
2. Apri **Estensioni > Apps Script** e incolla il contenuto di `apps-script/Code.gs`.
3. In Apps Script apri **Impostazioni progetto > Proprieta script** e aggiungi:
   - `OWNER_EMAIL`: email del titolare che deve ricevere le nuove richieste.
   - `ADMIN_TOKEN`: password/token da usare in `admin.html`.
4. Distribuisci lo script come **App web** con accesso consentito agli utenti necessari.
5. Copia l'URL della Web App in `assets/js/config.js` dentro `formEndpoint`.
6. Cambia `mode` da `"portfolio"` a `"production"` in `assets/js/config.js` e in `data/site-config.json`.

Quando configurato, il flusso fa cinque cose:

- salva la richiesta nel foglio `Richieste preventivo`;
- invia un'email automatica al cliente;
- invia un'email automatica al titolare;
- genera un PDF riepilogativo in Google Drive;
- permette la consultazione da `admin.html` tramite token.

Non inserire chiavi private, token o password nel frontend.

## Dati legali da verificare

Prima della pubblicazione reale verificare:

- ragione sociale completa;
- titolare del trattamento;
- email privacy;
- tempi di conservazione;
- fornitori esterni;
- eventuali strumenti analytics;
- contenuto definitivo della Privacy Policy.

## Recensioni e statistiche

La sezione recensioni rimanda al profilo Google ufficiale. Pubblicare card con testi, nomi, date e stelle solo dopo verifica manuale delle recensioni reali presenti sul profilo aziendale.

Le statistiche pubbliche vanno mostrate solo quando sono reali e verificabili. Non aggiungere rating aggregati o recensioni nei dati strutturati SEO se non sono reali e aggiornabili.
