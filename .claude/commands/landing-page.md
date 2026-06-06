---
description: Build a distinctive, production-grade product landing page — dark/atmospheric, motion-rich, dependency-free, fully responsive and accessible. Use for marketing/landing/product sites where visual quality matters and you want to avoid generic AI-slop aesthetics.
argument-hint: <product name, or path to a repo / brand brief>
allowed-tools: Read, Write, Edit, Bash, WebFetch, Glob, Grep
---

# /landing-page — craft a striking product landing page

Build a one-page landing site for `$ARGUMENTS` (a product name, repo, or brief) that looks intentional and premium at first glance. It must be **dependency-free, static, fully responsive, and accessible**, while avoiding generic "AI slop" aesthetics.

This skill is a concrete, copy-paste recipe distilled from a shipped LP (warm-black + one accent, scroll-driven motion, responsive WebP, GitHub Pages). The templates below are self-contained — adapt the tokens and copy to the product's personality; you should not need outside HTML/CSS knowledge to ship a complete page.

> **Quality bar:** intentional, non-template design. Give every color / type / spacing / motion choice a *reason*. For open-ended aesthetic judgment, also use the `frontend-design` skill.

---

## Process (in order)

1. **Discover** → 2. **Decide direction (get user sign-off)** → 3. **Foundation** (HTML + CSS tokens + JS) → 4. **Sections** → 5. **Images** → 6. **Polish (perf / a11y / motion)** → 7. **Pre-ship checklist**

### 1. Discover (first)
- Nail down: product name / one-sentence "what is it" / target user / tone (serious, playful, minimal…). Read the repo or brief if provided.
- Write **one** hero sentence — the payoff, not a feature list.
- Gather **real** content (screenshots, logo, actual feature copy). **No lorem, no placeholder images.** If missing, ask the user.

### 2. Decide direction (sign-off before building)
- Pick **one** accent color (from the brand). Pick a base world (deep warm-black, or another single mood).
- Pick **one** display × body font pair (e.g. Bricolage Grotesque × Hanken Grotesk; Fraunces × Inter Tight).
- Pick **one** signature element that's specific to this product (animated data dots, pinned device, custom grid…).
- Offer 2–3 directions briefly and get one approved before implementing.

### 3–6 use the templates below.

---

## Information architecture (typical stack)

```
progress bar (top)
sticky nav (reveals after hero)
hero (gradient-clip headline + visual + CTA)
takeaway chips (short proof points as pills)
feature block — bento grid OR pinned scroll tour
FAQ (<details>)
final CTA (radial glow)
mobile sticky CTA bar
footer (brand + links + copyright)
```
You don't need all of it. Minimum: nav / hero / one feature block / CTA / footer.

---

## Template A — Foundation (design tokens + atmosphere)

`index.html` is a single **raw HTML page (no layout engine)**; CSS is one `assets/css/lp.css`; JS is one `assets/js/lp.js`. No build step, no npm deps, no analytics.

Tokens at the top of the CSS (**only swap the colors and fonts** for the brand):

```css
:root{
  --bg:#0D0A0A; --bg-2:#0A0807; --surface:#161010;
  --text:#F5F0EE; --dim:rgba(245,240,238,.62); --faint:rgba(245,240,238,.40);
  --hair:rgba(245,240,238,.09);
  --accent:#D94425;        /* saturated — for FILLS, dots, borders */
  --accent-br:#FF6B4A;     /* brighter tint — for TEXT, eyebrows, links */
  --on-accent:#0A0707;     /* text color ON a solid accent fill (near-black = AA-safe) */
  --maxw:min(1200px, 92vw);
  --sans:-apple-system,"SF Pro Text","Hanken Grotesk",system-ui,sans-serif;
  --display:"Bricolage Grotesque",var(--sans);
  --ease:cubic-bezier(.2,.7,.2,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);
  font-size:17px;line-height:1.6;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
::selection{background:rgba(217,68,37,.32)}
.skip{position:fixed;left:-999px;top:8px;z-index:200;background:var(--surface);color:var(--text);padding:10px 16px;border-radius:10px}
.skip:focus{left:12px}
:focus-visible{outline:2px solid var(--accent-br);outline-offset:3px;border-radius:6px}
```

