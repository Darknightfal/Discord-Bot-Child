const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  description: "Leaves the voice channel",
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

    queue.delete();

    const embed = new EmbedBuilder()
      .setTitle(" ")
      .setColor("Random")
      .addFields({
        name: ` `,
        value: `Kicked from voice channel`
      });

    interaction.reply({ embeds: [embed] });
  }
};
