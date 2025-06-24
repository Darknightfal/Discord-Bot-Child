const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "q-clear",
  description: "clears the queue",
  deleted: false,

  callback: async (client, interaction) => {
    const queue = client.player.nodes.get(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    if (!queue || !queue.isPlaying()) {
      await interaction.reply("There is no songs in the queue");
      return;
    }

    queue.tracks.clear;

    await queue.node.stop();

    const embed = new EmbedBuilder()
      .setTitle(" ")
      .setColor("Random")
      .addFields({
        name: ` `,
        value: `Queue Cleared !`
      });

    interaction.reply({ embeds: [embed] });
  }
};