> **CONTRAST — read this when your accent is light/mid (e.g. indigo, teal, lime).** Keep two accent tokens: `--accent` (saturated, for *fills/dots/borders only*) and `--accent-br` (a *brighter* tint, for *text/eyebrows/links*). **Never put body-size text on the raw `--accent` fill.** Verify two ratios against the dark `--bg`: accent *text* ≥ 4.5:1, and on solid-fill buttons use near-black `--on-accent` text (not white) so it passes regardless of accent lightness. Example landmine: indigo `#5B5BD6` on `#0D0A0A` is only ~3.6:1 (too low for text) and white-on-`#5B5BD6` is ~3:1 (fails) — so use a brighter `--accent-br` like `#A5A5FF` for text and near-black text on the button.

**Atmosphere layer** (what makes it feel premium — stack three). Note the keyframe animates **scale only**, so multiple glows can reuse it without fighting positioning:

```css
.atmos{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55;will-change:transform}
.glow--a{width:60vw;height:48vw;top:-18vw;left:8vw;background:radial-gradient(closest-side,var(--accent),transparent 70%);animation:breathe 9s var(--ease) infinite}
.glow--b{width:36vw;height:30vw;top:2vw;right:-8vw;background:radial-gradient(closest-side,var(--accent-br),transparent 70%);animation:breathe 11s var(--ease) infinite reverse}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
/* dot grid, masked to the center */
.grid{position:absolute;inset:0;opacity:.35;
  background-image:radial-gradient(rgba(245,240,238,.10) 1px,transparent 1px);background-size:34px 34px;
  -webkit-mask-image:radial-gradient(60% 50% at 50% 30%,#000,transparent 75%);mask-image:radial-gradient(60% 50% at 50% 30%,#000,transparent 75%)}
/* film grain (SVG noise) over everything */
body::after{content:"";position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.035;mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
```
> All decorative atmosphere elements get `aria-hidden="true"`.

---

## Template B — Section CSS (excerpt; expect to adapt)

```css
/* hero: gradient-clip headline */
.hero{position:relative;min-height:100svh;display:flex;align-items:center;padding:92px 0 56px;overflow:hidden}
.hero__in{position:relative;z-index:2;max-width:var(--maxw);margin:0 auto;padding:0 24px;width:100%;
  display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(28px,4vw,64px);align-items:center}
.display{font-family:var(--display);font-weight:700;line-height:1.03;letter-spacing:-.035em;
  font-size:clamp(2.3rem,5.2vw,4.3rem);margin:0;
  background:linear-gradient(176deg,#fff,#efe7e3 72%);-webkit-background-clip:text;background-clip:text;color:transparent}
.eyebrow{font-size:.78rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--accent-br);margin:0 0 20px}
.lede{font-size:clamp(.96rem,1.25vw,1.1rem);line-height:1.55;color:var(--dim);margin:16px 0 0;max-width:38ch}

/* takeaway chips */
.chips{max-width:var(--maxw);margin:0 auto;list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.chips li{font-size:.9rem;font-weight:600;padding:11px 20px;border:1px solid var(--hair);border-radius:999px;background:rgba(255,255,255,.015)}
.chips li::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-right:9px;vertical-align:middle}

/* bento grid (uneven + hover lift) */
.bento__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cell{background:var(--surface);border:1px solid var(--hair);border-radius:22px;padding:26px;
  transition:transform .35s var(--ease-out),box-shadow .35s,border-color .35s}
.cell:hover{transform:translateY(-4px);border-color:rgba(217,68,37,.4);box-shadow:0 24px 50px -28px rgba(217,68,37,.5)}
.cell--focal{grid-row:span 2;background:linear-gradient(165deg,rgba(217,68,37,.16),var(--surface) 55%);display:flex;flex-direction:column;justify-content:flex-end}

/* FAQ: <details> */
.faq summary{cursor:pointer;list-style:none;padding:20px 40px 20px 4px;font-size:1.1rem;font-weight:600;position:relative}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";position:absolute;right:6px;top:18px;font-size:1.5rem;color:var(--accent-br);transition:transform .25s}
.faq details[open] summary::after{transform:rotate(45deg)}

/* final CTA */
.final{padding:120px 24px;text-align:center;position:relative;overflow:hidden}
.final::before{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(60% 70% at 50% 120%,rgba(217,68,37,.30),transparent 70%)}
.final__in{position:relative;z-index:1;max-width:680px;margin:0 auto;display:flex;flex-direction:column;align-items:center}

/* scroll-reveal initial state (JS adds is-visible) */
[data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .7s var(--ease-out),transform .7s var(--ease-out)}
[data-reveal].is-visible{opacity:1;transform:none}

/* responsive + motion (required). Breakpoint = 760px; test 360 / 760 / 1280 / ultrawide */
@media (max-width:760px){.hero__in,.bento__grid{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
```

