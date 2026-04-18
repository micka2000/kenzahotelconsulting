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
- Form feedback — `scrollIntoView` on submit
- Manifeste — close all cards on mobile ≤640px
- `prefers-reduced-motion` support
- 44px touch targets across all interactive elements
- ARIA labels for new mobile nav element
- 375px breakpoint pass
- `.iti__tel-input` font-size: 16px fix
- Scroll reveal: reduce `translateY(32px)` → `16px` at ≤640px

## Out of Scope

- Full dark mode palette (separate design effort — charcoal + gold system)
- New sections or pages
- Supabase integration
- Desktop layout changes

## Design Decisions Made

| # | Decision | Choice |
|---|---|---|
| 1 | Mobile topbar layout | `[ MK ] · [ FR \| Contact ]` — no hamburger |
| 2 | Form feedback on mobile | `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` |
| 3 | Manifeste first card open on mobile | Close all cards on ≤640px via JS |
| 4 | Touch state pattern | `scale(0.98)` on `:active` (not `translateY`) |
| 5 | Dark mode | `<meta name="color-scheme" content="light">` |
| 6 | Reduced motion | Full `prefers-reduced-motion` block in CSS |

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

### 2. `docs/styles.css` additions

**Mobile Contact CTA (matches lang-select visual language):**
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
  .nav-cta-mobile { display: inline-flex; align-items: center; }
}
```

**iOS Safari CTA fix:**
```css
@media (hover: none) {
  .cta-primary:active { --active: 1; }
}
```

**Touch states (scale, not translateY):**
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
  .nav-cta-mobile { min-height: 44px; }
}
```

**Scroll reveal optimization for mobile:**
```css
@media (max-width: 640px) {
  [data-reveal] {
    transform: translateY(16px);
    transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
  }
}
```

**intl-tel-input at 400px:**
```css
@media (max-width: 400px) {
  .iti {
    grid-template-columns: 72px 1fr;
  }
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

**`prefers-reduced-motion`:**
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

### 3. `docs/app.js` changes

**Manifeste: close all on mobile:**
```js
// In initReveals() or a new init block:
if (window.innerWidth <= 640) {
  document.querySelectorAll('.manifesto-card[open]')
    .forEach(el => el.removeAttribute('open'));
}
```

**Form: scroll feedback into view after submit:**
```js
// In handleSubmit, after setMessage(t.lead.success, 'success'):
messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
```

**intl-tel-input: font-size fix:**
```js
// After iti init:
if (itiInstance) {
  const telInput = document.querySelector('.iti__tel-input');
  if (telInput) telInput.style.fontSize = '16px';
}
```

## Files Affected

| File | Change type |
|---|---|
| `docs/index.html` | Add 2 elements (meta tag + Contact CTA) |
| `docs/styles.css` | Add ~60 lines to responsive section |
| `docs/app.js` | Add ~8 lines (manifeste init + scrollIntoView + iti fix) |

## Success Criteria

- [ ] All 6 sections reachable via tap on 375px
- [ ] Dark mode system setting: site renders warm off-white, not browser-darkened
- [ ] Cards give `scale(0.98)` feedback on tap
- [ ] Gold CTA animation fires on tap on iOS Safari
- [ ] Form success message scrolls into view after submit
- [ ] Inputs do not trigger iOS zoom
- [ ] No content overflow at 375px, 390px, 414px
- [ ] `prefers-reduced-motion` users see static layout

## Future Work (Out of Scope)

- Full dark palette: deep charcoal (#1a1a1a) background with warm gold on near-black — a full redesign of the color system for dark mode lovers
