const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  description: "resumes the current song",
  deleted: true,

  callback: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no song playing");
      return;
    }

    const currentSong = queue.current;

    queue.setPaused(false);

    const embed = new EmbedBuilder()
      .setTitle(" ")
      .setColor("random")
      .setThumbnail(currentSong.Thumbnail)
      .addFields({
        name: ` `,
        value: `Resumed **${currentSong.title}**`
      });

    interaction.reply({ embeds: [embed] });
  }
};
