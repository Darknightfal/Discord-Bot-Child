// Bot start line (nodemon src/index.js)

require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
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

client.player.events.on("playerStart", (queue, track) => {
  try {
    const embedPlaying = new EmbedBuilder()
      .setTitle(`Started playing **${track.cleanTitle}**!`)
      .setImage(track.thumbnail)
      .setFooter({
        text: `duration ${track.duration} | <${queue.tracks.size}> song(s) left! ✅`
      });
    queue.metadata.channel.send({ embeds: [embedPlaying] });
  } catch (error) {
    console.log(error);
    queue.node.skip();
    return;
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
