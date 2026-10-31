const form = document.querySelector("#submission-form");
const button = document.querySelector("#submit-button");
const statusBox = document.querySelector("#status");
const fileInput = document.querySelector("#attachments");
const fileList = document.querySelector("#file-list");
document.querySelector("#year").textContent = new Date().getFullYear();

fileInput.addEventListener("change", () => {
  const files = [...fileInput.files];
  const total = files.reduce((sum, file) => sum + file.size, 0);
  fileList.textContent = files.length
    ? `${files.length} file(s) selected · ${(total / 1024 / 1024).toFixed(2)} MB total`
    : "";
  if (total > 8 * 1024 * 1024) {
    status("Attachments exceed the 8 MB total limit. Please remove some files.", "error");
  } else {
    statusBox.className = "status";
    statusBox.textContent = "";
  }
});

function status(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusBox.className = "status";
  const files = [...fileInput.files];
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > 8 * 1024 * 1024) return status("Attachments exceed the 8 MB total limit.", "error");

  const data = new FormData(form);
  data.delete("attachments");
  const payload = {
    name: data.get("name"),
    email: data.get("email"),
    organization: data.get("organization"),
    subject: data.get("subject"),
    message: data.get("message"),
    website: data.get("website"),
    consent: data.get("consent") === "on",
    attachments: await Promise.all(files.map(async file => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      content: await toBase64(file)
    })))
  };

  button.disabled = true;
  button.querySelector("span").textContent = "Submitting...";
  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Your submission could not be sent. Please try again.");
    form.reset();
    fileList.textContent = "";
    status("Your submission has been received. Thank you.", "success");
  } catch (error) {
    status(error.message || "Something went wrong. Please try again.", "error");
  } finally {
    button.disabled = false;
    button.querySelector("span").textContent = "Submit information";
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}