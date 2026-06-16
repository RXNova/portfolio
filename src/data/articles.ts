export interface ArticleSection {
  heading?: string
  body: string
}

export interface Article {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  coverImage?: string
  sections: ArticleSection[]
  tech: string[]
  links: { label: string; href: string }[]
}

export const articles: Article[] = [
  {
    slug: "fsd-live-prices-ticker",
    title: "Frontend system design: a live prices ticker",
    date: "Jun 2026",
    readTime: "9 min",
    excerpt:
      "The signature screen of a Gringotts-style broker: a list of stocks whose prices update live, with the total balance moving in real time. Prices change hundreds of times a second; a screen repaints ~60. The whole design is absorbing that flood without melting the screen or the battery.",
    sections: [
      {
        heading: "Size the problem before designing",
        body: "Before drawing anything I pin down the numbers: ~12 stocks visible, ~50 total, up to ~10 updates per second per stock, and the latest value is all we need to show. That math — 50 stocks × 10 updates/sec ≈ 500 updates per second — settles the whole design. Redrawing on every update means 500 repaints a second, which stutters and drains the battery. So two things are immediately clear: get the data efficiently, and repaint far less often than updates arrive.",
      },
      {
        heading: "One connection, only what's visible",
        body: "All prices come down a single always-open WebSocket rather than one connection per stock — browsers cap concurrent connections and each has setup cost, and a shared source means the rows and the total balance can never disagree. I subscribe only to the ~12 visible stocks (plus a few just below for smooth scrolling) using IntersectionObserver to track what's on screen, and I keep owned stocks subscribed always because they feed the balance.",
      },
      {
        heading: "Batch updates, paint once a frame",
        body: "The core trick is a mailroom: instead of touching the screen on every update, each update drops into a holding Map keyed by stock (so two updates for the same stock collapse to the latest). About 60 times a second, on the browser's requestAnimationFrame signal, I drain the box and update the screen once. 500 updates a second become ~60 small repaints. requestAnimationFrame beats a timer because it's aligned to actual repaints and pauses automatically when the tab is backgrounded.",
      },
      {
        heading: "Redraw only the rows that changed",
        body: "Prices live in one shared, shallow store (Vue's shallowRef) so the framework doesn't waste effort deep-tracking every field of 50 stocks. When a stock changes I hand it a brand-new object, so only that row reacts; v-memo skips a row whose price didn't change. The total balance is a computed sum of shares × price that recalculates only when an owned stock moves — and for a huge portfolio I'd update it incrementally rather than re-summing.",
      },
      {
        heading: "Money in whole cents",
        body: "Floating point gets 0.1 + 0.2 slightly wrong, which is unacceptable in a finance app, so money is stored as whole numbers of cents (18934 means €189.34) and formatted with the currency symbol and separators only at display time. The browser's Intl formatter then renders 1.000,00 € in Germany and €1,000.00 in Ireland automatically across all 17 markets.",
      },
      {
        heading: "Surviving bad networks",
        body: "Mobile connections die silently, so I send periodic pings and reconnect if no pong arrives. Reconnects use exponential backoff with jitter so a server restart doesn't trigger a synchronized stampede from millions of phones. After reconnecting I re-subscribe and fetch a fresh snapshot of all current prices to fill the gap — and until that lands I grey out prices or show 'reconnecting' rather than freezing a stale number and pretending it's live. I'd then watch dropped frames, reconnect rate, and time-to-first-price.",
      },
    ],
    tech: ["WebSocket", "requestAnimationFrame", "Vue", "shallowRef", "IntersectionObserver", "Intl"],
    links: [],
  },

  {
    slug: "fsd-order-ticket",
    title: "Frontend system design: the buy/sell order ticket",
    date: "Jun 2026",
    readTime: "9 min",
    excerpt:
      "The screen that spends real money. The number one job isn't speed — it's making sure the order does exactly what the user intended, exactly once, even if the network drops at the worst possible moment.",
    sections: [
      {
        heading: "Correctness over speed",
        body: "Because this button moves real money, I lead with correctness: never buy twice, never lose an order, always show the true state. The order often comes back 'pending' and finishes later, so the screen must handle several states over time — not just loading then done. That reframes the whole design around honest state under failure.",
      },
      {
        heading: "Model it as a state machine",
        body: "I model the ticket as explicit stages — idle → quoting → reviewing → submitting → (pending → filled | rejected | failed) — not a tangle of isLoading/isDone/isError booleans. Booleans allow impossible combinations and invite scattered if-checks; a state machine guarantees the screen is in exactly one named stage and only certain moves are legal (you can't submit twice, can't jump idle→filled). For a money flow that clarity prevents whole classes of bugs and is far safer for teammates to extend.",
      },
      {
        heading: "Never buy twice: the idempotency key",
        body: "When the user reaches the confirm step I mint one unique order number (an idempotency key) and attach it to the request. A double-tap or an automatic retry carries the same key, so the server recognizes it and refuses to place a second order. There are three layers — disable the button on tap, guard the submit in the state machine, and the idempotency key — but the key is the real guarantee; the first two are just polish.",
      },
      {
        heading: "When the network dies mid-order",
        body: "If the request goes out, the server places the order, but the reply never returns, that is 'unknown' — not 'failed'. Showing 'failed' could make the user re-buy something they already own. So I move into a 'checking…' state and either retry with the same idempotency key (safe, the server dedupes) or ask the server for that order's status (reconcile). Only a real answer resolves the screen to filled, rejected, or retry.",
      },
      {
        heading: "Pessimistic about money, validated in layers",
        body: "For placing a trade I'm pessimistic: show submitting → pending → filled rather than optimistically claiming success I might have to yank back. Optimistic updates are for cheap reversible things like a watchlist toggle. I validate as the user types (positive amount, above minimum, within available cash), re-check at confirm, and re-confirm if the live price went stale or moved beyond tolerance — but the server is always the final judge.",
      },
      {
        heading: "Edge cases and mentoring",
        body: "Partial fills show filled-vs-requested; rejections give a clear reason and a fix; the order's truth lives on the server keyed by its number so leaving and returning still shows real status; and a push plus a refresh reporting the same fill is deduped by order number. The mentoring angle: make Buy and Sell share one order-ticket component and state machine so nobody can copy-paste away the idempotency protections. I'd track duplicate-order rate (should be zero), timeout rate, and time-to-confirm.",
      },
    ],
    tech: ["State machine", "Idempotency", "TypeScript", "Reconciliation", "WebSocket"],
    links: [],
  },

  {
    slug: "fsd-price-chart",
    title: "Frontend system design: the interactive price chart",
    date: "Jun 2026",
    readTime: "8 min",
    excerpt:
      "Candlesticks the user can scrub from five years down to intraday. Five years of minute data is millions of points — too much to send or draw. The whole design is shrinking the data to what you can actually see, and drawing it efficiently.",
    sections: [
      {
        heading: "A screen only needs a few hundred points",
        body: "A phone is ~400 pixels wide; you can't meaningfully show more than ~400 points because you can't draw two on the same pixel. That realization drives everything: no matter the zoom, I only ever need a few hundred points for the visible range, so I never download or draw millions.",
      },
      {
        heading: "Resolution matched to the zoom",
        body: "Like an online map showing countries when zoomed out and streets when zoomed in, the backend keeps data pre-summarized at several levels (per-day, per-hour, per-minute). For a five-year view I request daily candles; for today, minute candles — always aiming for roughly the points that fit the pixels. If I had to summarize on the client I'd use a shape-preserving method (keep the high and low per pixel-column, or LTTB) so spikes never disappear — a naive 'every Nth point' would hide the moment a stock spiked and make the chart lie.",
      },
      {
        heading: "Draw on a canvas",
        body: "SVG with one element per candle is easy to style but dies at scale because the browser manages thousands of objects. A canvas is a single surface I paint all ~400 candles onto, so the browser sees one element — far faster. The trade-off is doing crosshair hit-testing myself (mapping finger x-position to a candle), which is a fair price. WebGL handles millions of points but is overkill for a few hundred visible ones.",
      },
      {
        heading: "Smooth interaction",
        body: "I redraw on requestAnimationFrame while panning/zooming rather than on every finger move, do heavy parsing and summarizing in a Web Worker (transferring data without copying) so the main thread stays free, debounce fetches so flinging the chart doesn't fire a request every pixel, and cache fetched ranges so panning back is instant. High-DPI screens need the canvas scaled by device pixel ratio or it looks blurry, and a ResizeObserver triggers a redraw on rotate/resize.",
      },
      {
        heading: "Keep startup fast, stream only the live candle",
        body: "Charting libraries are large, so I lazy-load the chart code with a dynamic import — the home screen stays light and only people who open a chart pay its weight. Only the newest candle updates live (same buffer-and-repaint idea as the ticker); all the history behind it is frozen, so live updates are cheap. Market-closed gaps are drawn honestly rather than as a fake straight line. I'd measure frame smoothness, payload sizes, and fetch counts.",
      },
    ],
    tech: ["Canvas", "Web Worker", "Downsampling (LTTB)", "Code splitting", "requestAnimationFrame", "ResizeObserver"],
    links: [],
  },

  {
    slug: "fsd-asset-search",
    title: "Frontend system design: instant asset search",
    date: "Jun 2026",
    readTime: "7 min",
    excerpt:
      "A search box that feels instant across thousands of stocks, ETFs, and crypto. Search looks easy but has three classic traps: firing a request on every keystroke, a slow old answer overwriting a newer one, and big result lists freezing the screen.",
    sections: [
      {
        heading: "Don't ask on every keystroke",
        body: "Firing a request per keystroke makes 'apple' five requests, four of them wasted. Instead I debounce: wait ~250ms for a typing pause, then send one request. Below ~100ms you're back to per-keystroke chattiness; above ~600ms it feels laggy. The 200–300ms window skips mid-word keystrokes while still feeling instant, and I'd tune it against real request volume.",
      },
      {
        heading: "Ignore the stale answer (the big one)",
        body: "If the request for 'appl' is slow and 'apple' returns first, the late 'appl' response can overwrite the correct results — a race condition showing results for text the user already changed. I use both fixes: an AbortController cancels the previous in-flight request the moment a new one starts, and as a belt-and-braces check I compare the response against the current text and discard it if the text moved on. This guarantees the user only ever sees results for what they've actually typed.",
      },
      {
        heading: "Thousands of results without freezing",
        body: "A list with 2,000 real rows means the browser builds 2,000 chunks of UI, but the user only sees ~10. So I virtualize: only create the visible rows plus a small buffer, recycling them as the user scrolls and swapping in new data. The DOM stays tiny no matter the result count. I'd reach for a well-tested windowing library rather than hand-rolling the edge cases.",
      },
      {
        heading: "Make it feel instant and accessible",
        body: "Recent searches and popular assets show before the user types; skeleton placeholders appear while a request is out; the matched substring is highlighted; and caching per query (stale-while-revalidate) makes retyping a recent query instant. For accessibility I use the standard combobox pattern, arrow keys/Enter/Escape navigation, and a polite live region announcing the result count — nothing hover-only.",
      },
      {
        heading: "Backend ranking and trade-offs",
        body: "A simple SQL 'contains' works at small scale but gives poor ranking and no typo tolerance, so I frame ranked, fuzzy results as a frontend requirement that needs a real search engine behind it. If the whole dataset were a few hundred static items I'd ship it once and filter on the client instead — it's a size-dependent call. The mentoring note: keep request cancellation with a test and a comment so it isn't 'simplified' away, reintroducing the race. I'd measure request volume, time-to-results, and result usefulness.",
      },
    ],
    tech: ["Debounce", "AbortController", "Virtualization", "Combobox a11y", "Stale-while-revalidate"],
    links: [],
  },

  {
    slug: "fsd-savings-plan-form",
    title: "Frontend system design: a savings-plan setup wizard",
    date: "Jun 2026",
    readTime: "7 min",
    excerpt:
      "Setting up a recurring investment — €50 into an ETF every month. A multi-step form sounds easy, but doing it well means tidy state across steps, helpful validation, never losing progress, and a final 'create' that's safe because it commits recurring money.",
    sections: [
      {
        heading: "One shared draft, steps as stages",
        body: "I keep a single draft object holding every answer (asset, amount, frequency, payment); each step reads and writes its slice, so there's one source of truth and the review step just shows it back. The steps themselves are a small state machine with guarded next/back moves — you can't reach review until earlier steps are valid. What I avoid is a pile of scattered booleans (step1Done, isAmountValid, showPayment), which is exactly where multi-step forms rot.",
      },
      {
        heading: "Validation in layers from one rulebook",
        body: "Validation runs as-you-type (instant feedback), per-step (Next is disabled until valid, and says why), and finally on the server, which is the real judge for any money rule. I define the rules once as a schema (e.g. Zod) and derive the TypeScript types from it, so the checks and the types can't drift apart — a single place to change a rule.",
      },
      {
        heading: "Don't lose their progress",
        body: "The shared draft lives in a store so moving between steps never loses data, and going back preserves earlier inputs. To survive a refresh or an interrupting phone call I persist the draft — on the device (instant, offline) or on the server (follows them across devices). For a finance app there's a privacy angle: in-progress financial intent is sensitive, so I'm deliberate about what's stored locally and lean toward a server-side draft tied to the account. The draft is cleared once the plan is created.",
      },
      {
        heading: "A safe create",
        body: "The final Confirm is the only server write, and it carries one idempotency key so a double-tap or retry can't create two recurring plans — the server dedupes on it, with the button disabled and the state machine guarding too. The same flow powers both create and edit: editing prefills the draft from the server so behavior can't diverge between the two.",
      },
      {
        heading: "Accessibility and what I'd measure",
        body: "On entering a step I move focus to its heading so screen readers announce it, tie each error to its field ('Amount: below minimum'), show 'Step 2 of 5', and give a reasoned disabled state on Next without trapping focus. The mentoring note: extract the safe submit into one shared piece both create and one-off flows use, so the idempotency protection can't be copy-pasted away. I'd track per-step drop-off, validation-error rates, and duplicate-plan rate (zero).",
      },
    ],
    tech: ["State machine", "Schema validation (Zod)", "Draft persistence", "Idempotency", "Accessibility"],
    links: [],
  },

  {
    slug: "fsd-price-alerts",
    title: "Frontend system design: price alerts & push notifications",
    date: "Jun 2026",
    readTime: "8 min",
    excerpt:
      "'Tell me when Tesla drops below €200' — and actually getting notified when it happens, even with the app closed. The hard part isn't the form; it's the notification machinery: permission timing, closed-app delivery, and not notifying twice.",
    sections: [
      {
        heading: "Two halves",
        body: "The feature splits cleanly: managing alerts (a server-owned list with snappy optimistic add/remove and rollback on rejection) and delivering the notification — the interesting half, because it has to work when the app is closed. The 'did it trigger' decision lives on the backend, which watches the live price stream; the frontend designs for near-instant delivery and never assumes the user is online.",
      },
      {
        heading: "Ask permission in context, never on load",
        body: "Browsers let a site request notification permission, but prompting on page load gets a reflexive 'Block' — which is often permanent for that site, quietly killing the feature forever. So I ask right after the user creates their first alert, when the value is obvious. I handle all three outcomes: allowed → register for push; denied → fall back to in-app notifications and explain how to enable later; dismissed → ask again next time it's relevant.",
      },
      {
        heading: "Closed-app delivery via a service worker",
        body: "A service worker is a script the browser can wake even when no tab is open. When the user allows notifications the app subscribes to push and sends the subscription to the backend; when an alert triggers the backend pushes a message, the browser wakes the service worker, it shows the OS notification, and tapping it deep-links into the relevant screen. The service worker's lifecycle (install/activate/update) and platform quirks are where the bugs hide, so it gets careful testing.",
      },
      {
        heading: "App open → don't notify twice",
        body: "If the user is actively in the app, a jarring OS notification is unnecessary — better to update inline with a toast and mark the alert triggered, arriving over the same live connection as the prices screen. But a push might also fire. So every trigger carries an id and I dedupe by it: if one path already showed it, the other suppresses it. One trigger, one notification.",
      },
      {
        heading: "Sync, fallbacks, and what I'd measure",
        body: "The alerts list is server-owned and reflects triggered/one-shot-removed state via live updates. Push subscriptions can expire or rotate, so I refresh and re-send them and handle 'subscription gone'. iOS Safari web push has historically been finicky, so the in-app fallback matters. The mentoring note: keep the permission prompt at the moment of intent with a comment explaining why. I'd track permission allow-rate, delivery success, and duplicate-notification rate.",
      },
    ],
    tech: ["Service Worker", "Web Push", "Notifications API", "Optimistic UI", "Dedupe by id"],
    links: [],
  },

  {
    slug: "fsd-transaction-history",
    title: "Frontend system design: an infinite transaction history",
    date: "Jun 2026",
    readTime: "8 min",
    excerpt:
      "Years of transactions — scrollable, filterable, and fast. You can't load thousands of rows at once, so the design is loading in pages as the user scrolls, rendering only what's visible, and keeping paging correct even as new transactions arrive at the top.",
    sections: [
      {
        heading: "Load as you scroll",
        body: "I place an invisible sentinel at the end of the list; an IntersectionObserver tells me the moment it scrolls into view, which triggers fetching and appending the next page. Infinite scroll feels natural on mobile, though it hides the footer and makes specific items harder to find — so I pair it with filters and search, and for some audiences a 'Load more' button or classic pagination gives more control.",
      },
      {
        heading: "Page with a cursor, not page numbers (the key point)",
        body: "Offset paging ('give me rows 21–40') breaks because transactions are inserted at the top constantly: a new row arriving between page 1 and page 2 shifts everything down, so page 2 repeats a row you saw or skips one. Instead the server returns a cursor — 'here are 20 rows, continue after this bookmark.' New rows at the top don't affect 'after this item,' so there are no duplicates or skips. The only thing lost is jumping to an arbitrary page number, which a feed doesn't need.",
      },
      {
        heading: "Render only what's visible",
        body: "Even with 5,000 rows loaded in memory I only build the ~15 on screen plus a small buffer, recycling them on scroll — virtualization keeps the page light no matter how far down the user goes. Loaded pages stay in a cache keyed by id so returning to the screen doesn't refetch and scroll position is preserved, I dedupe by transaction id when merging as a safety net, and rows group under sticky day/month headers.",
      },
      {
        heading: "Filters in the URL, applied on the server",
        body: "Filters apply on the server so they cover all history, not just loaded rows, and they live in the URL query (?from=…&type=sell) so the back button, refresh, and sharing all work — using the browser's own history as intended. Changing a filter resets the cursor and reloads from the top of that filtered set.",
      },
      {
        heading: "Statements and resilience",
        body: "PDF statements are generated server-side (correct, consistent, auditable) and just downloaded — I wouldn't build financial documents in the browser. A failed page fetch shows a retry for that page without dropping rows already loaded, an empty state reads 'no transactions yet' rather than a blank screen, and very long scrolls can drop far-offscreen pages to bound memory. I'd measure scroll smoothness, duplicate-row rate (zero), and time-to-first-page.",
      },
    ],
    tech: ["Cursor pagination", "IntersectionObserver", "Virtualization", "URL state", "Caching"],
    links: [],
  },

  {
    slug: "fsd-auth-sessions",
    title: "Frontend system design: login & staying logged in",
    date: "Jun 2026",
    readTime: "9 min",
    excerpt:
      "How a user logs in and stays logged in safely, and how the app proves on every request that they're allowed in. The design is about storing that proof so it's both convenient and hard to steal, and refreshing it without annoying re-logins — extra important because it's people's money.",
    sections: [
      {
        heading: "Frame it around the threats",
        body: "After login the app holds proof you're logged in; where I keep it and how I refresh it decide how resistant we are to the two main web attacks. XSS is a malicious script trying to steal the proof; CSRF is another site tricking the browser into using your proof. The storage choice trades these off, so I address both, and since this is a money app I lean toward the safer options explicitly.",
      },
      {
        heading: "Where to keep the proof",
        body: "My default is an HttpOnly, Secure, SameSite cookie: JavaScript can't read it, so even a script that runs on the page can't steal the token — the big win for a money app. The catch is cookies are sent automatically, which opens CSRF, so I close that with SameSite plus a CSRF token. The alternative — localStorage or in-memory — is convenient but script-readable, meaning one XSS bug hands an attacker a money-app token. I accept the well-understood, easily-mitigated CSRF risk over the scarier script-theft risk.",
      },
      {
        heading: "Silent refresh, single-flight",
        body: "The server issues a short-lived access proof (minutes) and a longer-lived refresh credential kept very safe. Before the access proof expires the app quietly swaps it using the refresh credential — silent refresh, no re-login. The subtle bit: if five requests fire at once and all get 'expired,' each must not trigger its own refresh. Single-flight does exactly one refresh and makes the others await it, then replays — without it, a burst causes a refresh storm and, with rotating credentials, can even log the user out by accident.",
      },
      {
        heading: "Make a stolen proof nearly useless",
        body: "Several hardening moves: short access lifetime so a stolen token expires fast; rotating refresh credentials with reuse detection — each refresh retires the old credential, and if an attacker replays a retired one the server notices and revokes the whole session; and binding to device/context where possible so a lifted token looks suspicious on another machine.",
      },
      {
        heading: "Logout everywhere and step-up for money",
        body: "Logging out in one tab must propagate immediately via a BroadcastChannel or storage event, and the server must actually revoke the session, not just clear the client. An inactivity timer auto-logs-out to limit exposure on a shared device. And sensitive actions — trades, withdrawals — require a step-up check (PIN or biometric via WebAuthn/passkeys) so even a valid session needs a fresh, deliberate confirmation to move money.",
      },
      {
        heading: "Stateful vs stateless",
        body: "Stateless tokens (JWT) scale without a per-request lookup but can't easily be cancelled before they expire; stateful sessions keep a server record so they can be revoked instantly — which is what 'log out everywhere' and 'kill a compromised session' need. For a money app I lean stateful, or a hybrid of a short stateless access token plus a revocable server-side refresh/session. The mentoring note: security defaults like HttpOnly storage shouldn't be casually undone to fix a refresh bug — fix the refresh with single-flight instead. I'd monitor refresh failures, forced-logout/anomaly rates, and session age.",
      },
    ],
    tech: ["HttpOnly cookies", "CSRF/SameSite", "Token rotation", "Single-flight refresh", "WebAuthn", "BroadcastChannel"],
    links: [],
  },

  {
    slug: "fsd-internationalization",
    title: "Frontend system design: i18n across 17 markets",
    date: "Jun 2026",
    readTime: "8 min",
    excerpt:
      "Making the app work correctly in 17 countries — not just translated words, but correct money, number, and date formatting plus region-specific rules. Getting any of it subtly wrong in a finance app is a real bug.",
    sections: [
      {
        heading: "Separate language from region",
        body: "The mistake is thinking i18n equals swapping text strings. I treat language (the words) and region (formatting and rules) as separate axes: a locale like de-DE picks both. Language chooses the dictionary; region chooses the number/currency/date style and which disclosures or tax flags apply.",
      },
      {
        heading: "Format and parse with Intl",
        body: "Every modern browser ships Intl formatters that already encode each country's rules, so I never hand-roll formatting — €1,000 renders as 1.000,00 € in Germany and €1,000.00 in Ireland for free, and there's Intl for dates, relative time, and plurals too. Creating a formatter is a bit expensive, so I cache one per locale+currency. Input is the mirror image: a German user typing 1.000,50 means one-thousand-point-five, so I must parse in their locale rather than assuming dot-as-decimal — misreading a typed amount in a money app is dangerous.",
      },
      {
        heading: "Load only the language you need",
        body: "I split translations per language and per feature/route and load the active language on demand, so a German user never downloads the other 16 languages and the chart screen's strings load with the chart, not on first paint. That keeps the initial download small on mobile and scales cleanly as languages are added, since each is its own chunk.",
      },
      {
        heading: "Build-time vs runtime translations",
        body: "Baking translations into the build is fast with no network call or flicker, but changing a word needs a redeploy and the content team can't edit directly. Fetching at runtime from a CMS lets content folks iterate without a release but adds a network dependency and a risk of a flash of untranslated text. I lean hybrid: bake in the critical, rarely-changing UI strings so the core never flickers or breaks offline, and fetch the long-tail/marketing copy at runtime — the right mix depends on who owns the copy and how often it changes.",
      },
      {
        heading: "Region rules from data, resilient layouts",
        body: "Region-specific behavior (tax flags, disclosures, which fields show) is driven by a config/data table read in one place, not if (country === 'DE') scattered across components — adding a country becomes configuration, not a code hunt. Money stays canonical in whole cents and is localized only at display. German strings run ~30% longer than English and right-to-left needs a mirrored layout, so I design flexible layouts and plan for RTL early. A missing key falls back to the default language, never a blank or the raw key. I test formatter output per locale and use pseudo-localization to catch hardcoded strings and layout that can't handle length.",
      },
    ],
    tech: ["Intl", "Locale-aware parsing", "Code splitting", "Data-driven rules", "Pseudo-localization", "RTL"],
    links: [],
  },

  {
    slug: "fsd-frontend-architecture",
    title: "Frontend system design: architecture & design system at scale",
    date: "Jun 2026",
    readTime: "9 min",
    excerpt:
      "Zooming out from one feature: how to structure the whole frontend and shared components so many teams ship fast without breaking each other or the quality. It's about organization, clear boundaries, and guardrails — and the mentoring side the role explicitly wants.",
    sections: [
      {
        heading: "Make the right thing easy",
        body: "The goal isn't a clever trick — it's making it easy to do the right thing and hard to do the wrong thing across a growing team. That means clear component layers, separating the kinds of state, a solid design system, automated quality guardrails, and the human side: patterns and reviews that level up juniors. Guardrails catch mistakes; mentoring prevents them.",
      },
      {
        heading: "Layered components with clear ownership",
        body: "Three layers with distinct jobs: dumb, accessible design-system primitives (Button, Input, Money, Chart) with no business logic or data fetching; feature components that combine primitives and add feature behavior (the order ticket); and feature modules that own a whole area (Trade, Portfolio) including their data and screens. The rules I enforce are no business logic in the primitives and clear ownership of each feature area, with shared code confined to the design system, which gets careful review because many teams depend on it.",
      },
      {
        heading: "Separate the kinds of state (the key insight)",
        body: "The common failure is dumping everything into one giant global store, where any change can ripple anywhere. I split state three ways: server data (prices, holdings, transactions) is a cache of the backend handled by a data layer that does fetching, caching, and invalidation — not hand-managed globals; UI state (is this dropdown open, this form's draft) stays local to the component that owns it; and app-wide state (user, locale, theme) is a small global store kept deliberately small. This keeps responsibilities clear, eases testing, and limits blast radius — the single highest-leverage architecture decision.",
      },
      {
        heading: "A real design system",
        body: "Shared, trusted building blocks: design tokens (colors, spacing, type) defined once as variables so theming and per-region branding are automatic; primitives that bake in keyboard and screen-reader support so teams get accessibility for free; a living catalog (Storybook) so people find and use components without reading source and juniors learn the patterns; and visual-regression tests so a change to a shared button can't silently break it across the app. This is how I get consistency at scale without policing every PR by hand — the right component is the easy one to grab.",
      },
      {
        heading: "Guardrails and the mentoring angle",
        body: "Quality shouldn't rely on memory: TypeScript strict mode and good types catch bug classes and teach correct usage, lint rules enforce patterns, the testing pyramid (many unit, fewer integration, a few e2e on money paths) runs in CI, bundle budgets fail the build if the app gets heavy, and code owners gate the shared layer. The human layer matters as much: patterns and templates, architecture decision records so choices are written down, code review as teaching (explain the why), and pairing so juniors get productive fast and safely.",
      },
      {
        heading: "Trade-offs",
        body: "For several teams sharing a design system I lean monorepo — atomic shared-code changes and consistent tooling address exactly the coordination pain — provided we invest in the tooling. On the tension between a shared system and team autonomy, I make the system genuinely good and easy (faster than rolling your own), provide well-defined extension points, and reserve heavy review for the shared layer so teams move fast inside their modules; the path for something new is 'add it to the system,' not 'fork.' I'd track Core Web Vitals, JS error rate, and bundle-size trend to keep the frontend healthy.",
      },
    ],
    tech: ["Architecture", "TanStack Query", "Design tokens", "Storybook", "TypeScript strict", "Monorepo"],
    links: [],
  },

  {
    slug: "building-retro14",
    title: "Building Retro14 — real-time retro boards from scratch",
    date: "Apr 2026",
    readTime: "8 min",
    excerpt:
      "Sprint retrospectives are supposed to surface honest feedback. Most tools get in the way. I built Retro14 to fix that — real-time, no account required, private until you're ready.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/retro14/main/public/readme.png",
    sections: [
      {
        heading: "Why I built it",
        body: "Every retro tool I used had the same problem: cards were visible as you typed them. People self-censored. Whoever wrote the most cards first set the tone for everyone else. I wanted a tool where cards are drafted privately and only published when you decide — so the room shapes the retro, not the loudest person.",
      },
      {
        heading: "The stack",
        body: "React 18 on the frontend with Vite and React Router v7. Supabase as the backend — Postgres for the data model, Auth for sessions, and the Realtime engine for live updates. Cloudflare Pages for hosting. The whole thing runs on free tiers in production.",
      },
      {
        heading: "Real-time without a custom server",
        body: "Supabase Realtime subscribes to Postgres changes over WebSockets. Every card publish, vote, and group action triggers a database row change, which Supabase broadcasts to all connected clients. No custom WebSocket server, no polling — the database is the source of truth and the event bus at the same time.",
      },
      {
        heading: "The private drafting model",
        body: "Cards have a `published` boolean in the database. RLS policies ensure you can only read your own unpublished cards — even if someone queries Supabase directly they only see their own drafts. When you hit publish, the flag flips, RLS lets others read it, and Realtime fires the update to everyone in the room. This one policy decision solved the self-censorship problem completely.",
      },
      {
        heading: "Shipping it",
        body: "The first version was running at Building Minds within two weeks. We've used it for every sprint retro since. The structured voting and card grouping replaced the sticky-note shuffle we used to do in Miro. PDF export meant action items actually made it into Jira.",
      },
    ],
    tech: ["React 18", "TypeScript", "Vite", "Supabase", "Cloudflare Pages"],
    links: [
      { label: "Live", href: "https://retro14.com" },
      { label: "GitHub", href: "https://github.com/RXNova/retro14" },
    ],
  },

  {
    slug: "retro14-free-infra",
    title: "Running Retro14 on zero-cost infra",
    date: "Apr 2026",
    readTime: "5 min",
    excerpt:
      "The entire production stack for Retro14 — frontend, database, auth, realtime, and email — runs for $0/month. Here's how.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/retro14/main/public/readme.png",
    sections: [
      {
        heading: "The stack",
        body: "Cloudflare Pages for the frontend, Supabase for everything backend (Postgres, Auth, Realtime), GitHub Actions for CI, and Brevo as an SMTP relay for transactional email. Four services, four free tiers, one monthly bill: nothing.",
      },
      {
        heading: "Cloudflare Pages",
        body: "Connect the repo and Cloudflare handles the rest — build on every push to main, global CDN distribution, unlimited bandwidth. The only config is a wrangler.jsonc that points to the dist folder and sets SPA fallback so board routes don't 404. No wrangler deploy, no manual steps.",
      },
      {
        heading: "Supabase",
        body: "The free tier gives you 500 MB Postgres, 50k monthly active users, 2 GB egress, and the full Realtime engine. RLS policies handle access control at the database level — the anon key is safe to ship in the frontend because it can't read anything it shouldn't. Run the five schema files in order, set two env vars in the Cloudflare dashboard, done.",
      },
      {
        heading: "Brevo for email",
        body: "Supabase handles auth triggers (sign-up confirmation, password reset) and hands off to Brevo via SMTP. Brevo's free tier sends 300 emails a day — more than enough for a team tool. Verify your sender domain, generate an SMTP key, wire it into the Supabase SMTP settings. That's the entire email setup.",
      },
      {
        heading: "Free tier limits in practice",
        body: "For a team retro tool the limits are meaningless. A 10-person engineering team running weekly retros will use a few hundred kilobytes of database storage and maybe 50 auth emails a month. The only reason to upgrade would be running this at org scale across hundreds of teams.",
      },
    ],
    tech: ["Cloudflare Pages", "Supabase", "GitHub Actions", "Brevo"],
    links: [
      { label: "Live", href: "https://retro14.com" },
      { label: "GitHub", href: "https://github.com/RXNova/retro14" },
      {
        label: "Deployment docs",
        href: "https://github.com/RXNova/retro14/blob/main/docs/DEPLOYMENT.md",
      },
    ],
  },

  {
    slug: "corelasso",
    title: "CoreLasso — wrapping Apple's container CLI in SwiftUI",
    date: "Mar 2026",
    readTime: "6 min",
    excerpt:
      "Apple quietly shipped a native container runtime for macOS. It's fast, arm64-native, and has no GUI. I built one.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/CoreLasso/main/docs/app.png",
    sections: [
      {
        heading: "The problem",
        body: "Apple's container CLI is genuinely good — lightweight Linux containers running natively on Apple Silicon via the Virtualization framework, no Docker Desktop required. But it's terminal-only. If you want to see what's running, inspect ports, pull an image, or manage volumes, you're stringing together commands. I wanted a proper macOS app for it.",
      },
      {
        heading: "Building the GUI",
        body: "CoreLasso is a SwiftUI app that shells out to the container CLI and parses the output into a live dashboard. Container lifecycle (create, start, stop, kill, delete, export), image management with pull progress, volume and network management — all accessible from a single sidebar layout. The Virtualization framework does the heavy lifting; CoreLasso just wraps it in a UI that doesn't require a terminal.",
      },
      {
        heading: "The lasso CLI companion",
        body: "The GUI solves single-container workflows. For multi-container setups, I built lasso — a CLI that reads docker-compose.yml files and translates each service into a native Apple container. `lasso up` reads your existing compose file, `lasso down` tears it all down. Standard Docker Compose fields (image, ports, volumes, environment, networks) all work. Dockerfiles build with `lasso build`.",
      },
      {
        heading: "Architecture",
        body: "The code is split into four Swift packages: LassoCore (models and protocols, no framework dependencies), LassoData (the actual container engine and OCI registry client), LassoUI (all the SwiftUI views and view models), and LassoCLI (the command-line entry point). The separation means the CLI and GUI share all the core logic — adding a new container operation only needs to be done once.",
      },
      {
        heading: "OCI compatibility",
        body: "Because Apple's container runtime uses the OCI image format, images from Docker Hub, GHCR, ECR, and any other OCI registry work without modification. linux/arm64 images run natively on Apple Silicon — no emulation, no Rosetta layer.",
      },
    ],
    tech: ["Swift 6", "SwiftUI", "Virtualization.framework", "OCI", "macOS 15"],
    links: [
      {
        label: "Download",
        href: "https://github.com/RXNova/CoreLasso/releases/latest/download/CoreLasso-0.1.1.pkg",
      },
      { label: "GitHub", href: "https://github.com/RXNova/CoreLasso" },
    ],
  },

  {
    slug: "gitid",
    title: "gitid — auto-switching git identities like nvm",
    date: "Feb 2026",
    readTime: "4 min",
    excerpt:
      "I work on open source, client projects, and work repos from the same machine. Committing as the wrong identity is annoying. gitid fixes it by switching automatically when you cd into a directory.",
    sections: [
      {
        heading: "The problem",
        body: "Most developers have at least two git identities — work and personal. Some have more. The standard advice is to use local git config per repo, but that means remembering to set it up every time you clone. Once is fine. The tenth time is not. And if you forget, you've pushed commits under the wrong name and email and now you're rebasing.",
      },
      {
        heading: "How it works",
        body: "gitid is a shell function (zsh/bash) that hooks into your prompt via PROMPT_COMMAND / precmd. Every time you cd into a directory, it checks your directory rules for the longest matching path prefix and switches to the associated profile. Each profile stores user.name, user.email, core.sshCommand (SSH key), and optionally a signing key. The switch takes a few milliseconds and prints a single line confirmation.",
      },
      {
        heading: "Directory rules",
        body: "Rules are just path-to-profile mappings stored in ~/.config/gitid/rules. `gitid rule add ~/work work` means any directory under ~/work uses the work profile. Rules match on longest prefix, so ~/work/freelance can override ~/work if you need a different identity for that subtree. A default_profile fallback covers anything not matched by a rule.",
      },
      {
        heading: "Installation",
        body: "Install via Homebrew: `brew tap RXNova/gitid && brew install gitid`. Shell config is set up automatically on first run. Import your existing git config as a profile with `gitid import work`, add a second one with `gitid add personal`, then set directory rules and forget about it.",
      },
    ],
    tech: ["Shell", "Bash", "Zsh", "Homebrew"],
    links: [
      { label: "GitHub", href: "https://github.com/RXNova/homebrew-gitid" },
    ],
  },

  {
    slug: "toggleflow",
    title: "ToggleFlow — building a low-latency feature-flag system",
    date: "Jan 2026",
    readTime: "7 min",
    excerpt:
      "Feature flags sound simple until you need them at scale. I built ToggleFlow to explore what a low-latency, reliable flag system actually needs under the hood.",
    sections: [
      {
        heading: "Why feature flags are harder than they look",
        body: "A feature flag at its simplest is an if statement reading a boolean from a config. In production, you need that boolean to be consistent across thousands of requests per second, evaluate in under a millisecond, survive a backend outage, and update without a redeploy. The requirements compound quickly.",
      },
      {
        heading: "The architecture",
        body: "ToggleFlow is split into a NestJS backend and a React frontend. The backend uses Prisma against Postgres for the flag store and exposes a typed API. The evaluation path is intentionally separate from the management plane — flags are cached in-process so evaluation never blocks on a database read. Updates propagate via server-sent events, keeping clients fresh without polling.",
      },
      {
        heading: "Flag evaluation",
        body: "Flags support simple on/off toggles plus percentage rollouts and user-segment targeting. The evaluation engine resolves targeting rules in priority order and falls back to the default variant. All evaluation is deterministic — same input always produces same output, which matters for debugging and reproducibility.",
      },
      {
        heading: "The stack",
        body: "Frontend: React, TypeScript, Vite. Backend: NestJS, TypeScript, Prisma, Postgres. Docker Compose for local dev. The whole thing is containerised — frontend, backend, and database start with a single docker compose up.",
      },
    ],
    tech: ["NestJS", "React", "TypeScript", "Prisma", "Postgres", "Docker"],
    links: [
      { label: "Live", href: "https://toggleflow.io" },
      { label: "GitHub", href: "https://github.com/RXNova/ToggleFlow" },
    ],
  },

  {
    slug: "sneaky-little-button",
    title: "Sneaky Little Button — on-device AI for Gmail unsubscribes",
    date: "Dec 2025",
    readTime: "5 min",
    excerpt:
      "Chrome ships with Gemini Nano built in. I used it to build a Gmail extension that finds unsubscribe links using on-device AI — no API key, no server, no data leaving your machine.",
    coverImage:
      "https://raw.githubusercontent.com/RXNova/sneaky-little-button/main/assets/plugin-screenshot.png",
    sections: [
      {
        heading: "Chrome's Prompt API",
        body: "Chrome 127 shipped with Gemini Nano embedded in the browser and exposed a JavaScript Prompt API behind a flag. You can prompt the model directly from a content script or extension popup — it runs locally on-device, no network request, no API key. The model is small and fast enough for short classification tasks.",
      },
      {
        heading: "The idea",
        body: "Unsubscribe links are buried in email footers, often disguised as plain text or hidden behind legal boilerplate. Finding them manually in a dense email is annoying. The extension collects all links from an open Gmail thread, sends them to Gemini Nano with a prompt asking it to identify the unsubscribe link, and injects a prominent button wherever it lands.",
      },
      {
        heading: "How it works",
        body: "A content script monitors Gmail for opened emails. When it detects one, it extracts all anchor hrefs from the email body and passes the list to aiBridge.ts, which calls window.ai.languageModel to run the classification. The model returns the most likely unsubscribe URL, and the content script injects a button next to the email header. Auto mode runs on every email open; manual mode waits for you to click Scan.",
      },
      {
        heading: "Privacy and the local model",
        body: "Because everything runs in the browser with the local model, no email content leaves your device. There's no backend, no analytics, no telemetry. The custom prompt setting in the popup lets you tune the detection — useful if the default prompt misses links in a particular format.",
      },
      {
        heading: "The extension structure",
        body: "Built with React and Tailwind for the popup UI, Shadcn for components, and Vite to bundle the extension. The content script is plain TypeScript. The manifest is minimal — content_scripts permission for mail.google.com and the AI origin trial token to unlock the Prompt API.",
      },
    ],
    tech: ["TypeScript", "React", "Tailwind", "Gemini Nano", "Chrome Extension", "Vite"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/RXNova/sneaky-little-button",
      },
    ],
  },
]
