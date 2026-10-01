// ===== SET YOUR ADMIN PASSWORD HERE =====
const ADMIN_PASSWORD = "1112005dama"; // change this to whatever you want

const lockScreen = document.getElementById("lockScreen");
const adminContent = document.getElementById("adminContent");
const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const wrongPassword = document.getElementById("wrongPassword");

function tryUnlock() {
  if (passwordInput.value === ADMIN_PASSWORD) {
    lockScreen.classList.add("hidden");
    adminContent.classList.remove("hidden");
    startListening(); // begin loading the live data
  } else {
    wrongPassword.classList.remove("hidden");
  }
}

unlockBtn.addEventListener("click", tryUnlock);
passwordInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") tryUnlock();
});

// ===== RESET ALL DATA =====
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function () {
  const firstConfirm = confirm(
    "This will permanently delete ALL registrations. This cannot be undone. Continue?"
  );
  if (!firstConfirm) return;

  const secondConfirm = confirm(
    "Are you absolutely sure? Every registration will be erased right now."
  );
  if (!secondConfirm) return;

  resetBtn.disabled = true;
  resetBtn.textContent = "Deleting...";

  db.collection("registrations")
    .get()
    .then(function (snapshot) {
      const batch = db.batch();
      snapshot.forEach(function (doc) {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(function () {
      alert("All registrations have been deleted.");
    })
    .catch(function (error) {
      console.error("Error deleting registrations:", error);
      alert("Something went wrong while deleting. Check the console.");
    })
    .finally(function () {
      resetBtn.disabled = false;
      resetBtn.textContent = "Reset all data";
    });
});

// ===== LIVE REGISTRATIONS LIST =====
// onSnapshot keeps this updated in real time - no need to refresh the page
function startListening() {
  const tableBody = document.getElementById("regTableBody");
  const regCount = document.getElementById("regCount");
  const emptyMsg = document.getElementById("emptyMsg");
  const friendsLabel = { "0": "No", "1": "1 friend", "2": "2 friends" };

  db.collection("registrations")
    .orderBy("createdAt", "desc")
    .onSnapshot(function (snapshot) {
      tableBody.innerHTML = "";

      if (snapshot.empty) {
        emptyMsg.classList.remove("hidden");
        regCount.textContent = "0 registered";
        return;
      }

      emptyMsg.classList.add("hidden");
      regCount.textContent = snapshot.size + " registered";

      let rowNumber = snapshot.size;
      snapshot.forEach(function (doc) {
        const data = doc.data();
        const time = data.createdAt
          ? data.createdAt.toDate().toLocaleString()
          : "just now";

        const row = document.createElement("tr");
        row.innerHTML =
          "<td>" + rowNumber + "</td>" +
          "<td>" + data.fullName + "</td>" +
          "<td>" + data.department + "</td>" +
          "<td>" + data.phone + "</td>" +
          "<td>" + (friendsLabel[data.friends] || data.friends) + "</td>" +
          "<td>" + time + "</td>";
        tableBody.appendChild(row);
        rowNumber--;
      });
    });
}