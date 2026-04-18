# Plan: Mobile-First Experience — Maison MK

## Problem

The site has two breakpoints but several critical mobile gaps:

1. **Navigation disappears at 640px** — nav links hidden, no replacement.
2. **Dark mode broken** — no `prefers-color-scheme` rules; browser auto-darkens and distorts the gold palette.
3. **Touch states undefined** — hover effects have no touch/active equivalent.
4. **iOS Safari CTA bug** — `--active` CSS variable only fires on `:hover`, not on tap.
5. **Form feedback hidden by keyboard** — success/error message appears below submit button, hidden when keyboard is open.
6. **Manifeste first card forces scroll** — `<details open>` on first card pushes 6 others off-screen on 375px.
7. **intl-tel-input layout breaks at 400px** — flag column too wide.
8. **iOS input zoom** — `font-size < 16px` triggers unwanted zoom on focus.
9. **No `prefers-reduced-motion`** — vestibular accessibility gap.
10. **Missing 375px breakpoint** — no styles between 640px and 375px.

## In Scope

- Mobile navigation — minimal Contact CTA in topbar
- Dark mode fix — force light mode (meta tag)
- Touch states — `scale(0.98)` on `:active` for cards
- iOS Safari CTA fix
- Form feedback — `scrollIntoView` in `setMessage()` for ALL message types
- Manifeste — close all cards on mobile ≤640px via JS
- `prefers-reduced-motion` support
- 44px touch targets across all interactive elements
- ARIA labels for new mobile nav element
- 375px breakpoint pass
- `.iti__tel-input` font-size: 16px fix (in CSS, not JS)
- Scroll reveal: reduce `translateY(32px)` → `16px` at ≤640px
- Fix `setText()` to use `querySelectorAll` (so mobile CTA updates on lang switch)
- CSS ordering: `prefers-reduced-motion` block LAST in responsive section

## Out of Scope

- Full dark mode palette (separate design effort — charcoal + gold system)
- New sections or pages
- Supabase integration
- Desktop layout changes

## Design Decisions Made

| # | Decision | Choice |
|---|---|---|
| 1 | Mobile topbar layout | `[ MK ] · [ FR \| Contact ]` — no hamburger |
| 2 | Form feedback on mobile | `scrollIntoView` in `setMessage()` — fires for success AND errors |
| 3 | Manifeste first card open on mobile | Close all cards on ≤640px via JS |
| 4 | Touch state pattern | `scale(0.98)` on `:active` (not `translateY`) |
| 5 | Dark mode | `<meta name="color-scheme" content="light">` |
| 6 | Reduced motion | Full `prefers-reduced-motion` block LAST in CSS |
| 7 | i18n duplicate elements | `setText()` uses `querySelectorAll`/`forEach` |
| 8 | iti font-size fix | CSS, not JS inline style |
| 9 | Tests | Manual checklist (no test infra in repo) |

## Implementation

### 1. `docs/index.html`

Add inside `<head>`:
```html
<meta name="color-scheme" content="light">
```

Add in `.topbar-nav`, before `<span class="nav-divider">`:
```html
<a href="#lead" class="nav-cta-mobile" aria-label="Contact — planifier une consultation" data-i18n="nav.contact">Contact</a>
```

### 2. `docs/app.js`

**Fix `setText()` to use `querySelectorAll`:**
```js
const setText = (target, value) => {
  if (typeof value !== 'string') return;
  const els = typeof target === 'string'
    ? document.querySelectorAll(target)
    : [target];
  els.forEach(el => { if (el) el.textContent = value; });
};
```

**Fix `setMessage()` to scroll into view on every message:**
```js
const setMessage = (text, type = '') => {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = `form-message${type ? ' ' + type : ''}`;
  if (text) messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};
```

**Mobile init — close manifeste cards:**
```js
// Add to init block (alongside initReveals call):
if (window.innerWidth <= 640) {
  document.querySelectorAll('.manifesto-card[open]')
    .forEach(el => el.removeAttribute('open'));
}
```

### 3. `docs/styles.css` additions (append to RESPONSIVE section in order)

**Mobile Contact CTA:**
```css
.nav-cta-mobile {
  display: none;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--fg);
  text-transform: uppercase;
  transition: border-color 0.3s var(--ease);
}
@media (max-width: 640px) {
  .nav-cta-mobile { display: inline-flex; align-items: center; min-height: 44px; }
}
```

**iOS Safari CTA fix:**
```css
@media (hover: none) {
  .cta-primary:active { --active: 1; }
}
```

**Touch states:**
```css
.pillar-card:active,
.manifesto-card:active {
  transform: scale(0.98);
  transition: transform 0.1s var(--ease);
}
```

**44px touch targets:**
```css
@media (max-width: 640px) {
  .manifesto-card summary { min-height: 44px; }
  .lang-select { min-height: 44px; padding-top: 0; padding-bottom: 0; }
}
```

**Scroll reveal optimization:**
```css
@media (max-width: 640px) {
  [data-reveal] {
    transform: translateY(16px);
    transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
  }
}
```

**intl-tel-input fixes (CSS, not JS):**
```css
.iti__tel-input { font-size: 16px; }

@media (max-width: 400px) {
  .iti { grid-template-columns: 72px 1fr; }
}
```

**375px breakpoint pass:**
```css
@media (max-width: 400px) {
  .hero h1 { font-size: clamp(26px, 7vw, 34px); }
  .pillar-card { padding: 28px 20px 24px; }
  .lead-form { padding: 20px; }
  .manifesto-card { padding: 16px; }
}
```

**`prefers-reduced-motion` — MUST BE LAST in responsive section:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .pillar-card,
  .manifesto-card,
  .cta-primary {
    transition: none;
  }
}
```

## Files Affected

| File | Change type |
|---|---|
| `docs/index.html` | Add 2 elements (meta tag + Contact CTA) |
| `docs/styles.css` | Add ~70 lines to responsive section (ordering matters — reduced-motion last) |
| `docs/app.js` | Modify `setText()`, modify `setMessage()`, add mobile init block |

## Success Criteria (manual)

- [ ] All 6 sections reachable via tap on 375px
- [ ] Dark mode system setting: site renders warm off-white, not browser-darkened
- [ ] Cards give `scale(0.98)` feedback on tap
- [ ] Gold CTA animation fires on tap on iOS Safari
- [ ] Form success message scrolls into view after submit
- [ ] Form error message scrolls into view on server error
- [ ] Language switch FR→EN: mobile Contact button text updates
- [ ] Inputs do not trigger iOS zoom
- [ ] No content overflow at 375px, 390px, 414px
- [ ] `prefers-reduced-motion` users see static layout
- [ ] Manifeste cards all start closed on mobile

## Future Work (Out of Scope)

- Full dark palette: deep charcoal + warm gold on near-black — full redesign of color system

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR (PLAN) | 4 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR (FULL) | score: 5/10 → 8/10, 6 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** ENG + DESIGN CLEARED — ready to implement.
