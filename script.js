// 1. constants and database initialiazation
const domain_Map = {
  computing: "Advanced Computing",
  news: "World News",
  Arts: "Artisty",
  Science: "Science"
};

If (!localStorage.getItem("novus_posts")) {
  localStorage.setItem("novus_posts",JSON.stringify([
  {
  username: "Pearla",
  domain: "Advanced Computing",
  text: "Just finished setting up the dynamic UI script for the dashboard. The reusable componets architecture is working perfectly!",
  image:"",
  timestamp: "2 hours ago",
  visibility: "public"
  };
  {
  username: "Sloan",
  domain: "Global Jurisprudence",
  text: "Analyzing recent international maritime treaties. Fascinating overlaps in territorial airspace laws.",
  image: "",
  timestamp: "5 hours ago",
  visibility: "public",
  }
  {
  username:"",
  domain:"",
  text: "",
  image: "",
  timestamp: "",
  visibility: "",
  }
  ]));
}

// 2. central router and security

document.addEventListener ("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  //Check if a valid session token exists
  const activeUser = JSON.parse(localStorage.getItem("novus_session"));

  //Page safeguard (force redirect to portal if accessing raw unauthenticated)
  const privatePages = ["discover.html", "profile.html", "orbit-stream-wall.html"];
  if (privatePages.includes(pageName) && !activeUser) {
    alert("Access Denied: Please log in to view this node.");
    window.location.href = "index.html";
  } return ;
  
  // reidect to dashboard if logged-in user visits the landing portal
  if (pageName === "index.html" && activeUser) {
    window.location.href = "discover.html";
  } return;

  //specific page initializers or initialization
  switch (pageName) {
    case "index.html":
      initPage1Portal();
      break;
    case "discover.html":
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

// 3. Page 1 - index.html (portal engine)
function initPage1Portal () {
  const form = document.getElementById("discovery-form");
  const feedback = document.getElementById("feedback");
  if(!form) return;

  const showError = (message) => { feedback.className = "block mt-4 text-center font-bold text-red-500"; feedback.textContent = message;};
  const showOkay = (message) => { feedback.className = "block mt-4 text-center font-bold text-emerald-500"; feedback.textContent = message;};

// data validation
const validatePasswordComplexity = (string)=> {
  return string.length >= 8 && /\d/.test(str) && /[!@#$%^&*(),.?":{}|<>]/.test(str);
};

form.addEventListener("submit", (event) => event.preventDefault()); //prevents from reloading

// located the action buttons based on text signatures

const buttons = form.querySelectorAll("button");
buttons.forEach (button => {
  const text = button.textContent.trim().toLowerCase();

 // action A: sign-in process
 if (text === "log in") {
  button.addEventListener ("click", () => {
    const user = document.getElementById("username").value.trim();
    // show successful backend authentication exchange
    const targetSession = {
      username: user,
      role: "Founding Memeber",
      bio: `Novus network anchor point node assigned to ${user}. Dedicated explorer across tactical domains.`,
      domainPreference: document.getElementById("novus-select").value
    };
    localStorage.setItem("novus_session", JSON.stringify(targetSession));
    showOkay("Idenity Verified! Entering Orbit Stream...");
    setTimeout() => window.location.href = "discover.html", 1200);
  });
 }

 // action B: sign-up process (with requisite complexity check)
 if (text === "create new account") {
  button.addEventListener ("click", () =>{
    const user = document.getElementById("username").value.trim();
    if (!user) return showError("Account name field cannot remain blank. please enter a valid username.");

    // request user testing password input via structural prompt injection
    const promptPassword = prompt ("Assgin an access password for your secure profile token:");
    if (!promptPassword) return;
    
    if(!validatePasswordComplexity(promtPassword)) {
      showError ("Securing error: Password must be at least 8 characters. containing 1 number, and special symbol.");
      return;
    }
    
    showOkay(`Account node configured for ${user}! Click "Log In" to synchronize details.`);
  });
 }

 // action C: reset Password Forwarding
 if (text === "forgot password?") {
  button.addEventListener("click", () => {
    const user = document.getElementById("username").value.trim();
    if(!user) return showError("Specify target username anchor first.");
    showOkay(`Security validation token dispatched over sytem to user link:[${user}]`);
  });
 }

 // 4. Page 2: discover.html (Exploration Discover Feed)

 function initPage2Feed() {
  const feedSection = document.querySelector("main section");
  if(!feedSection) return;

  const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];
  const publicPosts = posts.filter (p => p.visibility === "public");

  if (publicPosts.length === 0) {
    feedSection.innerHTML = `<p class="text-center text-gray-500 py-12">No discovery moments have materialized yet.</p>`;
    return;
  }

  // inject beautiful structural tailwind utility feed items directly
  feedSection.innerHTML = publicPosts.map((post) => `
  <div class="block rounded-xl bg-white p-6 shadow-md border border-gray-100 mb-6 transition hover:shadow-lg">
      <div class="flex items-center justify-between mb-3 border-b pb-2">
        <div>
          <h5 class="text-lg font-bold leading-tight text-neutral-800">${post.username}</h5>
          <span class="inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 mt-1">
            ${post.domain}
          </span>
        </div>
        <span class="text-xs text-gray-400 font-mono">${post.timestamp}</span>
      </div>
      <p class="mb-4 text-base text-neutral-600">${post.text}</p>
      ${post.image ? `<img src="${post.image}" class="w-full h-64 object-cover rounded-lg mb-4" alt="Media content" onerror="this.style.display='none'"/>` : ""}
      <div class="flex gap-4 text-xs text-blue-500 font-medium">
        <button type="button" class="hover:underline">▲ Support Moment</button>
        <button type="button" class="hover:underline">💬 Thread Analysis</button>
      </div>
    </div>
  `).join("");
}

const formTag = document.getElementById("form-2");
const outputEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const successEl = document.getElementById("success");

formTag.onsubmit = handleSubmit;

async function handleSubmit (event) {
  event.preventDefault();

  errorEl.innerHTML = "";
  successEl.innerHTML = "";
  outputEl.innerHTML = "";
  try {
  // correctly trigger both fetches simultaneously using API
  const [response1, response2, response3, response4, response5, response6] = await Promise.all([
    fetch("https://api.nytimes.com/svc/topstories/v2/science.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // Science News response1
    fetch("https://api.nytimes.com/svc/topstories/v2/world.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // World News response 2
    fetch("https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS"), // Arts News response 3
    fetch("https://api.nasa.gov/planetary/apod?api_key=uqt1ryc8YuEJtkkrTpIJoJQP5SsyJz6EZjGTXuFS"),// Science NASA response4
    fetch("https://v2.jokeapi.dev/joke/Any?format=xml"), //Computing - Programming Jokes response5
    fetch("https://api.artic.edu/api/v1/artworks/search?params=%7B%22q%22%3A%22cats%22%2C%22query%22%3A%7B%22term%22%3A%7B%22is_public_domain%22%3Atrue%7D%7D%7D") // Artworks response6
  ]);

  // safely parse all incoming json result streams simultaneously
  const [] = await Promise.all ([
    response1.json(),
    response2.json(),
    response3.json(),
    response4.json(),
    response5.json(),
    response6.json()
  ]);

  // picks random index based on the array length (Note: i used a math.floor
  // because its a function that rounds a number down to the nearest whole integers;
  // it drops the decimal entirely, leaving us with the perfect whole number in the apis url that i choose.)
    const random[]Index = Math.floor(Math.random() * []Result.length);
    const random[] = []Result[random[]Index];

    const random[]Index = Math.floor(Math.random() * []Result.length);
    const random[] = []Result[random[]Index];

    const random[]Index = Math.floor(Math.random() * []Result.length);
    const random[] = []Result[random[]Index];
    // 4. safely seperated variables from the randomized selections
    const
    const
    const
    const

  } catch (error) {
    console.error("Error processing API data:", error);
    errorEl.color = "Red";
    errorEl.innerHTML = "Failed to load API facts. Please try again and check your connection."
    
  }
}

// Page 3. profile.html (Centralized profile node)
function initPage3Profile(activeUser) {
  const nameEl = document.getElementById("display-name");
  const roleEl = document.getElementById("display-role");
  const bioEl = document.getElementById("display-bio");

  if (!nameEl) return;
  // hydrate visual components direcly via global user identity tracking state object
  
  nameEl.textContent = activeUser.username;
  roleEl.textContent = activeUser.role;
  bioEl.textContent = activeUser.bio;

  // Gloable window handler to match functional programmatic template onclick trigger bindings
  window.resetProfile = () => {
    if (confrim ("Are you sure you want to scrub session storage and disconnet active nodes?")) {
      localStorage.removeItem("novus_session");
      window.location.href = "index.html";
    }
  };

}

// Page 4. orbit-stream-wall.html (Orbit Stream Wall Dashboard)
function initPage4OrbitWall (activeUser) {
  //start by synchronizing internal layout names with logged-in user conxtext variables
  const displayNames = document.querySelectorAll("#display-name, #profile-name");
  displayNames.forEach(el.textContent = activeUser.username);
  const roleEl = document.getElementById("display-role");
  if (roleEl) roleEl.textContent = activeUser.role;

  const feedContainer = document.getElementById("canvas-feed");
  const textInput = document.getElementById("post-input");
  const imageInput = document.getElementById("post-image-input");

  // Dynamically map chosen selector target preference to title elements
  const activeDomainKey = activeUser.domainPreference || "computing";
  const userDomainTitle = domain_Map[activeDomainKey];

  const subLabel = textInput.parentElement.querySelector(".text-xs strong");
  if (subLabel) subLabel.textContent = userDomainTitle;

  const renderOrbitPosts = () => {
    if(!feedContainer) return;
    const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];

    // Sort array so freshly committed moments land at top of view space
    feedContainer.innerHTML = posts.map(post => 
      `
      <div class="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 space-y-3 transition hover:border-slate-700/50">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-blue-400">${post.domain}</span>
          <div class="flex items-center gap-2 text-slate-500">
            <span class="italic text-[10px] text-slate-400 font-sans">[by ${post.username}]</span>`
    )
  }
  ${post.timestamp}
  ${post.visibility}
  
  ${post.text}
  ${post.image ? <img src="${post.image}" class="max-h-60 w-full 
  object-cover rounded-xl border border-slate-700/30" alt="Stream 
  Attachments" onerror="this.style.display='none'"/> : ""}
  
  ▲ Upvote
  💬 Discuss
  
  `).join("");
  
  };
// Locate Publishing button within submission context elements
  const publishBtn = textInput.parentElement.querySelector("button")
  ;if (publishBtn) {
  publishBtn.addEventListener("click", () => {
  const content = textInput.value.trim();
  if (!content) return alert("Write something to your feed stream matrix 
  before publishing.");
  
  // Check registration visibility settings inside index form mapping elements
    const targetVisibility = "public";
    
    const newPost = {
    username: activeUser.username,
    domain: userDomainTitle,
    text: content,
    image: imageInput.value.trim(),
    timestamp: "Just now",
    visibility: targetVisibility
    };
    
    const runtimePosts = JSON.parse(localStorage.getItem("novus_posts")) || 
    [];
    runtimePosts.unshift(newPost); // Push into index index point zero
    localStorage.setItem("novus_posts", JSON.stringify(runtimePosts));
    
    // Reset entry controls fields cleanly
    textInput.value = "";
    imageInput.value = "";
    renderOrbitPosts();
    });
    }
    
    // Initial draw execution looprenderOrbitPosts();
    }`


////////////////////////////////////////////////////////////////////////////////
// 1. objects and storage (Note: requirement)
//using  a built-in object (localStorage) and a custom object

const userState = {
  username: localStorage.getItem("user_name") || "Pearla",
  role: "Founding Member",
  lastActive: new Date().toLocaleString(),
  // adding method to update property (Note: requirement)
  updateRole: function (newRole) {
    this.role = newRole;
  },
};

// 2. Reusable function with parameters (Note: requirement)
// A reusable function to create UI elements is a
// piece of code that acts like a factory or a stamp.
// Instead of writing out repetitive HTML or setup code
//  every time you need a button, card, or dropdown,
// you write a single JavaScript function that builds
// it for you automatically.You give the function
// specific details (like text, colors, or options),
// and it spits out a ready-to-use visual element.

function CreateComponent(type, content, cssClass) {
  const el = document.createElement(type);
  el.innerHTML = content;
  el.className = cssClass;
  return el;

  // 3. loops and array travesal (Note: requirement)
  const activeNiches = [
    { name: "Computing", count: { active: true } },
    { name: "Dance", count: { active: true } },
    { name: "Law", count: { active: false } },
  ];

  function renderTable() {
    const tableBody = document.getElementById("niche-table-body");
    if (!tableBody) return;

    // clear any existing content first
    tableBody.innerHTML = "";

    for (let index = 0; index < activeNiches.length; index++) {
      const niche = activeNiches[index];

      //safetly pull the true/false status from inside count object
      const isActive = niche.count.active;
      const statusEmoji = isActive ? "🟢" : "🔴";
      //row generation to match data properties
      const row = `
      <tr class="border-b border-slate-700">
        <td class="border border-slate-700 p-2">${niche.name}</td>
        <td class="border border-slate-700 p-2">${statusEmoji} Active</td>
      </tr>
    `;
      tableBody.innerHTML += row;
    }
  }
  // 4. conditional and form handler (Note: requirement)
  const formTag = document.getElementById("discovery-form");
  if (formTag) {
    formTag.onsubmit = handleSubmit;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nicheInput = document.getElementById("niche-input").value;
    const feedback = document.getElementById("api-feeback");
    if (!nicheInput || !feedback) return;

    const nicheVal = nicheInput.value;
    const isEntryValid = nicheVal.trim().length > 3;

    feedback.classList.remove("hidden");

    if (isEntryValid) {
      //Success scenario
      feedback.innerText = `Connecting to ${nicheVal}...`;
      feedback.className = "bg-green-100 text-green-700 p-3 rounded block";

      //Save updated name to storage
      localStorage.setItem("user_name", userState.username);
    } else {
      //Error handling  with conditionals
      feedback.innerText =
        "Error: Your Novus login name must be longer than 3 letters.";
      feedback.className = "bg-red-100 text-red-700 p-3 rounded block";
    }
  }
  //initializing the UI on page load
  renderTable();

  //using dot notation to update DOM elements (Note: requirement)
  const displayNameEl = document.getElementById("display-name");
  const displayRoleEl = document.getElementById("display-role");
  if (displayNameEl) {
    displayNameEl.innerText = userState.username;
  }

  if (displayRoleEl) {
    displayRoleEl.innerText = userState.role;
  }
}
