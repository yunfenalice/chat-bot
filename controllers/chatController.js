const {
  generateFakeStringList,
  isYesNoQuestion,
  isListQuestion,
  isNumberQuestion,
  calculateNumbers
} = require('../utils/generateData');
const { generateResponse } = require('../utils/thirdParty');

const BASE_URL = 'https://code-challenge.us1.sandbox-rivaltech.io';

async function registerUser(name, email) {
  const url = `${BASE_URL}/challenge-register`;

  try {
    const response = await axios.post(url, {
      name: name,
      email: email
    });

    return response.data.user_id;
  } catch (error) {
    console.error(`we can't register this user: ${error.message}`);
    throw error;
  }
}

async function initializeConversation(userId) {
  const url = `${BASE_URL}/challenge-conversation`;

  try {
    const response = await axios.post(url, {
      user_id: userId
    });

    return response.data.conversation_id;
  } catch (error) {
    console.error(`Error initializing conversation: ${error.message}`);
    throw error;
  }
}

async function retrieveMessages(conversationId) {
  const url = `${BASE_URL}/challenge-behaviour/${conversationId}`;

  try {
    const response = await axios.get(url);
    return response.data.messages;
  } catch (error) {
    console.error(`Error retrieving messages: ${error.message}`);
    throw error;
  }
}
async function replyToChatbot(conversationId, content) {
  const url = `${BASE_URL}/challenge-behaviour/${conversationId}`;

  try {
    const response = await axios.post(url, {
      content: content
    });

    return response.data.correct;
  } catch (error) {
    console.error(`Error replying to chatbot: ${error.message}`);
    throw error;
  }
}
async function parseContent(question) {
  // For yes/no questions, random reply with "yes" or "no"
  let res;
  if (isYesNoQuestion(question)) {
    const yesNoAns = Math.random() > 0.5 ? 'yes' : 'no';
    res = yesNoAns;
  } else if (isListQuestion(question)) {
    res = generateFakeStringList(5);
  } else if (isNumberQuestion(question) && question.match(/\d+/g)) {
    const numbers = question.match(/\d+/g);
    res = '' + calculateNumbers(numbers);
  } else if (question.toLowerCase().includes('thank you')) {
    res = 'Game Over';
  } else {
    res = await generateResponse(question);
  }
  return res;
}

exports.startConversation = async () => {
  try {
    // Register a user
    const userId = await registerUser('Jane Doe', 'jane@doe.com');
    console.log(`User registered with ID: ${userId}`);

    // Initialize a conversation
    const conversationId = await initializeConversation(userId);
    console.log(`Conversation initialized with ID: ${conversationId}`);

    // Continue the conversation in a loop
    outerLoop: while (true) {
      // Retrieve and print messages
      const messages = await retrieveMessages(conversationId);
      let message;
      if (messages.length > 0) {
        console.log(`Bot says: ${messages[messages.length - 1].text}`);
        message = messages[messages.length - 1].text;
      } else {
        console.log('No messages retrieved.');
        break;
      }
      innerLoop: while (true) {
        const replyContent = await parseContent(message);

        if (replyContent === 'Game Over') {
          console.log('Celebrating ! We will contact you!');
          break outerLoop;
        }
        console.log(`I say: ${replyContent}`);
        const correctAnswer = await replyToChatbot(
          conversationId,
          replyContent
        );
        if (!correctAnswer) {
          console.log('Bot says: it is wrong.');
        } else {
          break innerLoop;
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
