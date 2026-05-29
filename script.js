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
