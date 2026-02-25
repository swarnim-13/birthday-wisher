const XLSX = require("xlsx");
const fs = require("fs");

const workbook = XLSX.readFile("BIRTHDAY GREETINGS (1).xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

let birthdayData = {};

const monthMap = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12"
};

data.forEach(row => {
  const name = row["*  vc"]?.toString().trim();      // 2 spaces
  const course = row["COURSE"]?.toString().trim();
  const email = row["EMAIL ID "]?.toString().trim(); // last me space
  const dobRaw = row["DOB"]?.toString().trim();

  if (!name || !course || !email || !dobRaw) return;

  const parts = dobRaw.split("-");
  if (parts.length !== 2) return;

  const day = parts[0].padStart(2, "0");
  const month = monthMap[parts[1]];
  if (!month) return;

  const dateKey = `${month}-${day}`;

  if (!birthdayData[dateKey]) {
    birthdayData[dateKey] = [];
  }

  birthdayData[dateKey].push({
    name,
    course,
    email
  });
});

fs.writeFileSync(
  "students.json",
  JSON.stringify(birthdayData, null, 2),
  "utf-8"
);

console.log("✅ students.json created successfully");