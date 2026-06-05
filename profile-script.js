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