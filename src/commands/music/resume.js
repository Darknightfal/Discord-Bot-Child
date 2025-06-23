const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  description: "resumes the current song",
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

    queue.node.setPaused(false);

    const embed = new EmbedBuilder()
      .setTitle(" ")
      .setColor("Random")
      .setImage(queue.currentTrack.thumbnail)
      .addFields({
        name: ` `,
        value: `Resumed **${queue.currentTrack}**`
      });

    interaction.reply({ embeds: [embed] });
  }
};
