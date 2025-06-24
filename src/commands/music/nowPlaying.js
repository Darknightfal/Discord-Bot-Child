const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "now-playing",
  description: "the current song playing",
  deleted: false,

  callback: async (client, interaction) => {
    const queue = client.player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    if (!queue) {
      await interaction.reply("There is no song playing");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(" ")
      .setColor("Random")
      .setImage(queue.currentTrack.thumbnail)
      .addFields({
        name: ` `,
        value: `Paused **${queue.currentTrack}**`
      });

    interaction.reply({ embeds: [embed] });
  }
};
