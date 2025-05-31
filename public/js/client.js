document.addEventListener("DOMContentLoaded", async () => {
  let footer = document.getElementById("current-year");

  if (footer) footer.textContent = new Date().getFullYear();
});

function showToast(message, color = "default") {
  const container = document.getElementById("toast-container");

  // Create a new toast element
  const toast = document.createElement("div");
  toast.classList.add("toast", "show", color !== "default" ? color : "default");
  toast.innerText = message;

  // Append the new toast to the container
  container.appendChild(toast);

  // Automatically remove the toast after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      container.removeChild(toast);
    }, 500); // Allow the fade-out animation to finish before removal
  }, 5000);
}

function toggleModal(ID) {
  const customizeModal = document.getElementById(ID);

  customizeModal.style.display =
    customizeModal.style.display === "block" ? "none" : "block";
}
