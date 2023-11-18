const express = require("express");
const app = express();
const { startConversation } = require("./controllers/chatController");

startConversation();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
