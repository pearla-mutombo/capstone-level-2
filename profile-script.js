//====================================================================
// SECTION 2 - Central Router (runs on every page)
// (Note: When any HTML page loads, this listner fires. 
// reads the filename from the URL and decides what to do:
//  - Block private pages if no one is logged in
//  - Send logged-in users away from the login page
//  - Call the right setup function for this page)
//=====================================================================

document.addEventListener ("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  // Read the curent session from storage (rubric: Storage - get)
  const activeUser = JSON.parse(localStorage.getItem("novus_session"));

  //Boolean variable starting with "has" (rubric: Conditionals - Boolean variable)
  const hasSession = activeUser !== null;

  const privatePages = ["feed.html", "profile.html", "orbit-stream-wall.html"];

  // Conditional: redirect logged-out users away from private pages
  if (privatePages.includes(pageName) && !hasSession) {
    alert("Access Denied: You need an account to see this. Please log in first.");
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
    navLogoutBtn.addEventListener("click", () =>{
      if (confirm("Are you sure you want to log out and clear your session?"))
      {localStorage.removeItem("novus_session");
        window.location.href = "index.html";
      }
    });
  
  }
});



//=====================================================================
// SECTION 5 -  Page 3: Profile (profile.html)
// Note: Shows the user's idenity card. Pulls the 
// session from storage and writes name/role/bio into the page
// using dot nation (activeUser.username, .role, .bio).
//=====================================================================

// when this function starts, it accepts the activeUser badge. if that badge is missing or broken,
//  the code automatically creates a generic "Guest Explorer"
// placeholder badge so the webpage doesn't freeze or crash.
function initPage3Profile(activeUser) {
  const nameEl = document.getElementById("display-name");
  const roleEl = document.getElementById("display-role");
  const bioEl = document.getElementById("display-bio");

// Created a backup safety net for Guest if there's no logged-in user data
  const userSession = activeUser || {
    username: "Guest Explorer",
    role: "Unverified",
    bio: "No active session found."
  };

  // Instead of throwing an error if an HTML item is missing, the code
  // checks each box using (if) (nameEl) statement. if it finds the name block
  // on the HTML page, it writes the name text using dot notation (userSession.username).
  // if it doesn't find it. it quietlt moves to the next item.

  // Only update the profile text boxes if they actually exist on this HTML page
  if (nameEl) {
    // Dot-notation updates to DOM elements (rubric: Objects - dot notation)
    nameEl.innerText = userSession.username;
  }

  if (roleEl) {
    roleEl.innerText = userSession.role;
  }

  if (bioEl) {
    bioEl.innerText = userSession.bio;
  }

  // Logout handler - attached to the global window so HTML onclick can call it
  const logoutBtn = document.getElementById("logout-btn");

   if (logoutBtn) {
    // Listen for the user clicking the button directly 
    logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your session and disconnect?")) {
      localStorage.removeItem("novus_session");
      window.location.href = "index.html";
    }
  });
}

}