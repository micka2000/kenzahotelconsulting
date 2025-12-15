const form = document.querySelector(".lead-form");
const emailInput = form?.querySelector("#email");
const messageBox = form?.querySelector(".form-message");
const submitButton = form?.querySelector('button[type="submit"]');
const langSelect = document.querySelector(".lang-select");
const firstNameInput = form?.querySelector("#firstName");
const lastNameInput = form?.querySelector("#lastName");
const phoneInput = form?.querySelector("#phone");

const SUPABASE_URL = "VOTRE_URL";
const SUPABASE_KEY = "VOTRE_KEY";

let supabaseClient = null;
if (window.supabase && SUPABASE_URL !== "VOTRE_URL" && SUPABASE_KEY !== "VOTRE_KEY") {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const translations = {
  fr: {
    topbar: { label: "Langue", optionFr: "Français", optionEn: "English" },
    eyebrow: "Maison MK",
    hero: {
      title: "Élevez votre établissement au rang d'Institution",
      subtitle: "Audit & Conseil Vision Michelin",
      cta: "Découvrir la méthode",
    },
    manifesto: {
      overline: "#manifeste",
      heading: '🐺 Le "Manifeste de l\'Exigence" (QQOQCCP Maison MK)',
      intro: "Un pacte pour les dirigeants qui visent la perfection absolue. Chaque principe est une lame de précision.",
      items: [
        {
          tag: "1. QUI",
          title: "La Cible d'Élite",
          subtitle: "Pour les propriétaires et directeurs qui visent la perfection absolue.",
          body:
            'Ce n\'est pas pour l\'hôtelier moyen. Nous nous adressons exclusivement à ceux qui savent que "bien" est l\'ennemi de "l\'exceptionnel". Si vous cherchez juste à remplir vos chambres, passez votre chemin. Si vous cherchez la gloire du sans-faute, on parle.',
        },
        {
          tag: "2. QUOI",
          title: "L'Arme Absolue",
          subtitle: "Mise à niveau chirurgicale basée sur notre grille 6 Piliers, 3 Règles d'Or.",
          body:
            'Nous ne vendons pas du "conseil", nous vendons une Mise à Niveau Chirurgicale. On ne vous dit pas ce que vous voulez entendre, on vous révèle l\'écart exact entre votre état actuel et le sommet de la montagne.',
        },
        {
          tag: "3. OÙ",
          title: "Dans l'invisible qui compte",
          subtitle: "Le luxe se joue dans les gestes imperceptibles.",
          body: `
            <ul>
              <li><strong>Call Service :</strong> décrochez avant la 3e sonnerie avec le sourire dans la voix.</li>
              <li><strong>Rituel du Lit :</strong> tiré au cordeau, une invitation irrésistible au sommeil absolu.</li>
              <li><strong>Intimité (Douche) :</strong> pression parfaite, produits alignés au millimètre.</li>
              <li><strong>Touche Fantôme :</strong> chocolat, mot manuscrit, eau fraîche qui attend. L'intention précède le besoin.</li>
            </ul>
          `,
        },
        {
          tag: "4. QUAND",
          title: "Maintenant (The Gap)",
          subtitle: "Chaque jour avec un standard approximatif ancre de mauvaises habitudes.",
          body:
            "L'excellence n'attend pas. Vous êtes soit en train de monter en gamme, soit en train de glisser vers la banalité. Mickaël et son équipe ne prennent que des projets où l'ambition est réelle. Est-ce le cas aujourd'hui ?",
        },
        {
          tag: "5. COMMENT",
          title: 'La Méthode "Incognito"',
          subtitle: "Infiltration silencieuse, dissection, révélation.",
          body: `
            <ul>
              <li><strong>Infiltration :</strong> nous venons comme des clients lambda pour vivre l'expérience réelle.</li>
              <li><strong>Dissection :</strong> chaque interaction est comparée à notre Algorithme d'Excellence.</li>
              <li><strong>Révélation :</strong> un rapport qui transforme votre vision de votre propre hôtel.</li>
            </ul>
          `,
        },
        {
          tag: "6. COMBIEN",
          title: "L'Investissement vs le Coût",
          subtitle: "L'incompétence coûte, l'excellence rapporte.",
          body:
            "Ne voyez pas le prix de l'audit. Voyez la valeur d'un établissement qui peut justifier des prix 30% supérieurs car son service est irréprochable. Le ROI se grave dans la fidélité de vos clients VIP.",
        },
        {
          tag: "7. POURQUOI",
          title: "La Fierté",
          subtitle: "Créer de l'émotion, du souvenir, de la magie.",
          body:
            "Vous ne faites pas ce métier pour être \"correct\". Vous le faites pour écrire une légende. Votre hôtel a le potentiel d'être une Institution : il suffit d'un regard extérieur impitoyable pour l'atteindre.",
        },
      ],
    },
    pillars: {
      overline: "Les 6 Piliers",
      title: "Notre grille d'excellence",
      intro: "Chaque pilier est audité, mesuré et orchestré pour délivrer une signature intemporelle.",
      items: [
        { title: "Ancrage", text: "Un récit ancré dans le lieu, exprimé avec justesse et retenue." },
        { title: "Esthétique", text: "Volumes, lumières, textures : un équilibre sans ostentation." },
        { title: "Savoir-Être", text: "Une chorégraphie humaine qui précède les attentes, jamais l'effet." },
        { title: "Signature Culinaire", text: "Une narration gustative cohérente, du lever au dernier verre." },
        { title: "Fluidité Service", text: "Des parcours invités orchestrés, sans friction ni répétition." },
        { title: "Aura Sonore", text: "Une acoustique et une bande-son qui sculptent le silence habité." },
      ],
    },
    lead: {
      overline: "Formulaire de contact",
      title: "Planifions une conversation sur vos objectifs",
      subtitle: "Partagez vos coordonnées : nous revenons vers vous avec une proposition sur mesure pour élever votre maison au rang d'institution.",
      firstNameLabel: "Prénom",
      lastNameLabel: "Nom",
      emailLabel: "Email",
      phoneLabel: "Téléphone",
      firstNamePlaceholder: "Prénom",
      lastNamePlaceholder: "Nom",
      emailPlaceholder: "nom@domaine.com",
      phonePlaceholder: "Numéro de téléphone",
      button: "Recevoir",
      hint: "Nous n'envoyons ni spam ni séquences automatiques. Un seul envoi, signature MK.",
      success: "Message envoyé. Vérifiez votre boîte mail.",
      invalid: "Entrez un email valide.",
      duplicate: "Cet email est déjà inscrit. Merci !",
      missingConfig: "Configuration Supabase manquante. Ajoutez vos clés.",
      error: "Une erreur est survenue.",
    },
    footer: { copy: "Maison MK © 2025. L'Excellence en Signature." },
  },
  en: {
    topbar: { label: "Language", optionFr: "French", optionEn: "English" },
    eyebrow: "Maison MK",
    hero: {
      title: "Raise your property to Institution status",
      subtitle: "Audit & Advisory — Michelin Vision",
      cta: "Discover the method",
    },
    manifesto: {
      overline: "#manifesto",
      heading: '🐺 The "Manifesto of Demanding Excellence" (QQOQCCP Maison MK)',
      intro: "A pact for leaders pursuing absolute perfection. Each principle is a precision blade.",
      items: [
        {
          tag: "1. WHO",
          title: "The Elite Target",
          subtitle: "For owners and GMs aiming for absolute perfection.",
          body:
            'This is not for average hoteliers. It is for those who know "good" is the enemy of "exceptional." If you just want rooms filled, move on. If you want flawless glory, let’s talk.',
        },
        {
          tag: "2. WHAT",
          title: "The Absolute Weapon",
          subtitle: "A surgical upgrade based on our 6 Pillars and 3 Golden Rules.",
          body:
            "We don’t sell advice; we deliver a Surgical Upgrade. We reveal the exact gap between where you are and the summit.",
        },
        {
          tag: "3. WHERE",
          title: "In the Invisible That Counts",
          subtitle: "Luxury lives in imperceptible gestures.",
          body: `
            <ul>
              <li><strong>Call Service:</strong> pick up before the 3rd ring with a smile in your voice.</li>
              <li><strong>Bed Ritual:</strong> razor-sharp turndown, an irresistible invitation to absolute sleep.</li>
              <li><strong>Intimacy (Shower):</strong> perfect pressure, amenities aligned to the millimeter.</li>
              <li><strong>Phantom Touch:</strong> chocolate, handwritten note, fresh water waiting. Intent precedes need.</li>
            </ul>
          `,
        },
        {
          tag: "4. WHEN",
          title: "Now (The Gap)",
          subtitle: "Every day with approximate standards hardwires bad habits.",
          body:
            "Excellence won’t wait. You are either moving upmarket or sliding into banality. Mickaël and team only engage where ambition is real. Is it today?",
        },
        {
          tag: "5. HOW",
          title: 'The "Incognito" Method',
          subtitle: "Silent infiltration, dissection, revelation.",
          body: `
            <ul>
              <li><strong>Infiltration:</strong> we come as regular guests and live the real experience.</li>
              <li><strong>Dissection:</strong> every interaction is benchmarked against our Algorithm of Excellence.</li>
              <li><strong>Revelation:</strong> a report that reframes how you see your own hotel.</li>
            </ul>
          `,
        },
        {
          tag: "6. HOW MUCH",
          title: "Investment vs Cost",
          subtitle: "Incompetence costs; excellence pays back.",
          body:
            "Don’t look at the audit price. Look at the value of a property that can command rates 30% higher because its service is flawless. ROI is etched in VIP loyalty.",
        },
        {
          tag: "7. WHY",
          title: "Pride",
          subtitle: "Craft emotion, memories, and magic.",
          body:
            'You are not in this business to be "fine." You do it to write a legend. Your hotel can become an Institution; it takes an exacting external eye to get there.',
        },
      ],
    },
    pillars: {
      overline: "The 6 Pillars",
      title: "Our grid of excellence",
      intro: "Each pillar is audited, measured, and orchestrated to deliver a timeless signature.",
      items: [
        { title: "Anchoring", text: "A narrative rooted in place, expressed with restraint." },
        { title: "Aesthetics", text: "Volumes, light, textures: balance without ostentation." },
        { title: "Service Poise", text: "A human choreography that anticipates expectations, never effects." },
        { title: "Culinary Signature", text: "A coherent taste narrative, from sunrise to last glass." },
        { title: "Service Flow", text: "Guest journeys orchestrated without friction or repetition." },
        { title: "Sonic Aura", text: "Acoustics and soundscape that sculpt inhabited silence." },
      ],
    },
    lead: {
      overline: "Contact Form",
      title: "Let's schedule a conversation about your goals",
      subtitle: "Share your details: we'll return with a tailored proposal to elevate your property to institution status.",
      firstNameLabel: "First name",
      lastNameLabel: "Last name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      emailPlaceholder: "name@company.com",
      phonePlaceholder: "Phone number",
      button: "Send",
      hint: "No spam or sequences. A single follow-up, signature MK.",
      success: "Message sent. Check your inbox.",
      invalid: "Enter a valid email.",
      duplicate: "This email is already registered. Thank you!",
      missingConfig: "Supabase configuration missing. Add your keys.",
      error: "An error occurred.",
    },
    footer: { copy: "Maison MK © 2025. Excellence in Signature." },
  },
};

let currentLang = "fr";

const setMessage = (text, type = "") => {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = `form-message${type ? " " + type : ""}`;
};

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(String(value).trim());

const translationsApply = (lang) => {
  currentLang = translations[lang] ? lang : "fr";
  const t = translations[currentLang];
  document.documentElement.lang = currentLang;

  const setText = (target, value) => {
    if (typeof value !== "string") return;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) el.textContent = value;
  };

  const setHtml = (target, value) => {
    if (typeof value !== "string") return;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) el.innerHTML = value;
  };

  setText('[data-i18n="topbar.label"]', t.topbar.label);
  const optFr = document.querySelector('.lang-select option[value="fr"]');
  const optEn = document.querySelector('.lang-select option[value="en"]');
  if (optFr) optFr.textContent = t.topbar.optionFr;
  if (optEn) optEn.textContent = t.topbar.optionEn;

  setText('[data-i18n="eyebrow"]', t.eyebrow);
  setText('[data-i18n="hero.title"]', t.hero.title);
  setText('[data-i18n="hero.subtitle"]', t.hero.subtitle);
  setText('[data-i18n="hero.cta"]', t.hero.cta);

  setText('[data-i18n="manifesto.overline"]', t.manifesto.overline);
  setText('[data-i18n="manifesto.heading"]', t.manifesto.heading);
  setText('[data-i18n="manifesto.intro"]', t.manifesto.intro);
  const manifestoCards = document.querySelectorAll(".manifesto-card");
  manifestoCards.forEach((card, idx) => {
    const item = t.manifesto.items[idx];
    if (!item) return;
    const tagEl = card.querySelector('[data-i18n^="manifesto.items"][data-i18n$=".tag"]');
    const titleEl = card.querySelector('[data-i18n^="manifesto.items"][data-i18n$=".title"]');
    const subEl = card.querySelector('[data-i18n^="manifesto.items"][data-i18n$=".subtitle"]');
    const bodyEl = card.querySelector('[data-i18n-html^="manifesto.items"]');
    if (tagEl) tagEl.textContent = item.tag;
    if (titleEl) titleEl.textContent = item.title;
    if (subEl) subEl.textContent = item.subtitle;
    if (bodyEl) setHtml(bodyEl, item.body);
  });

  setText('[data-i18n="pillars.overline"]', t.pillars.overline);
  setText('[data-i18n="pillars.title"]', t.pillars.title);
  setText('[data-i18n="pillars.intro"]', t.pillars.intro);
  const pillarCards = document.querySelectorAll(".editorial-grid .article-card");
  pillarCards.forEach((card, idx) => {
    const item = t.pillars.items[idx];
    if (!item) return;
    const h3 = card.querySelector("h3");
    const p = card.querySelector("p");
    if (h3) h3.textContent = item.title;
    if (p) p.textContent = item.text;
  });

  setText('[data-i18n="lead.overline"]', t.lead.overline);
  setText('[data-i18n="lead.title"]', t.lead.title);
  setText('[data-i18n="lead.subtitle"]', t.lead.subtitle);
  setText('[data-i18n="lead.firstNameLabel"]', t.lead.firstNameLabel);
  setText('[data-i18n="lead.lastNameLabel"]', t.lead.lastNameLabel);
  setText('[data-i18n="lead.emailLabel"]', t.lead.emailLabel);
  setText('[data-i18n="lead.phoneLabel"]', t.lead.phoneLabel);
  setText('[data-i18n="lead.button"]', t.lead.button);
  setText('[data-i18n="lead.hint"]', t.lead.hint);
  if (firstNameInput) firstNameInput.placeholder = t.lead.firstNamePlaceholder;
  if (lastNameInput) lastNameInput.placeholder = t.lead.lastNamePlaceholder;
  if (emailInput) emailInput.placeholder = t.lead.emailPlaceholder;
  if (phoneInput && !window.iti) phoneInput.placeholder = t.lead.phonePlaceholder;

  setText('[data-i18n="footer.copy"]', t.footer.copy);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!emailInput || !submitButton) return;

  const t = translations[currentLang];
  const email = emailInput.value.trim();
  const firstName = firstNameInput ? firstNameInput.value.trim() : "";
  const lastName = lastNameInput ? lastNameInput.value.trim() : "";
  const phoneRaw = phoneInput ? phoneInput.value.trim() : "";

  if (!isValidEmail(email)) {
    setMessage(t.lead.invalid, "error");
    emailInput.focus();
    return;
  }
  if (!firstName || !lastName) {
    setMessage(currentLang === "en" ? "Please fill first and last name." : "Renseignez prénom et nom.", "error");
    return;
  }

  submitButton.disabled = true;
  setMessage(currentLang === "en" ? "Sending…" : "Transmission en cours…");

  try {
    let formattedPhone = phoneRaw || null;
    if (phoneRaw && window.iti) {
      if (!window.iti.isValidNumber()) {
        throw new Error(currentLang === "en" ? "Invalid phone number." : "Numéro de téléphone invalide.");
      }
      formattedPhone = window.iti.getNumber();
    }

    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: formattedPhone,
      company: "N/A",
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const reason = detail?.message || t.lead.error;
      throw new Error(reason);
    }

    setMessage(t.lead.success, "success");
    form.reset();
  } catch (err) {
    setMessage(err.message || t.lead.error, "error");
  } finally {
    submitButton.disabled = false;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    translationsApply(e.target.value);
  });
}

let itiInstance = null;
if (phoneInput && window.intlTelInput) {
  itiInstance = window.intlTelInput(phoneInput, {
    initialCountry: "fr",
    allowDropdown: true,
    autoPlaceholder: "polite",
    separateDialCode: false,
    nationalMode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js",
  });
  window.iti = itiInstance;
  phoneInput.placeholder = itiInstance.getPlaceholder() || "";
  phoneInput.addEventListener("countrychange", () => {
    phoneInput.placeholder = itiInstance.getPlaceholder() || "";
  });
}

translationsApply("fr");
