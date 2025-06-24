const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "shuffle the songs in queue",
  deleted: false,

  callback: async (client, interaction) => {
    try {
      const queue = client.player.nodes.get(interaction.guild, {
        metadata: {
          channel: interaction.channel
        }
      });

      if (!queue || !queue.isPlaying()) {
        interaction.reply("There are no songs playing");
        return;
      }

      if (!queue.tracks.toArray()[0]) {
        interaction.reply("There are no other songs in the queue");
        return;
      }

      queue.tracks.shuffle();

      const embed = new EmbedBuilder()
        .setTitle(" ")
        .setColor("Random")
        .addFields({
          name: "",
          value: `Queue shuffled <${queue.tracks.size}> song(s)! ✅`
        });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  }
};
