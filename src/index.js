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

client.player = new Player(client);

client.player.extractors.register(YoutubeiExtractor, {
  downloadOptions: {
    type: "audio", // or 'video', 'video+audio'
    quality: "worst", // or 'worst'
    format: "any" // 'mp4', 'webm', 'any'
  }
});

client.player.on("error", (queue, error) => {
  console.error(
    `🎵 Player error on ${queue.metadata.guild?.name || "unknown"}:`,
    error.message
  );

  // Try to skip to next song

  if (queue && queue.playing) {
    queue.skip().catch((err) => {
      console.error("❌ Failed to skip track:", err.message);
      queue.destroy();
    });
  } else {
    queue.destroy(); // clean up if nothing left
  }

  // Optional: send message to a channel
  if (queue.metadata && queue.metadata.send) {
    queue.metadata.send(
      "❌ Error playing the current track. Skipping to next..."
    );
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
