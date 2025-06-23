const { Schema, model } = require("mongoose");

const messages = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  messages: {
    type: Number,
    default: 0
  }
});

module.exports = model("MessagesSent", messages);
