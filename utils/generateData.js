function generateFakeStringList(length) {
  const fakeList = [];

  for (let i = 0; i < length; i++) {
    const fakeString = faker.random.word();
    fakeList.push(fakeString);
  }

  return fakeList.join(',');
}
function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function calculateNumbers(numbers) {
  const numbersAsIntegers = numbers.map(num => parseInt(num, 10));
  const sum = numbersAsIntegers.reduce((acc, num) => acc + num, 0);
  const min = Math.min(...numbersAsIntegers);
  const max = Math.max(...numbersAsIntegers);
  const result = [sum, min, max];
  const randomIndex = Math.floor(Math.random() * result.length);
  return result[randomIndex];
}
function isYesNoQuestion(message) {
  const lowercasedMessage = message.toLowerCase();

  return (
    lowercasedMessage.includes('yes/no') ||
    lowercasedMessage.includes('yes or no') ||
    lowercasedMessage.includes('do you') ||
    lowercasedMessage.includes('is it') ||
    lowercasedMessage.includes('are you') ||
    lowercasedMessage.includes('can you') ||
    lowercasedMessage.includes('will you') ||
    lowercasedMessage.includes('should you') ||
    lowercasedMessage.includes('would you')
  );
}
function isListQuestion(message) {
  const lowercasedMessage = message.toLowerCase();

  return (
    lowercasedMessage.includes('list') ||
    lowercasedMessage.includes('elements') ||
    lowercasedMessage.includes('names') ||
    lowercasedMessage.includes('items') ||
    lowercasedMessage.includes('provide') ||
    lowercasedMessage.includes('give') ||
    lowercasedMessage.includes('show')
  );
}
function isNumberQuestion(message) {
  const lowercasedMessage = message.toLowerCase();

  return (
    lowercasedMessage.includes('number') ||
    lowercasedMessage.includes('how many') ||
    lowercasedMessage.includes('quantity') ||
    lowercasedMessage.includes('amount') ||
    lowercasedMessage.includes('measure') ||
    lowercasedMessage.includes('total') ||
    lowercasedMessage.includes('what') ||
    lowercasedMessage.includes('how')
  );
}
module.exports = {
  generateFakeStringList,
  generateRandomInteger,
  isYesNoQuestion,
  isListQuestion,
  isNumberQuestion,
  calculateNumbers
};
