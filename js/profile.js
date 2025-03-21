document.addEventListener("DOMContentLoaded", async () => {
  let response = await fetch("/posts");
  let json = await response.json();
  const posts = document.getElementById("posts");

  // Clear the existing posts before adding new ones
  posts.innerHTML = "";

  const currentUser = JSON.parse(localStorage.getItem("user"));

  let filteredPosts = json.filter((p) => p.username === currentUser.username);

  for (let post of filteredPosts) {
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
      <div class="post-card" data-user="${post.username}" data-perms="${post.permissions}" data-id="${post._id}">
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
  cnsole.log(currentUser);
  if (userData) {
    replaceCrossWithAvatar(currentUser.avatar); // Replace the cross icon with an avatar
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
  plusIcon.outerHTML = `<div class="plus-icon" onclick="openModal('editProfileModal', 'block')"><img src="${avatarUrl}" alt="Avatar" class="avatar" style="width: 40px; height: 40px; border-radius: 50%;"/></div>`;
}
