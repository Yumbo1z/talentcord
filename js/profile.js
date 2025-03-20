document.addEventListener("DOMContentLoaded", async () => {
    let response = await fetch("/users");
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