document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  let profile = document.getElementById("profile");

  profile.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (currentUser) {
      let currentUserMoreData = json.find(
        (v) => v.username === currentUser.username
      );
      if (currentUserMoreData.permissions === 1)
        showContextMenu(event, profile);
    }
  });

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
});

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user data exists in localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  let response = await fetch("/users");
  let json = await response.json();
  let currentUser = json.find((p) => p.username === userData.username);

  if (userData) {
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

document.addEventListener("click", () => {
  const menu = document.getElementById("customContextMenu");
  const menu2 = document.getElementById("postContextMenu");
  menu.style.display = "none";
  menu2.style.display = "none";
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
  menu.dataset.perms = card.dataset.perms;
  menu.dataset.id = card.dataset.id;
}

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

async function deletePost() {
  const username = document.getElementById("postContextMenu").dataset.username;
  const targetPerms = document.getElementById("postContextMenu").dataset.perms;
  const postId = document.getElementById("postContextMenu").dataset.id;
  const userData = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch("/delete-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userData.token,
        targetUsername: username,
        targetPerms,
        id: postId,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Successfully deleted post!");
    } else {
      alert("Failed to delete post: " + result.message);
    }
  } catch (error) {
    console.error("Error during ban:", error);
    alert("An error occurred. Please try again later.");
  }
}

function replaceCrossWithAvatar(avatarUrl) {
  const navbar = document.querySelector(".navbar");
  const plusIcon = navbar.querySelector(".plus-icon");
  // Replace the icon with the avatar
  plusIcon.outerHTML = `<div class="plus-icon" onclick="openModal('editProfileModal', 'block')"><img src="${avatarUrl}" alt="Avatar" class="plus-avatar"/></div>`;
}

// Open modal
function openModal(modalId, type) {
  document.getElementById(modalId).style.display = type;
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