---

## Template C — Chrome (nav + progress + mobile CTA + buttons)

These four are referenced by the JS via `data-*` hooks, so ship them together. HTML:

```html
<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"><span></span></div>

<nav class="nav" data-nav aria-label="Primary">
  <div class="nav__in">
    <a class="wordmark" href="#top">Cadence</a>
    <div class="nav__links">
      <a href="#features">Features</a>
      <a href="#faq">FAQ</a>
      <a class="btn btn--sm" href="{{DOWNLOAD_URL}}">Get the app</a>
    </div>
  </div>
</nav>

<!-- ...sections... -->

<div class="mobar" data-mobar>
  <span>Cadence — focus, measured</span>
  <a class="btn btn--sm" href="{{DOWNLOAD_URL}}">Get</a>
</div>
```

CSS:

```css
.progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:120;background:transparent;pointer-events:none}
.progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent-br))}

.nav{position:fixed;top:0;left:0;right:0;z-index:100;transform:translateY(-110%);opacity:0;
  transition:transform .5s var(--ease-out),opacity .4s ease;
  background:rgba(13,10,10,.62);backdrop-filter:saturate(160%) blur(14px);-webkit-backdrop-filter:saturate(160%) blur(14px);border-bottom:1px solid var(--hair)}
.nav.is-visible{transform:none;opacity:1}
.nav__in{max-width:var(--maxw);margin:0 auto;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.wordmark{font-family:var(--display);font-weight:800;letter-spacing:.14em}
.nav__links{display:flex;align-items:center;gap:18px}
.nav__links a:not(.btn){font-size:.86rem;color:var(--dim);transition:color .2s}
.nav__links a:not(.btn):hover{color:var(--text)}

/* buttons: near-black text on a solid accent fill = AA-safe for any accent lightness */
.btn{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:.92rem;cursor:pointer;
  padding:13px 22px;border-radius:999px;background:var(--accent);color:var(--on-accent);
  border:1px solid transparent;transition:transform .2s var(--ease),box-shadow .25s,background .2s}
.btn:hover{transform:translateY(-1px);box-shadow:0 14px 34px -16px var(--accent)}
.btn--ghost{background:transparent;color:var(--text);border-color:var(--hair)}
.btn--ghost:hover{border-color:var(--accent);background:rgba(217,68,37,.06)}
.btn--sm{padding:9px 16px;font-size:.84rem}

.mobar{position:fixed;left:12px;right:12px;bottom:12px;z-index:90;display:none;align-items:center;justify-content:space-between;
  gap:12px;padding:10px 12px 10px 18px;font-size:.88rem;color:var(--dim);
  background:rgba(20,15,14,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border:1px solid var(--hair);border-radius:18px;transform:translateY(140%);transition:transform .45s var(--ease-out)}
.mobar.is-visible{transform:none}
@media (max-width:760px){.mobar{display:flex}.nav__links a:not(.btn){display:none}}
```

---

## Template D — Pinned scroll tour (optional but signature)

A sticky visual that swaps as text steps scroll past. **The contract:** each `.step[data-step="N"]` maps to the screen at index `N` (same count). The centered step wins.

```html
<section class="tour" id="features">
  <div class="tour__steps">
    <article class="step" data-step="0" data-reveal><p class="step__n">01</p><h2 class="h2">Start a block</h2><p>One tap begins a focused session…</p></article>
    <article class="step" data-step="1" data-reveal><p class="step__n">02</p><h2 class="h2">See today</h2><p>Every block, stacked into your day…</p></article>
    <article class="step" data-step="2" data-reveal><p class="step__n">03</p><h2 class="h2">Read the insight</h2><p>Where your attention actually went…</p></article>
  </div>
  <div class="tour__phone">
    <div class="frame">
      <img class="screen is-active" src="assets/img/timer-990.webp" alt="Timer running a 50-minute focus block" width="990" height="2087">
      <img class="screen" src="assets/img/today-990.webp" alt="Today view stacking finished blocks" width="990" height="2087">
      <img class="screen" src="assets/img/insights-990.webp" alt="Insights chart of attention by hour" width="990" height="2087">
    </div>
  </div>
</section>
```

