const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the track",
  deleted: false,

  callback: async (client, interaction) => {
    const queue = client.player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again? ❌`
      });
    }

    queue.node.skip();

    try {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Skipped [${queue.currentTrack}] ✅`);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  }
};
