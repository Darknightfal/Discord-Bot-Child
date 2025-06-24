const { QueryType, useMainPlayer } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a song!",
  voiceChannel: true,
  options: [
    {
      name: "song",
      description: "The song you want to play",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  callback: async (client, interaction) => {
    const player = useMainPlayer();

    const song = interaction.options.getString("song");
    const res = await player.search(song, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO
    });

    const embed = new EmbedBuilder().setColor("Random");

    if (!res?.tracks.length) {
      embed.setAuthor({
        name: `No results found... try again ? <❌>`
      });
      return interaction.reply({ embeds: [embed] });
    }

    try {
      const { track } = await player.play(
        interaction.member.voice.channel,
        song,
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel
            },
            selfDeaf: true,
            volume: 5,
            leaveOnEnd: false,
            leaveOnEmpty: false,
            leaveOnStop: false,
            bufferingTimeout: 2000
          }
        }
      );
      embed.setTitle(`Added [${track.title}] to the queue!`);
      embed.setImage(track.thumbnail);
      embed.setFooter({ text: `duration ${track.duration}` });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`Play error: ${error}`);
      embed.setAuthor({
        name: `I can't join the voice channel... try again ? <❌>`
      });
      return interaction.reply({ embeds: [embed] });
    }
  }
};
