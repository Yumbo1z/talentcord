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

document.addEventListener("click", () => {
  const menu = document.getElementById("customContextMenu");
  const menu2 = document.getElementById("postContextMenu");
  menu.style.display = "none";
  menu2.style.display = "none";
});
