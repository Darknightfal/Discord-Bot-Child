// Bot start line (nodemon src/index.js)

require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates
  ]
});

client.player = new Player(client, {
  //ytdlOptions: {
  //  quality: "highestaudio",
  //  filter: "audioonly",
  //  highWaterMark: 1 << 25
  //}
});

client.player.extractors.register(YoutubeiExtractor, {
  downloadOptions: {
    type: "audio", // or 'video', 'video+audio'
    quality: "worst", // or 'worst'
    format: "any" // 'mp4', 'webm', 'any'
  }
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
