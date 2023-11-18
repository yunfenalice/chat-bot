const axios = require('axios');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const apiUrl = 'https://api-fakell.x10.mx/v1/chat/completions/';
const delay = 10000; // 2000 milliseconds (2 seconds) delay

async function generateResponse(message) {
  await setTimeoutPromise(delay);

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: message + ', make your answer shorter' }
    ],
    stream: false
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`we can't register this user: ${error.message}`);
    throw error;
  }
}

module.exports.generateResponse = generateResponse;
