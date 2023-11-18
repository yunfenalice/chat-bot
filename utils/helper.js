const {
  isYesNoQuestion,
  isListQuestion,
  isNumberQuestion,
  calculateNumbers,
  repeatWordsWithEvenLength,
  returnRandomValue,
} = require("./generateData");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "sports-teams.dat");
function readFileData() {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return fileContent;
}
function alphabetizeOrder(array) {
  return array.sort((a, b) => a.localeCompare(b));
}

function extractYear(sentence) {
  const yearRegex = /\b(\d{4})\b/; // Matches a 4-digit number (assumed to be a year)

  const match = sentence.match(yearRegex);

  if (match && match[1]) {
    return parseInt(match[1], 10); // Convert the matched string to an integer
  } else {
    return null; // Return null if no year is found
  }
}

async function parseContent(question) {
  let res;
  if (isYesNoQuestion(question)) {
    const yesNoAns = "yes";
    res = yesNoAns;
  } else if (isListQuestion(question)) {
    res = generateFakeStringList(5);
  } else if (
    isNumberQuestion(question) &&
    question.match(/\d+/g) &&
    question.match(/\d+/g).length >= 2
  ) {
    const numbers = question.match(/\d+/g);
    res = "" + calculateNumbers(numbers);
  } else if (question.toLowerCase().includes("thank you")) {
    res = "Game Over";
  } else if (question.toLowerCase().includes("even")) {
    res = repeatWordsWithEvenLength(question.split(":")[1].trim());
  } else if (question.toLowerCase().includes("alphabetize")) {
    const words = question
      .split(":")[1]
      .replace(".", "")
      .trim()
      .split(",")
      .map((words) => words.trim());
    res = alphabetizeOrder(words).join(",");
  } else if (
    question.toLowerCase().includes("team") &&
    question.toLowerCase().includes("which")
  ) {
    res = returnRandomValue(question);
  } else if (question.toLowerCase().includes("data set")) {
    const targetYear = extractYear(question);
    const fileContent = readFileData();
    const lines = fileContent.split("\n");
    const result = [];
    for (const line of lines) {
      const elements = line.split(", ");
      const year = parseInt(elements[3], 10);

      if (year === targetYear) {
        result.push(elements[0]);
      }
    }
    res = result.join(",");
  } else {
    res = "it is beyond my expectations";
  }
  return res;
}
module.exports = {
  extractYear,
  parseContent,
  alphabetizeOrder,
};
