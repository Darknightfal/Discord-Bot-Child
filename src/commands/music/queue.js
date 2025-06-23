const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "queue",
  description: "Shows the first 10 songs in the queue",
  deleted: true,

  callback: async (client, interaction) => {
    const queue = await client.player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    if (!queue || !queue.playing) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply("There is no song playing");
      return;
    }

    const queueString = queue.tracks
      .slice(0, 10)
      .map((song, i) => {
        return `${i + 1}) [${song.duration}]\` ${song.title} - <@${
          song.requestedBy.id
        }>`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .addFields(
        `**Currently Playing**\n ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`
      )
      .setThumbnail(currentSong.thumbnail);

    interaction.reply({ embeds: [embed] });
  }
};
