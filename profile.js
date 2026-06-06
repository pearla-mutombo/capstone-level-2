// ====================================================================
// SECTION  - Main Page Router
//
// Think of this section as the "traffic controller" for the website.
//
// Every time a page loads:
//
// 1. Wait until the HTML is fully loaded.
// 2. Check which page the user is currently visiting.
// 3. Check if a user is logged in.
// 4. Block access to private pages if nobody is logged in.
// 5. Send logged-in users directly to the feed page.
// 6. Run the correct setup function for the current page.
//
// This code runs on EVERY page of the website.
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {

  const currentPath = window.location.pathname;

  const pageName =
    currentPath.substring(currentPath.lastIndexOf("/") + 1) ||
    "index.html";

  // Read saved login information from localStorage.
  // localStorage keeps data even after the browser closes.
  const activeUser = JSON.parse(
    localStorage.getItem("novus_session")
  );

  // Boolean value:
  // true = user is logged in
  // false = no user session exists
  const hasSession = activeUser !== null;

  // List of pages that require a login.
  const privatePages = [
    "feed.html",
    "profile.html",
    "orbit-stream-wall.html"
  ];

  // --------------------------------------------------
  // Security Check # 1
  // --------------------------------------------------
  // If someone tries to visit a private page without
  // being logged in, send them back to the login page.
  if (privatePages.includes(pageName) && !hasSession) {

    alert(
      "Access Denied: You need an account to see this. Please log in first."
    );

    window.location.href = "index.html";

    return; // Stop the rest of the code.
  }

  // --------------------------------------------------
  // Security Check #2
  // --------------------------------------------------
  // If the user is already logged in and tries to
  // visit the login page, send them directly to Feed.
  if (pageName === "index.html" && hasSession) {

    window.location.href = "feed.html";

    return; // Stop the rest of the code.
  }

  // --------------------------------------------------
  // Page Router
  // --------------------------------------------------
  // Run the setup function that belongs to the page.
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
      break;
  }

  // --------------------------------------------------
  //  Global Logout Button
  // --------------------------------------------------
  // each page has a log out button
  const navLogoutBtn =
    document.getElementById("logout-btn");

  if (navLogoutBtn) {

    navLogoutBtn.addEventListener("click", () => {

      if (
        confirm(
          "Are you sure you want to log out and clear your session?"
        )
      ) {

        // Delete the saved login session.
        localStorage.removeItem("novus_session");

        // Return to the login page.
        window.location.href = "index.html";
      }
    });
  }
});

// ====================================================================
// SECTION 5 - Profile Page
//
// This function fills in the user's profile information.
//
// How it works:
//
// 1. Receive the logged-in user data.
// 2. Find the profile text boxes in the HTML.
// 3. Put the user's information into those boxes.
// 4. If no user exists, show default "Guest" data.
// 5. Set up the logout button.
//
// Example:
//
// activeUser = {
//   username: "JohnDoe",
//   role: "Explorer",
//   bio: "I enjoy coding."
// }
//
// ====================================================================

function initPage3Profile(activeUser) {

  // Find the HTML elements where profile information
  // will be displayed.
  const nameEl =
    document.getElementById("display-name");

  const roleEl =
    document.getElementById("display-role");

  const bioEl =
    document.getElementById("display-bio");

  // --------------------------------------------------
  // Backup User
  // --------------------------------------------------
  // If activeUser does not exist, create a default
  // guest profile so the page doesn't break.
  const userSession = activeUser || {

    username: "Guest Explorer",
    role: "Unverified",
    bio: "No active session found."
  };

  // --------------------------------------------------
  //  Display User Information
  // --------------------------------------------------
  // Only update the HTML if the element exists.

  if (nameEl) {

    // Dot notation:
    // userSession.username
    // means:
    // "Get the username property from the object."
    nameEl.innerText = userSession.username;
  }

  if (roleEl) {
    roleEl.innerText = userSession.role;
  }

  if (bioEl) {
    bioEl.innerText = userSession.bio;
  }

  // --------------------------------------------------
  //  Profile Page Logout Button
  // --------------------------------------------------
  const logoutBtn =
    document.getElementById("logout-btn");

  if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

      if (
        confirm(
          "Are you sure you want to clear your session and disconnect?"
        )
      ) {

        // Delete saved user session.
        localStorage.removeItem("novus_session");

        // Return to login page.
        window.location.href = "index.html";
      }
    });
  }
}
