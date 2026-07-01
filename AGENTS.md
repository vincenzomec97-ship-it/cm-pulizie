# C.M. Pulizie - Logobook e linee guida progetto

Questo file fa da logobook operativo per il sito C.M. Pulizie. Serve a mantenere logo, colori, stile e tono coerenti quando si modificano pagine, CSS, immagini o componenti.

## Identita del brand

- Nome: C.M. Pulizie
- Settore: impresa di pulizie professionali
- Area: Vomero e Napoli
- Personalita: affidabile, ordinata, concreta, professionale, umana
- Messaggio chiave: servizi di pulizia curati, preventivi chiari, contatto diretto e interventi organizzati

## Logo

Logo principale da usare:

- `assets/logo-cm-nuovo.png`

Logo storico o secondario:

- `assets/logo-cm.png`

Favicon:

- `assets/img/favicon.png`

Regole:

- Non deformare il logo.
- Non tagliare il logo.
- Non cambiare colori, proporzioni o dettagli interni.
- Usare sempre `object-fit: contain` quando il logo e dentro un contenitore con dimensioni definite.
- Lasciare spazio libero attorno al logo: almeno 12 px su mobile e 20 px su desktop.
- In header usare il logo piccolo e leggibile.
- In hero usare il logo solo se non appesantisce la composizione.

Dimensioni consigliate:

- Header desktop: altezza visiva 42-58 px.
- Header mobile: altezza visiva 38-52 px.
- Hero: massimo 190-230 px di larghezza, salvo layout specifico.
- Favicon: quadrata, leggibile anche a 32 px.

## Colori

Palette principale attuale:

- Blu principale: `#1c5d91`
- Blu profondo: `#123f62`
- Azzurro: `#3aa4d8`
- Giallo: `#ffd66b`
- Giallo CTA secondario: `#f4c64e`
- Grigio testo secondario: `#7d8790`
- Inchiostro/testo scuro: `#173d58`
- Bianco: `#ffffff`
- Sfondo chiaro: `#f5f9fc`
- Sfondo card: `#ffffff`
- Sfondo morbido: `#f7fbfe`

Uso consigliato:

- Blu per titoli, navigazione, pulsanti principali e icone del sito.
- Azzurro per accenti, sottotitoli, stati attivi e dettagli leggeri.
- Giallo per box preventivo, accenti e CTA secondarie.
- Bianco e sfondi chiari per dare ordine e pulizia visiva.
- Evitare blocchi troppo saturi o colori esterni alla palette.

## Tipografia

Font attuale:

- `"Montserrat", "Segoe UI", Arial, sans-serif`

Regole:

- Titoli grandi, leggibili e con forte gerarchia.
- Testi corpo almeno 16 px.
- Interlinea comoda: circa 1.45-1.7.
- Evitare righe troppo lunghe: larghezza ideale testo 55-75 caratteri.
- Non usare font diversi senza motivo.
- Non usare letter spacing negativo.

## Stile componenti

Card:

- Bordi arrotondati coerenti.
- Ombre leggere, non pesanti.
- Spaziatura interna generosa.
- Testi sempre dentro il contenitore.
- Su mobile una card per riga.

Pulsanti:

- Altezza minima consigliata: 44-48 px.
- Testo chiaro e breve.
- Hover e focus visibili.
- Pulsante principale in blu.
- Pulsante secondario in giallo o bianco, secondo contesto.

Form:

- Label visibili.
- Input comodi da mobile.
- Messaggi semplici, non tecnici.
- Privacy non preselezionata.
- Preferire invio tramite WhatsApp quando non esiste backend reale.

## Immagini

Regole:

- Usare immagini reali del progetto quando disponibili.
- Evitare immagini troppo zoomate o deformate.
- Usare `object-fit: cover` per card fotografiche.
- Usare `object-fit: contain` solo quando l'immagine deve vedersi intera.
- Aggiungere sempre `alt` descrittivo, salvo immagini decorative.
- Usare `loading="lazy"` per immagini sotto la prima schermata.

Asset principali:

- `assets/hero-pulizie.jpg`
- `assets/bg-pulizie.jpg`
- `assets/team-cm-pulizie.jpg`
- `assets/squadra-team.jpg`
- `assets/furgone.jpg`
- `assets/prenotazione.jpg`
- `assets/extra.jpg`

## Social e contatti

Usare solo collegamenti reali e confermati.

Contatti ricorrenti:

- Indirizzo: Via G. Capaldo 7
- Email: `info@c.m.puliziesrl.it`
- Ciro: `327 662 3190`
- Roberto: `338 386 1399`
- P.IVA: `09749501210`

Regole:

- Indirizzo cliccabile verso Google Maps.
- Email con `mailto:`.
- Telefoni con `tel:`.
- WhatsApp con `wa.me`.
- Non mostrare LinkedIn o Instagram se non esistono profili reali.

## Recensioni

Regole:

- Non presentare recensioni inventate come verificate.
- Se si usano recensioni dimostrative, devono essere gestite con coerenza e senza dati strutturati SEO falsi.
- Il logo Google G deve essere usato solo come riferimento visivo al profilo Google.
- Non inserire rating aggregati se non verificati.

## Accessibilita

Checklist minima:

- Un solo `h1` per pagina.
- Link e pulsanti con testo o `aria-label` chiaro.
- Focus visibile.
- Contrasto leggibile.
- Immagini con `alt` corretto.
- Menu mobile apribile e chiudibile da tastiera.
- Chat e modali chiudibili con Escape.
- Rispettare `prefers-reduced-motion`.

## SEO locale

Mantenere coerenti:

- Nome azienda.
- Servizi.
- Napoli e Vomero.
- Indirizzo.
- Telefono.
- Email.
- P.IVA.

Non inventare:

- Zone non servite.
- Prezzi.
- Rating.
- Certificazioni.
- Recensioni.
- Numero clienti o interventi non verificati.

## Cosa non fare

- Non ridisegnare il sito da zero.
- Non cambiare identita visiva senza richiesta.
- Non sostituire il logo.
- Non cambiare palette principale.
- Non aggiungere librerie pesanti.
- Non esporre chiavi API o token.
- Non inserire dati personali reali in demo pubbliche.
- Non rompere compatibilita con GitHub Pages.

## Checklist prima di pubblicare

- Header ordinato su desktop e mobile.
- Menu funzionante.
- Nessuno scroll orizzontale.
- Immagini non deformate.
- Form preventivo funzionante.
- Chatbot non sovrapposto a WhatsApp.
- Link WhatsApp, telefono, email e Maps funzionanti.
- Footer coerente in tutte le pagine.
- Favicon presente.
- Nessun errore console evidente.
- Nessun placeholder visibile al pubblico.
