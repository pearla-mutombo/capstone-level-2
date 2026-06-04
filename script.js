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
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index-discover.html";

  // Read the curent session from storage (rubric: Storage - get)
  const activeUser = JSON.parse(localStorage.getItem("novus_session"));

  //Boolean variable starting with "has" (rubric: Conditionals - Boolean variable)
  const hasSession = activeUser !== null;

  const privatePages = ["feed.html", "profile.html", "orbi-stream-wall.html"];

  // Conditional: redirect logged-out users away from private pages
  if (privatePages.includes(pageName) && !hasSession) {
    alert("Access Denied: You need an account to see this. Please log in first.");
    window.location.href = "index-discover.html"; 
    return;
  } 
  
  // Conditional: send logged-in users straight to the feed
  if (pageName === "index-discover.html" && hasSession) {
    window.location.href = "feed.html";
    return;
  } 

  //Call the right setup function for this page
  switch (pageName) {
    case "index-discover.html":
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
  }
});
//======================================================================
// SECTION 1. Page 1: Portal (index-discover.html) 
// (Note: This handles login, signup, and forgot password.
// Each button has its own id in the HTML and its own click handler.)
//=======================================================================

function initPage1Portal () {
  const form = document.getElementById("discovery-form");
  const feedback = document.getElementById("feedback");

  form.onsubmit = handleLoginSubmit;

  function handleLoginSubmit(event) {
    event.preventDefault();
    
    const form = event.target;

    const data = {
      username: form.elements.username.value,
      password: form.elements.password.value
  };
  
   if(!username) {
      showError("Please enter your username before logging in.");
      return;
    }
   
    if(!password) {
      showError("Please enter your password before loggin in.");
      return;
    }

  // Save to storage (rubric: Storage  - save)
    localStorage.setItem("novus_session", JSON.stringify(targetSession));


  }
  // if(!form) return;

  // Reusable helper functions with parameters (rubric: Functions)
  // const showError = (message) => { 
  //   feedback.className = "block mt-4 text-center font-bold text-red-500"; 
  //   feedback.textContent = message;
  // };

  // const showOkay = (message) => {
  //    feedback.className = "block mt-4 text-center font-bold text-emerald-500"; 
  //    feedback.textContent = message;
  //   };

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
form.addEventListener("submit", (event) => event.preventDefault());

 // Action A: LOG IN 
 const loginBtn = document.getElementById("loginBtn");
 if (text === "log in") {
  loginBtn.addEventListener ("click", () => {
    //Access form values via form.elements (rubric: Form)
    const username = form.elements.username.value.trim();
    const domain = form.elements.domain.value;



    //First use of validPasswordComplexitity (rubric: Functions Called two more times)
    const isLoginPasswordValid = validatePasswordComplexity(loginPassword);
    if(!isLoginPasswordValid) {
      showError("Password must be eight characters with a symbol.");
      return;
    }

    // Build the session object (rubric - Object - new object with properties)
    const targetSession = {
      username: user,
      role: "Founding Member",
      bio: `Novus network anchor point node assigned to ${username}. Dedicated explorer across tactical domains.`,
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
    const user = document.getElementById("username").value.trim();
    if (!username) {
     showError("Account name field cannot remain blank. please enter a valid username.");
     return;
    }

    const signupPassword = prompt("Assgin an access password for your secure profile token:");
    if (!signupPassword) return;

    // Second use of validatePasswordComplexity (rubric: Functions - called two more times)
    const isSignupPasswordValid = validatePasswordComplexity(signupPassword);
    if (isPasswordValid){
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
    const username = form.elements.username.value.trim();
    if(!username) {
      showError("Specify a target username first.");
      return;
    }
    showOkay(`Security validation token dispatched to user link:[${username}]`);
  });
  }
}
 
//=====================================================================
// SECTION 4 -  Page 2: Feed (feed.html)
// Note: This page shows all public posts AND has a
// form that fetches data from 6 different external APIs.
// Everything is inside the initPage2Feed so it only runs on this page.
//=====================================================================
 
function initPage2Feed() {
  // Render public posts
  const feedSection = document.getElementById("feed-section");
  if(!feedSection) {
    const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];
    const publicPosts = posts.filter((p) => p.visibility === "public");

    if(publicPosts.length === 0) {
      feedSection.innerHTML = `<p class="text-center text-gray-500 py-12">No discovery Moments have materialized yet.</p>`;
    } else {
      // for loop traversing an array (rubric: Loops)
      let html = "";
      for (let index = 0; index < publicPosts.length; index++) {
        const post = publicPosts[index];
        html+= `
        <article class="block rounded-xl bg-white p-6 shadow-md border border-gray-100 mb-6">
            <header class="flex items-center justify-between mb-3 border-b pb-2">
              <div>
                <h5 class="text-lg font-bold text-neutral-800">${post.username}</h5>
                <span class="inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 mt-1">${post.domain}</span>
              </div>
              <span class="text-xs text-gray-400 font-mono">${post.timestamp}</span>
            </header>
            <p class="mb-4 text-base text-neutral-600">${post.text}</p>
            ${post.image ? `<figure><img src="${post.image}" class="w-full h-64 object-cover rounded-lg" alt="Media content" /></figure>` : ""}
            <footer class="flex gap-4 text-xs text-blue-500 font-medium">
              <button type="button" class="hover:underline">▲ Support Moment</button>
              <button type="button" class="hover:underline">💬 Thread Analysis</button>
            </footer>
          </article>
        `;
      }
      feedSection.innerHTML = html;
    }
  }

  // API explorer form
  const apitForm = document.getElementById("form-2");
  if(!apiForm) return;

  apiForm.onsubmit = handleApiSubmit;
}

// Handler for the API form (separate function so it stays clean)

async function handleApiSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const errorEl = document.getElementById("error");
  const successEl = document.getElementById("success");
  const resultEL = document.getElementById("result");
  
  // Clear old feedback
  errorEl.innerHTML = "";
  successEl.innerHTML = "";
  resultEL.innerHTML = "";

  // Build a data FROM the form values (rubric: API - data object from form)
  // Reads the logged-in user's doman preference too
  const activeUser = JSON.parse(localStorage.getItem("novus_session")) || {};
  const formData = {
    topic: form.elements.topic.value.trim(),
    domain: activeUser.domainPreference || "computing"
  };
  
  // try/catch handles API errors (rubric: Conditionals - try/catch)
  try {
    // Fire all 6 fetches in parallel
    const [response1, response2, response3, response4, response5, response6] = await Promise.all([
      fetch("https://api.nytimes.com/svc/topstories/v2/science.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // Science News response1
      fetch("https://api.nytimes.com/svc/topstories/v2/world.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // World News response2
      fetch("https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // Arts News response3
      fetch("https://api.nasa.gov/planetary/apod?api_key=uqt1ryc8YuEJtkkrTpIJoJQP5SsyJz6EZjGTXuFS"), // NASA picture of the Day response4
      fetch("https://v2.jokeapi.dev/joke/Programming?type=single"), // Programming Joke response5
      fetch("https://api.artic.edu/api/v1/artworks/search") // Artwork response6
    ]);

    // Parse all 6 responses as JSON in parallel
    const [scienceData, worldData, artsData, nasaData, jokeData, artwrokData] = await Promise.all([
      response1.json(),
      response2.json(),
      response3.json(),
      response4.json(),
      response5.json(),
      response6.json()
    ]);

    // Pick random items from each list-style API.
    // Math.floor rounds DOWN to a whole nu,ber so we get a valid array index.
    const scienceResults = scienceData.results;
    const randomScience = scienceResults[Math.floor(Math.random() * scienceResults.length)];

    const worldResults = worldData.results;
    const randomWorld= worldResults[Math.floor(Math.random() * worldResults.length)];

    const artsResults = artsData.results;
    const randomArts= artsResults[Math.floor(Math.random() * artsResults.length)];

    // NASA APOD returns a single object, not a list a picture of the day
    const nasaPicture = nasaData;
    
    //JokeAPI single returns one joke at a time
    const joke = jokeData;

    // Art Institute returns .data, not results
    const artworks = artwrokData.data;
    const randomArt = artworks[Math.floor(Math.random() * artworks.length)];

    // Display feedback based on the data (rubric: API - display feedback)
    successEl.className = "text-emerald-600 font-bold mb-4";
    successEl.innerHTML = `✅ Loaded 6 discovery moments for topic: <em>${formData.topic || "anything"}</em>`;

    resultEL.innerHTML = `
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <article class="bg-blue-50 p-4 rounded">
          <h3 class="font-bold">🔬 NYT Science</h3>
          <p>${randomScience ? randomScience.title : "No data."}</p>
        </article>
        <article class="bg-green-50 p-4 rounded">
          <h3 class="font-bold">🌍 NYT World</h3>
          <p>${randomWorld ? randomWorld.title : "No data."}</p>
        </article>
        <article class="bg-purple-50 p-4 rounded">
          <h3 class="font-bold">🎨 NYT Arts</h3>
          <p>${randomArts ? randomArts.title : "No data."}</p>
        </article>
        <article class="bg-indigo-50 p-4 rounded">
          <h3 class="font-bold">🚀 NASA Picture of the Day</h3>
          <p>${nasaPicture.title || "No data."}</p>
          ${nasaPicture.url ? `<figure><img src="${nasaPicture.url}" class="mt-2 rounded max-h-48" alt="${nasaPicture.title}" /></figure>` : ""}
        </article>
        <article class="bg-yellow-50 p-4 rounded">
          <h3 class="font-bold">💻 Programming Joke</h3>
          <p>${joke.joke || (joke.setup ? joke.setup + " — " + joke.delivery : "No joke today.")}</p>
        </article>
        <article class="bg-pink-50 p-4 rounded">
          <h3 class="font-bold">🖼️ Art Institute</h3>
          <p>${artworkPicture.title || "No data."}</p>
          ${artworkImage.url ? `<figure><img src="${artworks.lqip}" class="mt-2 rounded max-h-48" alt="${artworkImage.alt_text}" /></figure>` : ""}
        </article>
      </section>
    `;

  } catch (error) {
    console.error("Error processing API data:", error);
    errorEl.className = "text-red-600 font-bold";
    errorEl.innerHTML = "Failed to load API facts. Check your connection."
    
  }

}
//=====================================================================
// SECTION 5 -  Page 3: Profle (profile.html)
// Note: Shows the user's idenity card. Pulls the 
// session from storage and writes name/role/bio into the page
// using dot nation (activeUser.username, .role, .bio).
//=====================================================================

function initPage3Profile(activeUser) {
  const nameEl = document.getElementById("display-name");
  const roleEl = document.getElementById("display-role");
  const bioEl = document.getElementById("display-bio");

  if (!nameEl) return;
  
  // Dot-notation updates to DOM elements (rubric: Objects - dot notation)
  nameEl.textContent = activeUser.username;
  roleEl.textContent = activeUser.role;
  bioEl.textContent = activeUser.bio;

  // Logout handler - attached to the global window so HTML onclicl can call it
  window.resetProfile = () => {
    if (confirm("Are you sure you want to clear your session and disconnect?")) {
      localStorage.removeItem("novus_session");
      window.location.href = "index-discover.html";
    }
  };

}
//======================================================================
//  SECTION 6  - Page 4: Orbit Wall (orbit-stream-wall.html)
// Not: This is the user's personal dashboard.
// They can publish a post  (text + optional image URL) and see
// every post (public and private) sorted newest-first.
//=======================================================================

function initPage4OrbitWall (activeUser) {
  // Show username everywhere it's reference in the layout
  const displayNames = document.querySelectorAll("#display-name, #profile-name");
  displayNames.forEach((el) => {
    el.textContent = activeUser.username;
  });

  const roleEl = document.getElementById("display-role");
  if (roleEl) roleEl.textContent = activeUser.role;

  const feedContainer = document.getElementById("canvas-feed");
  const textInput = document.getElementById("post-input");
  const imageInput = document.getElementById("post-image-input");

  // Look up the user's pretty domain name from the map
  const activeDomainKey = activeUser.domainPreference || "computing";
  const userDomainTitle = domain_Map[activeDomainKey] || "Advanced Computing";


  const subLabel = document.getElementById("domain-label");
  if (subLabel) subLabel.textContent = userDomainTitle;

  // Reusable function to redraw the feed (rubric: Functions)
  const renderOrbitPosts = () => {
    if(!feedContainer) return;
    const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];

    let html = "";
    // for loop traversing an array (rubric: Loops)
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    html += `
        <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 space-y-3 mb-4">
          <header class="flex justify-between items-center text-xs">
            <span class="font-bold text-blue-400">${post.domain}</span>
            <div class="flex items-center gap-2 text-slate-500">
              <span class="italic text-[10px]">[by ${post.username}]</span>
              <span>${post.timestamp}</span>
              <span>${post.visibility}</span>
            </div>
          </header>
          <p class="text-slate-200">${post.text}</p>
          ${post.image ? `<figure><img src="${post.image}" class="max-h-60 w-full object-cover rounded-xl" alt="Stream attachment" /></figure>` : ""}
          <footer class="flex gap-4 text-xs text-blue-400">
            <button type="button" class="hover:underline">▲ Upvote</button>
            <button type="button" class="hover:underline">💬 Discuss</button>
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
      const content = textInput.value.trim();
      if(!content) {
        alert("Write something before publishing your post.");
        return;
      }

      const newPost = {
        username: activeUser.username,
        domain: userDomainTitle,
        text: content,
        image: imageInput.value.trim(),
        timestamp: "Just now",
        visibility: "public"
      };

      const runtimePosts = JSON.parse(localStorage.getItem("novus_posts")) || [];
      runtimePosts.unshift(newPost); // newest first
      localStorage.setItem("novus_posts", JSON.stringify(runtimePosts));

      // Reset form fields
      textInput.value = "";
      imageInput.value = "";

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