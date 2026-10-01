// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });

  // Close the menu automatically once a link is clicked (mobile)
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });
}

// ===== ACTIVE LINK WHILE SCROLLING =====
// Highlights the nav link for whichever section is currently in view
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

if (sections.length && navAnchors.length) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" } // counts a section "active" once it crosses the middle of the screen
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

// ===== COUNTDOWN TIMER =====
// Set the party's date & time here (year, month-1, day, hour, minute)
// Note: months start at 0, so October = 9
const partyDate = new Date(2026, 9, 11, 9, 0, 0);

function updateCountdown() {
  const now = new Date();
  const diff = partyDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
}

if (document.getElementById("days")) {
  updateCountdown();
  setInterval(updateCountdown, 60 * 1000);
}

// ===== REGISTER FORM =====
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    // Grab the values the person typed
    const fullName = document.getElementById("fullName").value;
    const department = document.getElementById("department").value;
    const phone = document.getElementById("phone").value;
    const friends = document.querySelector('input[name="friends"]:checked').value;

    const submitButton = registerForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Save it to the "registrations" collection in Firestore
    db.collection("registrations")
      .add({
        fullName: fullName,
        department: department,
        phone: phone,
        friends: friends,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function () {
        const successMessage = document.getElementById("successMessage");
        successMessage.classList.remove("hidden");
        registerForm.reset();
        registerForm.classList.add("hidden"); // hide the form once submitted
      })
      .catch(function (error) {
        console.error("Error saving registration:", error);
        alert("Something went wrong. Please try again.");
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm registration";
      });
  });
}