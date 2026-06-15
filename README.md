# C.M. Pulizie — Sito aziendale responsive

[Visualizza la demo online](https://vincenzomec97-ship-it.github.io/cm-pulizie/)

Progetto frontend realizzato per presentare i servizi di un'impresa di pulizie e semplificare la richiesta di preventivo. Il sito include un preventivo dinamico diverso per ogni servizio, un assistente virtuale con risposte controllate, integrazione WhatsApp, animazioni leggere e un'interfaccia completamente responsive.

## Stato del progetto

Il progetto e pubblicato in modalita portfolio. Le integrazioni con database, email, PDF e account aziendali sono predisposte concettualmente, ma non sono attive nella demo pubblica.

La configurazione della demo e dichiarata in:

```json
{
  "mode": "portfolio"
}
```

File: `data/site-config.json`

## Demo sicura

La demo pubblica e navigabile e mostra il comportamento del preventivo dinamico senza inviare dati reali.

- Nessun dato personale viene inviato.
- Nessuna richiesta viene salvata in database.
- Nessuna email automatica viene inviata.
- Nessun PDF con dati personali viene caricato online.
- Nessuna API privata o credenziale e presente nel frontend.
- La pagina admin resta una demo grafica e non mostra dati reali.

Quando il form viene completato, il sito mostra un messaggio chiaro:

> Questa e una versione dimostrativa del progetto. La richiesta non e stata inviata ne salvata.

## Problema affrontato

Il sito doveva presentare diversi servizi in modo semplice, funzionare bene da smartphone e guidare l'utente verso una richiesta di preventivo o un contatto WhatsApp. Una parte importante del progetto era evitare un modulo generico: condomini, appartamenti, uffici e servizi specialistici richiedono dati diversi.

## Soluzione realizzata

- Homepage aziendale con hero, form iniziale e call to action.
- Pagina servizi con card informative e immagini.
- Sezioni con contatori animati e micro-animazioni leggere.
- Recensioni dimostrative per mostrare il layout della sezione.
- Preventivo dinamico con campi specifici per servizio.
- Assistente virtuale deterministico con FAQ controllate.
- Integrazione WhatsApp tramite link diretto.
- Layout responsive per desktop, tablet e smartphone.
- Accessibilita di base e SEO tecnica per una demo pubblica.
- Modalita portfolio sicura senza backend attivo.

## Funzionalita principali

1. Layout responsive.
2. Navigazione desktop e mobile.
3. Preventivo differenziato per servizio.
4. Campi dinamici.
5. Riepilogo della stima.
6. Chatbot con FAQ controllate.
7. Pulsanti WhatsApp.
8. Animazioni leggere allo scroll.
9. Gestione degli errori lato frontend.
10. Privacy e modalita demo.
11. Pagina 404.
12. SEO tecnica di base.

## Preventivo dinamico

Il preventivo non e un semplice modulo generico. Il modulo cambia in base al servizio scelto:

- Pulizie condomini.
- Pulizie appartamenti.
- Pulizie uffici.
- Sanificazione ambienti.
- Disinfestazione.
- Giardinaggio.

Ogni percorso mostra domande e campi specifici. La stima resta indicativa e nella demo portfolio non viene inviata ne salvata.

## Assistente virtuale

L'assistente virtuale non utilizza AI esterna. Usa risposte controllate definite in `data/chatbot-config.json`.

Il chatbot:

- non inventa prezzi;
- non conferma appuntamenti;
- indirizza verso preventivo e WhatsApp;
- non salva conversazioni;
- non raccoglie dati personali;
- funziona in modo sicuro in un progetto statico.

## Tecnologie utilizzate

- HTML5.
- CSS3.
- JavaScript.
- JSON.
- GitHub Pages.

## Responsive design

Il sito e stato verificato su smartphone, tablet, desktop, dispositivi touch e orientamenti verticale/orizzontale. Le card, le immagini, il form preventivo, il menu mobile e il chatbot sono stati controllati per evitare sovrapposizioni e scorrimento orizzontale.

## Accessibilita

Nel progetto sono presenti:

- lingua italiana nel tag `html`;
- testi alternativi per le immagini;
- label associate ai campi;
- aria-label sui controlli principali;
- aria-expanded sul menu mobile e sulla chat;
- focus visibile;
- supporto tastiera per menu e chatbot;
- rispetto di `prefers-reduced-motion`.

Non viene dichiarata una conformita WCAG completa, ma il progetto include attenzioni concrete per rendere l'esperienza piu accessibile.

## Recensioni dimostrative

Le recensioni presenti nella demo sono contenuti dimostrativi utilizzati per mostrare il layout della sezione. Non vengono presentate come recensioni Google o recensioni verificate.

## Screenshot

Gli screenshot reali della demo, se presenti, sono in `docs/screenshots/`.

- `home-desktop.png`
- `home-mobile.png`
- `servizi-desktop.png`
- `preventivo-mobile.png`
- `chatbot-desktop.png`
- `chatbot-mobile.png`

![Homepage desktop](docs/screenshots/home-desktop.png)
![Homepage mobile](docs/screenshots/home-mobile.png)
![Servizi desktop](docs/screenshots/servizi-desktop.png)
![Preventivo mobile](docs/screenshots/preventivo-mobile.png)
![Chatbot desktop](docs/screenshots/chatbot-desktop.png)
![Chatbot mobile](docs/screenshots/chatbot-mobile.png)

Dimensioni consigliate per nuove acquisizioni:

- desktop: 1440 x 900;
- mobile: 390 x 844.

## Evoluzione futura

Il progetto puo essere trasformato in una versione produzione collegando:

- dominio aziendale;
- email professionali;
- Profilo dell'attivita Google;
- PagineGialle;
- Google Search Console;
- Google Sheet o database;
- Google Apps Script;
- email automatiche;
- PDF preventivi;
- area amministrativa protetta;
- recensioni reali;
- Analytics dopo configurazione privacy.

Queste integrazioni non sono attive nella demo pubblica.

## Come eseguire il progetto

Puoi aprire `index.html` direttamente nel browser. Per testare al meglio il caricamento dei file JSON, usa un server locale:

```bash
python -m http.server 8000
```

Poi apri:

```text
http://localhost:8000/
```

## Struttura delle cartelle

```text
.
├── assets/
│   ├── css/
│   ├── img/
│   └── js/
├── apps-script/
├── data/
├── docs/
│   └── screenshots/
├── index.html
├── servizi.html
├── chi-siamo.html
├── prenota.html
├── candidati.html
├── aiuto.html
├── privacy.html
├── admin.html
├── 404.html
├── style.css
├── script.js
├── robots.txt
└── sitemap.xml
```

## File principali

- `index.html` - homepage.
- `servizi.html` - pagina servizi.
- `chi-siamo.html` - pagina aziendale.
- `prenota.html` - preventivo dinamico.
- `candidati.html` - form candidatura demo.
- `aiuto.html` - FAQ.
- `privacy.html` - informativa privacy.
- `admin.html` - demo grafica area richieste, noindex.
- `script.js` - animazioni, preventivo dinamico, modalita portfolio e admin demo.
- `assets/js/chatbot.js` - assistente virtuale controllato.
- `data/chatbot-config.json` - FAQ e risposte del chatbot.
- `data/preventivo-config.json` - configurazione dei servizi.
- `data/site-config.json` - modalita portfolio.

## Futuro collegamento produzione

Il file `apps-script/Code.gs` resta come traccia tecnica per una futura integrazione con Google Apps Script. Per una versione reale servirebbero:

- URL Web App Google Apps Script;
- email reale del titolare;
- token admin salvato in Script Properties;
- informativa privacy definitiva;
- protezione reale dell'area admin.

Non inserire password, API key o token nel repository pubblico.

## Autore

- Nome: Vincenzo Meccariello
- Portfolio: INSERIRE_LINK_PORTFOLIO
- GitHub: INSERIRE_LINK_GITHUB
- LinkedIn: INSERIRE_LINK_LINKEDIN
- Email professionale: INSERIRE_EMAIL_PROFESSIONALE
