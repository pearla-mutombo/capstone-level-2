 //=================================================================
 // NOVUS SCRIPT.JS - Capstone Level 2
 // Note: This ONE file runs on all 4 HTML pages.
 // The router (Section 2) checks which page the user is on 
 // and runs only the setip function for that page.
//==================================================================

//====================================================================
// SECTION 3 - Constants and Storage Initialization
// Note: Before any page loads, set up a shared data.
// "domainMap" which translates short codes into pretty labels.
// We seed localStorage with 2 sample posts on first visit.
//====================================================================

//  Custom object with key/value pairs (rubric: Objects)
const domain_Map = {
  computing: "Advanced Computing",
  news: "World News",
  Arts: "Artistry",
  Science: "Science",
  law: "Global Jurisprudence"
};

// Built- in object: localStorage (rubric: Storage)
if (!localStorage.getItem("novus_posts")) {
  localStorage.setItem("novus_posts",JSON.stringify([
  {
    username: "Pearla",
    domain: "Advanced Computing",
    text: "Just finished setting up the dynamic UI script for the dashboard. The reusable componets architecture is working perfectly!",
    image:"",
    timestamp: "2 hours ago",
    visibility: "public"
  },

  {
    username: "Sloan",
    domain: "Global Jurisprudence",
    text: "Analyzing recent international maritime treaties. Fascinating overlaps in territorial airspace laws.",
    image: "",
    timestamp: "5 hours ago",
    visibility: "public",
  }

  ]));
}

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


//======================================================================
// SECTION 1. Page 1: Portal (index.html) 
// (Note: This handles login, signup, and forgot password.
// Each button has its own id in the HTML and its own click handler.)
//=======================================================================

function initPage1Portal () {
  const form = document.getElementById("discovery-form");
  const feedback = document.getElementById("feedback");
  
  if(!form) return;

  const showError = (message) => {
    if(feedback) {
    feedback.className = "block mt-4 text-center font-bold text-red-500"; 
    feedback.innerText = message;
    }
  };

  const showOkay = (message) => {
    if (feedback) {
     feedback.className = "block mt-4 text-center font-bold text-emerald-500"; 
     feedback.innerText = message;
  }
};

// Reusable function with a parameter (rubric: Functions)
// Called TWICE below - once for login, once for signup.
const validatePasswordComplexity = (password)=> {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) 
  );
};

// Prevent the form from reloading the page (rubric: Form handler)
form.addEventListener("submit",(event) =>{
  event.preventDefault();
})

 // Action A: LOG IN 
 const loginBtn = document.getElementById("loginBtn");
 if (loginBtn) {
  loginBtn.addEventListener ("click", () => {
    //Access form values via form.elements (rubric: Form)
    const username =  form.elements.username ? form.elements.username.value.trim(): "";
    const domain = form.elements.domain.value ? form.elements.domain.value: "computing";
    const loginPassword = form.elements.password ? form.elements.password.value : "";

    if(!username) {
      showError("Please enter your username before logging in.");
      return;
    }

    if(!loginPassword) {
      showError("Please enter your password before logging in.");
      return;
    }

    //First use of validPasswordComplexitity (rubric: Functions Called two more times)
    // Instead of writing identical messay checking logic over and over again, 
    // we build a single automated machine (validatePasswordComplexity). 
    // We drop the login password inot it first, and later 
    // we drop the signup password into it.
    const isLoginPasswordValid = validatePasswordComplexity(loginPassword);
    if(!isLoginPasswordValid) {
      showError("Password must be 8+ characters with a number and a symbol.");
      return;
    }

    // Build the session object (rubric - Object - new object with properties)
    // When someone successfully logs in the script packs their digital ID badge
    // (targetSession) inside a string box and locks it safely away inside the browser's
    // persistent memory vault (localStorage), ensurinf they stay logged in even if they refresh.
    const targetSession = {
      username: username,
      role: "Founding Member",
      bio: `Novus network anchor point connection assigned to ${username}. Dedicated explorer across tactical domains.`,
      domainPreference: domain,
      lastLogin: new Date().toLocaleString()
    };

    // Change property's value (rubric: Objects - change a property)
    targetSession.role = "Founding Memeber. Verified."

    // Save to storage (rubric: Storage  - save)
    localStorage.setItem("novus_session", JSON.stringify(targetSession));

    showOkay("Idenity Verified! Entering Orbit Stream...");
    setTimeout(() => {
      window.location.href = "feed.html";
    }, 1200);
     });
 }

 // Action B: Create Account
  const createBtn = document.getElementById("createBtn");
    if (createBtn) {
  createBtn.addEventListener ("click", () => {
    const usernameEl = document.getElementById("username");
    const username =  usernameEl ? usernameEl.value.trim() : "";


    if (!username) {
     showError("Account name field cannot remain blank. please enter a valid username.");
     return;
    }

    const signupPassword = prompt("Assgin an access password for your secure profile stream:");
    if (!signupPassword) return;

    // Second use of validatePasswordComplexity (rubric: Functions - called two more times)
    const isSignupPasswordValid = validatePasswordComplexity(signupPassword);

    if (isSignupPasswordValid) {
      showOkay(`Account created for ${username}! Click "Log In" to synchronize details.`);
    } else {
      showError("Password must be 8+ characters with a number and a symbol.");
    }
  });
} 

// Action C: Forgot Password
const forgotBtn = document.getElementById("forgotBtn");
if (forgotBtn) {
  forgotBtn.addEventListener("click", () => {
    const username =  form.elements.username ? form.elements.username.value.trim(): "";
    if(!username) {
      showError("Specify a target username first.");
      return;
    }
    showOkay(`Security validation token dispatched to user link:[${username}]`);
  });
  }
}
 



//=============================================================
// THE END.
// @2026 Pearla Mutmbo | Authentic Social Network | Novus
//=============================================================