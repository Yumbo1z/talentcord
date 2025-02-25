document.addEventListener("DOMContentLoaded", async () => {
  let response = await fetch("/users");
  let json = await response.json();
  const listings = document.getElementById("listings");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  for (let user of json) {
    let tags = user.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join(" ");

    // Map badges to Font Awesome icons
    let badges = user.badges
      .map((badge) => {
        return `<div class="badge-container">
                <i class="${badge.faClass} badge-icon"></i>
                <span class="badge-tooltip">${badge.name}</span>
              </div>`;
      })
      .join("");

    listings.innerHTML += `
    <div class="listing-card" data-user="${user.username}" data-perms="${user.permissions}">
      <img src="${user.icon}" alt="User Avatar" class="avatar">
      <div class="listing-info">
        <div class="profile-header">
          <h3><a style="color: white;" href="${user.portfolio}" onclick="confirmExit(event, '${user.portfolio}')" target="_blank">${user.username}</a></h3>
          <div class="badge-icons">
            ${badges}
          </div>
        </div>
        <p>${user.bio}</p>
        <div class="tags">${tags}</div>
      </div>
    </div>`;
  }

  document.querySelectorAll(".listing-card").forEach((card) => {
    card.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (currentUser) {
        let currentUserMoreData = json.find(
          (v) => v.username === currentUser.username
        );
        if (currentUserMoreData.permissions === 1) showContextMenu(event, card);
      }
    });
  });

  refreshPosts();
});

function showContextMenu(event, card) {
  const menu = document.getElementById("customContextMenu");
  menu.style.display = "block";
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;
  menu.dataset.username = card.dataset.user;
  menu.dataset.perms = card.dataset.perms;
}

function showPostContextMenu(event, card) {
  const menu = document.getElementById("postContextMenu");
  menu.style.display = "block";
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;
  menu.dataset.username = card.dataset.user;
  menu.dataset.perms = card.dataset.perms;
}

document.addEventListener("click", () => {
  const menu = document.getElementById("customContextMenu");
  menu.style.display = "none";
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

// Ban and Timeout functions
async function banUser() {
  const username =
    document.getElementById("customContextMenu").dataset.username;
  const targetPerms =
    document.getElementById("customContextMenu").dataset.perms;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/ban", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Successfully banned user!");
    } else {
      alert("Failed to banned user: " + result.message);
    }
  } catch (error) {
    console.error("Error during ban:", error);
    alert("An error occurred. Please try again later.");
  }
}

async function timeoutUser() {
  const username =
    document.getElementById("customContextMenu").dataset.username;
  const targetPerms =
    document.getElementById("customContextMenu").dataset.perms;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/timeout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Successfully timeouted user!");
    } else {
      alert("Failed to timeout user: " + result.message);
    }
  } catch (error) {
    console.error("Error during timeout:", error);
    alert("An error occurred. Please try again later.");
  }
}

async function givedev() {
  const username =
    document.getElementById("customContextMenu").dataset.username;
  const targetPerms =
    document.getElementById("customContextMenu").dataset.perms;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/givedev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Success");
    } else {
      alert("Failed to award user: " + result.message);
    }
  } catch (error) {
    console.error("Error during awarding:", error);
    alert("An error occurred. Please try again later.");
  }
}

async function givemod() {
  const username =
    document.getElementById("customContextMenu").dataset.username;
  const targetPerms =
    document.getElementById("customContextMenu").dataset.perms;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/givemod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Success");
    } else {
      alert("Failed to award user: " + result.message);
    }
  } catch (error) {
    console.error("Error during awarding:", error);
    alert("An error occurred. Please try again later.");
  }
}

async function giveverified() {
  const username =
    document.getElementById("customContextMenu").dataset.username;
  const targetPerms =
    document.getElementById("customContextMenu").dataset.perms;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/giveverified", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Success");
    } else {
      alert("Failed to award user: " + result.message);
    }
  } catch (error) {
    console.error("Error during awarding:", error);
    alert("An error occurred. Please try again later.");
  }
}

