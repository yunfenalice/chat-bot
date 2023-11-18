const express = require('express');

const app = express();
const { startConversation } = require('./controllers/chatController');
app.use(express.json({ limit: '10kb' }));
startConversation();
const port = process.env.PORT || 3001;
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  app.close(() => {
    process.exit(1);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
