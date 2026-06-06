//====================================================================
// SECTION 2 - Central Router (runs on every page)
// (Note: When any HTML page loads, this listner fires.
// reads the filename from the URL and decides what to do:
//  - Block private pages if no one is logged in
//  - Send logged-in users away from the login page
//  - Call the right setup function for this page)
//=====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const pageName =
    currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  // Read the curent session from storage (rubric: Storage - get)
  const activeUser = JSON.parse(localStorage.getItem("novus_session"));

  //Boolean variable starting with "has" (rubric: Conditionals - Boolean variable)
  const hasSession = activeUser !== null;

  const privatePages = ["feed.html", "profile.html", "orbit-stream-wall.html"];

  // Conditional: redirect logged-out users away from private pages
  if (privatePages.includes(pageName) && !hasSession) {
    alert(
      "Access Denied: You need an account to see this. Please log in first.",
    );
    window.location.href = "index.html";
    return;
  }

  // Conditional: send logged-in users straight to the feed
  if (pageName === "index.html" && hasSession) {
    window.location.href = "feed.html";
    return;
  }

  //Call the right setup function for this page - routing logic checks
  switch (pageName) {
    case "index.html":
      initPage1Portal();
      break;
    case "feed.html":
      initPage2Feed();
      break;
    case "profile.html":
      initPage3Profile(activeUser);
      break;
    case "orbit-stream-wall.html":
      initPage4OrbitWall(activeUser);
      break;
    case "citation.html":
      initPage5Citation();
  }

  const navLogoutBtn = document.getElementById("logout-btn");

  if (navLogoutBtn) {
    console.log("Logout button found");

    navLogoutBtn.addEventListener("click", () => {
      console.log("Logout button clicked");

      if (confirm("Are you sure you want to log out and clear your session?")) {
        localStorage.removeItem("novus_session");

        alert("You have been logged out.");

        window.location.href = "index.html";
      }
    });
  } else {
    console.log("Logout button NOT found");
  }
});

//====================================================================
// SECTION 3 - Constants and Storage Initialization
// Note: Before any page loads, set up a shared data.
// "domainMap" which translates short codes into pretty labels.
// We seed localStorage with 2 sample posts on first visit.
//====================================================================

//  Custom object with key/value pairs (rubric: Objects)
const domainMap = {
  computing: "Advanced Computing",
  news: "World News",
  Arts: "Artistry",
  Science: "Science",
  law: "Global Jurisprudence",
};

// Built- in object: localStorage (rubric: Storage)
if (!localStorage.getItem("novus_posts")) {
  localStorage.setItem(
    "novus_posts",
    JSON.stringify([
      {
        username: "Pearla",
        domain: "Advanced Computing",
        text: "Just finished setting up the dynamic UI script for the dashboard. The reusable componets architecture is working perfectly!",
        image: "",
        timestamp: "2 hours ago",
        visibility: "public",
      },

      {
        username: "Sloan",
        domain: "Global Jurisprudence",
        text: "Analyzing recent international maritime treaties. Fascinating overlaps in territorial airspace laws.",
        image: "",
        timestamp: "5 hours ago",
        visibility: "public",
      },
    ]),
  );
}

//======================================================================
//  SECTION 6  - Page 4: Orbit Wall (orbit-stream-wall.html)
// Not: This is the user's personal dashboard.
// They can publish a post  (text + optional image URL) and see
// every post (public and private) sorted newest-first.
//=======================================================================

function initPage4OrbitWall(activeUser) {
  // create a fallback safety net if no user session is active so tha page
  // doesn't crash or create an error
  const currentUser = activeUser || {
    username: "Annoymous User",
    role: "Guest Explorer",
    domainPreference: "computing",
  };
  // Show username everywhere it's reference in the layout
  const displayNames = document.querySelectorAll(
    "#display-name, #profile-name",
  );
  displayNames.forEach((el) => {
    // Dot -notation updates to DOM elements (rubric: objects - dot notation)
    el.textContent = activeUser.username;
  });

  const roleEl = document.getElementById("display-role");
  if (roleEl) roleEl.textContent = activeUser.role;

  const feedContainer = document.getElementById("canvas-feed");
  const textInput = document.getElementById("post-input");
  const imageInput = document.getElementById("post-image-input");

  // Look up the user's pretty domain name from the map
  const activeDomainKey = activeUser.domainPreference || "computing";
  const userDomainTitle = domainMap[activeDomainKey] || "Advanced Computing";

  const subLabel = document.getElementById("domain-label");
  if (subLabel) subLabel.textContent = userDomainTitle;

  // Reusable function to redraw the feed (rubric: Functions)
  const renderOrbitPosts = () => {
    if (!feedContainer) return;
    const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];

    let html = "";
    // for loop traversing an array (rubric: Loops)
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      html += `
        <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 space-y-3 mb-4">
          <header class="flex justify-between items-center text-xs">
            <span class="font-bold text-blue-400">${post.domain || "General"}</span>
            <div class="flex items-center gap-2 text-slate-500">
              <span class="italic text-[10px]">[by ${post.username || "Annymous"}]</span>
              <span>${post.timestamp || "Just now"}</span>
              <span>${post.visibility || "public"}</span>
            </div>
          </header>
          <p class="text-slate-200">${post.text}</p>
          ${post.image ? `<figure><img src="${post.image}" class="max-h-60 w-full object-cover rounded-xl" alt="Stream attachment" /></figure>` : ""}
          <footer class="flex gap-4 text-xs text-blue-400">
            <button type="button" class="hover:underline">▲ Upvote</button>
            <button type="button" class="hover:underline">💬 Discuss</button>
            <button type="button" class="hover:underline">🗑️ Delete</button>
          </footer>
        </article>
      `;
    }
    feedContainer.innerHTML = html;
  };

  // Publish button - saves a new post to storage and re-renders
  const publishBtn = document.getElementById("publishBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      // input to make sure the boxes exist before grabbing text values
      const content = textInput.value.trim();
      const imageURL = imageInput.value.trim();

      if (!content) {
        alert("Write something before publishing your post.");
        return;
      }

      // Build the new post object (rubric: object - new object with properties)
      const newPost = {
        username: activeUser.username,
        domain: userDomainTitle,
        text: content,
        image: imageInput.value.trim(),
        timestamp: "Just now",
        visibility: "public",
      };

      const runtimePosts =
        JSON.parse(localStorage.getItem("novus_posts")) || [];
      runtimePosts.unshift(newPost); //  post newest first item placement
      localStorage.setItem("novus_posts", JSON.stringify(runtimePosts));

      // Reset form fields
      if (textInput) textInput.value = "";
      if (imageInput) imageInput.value = "";
      // Instanly redraw the wall with the new item included
      renderOrbitPosts();
    });
  }
  // Initial draw = ACTUALLY call the function this time
  renderOrbitPosts();
}

//=============================================================
// THE END.
// @2026 Pearla Mutmbo | Authentic Social Network | Novus
//=============================================================
