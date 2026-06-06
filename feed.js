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
    navLogoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out and clear your session?")) {
        localStorage.removeItem("novus_session");
        window.location.href = "index.html";
      }
    });
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

//=====================================================================
// SECTION 4 -  Page 2: Feed (feed.html)
// Note: This page shows all public posts AND has a
// form that fetches data from 6 different external APIs.
// Everything is inside the initPage2Feed so it only runs on this page.
//=====================================================================

function initPage2Feed() {
  // Render public posts
  const feedSection = document.getElementById("feed-section");

  if (feedSection) {
    const posts = JSON.parse(localStorage.getItem("novus_posts")) || [];
    const publicPosts = posts.filter((p) => p.visibility === "public");

    if (publicPosts.length === 0) {
      feedSection.innerHTML = `<p class="text-center text-gray-500 py-12">No discovery Moments have materialized yet.</p>`;
    } else {
      // for loop traversing an array (rubric: Loops)
      let html = "";
      for (let index = 0; index < publicPosts.length; index++) {
        const post = publicPosts[index];
        html += `
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
  const apiForm = document.getElementById("form-2");
  if (!apiForm) return;

  apiForm.onsubmit = handleApiSubmit;
}

// Handler for the API form (separate function so it stays clean)
async function handleApiSubmit(event) {
  event.preventDefault();

  const form = event.target;
  console.log("FORM:", form);
  console.log("TOPIC:", form.elements.topic);

  const errorEl = document.getElementById("error");
  const successEl = document.getElementById("success");
  const resultEl = document.getElementById("result");

  // Clear old feedback if the elements exist
  if (errorEl) errorEl.innerHTML = "";
  if (successEl) successEl.innerHTML = "";
  if (resultEl) resultEl.innerHTML = "";

  // Build a data FROM the form values (rubric: API - data object from form)
  // Reads the logged-in user's doman preference to
  const activeUser = JSON.parse(localStorage.getItem("novus_session")) || {};
  let topic = "";
  if (form.elements.topic) {
    topic = form.elements.topic.value.trim();
  }
  const formData = {
    topic: topic,
    domain: activeUser.domainPreference || "computing",
  };

  // Try/catch handles API errors (rubric: Conditionals - try/catch)
  try {
    // Fire all 6 fetches in parallel
    // Normally, javaScript fetches information from the internet one item at a time.
    // Using Promise.all, it simultaneously calls all six web services at the exact same moment.
    // They return in parallel, cutting down the user's wait time significantly.
    const [response1, response2, response3, response4, response5, response6] =
      await Promise.all([
        fetch(
          "https://api.nytimes.com/svc/topstories/v2/science.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS",
        ), // Science News
        fetch(
          "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS",
        ), // World News
        fetch(
          "https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=haMreju8Eo1myVG3fJGhXpyGksuO6NATTC6YHGBhzTGWhedS",
        ), // Arts News
        fetch(
          "https://api.nasa.gov/planetary/apod?api_key=uqt1ryc8YuEJtkkrTpIJoJQP5SsyJz6EZjGTXuFS",
        ), // NASA picture of the Day
        fetch("https://v2.jokeapi.dev/joke/Programming?type=single"), // Programming Joke
        fetch("https://api.artic.edu/api/v1/artworks/search"), // Artwork
      ]);
    // console.log(scienceData);
    // console.log(worldData);
    // console.log(artsData);
    // console.log(nasaData);
    // console.log(jokeData);
    // console.log(artworkData);

    // Parse all 6 responses as JSON in parallel
    const [scienceData, worldData, artsData, nasaData, jokeData, artworkData] =
      await Promise.all([
        response1.json(),
        response2.json(),
        response3.json(),
        response4.json(),
        response5.json(),
        response6.json(),
      ]);

    // Pick random items from each list-style API.
    // Math.floor rounds DOWN to a whole number so we get a valid array index.
    // Because the news channels, and art hubs return long lists of content,
    //  in this script I use a math filter (Math.random()) to grab a random index integer from
    // the arrays, ensuring that every time your page is loaded or submitted, a completely
    // dynamic set of titles updates on screen.
    const scienceResults = scienceData.results || [];
    let randomScience = null;
    if (scienceResults.length > 0) {
      const randomIndex = Math.floor(Math.random() * scienceResults.length);

      randomScience = scienceResults[randomIndex];
    }
    const worldResults = worldData.results || [];
    const randomWorld =
      worldResults.length > 0
        ? worldResults[Math.floor(Math.random() * worldResults.length)]
        : null;

    const artsResults = artsData.results || [];
    const randomArts =
      artsResults.length > 0
        ? artsResults[Math.floor(Math.random() * artsResults.length)]
        : null;

    // NASA APOD returns a single object, not a list a picture of the day
    const nasaPicture = nasaData || {};

    //JokeAPI single returns one joke at a time
    const joke = jokeData || {};

    // Art Institute returns .data
    const artworks = artworkData.data || [];
    const randomArt =
      artworks.length > 0
        ? artworks[Math.floor(Math.random() * artworks.length)]
        : null;

    // Display feedback based on the data (rubric: API - display feedback)
    if (successEl) {
      const topicText =
        (form.elements.topic && form.elements.topic.value.trim()) ||
        "General Matrix";
      successEl.className =
        "text-emerald-500 font-bold mb-4 text-xs tracking-wide uppercase";
      successEl.innerHTML = `✅ Results loaded for topic: ${formData.topic}`;
    }
    // Here the browser checks the localStorage storage for any user posts. if it finds some, a for loop
    // starts at zero, visits every single item on the list, packages it clearly inside this neat HTML template tags,
    // and sticks it onto the page.
    if (resultEl) {
      resultEl.innerHTML = `
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-blue-400">🔬 NYT Science Hub</h3>
            <p class="text-xs text-slate-300 mt-1">${randomScience ? randomScience.title : "No data received."}</p>
          </article>
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-green-400">🌍 NYT World News</h3>
            <p class="text-xs text-slate-300 mt-1">${randomWorld ? randomWorld.title : "No data received."}</p>
          </article>
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-purple-400">🎨 NYT Arts Division</h3>
            <p class="text-xs text-slate-300 mt-1">${randomArts ? randomArts.title : "No data received."}</p>
          </article>
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-indigo-400">🚀 NASA Image Capture</h3>
            <p class="text-xs text-slate-300 mt-1">${nasaPicture.title || "No data received."}</p>
            ${nasaPicture.url ? `<figure class="mt-2"><img src="${nasaPicture.url}" class="max-h-40 w-full object-cover rounded-xl" alt="NASA Media" /></figure>` : ""}
          </article>
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-yellow-400">💻 Debugging Humor</h3>
            <p class="text-xs text-slate-300 mt-1">${joke.joke || (joke.setup ? joke.setup + " — " + joke.delivery : "No data received.")}</p>
          </article>
          <article class="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
            <h3 class="font-bold text-sm text-pink-400">🖼️ Art Institute Repository</h3>
            <p class="text-xs text-slate-300 mt-1">${randomArt ? randomArt.title : "No data received."}</p>
            ${
              randomArt.thumbnail?.lqip
                ? `<img src="${randomArt.thumbnail.lqip}" class="max-h-40 w-full object-cover rounded-xl">`
                : ""
            }
          </article>
      </section>
      `;
    }
  } catch (error) {
  
    // console.error("Error processing API data:", error);
    if (errorEl) {
      errorEl.className =
        "text-red-600 font-bold text-xs uppercase tracking-wider";
      errorEl.innerHTML =
        "❌Failed to load API facts. Check your connection or API Keys.";
    }
  }

  const navLogoutBtn = document.getElementById("logout-btn");
  if (navLogoutBtn) {
    navLogoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out and clear your session?")) {
        localStorage.removeItem("novus_session");
        window.location.href = "index.html";
      }
    });
  }
}
