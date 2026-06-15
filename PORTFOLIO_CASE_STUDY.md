# C.M. Pulizie — Case Study Portfolio

## 1. Panoramica

C.M. Pulizie e una demo portfolio di sito aziendale multi-pagina per un'impresa di pulizie a Napoli. Il progetto mostra un'esperienza completa: presentazione del brand, servizi, richiesta di preventivo dinamica, assistente virtuale controllato, pagina FAQ, candidatura e struttura pronta per future integrazioni.

## 2. Obiettivo del progetto

L'obiettivo era creare un sito credibile e professionale, capace di presentare i servizi in modo chiaro e guidare l'utente verso una richiesta di preventivo o un contatto WhatsApp. Il progetto doveva funzionare bene da desktop, tablet e smartphone.

## 3. Pubblico di riferimento

Il sito e pensato per privati, amministratori condominiali, uffici e piccole attivita che cercano un'impresa di pulizie operativa a Napoli, con particolare attenzione alla zona Vomero.

## 4. Problemi da risolvere

- Presentare servizi diversi senza creare confusione.
- Rendere la richiesta di preventivo semplice anche da smartphone.
- Evitare un modulo unico troppo generico.
- Comunicare affidabilita e professionalita.
- Aggiungere un supporto rapido senza usare AI esterna o risposte non controllate.
- Preparare il progetto per una futura integrazione reale senza esporre credenziali.

## 5. Scelte di design

Il design usa una palette coerente con il brand: blu, azzurro, giallo e grigi chiari. Le sezioni sono ariose, le card hanno bordi arrotondati e ombre leggere, le immagini vengono valorizzate senza appesantire l'interfaccia.

L'obiettivo visivo e stato mantenere un tono aziendale, pulito e umano.

## 6. Architettura delle pagine

Il sito e composto da:

- homepage;
- servizi;
- chi siamo;
- prenota/preventivo;
- candidati;
- aiuto/FAQ;
- privacy;
- admin demo;
- pagina 404.

Ogni pagina mantiene header, menu, footer e stile coerenti.

## 7. Preventivo dinamico

Il modulo preventivo cambia in base al servizio selezionato. Ogni percorso raccoglie solo i dati utili:

- condomini: piani, scale, ascensore, androne, cortile, garage, vetri e frequenza;
- appartamenti: metratura, stanze, bagni, tipo pulizia e balconi;
- uffici: metratura, bagni, postazioni, frequenza e orari;
- sanificazione: metratura, ambiente, livello e urgenza;
- disinfestazione: infestante, zona, interno/esterno e gravita;
- giardinaggio: area verde, lavorazione, siepi, prato e frequenza.

Il progetto dimostra gestione di form complessi, campi dinamici, riepilogo e validazione.

## 8. Assistente virtuale

L'assistente virtuale e deterministico: usa FAQ, parole chiave e risposte controllate. Non utilizza API AI esterne, non inventa prezzi, non conferma appuntamenti e non salva conversazioni.

Il suo ruolo e aiutare l'utente a capire i servizi, scegliere il percorso corretto e raggiungere il preventivo o WhatsApp.

## 9. Responsive design

Il layout e stato controllato su desktop, tablet e smartphone. Il menu mobile, il form, il chatbot, il footer, le immagini e le card si adattano senza scorrimento orizzontale involontario.

## 10. Accessibilita

Il progetto include:

- testi alternativi per le immagini;
- label sui campi;
- aria-label sui controlli;
- aria-expanded su menu e chatbot;
- focus visibile;
- supporto Escape per menu e chat;
- rispetto di `prefers-reduced-motion`.

## 11. Sicurezza della modalita demo

La demo pubblica e configurata in modalita portfolio. Il form non invia e non salva dati personali. L'area admin non mostra dati reali e non contiene password o token.

Questa scelta consente di presentare il progetto online senza attivare backend, email, database o analytics.

## 12. Difficolta affrontate

- Rendere il modulo dinamico senza appesantire l'esperienza.
- Mantenere immagini e card leggibili su schermi molto diversi.
- Integrare chatbot e WhatsApp senza sovrapposizioni.
- Separare la demo portfolio dalle future funzioni produzione.
- Documentare il progetto in modo chiaro per portfolio e sviluppatori.

## 13. Soluzioni adottate

- JavaScript modulare per campi dinamici e riepilogo.
- Configurazioni JSON per preventivo e chatbot.
- CSS responsive con grid, flexbox e dimensioni fluide.
- Modalita portfolio con messaggio demo professionale.
- File SEO, 404, sitemap e robots per pubblicazione su GitHub Pages.
- Documentazione dedicata al caso studio e ai testi portfolio.

## 14. Risultato finale

Il progetto dimostra la capacita di progettare un'esperienza completa, dalla presentazione del servizio alla richiesta di preventivo, con attenzione a responsive design, sicurezza della demo, accessibilita e documentazione.

## 15. Possibili evoluzioni

Il sito puo essere collegato in futuro a:

- dominio aziendale;
- email professionali;
- Google Business Profile;
- PagineGialle;
- Google Search Console;
- Google Sheet o database;
- email automatiche;
- PDF preventivi;
- area admin protetta;
- recensioni reali;
- Analytics configurato secondo privacy.

## 16. Competenze dimostrate

- Progettazione responsive.
- Cura dell'esperienza utente.
- Organizzazione delle informazioni.
- JavaScript dinamico.
- Gestione di moduli complessi.
- Validazione dei campi.
- Accessibilita di base.
- Attenzione alla sicurezza.
- Progettazione mobile-first.
- Documentazione del codice.
- Preparazione per future integrazioni.
- Gestione di una demo pubblica.
- Controllo delle risposte del chatbot.
- Attenzione ai dettagli grafici.
