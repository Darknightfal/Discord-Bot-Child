const {
  Client,
  InteractionCollector,
  PermissionFlagsBits
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply(
          "Auto role has not been configured for this server. use `/autorole-configure` to set it up."
        );
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply(
        "Auto role has been disabled for this server. Use `/autorole-configure` to set it up again."
      );
    } catch (error) {
      console.log(error);
    }
  },

  name: "autorole-disable",
  description: "disable auto-role in this server.",
  deleted: true,
  permissionsRequired: [PermissionFlagsBits.Administrator]
};
