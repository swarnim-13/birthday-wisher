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

  const visibleCount = 4; // 👈 initially kitne cards dikhane hain

  // Pehle 4 cards
  people.slice(0, visibleCount).forEach((person, index) => {
    createCard(person, index, cardsDiv);
  });

  // Agar 4 se zyada ho
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
      onclick="downloadAndSend(
        'card-${index}',
        '${person.email}',
        '${person.name}',
        '${person.course}'
      )">
      📩 Download & Send Card
    </button>

    <p style="font-size:12px;color:#555;margin-top:6px">
      📌 Tip: Download the card and attach it in Gmail before sending
    </p>
  `;

  cardsDiv.appendChild(card);
}


// ➕ Add new birthday
function addBirthday() {
  const name = document.getElementById("nameInput").value;
  const course = document.getElementById("courseInput").value;
  const birthdate = document.getElementById("birthdateInput").value;
  const email = document.getElementById("emailInput").value;
  const message = document.getElementById("message");

  if (!name || !course || !birthdate || !email) {
    message.innerText = "Please fill all fields ❗";
    return;
  }

  const formattedDate = birthdate.slice(5); // MM-DD

  if (!birthdayData[formattedDate]) {
    birthdayData[formattedDate] = [];
  }

  birthdayData[formattedDate].push({
    name,
    course,
    email
  });

  message.innerText = "🎉 Birthday added successfully!";
}


// 📥 Download Only
function downloadCard(cardId) {
  const card = document.getElementById(cardId);

  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "birthday-card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}


// 📩 Download + Open Gmail
function downloadAndSend(cardId, email, name, course) {
  const card = document.getElementById(cardId);

  html2canvas(card).then(canvas => {

    // 1️⃣ Download card
    const link = document.createElement("a");
    link.download = `${name}-birthday-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // 2️⃣ Reminder alert
    setTimeout(() => {
      alert("⚠️ IMPORTANT:\n\nPlease ATTACH the downloaded BIRTHDAY CARD before sending the email.");
    }, 300);

    // 3️⃣ Open Gmail compose
    setTimeout(() => {

      const subject = encodeURIComponent("Happy Birthday 🎉");

      const body = encodeURIComponent(
`Dear ${name},

Wishing you a very Happy Birthday 🎂
(${course})

Please find your birthday card attached.

Best wishes,
IPS-ACADEMY`
      );

      const gmailLink =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

      window.open(gmailLink, "_blank");

    }, 900);
  });
}