// Open modal
function openModal(modalId, type) {
  document.getElementById(modalId).style.display = type;
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Toggle to Create Account modal
function toggleToCreateAccount() {
  closeModal("signInModal");
  openModal("createAccountModal", "block");
}

// Toggle to Sign In modal
function toggleToSignIn() {
  closeModal("createAccountModal");
  openModal("signInModal", "block");
}

// Form submission functions
function postSignIn(event) {
  event.preventDefault();
  // Handle sign-in logic here
  closeModal("signInModal");
}

function postCreateAccount(event) {
  event.preventDefault();
  // Handle account creation logic here
  closeModal("createAccountModal");
}

function replaceCrossWithAvatar(avatarUrl) {
  const navbar = document.querySelector(".navbar");
  const plusIcon = navbar.querySelector(".plus-icon");
  // Replace the icon with the avatar
  plusIcon.outerHTML = `<div class="plus-icon" onclick="openModal('editProfileModal', 'block')"><img src="${avatarUrl}" alt="Avatar" class="avatar" style="width: 40px; height: 40px; border-radius: 50%;"/></div>`;
}

function signout() {
  event.preventDefault();
  localStorage.removeItem("user");
  alert("Successfully signed out!");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
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

async function postCreateAccount(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get values from the form
  const username = document.getElementById("create-username").value;
  const email = document.getElementById("create-email").value;
  const password = document.getElementById("create-password").value;
  const bio = document.getElementById("create-bio").value;
  const portfolio = document.getElementById("create-portfolio").value;

  // Collect checked tags
  const tags = selectedTags;

  try {
    const response = await fetch("/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        bio: bio,
        portfolio: portfolio,
        tags: tags,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Handle success, for example, show a welcome message or redirect
      alert("Account created successfully!");
      closeModal("createAccountModal"); // Close the modal after account creation
    } else {
      // Handle error, for example, display an error message
      alert("Account creation failed: " + result.message);
    }
  } catch (error) {
    console.error("Error during account creation:", error);
    alert("An error occurred during account creation. Please try again later.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user data exists in localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData) {
    replaceCrossWithAvatar(userData.avatar); // Replace the cross icon with an avatar
  }

  // Refresh page if user is signed in
  if (window.location.search.includes("token")) {
    const username = new URLSearchParams(window.location.search).get(
      "username"
    );
    const token = new URLSearchParams(window.location.search).get("token");
    const avatar = new URLSearchParams(window.location.search).get("avatar");

    const user = { username, avatar, token };
    localStorage.setItem("user", JSON.stringify(user)); // Save user data to localStorage
    window.location.href = "https://talentcord.org/";
  }
});

//post
document.getElementById("open-post").addEventListener("click", (e) => {
  if (!localStorage.user) {
    e.preventDefault();
    alert("Sign in to post!");
  } else {
    openModal("postdiv", "flex");
  }
});

const form = document.getElementById("postdiv");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("post-now").disabled = true;
  const data = Object.fromEntries(new FormData(form).entries());
  const userData = JSON.parse(localStorage.getItem("user"));
  const response = await fetch("/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { content: data.content, token: userData.token },
    }),
  });

  if (response.ok) {
    const successData = await response.json();
    alert(successData.success);
    document.getElementById("post-now").disabled = false;
    closeModal("postdiv");
    refreshPosts();
  } else {
    const errorData = await response.json();
    alert(errorData.error);
    document.getElementById("post-now").disabled = false;
  }
});

async function refreshPosts() {
  let response = await fetch("/posts");
  let json = await response.json();
  const posts = document.getElementById("posts");

  // Clear the existing posts before adding new ones
  posts.innerHTML = "";

  const currentUser = JSON.parse(localStorage.getItem("user"));

  for (let post of json) {
    // Map badges to Font Awesome icons
    let badges = post.badges
      .map((badge) => {
        return `<div class="badge-container">
                <i class="${badge.faClass} badge-icon"></i>
                <span class="badge-tooltip">${badge.name}</span>
              </div>`;
      })
      .join("");

    posts.innerHTML += `
    <div class="post-card" data-user="${post.username}" data-perms="${post.permissions}">
      <img src="${post.icon}" alt="User Avatar" class="avatar">
      <div class="listing-info">
        <div class="profile-header">
          <h3><a style="color: white;" href="${post.portfolio}" onclick="confirmExit(event, '${post.portfolio}')" target="_blank">${post.username}</a></h3>
          <div class="badge-icons">
            ${badges}
          </div>
        </div>
        <p>${post.content}</p>
      </div>
    </div>`;
  }

  document.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (currentUser) {
        let currentUserMoreData = json.find(
          (v) => v.username === currentUser.username
        );
        if (currentUserMoreData.permissions === 1)
          showPostContextMenu(event, card);
      }
    });
  });
}
