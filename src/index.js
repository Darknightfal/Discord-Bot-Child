// Bot start line (nodemon src/index.js)

require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
  ]
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
    eventHandler(client);
  } catch (error) {
    console.log(`error: ${error}`);
  }
})();

client.login(process.env.TOKEN);
