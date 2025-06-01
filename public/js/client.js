document.addEventListener("DOMContentLoaded", async () => {
  let footer = document.getElementById("current-year");

  if (footer) footer.textContent = new Date().getFullYear();
});

function toggleModal(ID) {
  const customizeModal = document.getElementById(ID);

  customizeModal.style.display =
    customizeModal.style.display === "block" ? "none" : "block";
}
