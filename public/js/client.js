document.addEventListener("DOMContentLoaded", async () => {
  let footer = document.getElementById("current-year");

  if (footer) footer.textContent = new Date().getFullYear();
});

function toggleModal(ID) {
  const customizeModal = document.getElementById(ID);

  customizeModal.style.display =
    customizeModal.style.display === "block" ? "none" : "block";
}

function replaceCrossWithAvatar(avatarUrl) {
  const navbar = document.querySelector(".navbar");
  const plusIcon = navbar.querySelector(".plus-icon");
  // Replace the icon with the avatar
  plusIcon.outerHTML = `<div class="plus-icon" onclick="openModal('editProfileModal', 'block')"><img src="${avatarUrl}" id="AvatarImage" class="plus-avatar"/></div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user data exists in localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    let response = await fetch("/users");
    let json = await response.json();
    let currentUser = json.find((p) => p.username === userData.username);
    replaceCrossWithAvatar(currentUser.icon); // Replace the cross icon with an avatar
  }

  // Refresh page if user is signed in
  if (window.location.search.includes("token")) {
    const username = new URLSearchParams(window.location.search).get(
      "username"
    );
    const token = new URLSearchParams(window.location.search).get("token");
    const id = new URLSearchParams(window.location.search).get("id");

    const user = { username, id, token };
    localStorage.setItem("user", JSON.stringify(user)); // Save user data to localStorage
    window.location.href = "https://talentcord.org/";
  }
});

function confirmExit(event, url) {
  event.preventDefault(); // Prevents the link from opening immediately

  // Create the confirmation modal
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Darker overlay
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1000";

  let modalContent = document.createElement("div");
  modalContent.style.background = "#23272a"; // Dark theme modal background
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";
  modalContent.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
  modalContent.style.width = "400px";

  modalContent.innerHTML = `
        <p style="font-size: 18px; color: #fff;">⚠️ Watch out! You're about to leave TalentCord.</p>
        <p style="font-size: 16px; color: #b9bbbe;">You're going to: <br><strong style="color: #7289da;">${url}</strong></p>
        <button id="confirmLeave" class="about-button">Accept</button>
        <button id="cancelLeave" class="about-button">Decline</button>
    `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Handle button actions
  document
    .getElementById("confirmLeave")
    .addEventListener("click", function () {
      window.open(url, "_blank"); // Open in new tab
      document.body.removeChild(modal); // Close modal
    });

  document.getElementById("cancelLeave").addEventListener("click", function () {
    document.body.removeChild(modal); // Just close the modal
  });
}

// Open modal
function openModal(modalId, type) {
  document.getElementById(modalId).style.display = type;
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Toggle to Sign In modal
function toggleToSignIn() {
  closeModal("createAccountModal");
  openModal("signInModal", "block");
}

function signout() {
  event.preventDefault();
  localStorage.removeItem("user");
  alert("Successfully signed out!");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

// Handle the form submission for bio and tags update
async function postEditProfile(event) {
  event.preventDefault();
  const bio = document.getElementById("edit-bio").value;
  const portfolio = document.getElementById("edit-portfolio").value;
  const avatar = document.getElementById("edit-avatar").value;

  const tags = selectedTagsEP; // Get the updated tags

  const userData = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch("/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
        bio: bio,
        tags: tags,
        portfolio: portfolio,
        token: userData.token,
      }),
    });

    if (response.ok) {
      alert("Profile updated successfully");
      closeModal("editProfileModal");
      location.reload(); // Reload the page to reflect updated profile
    } else {
      alert("Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}

// Function to handle Sign In form submission
async function postSignIn(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get values from the form
  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = result.redirectUrl; // Redirect to the URL returned from the server
    } else {
      alert("Sign in failed: " + result.message);
    }
  } catch (error) {
    console.log(error);
    console.error("Error during sign in:", error);
    alert("An error occurred during sign in. Please try again later.");
  }
}

const tagsContainerep = document.getElementById("tags-container-ep");
const selectedTagsEP = [];

tagsContainerep.addEventListener("click", (event) => {
  if (event.target.classList.contains("tag-button")) {
    const button = event.target;
    const tagValue = button.getAttribute("data-value");

    // Toggle selection
    if (selectedTagsEP.includes(tagValue)) {
      selectedTagsEP.splice(selectedTagsEP.indexOf(tagValue), 1);
      button.classList.remove("selected");
    } else {
      selectedTagsEP.push(tagValue);
      button.classList.add("selected");
    }
  }
});

// Function to handle Create Account form submission
const tagsContainer = document.getElementById("tags-container");
const selectedTags = [];

tagsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("tag-button")) {
    const button = event.target;
    const tagValue = button.getAttribute("data-value");

    // Toggle selection
    if (selectedTags.includes(tagValue)) {
      selectedTags.splice(selectedTags.indexOf(tagValue), 1);
      button.classList.remove("selected");
    } else {
      selectedTags.push(tagValue);
      button.classList.add("selected");
    }
  }
});
