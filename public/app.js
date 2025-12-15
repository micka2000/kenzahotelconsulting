const form = document.querySelector(".lead-form");
const emailInput = form?.querySelector("#email");
const messageBox = form?.querySelector(".form-message");
const submitButton = form?.querySelector('button[type="submit"]');

const SUPABASE_URL = "VOTRE_URL";
const SUPABASE_KEY = "VOTRE_KEY";

let supabaseClient = null;
if (window.supabase && SUPABASE_URL !== "VOTRE_URL" && SUPABASE_KEY !== "VOTRE_KEY") {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const setMessage = (text, type = "") => {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = `form-message${type ? " " + type : ""}`;
};

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(String(value).trim());

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!emailInput || !submitButton) return;

  const email = emailInput.value.trim();
  if (!isValidEmail(email)) {
    setMessage("Entrez un email valide.", "error");
    emailInput.focus();
    return;
  }

  if (!supabaseClient) {
    setMessage("Configuration Supabase manquante. Ajoutez vos clés.", "error");
    return;
  }

  submitButton.disabled = true;
  setMessage("Transmission en cours…");

  try {
    const { error } = await supabaseClient.from("prospects").insert({ email });

    if (error) {
      if (error.code === "23505") {
        setMessage("Cet email est déjà inscrit. Merci !", "success");
      } else {
        throw error;
      }
    } else {
      setMessage("Checklist envoyée. Vérifiez votre boîte mail.", "success");
      form.reset();
    }
  } catch (err) {
    setMessage(err.message || "Une erreur est survenue.", "error");
  } finally {
    submitButton.disabled = false;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
