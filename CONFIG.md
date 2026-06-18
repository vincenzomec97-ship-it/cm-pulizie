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

La demo non invia e non salva dati personali. Per attivare l'invio reale serve configurare:

- endpoint sicuro in `formEndpoint`;
- gestione server o Google Apps Script;
- protezione da spam;
- email di conferma;
- trattamento privacy;
- conservazione dei dati;
- eventuale PDF riepilogativo.

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
