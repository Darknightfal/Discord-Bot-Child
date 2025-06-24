const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "queue",
  description: "Shows the first 10 songs in the queue",
  deleted: false,

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
      await interaction.reply({
        content: "❌ There is no song playing.",
        ephemeral: true
      });
      return;
    }

    const currentSong = queue.currentTrack;

    const queueString = queue.tracks.toArray().slice(0, 10).join(`\n\n`);

    const embed = new EmbedBuilder()
      .setTitle("🎶 Current Queue")
      .setDescription(
        `**Now Playing:**\n[${currentSong.title}]\n\n` +
          `**Up Next:**\n${queueString || "No songs in queue."}`
      )
      .setThumbnail(currentSong.thumbnail)
      .setColor("Random");

    interaction.reply({ embeds: [embed] });
  }
};
