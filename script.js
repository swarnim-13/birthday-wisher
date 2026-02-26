let birthdayData = {};

// 📦 Load students.json
fetch("students.json")
  .then(response => response.json())
  .then(data => {
    birthdayData = data;
    console.log("Students data loaded successfully");
  })
  .catch(error => {
    console.error("Error loading students.json:", error);
  });


// 🎉 Show birthdays for selected date
function showBirthdays() {
  const dateInput = document.getElementById("datePicker").value;
  const cardsDiv = document.getElementById("cards");

  cardsDiv.innerHTML = "";

  if (!dateInput) {
    cardsDiv.innerHTML = "<p style='color:white'>Please select a date 📅</p>";
    return;
  }

  const formattedDate = dateInput.slice(5); // MM-DD
  const people = birthdayData[formattedDate];

  if (!people || people.length === 0) {
    cardsDiv.innerHTML = "<p style='color:white'>No birthdays on this day 🎈</p>";
    return;
  }

  const visibleCount = 4;

  // First 4 cards
  people.slice(0, visibleCount).forEach((person, index) => {
    createCard(person, index, cardsDiv);
  });

  // Show More button
  if (people.length > visibleCount) {
    const remaining = people.length - visibleCount;

    const showMoreBtn = document.createElement("button");
    showMoreBtn.innerText = `Show ${remaining} More 🎂`;
    showMoreBtn.className = "download-btn";
    showMoreBtn.style.marginTop = "20px";

    showMoreBtn.onclick = () => {
      people.slice(visibleCount).forEach((person, index) => {
        createCard(person, index + visibleCount, cardsDiv);
      });
      showMoreBtn.remove();
    };

    cardsDiv.appendChild(showMoreBtn);
  }

  // ✅ Send All Button
  const sendAllBtn = document.createElement("button");
  sendAllBtn.innerText = "📨 Send Birthday Wishes To All";
  sendAllBtn.className = "download-btn";
  sendAllBtn.style.marginTop = "20px";

  sendAllBtn.onclick = () => {
    sendAllWishes(people);
  };

  cardsDiv.appendChild(sendAllBtn);
}


// 🪪 Card Creation Function
function createCard(person, index, cardsDiv) {
  const card = document.createElement("div");
  card.className = "birthday-card";
  card.id = `card-${index}`;

  card.innerHTML = `
    <div class="card-template">
      <img src="birthday-template.jpeg" class="template-img">

      <div class="birthday-text">
        <div class="birthday-name">${person.name}</div>
        <div class="birthday-course">${person.course}</div>
      </div>
    </div>

    <button class="download-btn"
      onclick="downloadCard('card-${index}')">
      📥 Download Card
    </button>
  `;

  cardsDiv.appendChild(card);
}


// 📥 Download Card Only
function downloadCard(cardId) {
  const card = document.getElementById(cardId);

  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "birthday-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}


// 🚀 SEND ALL WISHES FUNCTION
async function sendAllWishes(students) {

  if (!confirm("Are you sure you want to send birthday wishes to all students?")) return;

  try {

    const response = await fetch("/api/send-wishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ students })
    });

    const data = await response.json();

    if (response.ok) {
      alert("🎉 All birthday wishes sent successfully!");
    } else {
      alert("❌ " + data.message);
    }

  } catch (error) {
    alert("❌ Error sending emails");
    console.error(error);
  }
}