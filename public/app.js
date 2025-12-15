const form = document.querySelector(".lead-form");
const emailInput = form?.querySelector("#email");
const messageBox = form?.querySelector(".form-message");
const submitButton = form?.querySelector('button[type="submit"]');

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

  submitButton.disabled = true;
  setMessage("Transmission en cours…");

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const reason = detail?.message || "Service momentanément indisponible.";
      throw new Error(reason);
    }

    setMessage("Checklist envoyée. Vérifiez votre boîte mail.", "success");
    form.reset();
  } catch (err) {
    setMessage(err.message || "Une erreur est survenue.", "error");
  } finally {
    submitButton.disabled = false;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