```css
.tour{max-width:var(--maxw);margin:0 auto;padding:60px 24px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,5vw,72px);align-items:start}
.tour__steps{order:1}
.tour__phone{order:2;position:sticky;top:16vh;height:66vh;display:flex;align-items:center;justify-content:center}
.tour__phone .frame{position:relative;width:100%;max-width:330px;aspect-ratio:990/2087} /* match your screenshot ratio */
.tour__phone .screen{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:20px;opacity:0;transition:opacity .6s var(--ease)}
.tour__phone .screen.is-active{opacity:1}
.step{min-height:62vh;display:flex;flex-direction:column;justify-content:center}
.step__n{font-size:.8rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-br);margin-bottom:14px}
@media (max-width:760px){.tour{grid-template-columns:1fr}.tour__phone{position:static;height:auto;margin-top:8px}.step{min-height:auto;padding:16px 0}}
```

---

## Template E — Dependency-free interactions (`assets/js/lp.js`)

Vanilla JS IIFE; IntersectionObserver + WAAPI only. **Gate every motion behind `prefers-reduced-motion` and `pointer:coarse` up front.** Load with `<script ... defer>`.

```js
/* landing — dependency-free interactions (IO + sticky + WAAPI) */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = matchMedia("(pointer: coarse)").matches;

  /* reveal on enter */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* nav + mobile bar reveal after hero, + scroll progress (rAF throttled) */
  var nav = document.querySelector("[data-nav]"), mobar = document.querySelector("[data-mobar]");
  var hero = document.querySelector(".hero"), bar = document.querySelector(".progress span");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      if (bar) { var max = document.documentElement.scrollHeight - innerHeight; bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%"; }
      var past = hero ? hero.getBoundingClientRect().bottom < 72 : scrollY > 600;
      if (nav) nav.classList.toggle("is-visible", past);
      if (mobar) mobar.classList.toggle("is-visible", past);
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll); onScroll();

  /* pinned-visual scroll tour: centered step wins (step N -> screen N) */
  var steps = document.querySelectorAll(".tour .step"), screens = document.querySelectorAll(".tour__phone .screen");
  if (steps.length && screens.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) {
        var i = parseInt(e.target.getAttribute("data-step"), 10) || 0;
        screens.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
      }});
    }, { rootMargin: "-48% 0px -48% 0px", threshold: 0 });
    steps.forEach(function (s) { so.observe(s); });
  }

  /* magnetic CTA (pointer only) — add data-magnetic to a CTA wrapper */
  if (!reduce && !coarse) {
    document.querySelectorAll("[data-magnetic]").forEach(function (w) {
      w.style.transition = "transform .3s cubic-bezier(.2,.7,.2,1)";
      w.addEventListener("pointermove", function (ev) { var r = w.getBoundingClientRect();
        w.style.transform = "translate(" + (ev.clientX - r.left - r.width/2)*.18 + "px," + (ev.clientY - r.top - r.height/2)*.18 + "px)"; });
      w.addEventListener("pointerleave", function () { w.style.transform = ""; });
    });
  }
})();
```
HTML hooks required: `data-reveal` on elements that should fade in; `data-nav` on the nav; `.progress > span` for the bar; `data-mobar` on the mobile bar; `data-magnetic` on a CTA wrapper (optional).

---

## Template F — Complete `<head>` + favicon + OGP

Template E's perf bits live here. Copy the **whole** head (charset, lang, title, OGP, twitter), don't trim it:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cadence — focus, measured</title>
<meta name="description" content="Cadence turns your day into focused work blocks and shows you where your attention actually went.">
<meta name="theme-color" content="#0D0A0A">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="Cadence — focus, measured">
<meta property="og:description" content="Turn your day into focused blocks. See where your attention went.">
<meta property="og:image" content="https://example.com/assets/og.png">
<meta property="og:url" content="https://example.com/">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/lp.css?v=1">
</head>
<body id="top">
  <div class="atmos" aria-hidden="true"><div class="glow glow--a"></div><div class="glow glow--b"></div><div class="grid"></div></div>
  <!-- chrome (Template C) + sections + footer -->
  <main id="main"> ... </main>
  <script src="assets/js/lp.js?v=1" defer></script>
