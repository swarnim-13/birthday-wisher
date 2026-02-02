// 🎂 Initial Sample Data
const birthdayData = {
  "08-15": [
    { name: "Keshav Parashar", course: "B.Tech AIML", email: "keshav@gmail.com" },
    { name: "Shruti Vyas", course: "Bsc Chemistry", email: "shruti@gmail.com" }
  ],
  "02-22": [
    { name: "Sneha Iyer", course: "B.Tech CSE", email: "sneha@gmail.com" },
    { name: "Yash Gautam", course: "MBA", email: "yash@gmail.com" }
  ],
    "04-10": [
    { name: "Shubh Soni", course: "B.Tech CSE", email: "shubhsoni43@gmail.com" },
    { name: "Shruti saxena", course: "Bsc Chemistry", email: "shruti@gmail.com" }
  ],
  "02-5": [
    { name: "Raghav Goshal", course: "B.TecH FIRE & SAFETY", email: "goshal@gmail.com" }
    
  ],
    "06-13": [
    { name: "Charles Roy", course: "BBA", email: "charls1212@gmail.com" },
  
  ],
  "12-25": [
    { name: "Krishna murti", course: "B.Tech Data Science", email: "krishna345@gmail.com" },
    { name: "Akash", course: "MBA", email: "akash@gmail.com" },
    { name: "Gourav", course: "Msc Chemistry", email: "gourav45@gmail.com" }

  ],
};


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

  if (!people) {
    cardsDiv.innerHTML = "<p style='color:white'>No birthdays on this day 🎈</p>";
    return;
  }
  people.forEach((person, index) => {
  const card = document.createElement("div");
  card.className = "birthday-card";
  card.id = `card-${index}`;

 const subject = encodeURIComponent("Happy Birthday 🎉");

const body = encodeURIComponent(
`Dear ${person.name},

Wishing you a very Happy Birthday 🎂 We wish for your bright future  
(${person.name}) , (${person.course})


'Your Birthday Card is Attached Below'



Best wishes,
IPS-ACADEMY`
);

const gmailLink =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}&su=${subject}&body=${body}`;

card.innerHTML = `
  <div class="card-template">
    <img src="birthdaypic.jpeg" class="template-img">

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
});





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

 
function downloadCard(cardId) {
  const card = document.getElementById(cardId);

  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "birthday-card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function downloadAndSend(cardId, email, name, course) {
  const card = document.getElementById(cardId);

  html2canvas(card).then(canvas => {
    // 1️⃣ Download card
    const link = document.createElement("a");
    link.download = `${name}-birthday-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // 2️⃣ Show reminder to client
    setTimeout(() => {
      alert("⚠️ IMPORTANT:\n\nPlease ATTACH the downloaded BIRTHDAY CARD before sending the email.");
    }, 300);

    // 3️⃣ Open Gmail after reminder
    setTimeout(() => {
      const subject = encodeURIComponent("Happy Birthday 🎉");

      const body = encodeURIComponent(
`Dear ${name},

Wishing you a very Happy Birthday 🎂
(${course})

Please find your birthday card attached.

Best wishes,
Ar. Achal K Choudhary`
      );

      const gmailLink =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

      window.open(gmailLink, "_blank");
    }, 900); // thoda delay taaki alert padh le
  });
}

