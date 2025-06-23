const {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const cooldowns = new Set();

module.exports = {
  name: "give-levels",
  description: "Gives a User levels",
  options: [
    {
      name: "user",
      description: "The User you want to give levels",
      type: ApplicationCommandOptionType.Mentionable,
      required: true
    },
    {
      name: "amount",
      description: "The amount of levels you want to give to a user",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 100000,
      required: true
    }
  ],
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.Administrator],

  /**
   *
   * @param {Client} client
   * @param {Message} message
   */

  callback: async (client, interaction) => {
    const levelsToGive = interaction.options.get("amount")?.value;

    const query = {
      userId: interaction.options.get("user")?.value,
      guildId: interaction.guild.id
    };

    try {
      const level = await Level.findOne(query);

      if (level) {
        level.level += levelsToGive;

        if (level.xp > calculateLevelXp(level.level)) {
          level.xp = 0;
          level.level += 1;
        }

        const embed = new EmbedBuilder()
          .setTitle(` `)
          .setColor("DarkRed")
          .addFields({
            name: ` `,
            value: `<@${
              interaction.options.get("user")?.value
            }> has leveled up to **level ${level.level}**`,
            inline: true
          });
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
          content: `Gave <@${interaction.options.get("user")?.value}> ${
            interaction.options.get("amount")?.value
          } Levels`
        });

        client.channels.cache
          .get("1313370210354593827")
          .send({ embeds: [embed] });

        await level.save().catch((e) => {
          console.log(`Error saving updated level ${e}`);
          return;
        });
      }

      // if (!level)
      else {
        // create new level
        const newLevel = new Level({
          userId: message.author.id,
          guildId: message.guild.id,
          xp: xpToGive
        });
      }
    } catch (error) {
      console.log(`Error giving xp: ${error}`);
    }
  }
};