</body>
</html>
```

Quick favicon + OGP image (no design tool needed):
```bash
# Minimal SVG favicon (swap the glyph + colors)
cat > assets/favicon.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D0A0A"/><text x="32" y="44" font-family="system-ui" font-size="38" font-weight="800" text-anchor="middle" fill="#5B5BD6">C</text></svg>
SVG
# OGP 1200x630: design a real one, or render a quick HTML→PNG. As a placeholder, crop a hero screenshot:
sips -c 630 1200 assets/img/hero.png --out assets/og.png   # macOS; or use ImageMagick `convert`
```

---

## Template G — Responsive image pipeline

Use **multi-width WebP + `srcset`**, and **only generate the widths you actually use** (don't make unused 2x assets). Generate from source PNG/screenshots:

```bash
for w in 660 990 1320; do
  cwebp -q 82 -resize $w 0 home.png -o assets/img/home-$w.webp
done
# no cwebp? sips/ImageMagick: sips -Z 990 home.png --out /tmp/h.png && cwebp -q 82 /tmp/h.png -o assets/img/home-990.webp
```

In HTML — hero is eager + high priority, everything below the fold is lazy:
```html
<img src="assets/img/home-990.webp"
     srcset="assets/img/home-660.webp 660w, assets/img/home-990.webp 990w, assets/img/home-1320.webp 1320w"
     sizes="(max-width:760px) 86vw, 380px"
     width="990" height="2151" alt="Home screen showing today's score"
     fetchpriority="high">
```
- **`width`/`height` must equal each image's REAL pixel dimensions** (prevents layout shift). Read them: `sips -g pixelWidth -g pixelHeight home.png` (macOS) or `identify home.png` (ImageMagick). Don't copy a literal height between images of different aspect ratios.
- Below the fold: add `loading="lazy" decoding="async"`.
- `alt` describes informative images (it's product copy); only purely decorative images get `alt=""`.

---

## Hosting (GitHub Pages / static)

- Minimal: commit `index.html` + `assets/`, enable Settings → Pages. If you're not using Jekyll, add an empty `.nojekyll`.
- **Project-subpath trap (`user.github.io/repo/`):** absolute paths like `/assets/...` break. Use **relative** `assets/...`, or set a `<base>` / baseurl. If a custom domain is coming, add `CNAME` from the start.
- **Cache busting is manual `?v=N`** on the CSS/JS/og links. Bump N whenever you change those files (there's no fingerprinting).

---

## Pre-ship checklist (run every item)

- [ ] **No placeholder links** — CTAs/badges must have real `href`s, never `#`
- [ ] Real content only (no lorem, no dummy images)
- [ ] Responsive at 360 / 760 / 1280 / ultrawide (grid columns collapse correctly)
- [ ] `prefers-reduced-motion` stops all animation + smooth scroll (in **both** CSS and JS)
- [ ] Keyboard operable, `:focus-visible` visible, skip link present, decorative nodes `aria-hidden`
- [ ] Images: multi-width WebP + `srcset`, `width`/`height` = real pixels (no CLS), meaningful `alt` on informative images, below-fold lazy
- [ ] Performance: zero deps, preconnect, `font-display:swap`, one CSS + one JS, scroll uses rAF + passive
- [ ] Cache-busting `?v=N` bumped
- [ ] Full `<head>`: charset, `lang`, title, description, theme-color, favicon, OGP + twitter:card with a real `og:image`
- [ ] **Color contrast ≥ AA**: accent *text* on bg ≥ 4.5:1; solid-fill buttons use near-black `--on-accent` text. (Light/mid brand colors fail as text — see the CONTRAST note in Template A.)

## Anti "AI-slop" principles
- One accent color; deploy it boldly in a few places (don't let everything shout).
- Pick a display font with character (avoid defaulting to Inter for everything). Gradient-clip headlines work — don't overuse them.
- **Respect whitespace.** One message per section; don't cram.
- Motion is "pleasant when noticed," never busy — always disabled under reduced-motion.
- Concrete copy. Avoid empty triads like "Powerful. Simple. Beautiful."
- For hard aesthetic calls, also use the `frontend-design` skill.

---

When done, serve locally (`python3 -m http.server`), eyeball **both** 360px and 1280px, and clear every checklist item before presenting.
