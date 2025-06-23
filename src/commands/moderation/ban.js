const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a member from the server.",
  options: [
    {
      name: "target-user",
      description: "The user to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: "reason",
      description: "Reason for banning.",
      type: ApplicationCommandOptionType.String
    }
  ],
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const reason = interaction.options.get("reason")?.value;
    const banUser = interaction.options.get("target-user")?.value;
    const banUseId = banUser || interaction.member.id;
    const banUseObj = await interaction.guild.members.fetch(banUseId);

    if (banUseObj.user.id === "1285206397931487262") {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: `You can not ban this user` });
      return;
    }
    if (
      banUseObj.permissions.has(
        PermissionFlagsBits.Administrator && PermissionFlagsBits.BanMembers
      )
    ) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: `Failed Action. This user has ban capabilities`
      });
      return;
    }

    if (!interaction.options.get("reason")?.value) {
      const embed = new EmbedBuilder()
        .setTitle(`User Banned`)
        .setColor("DarkRed")
        .addFields({
          name: ` `,
          value: `Banned ${banUseObj.user.tag} `,
          inline: true
        });
      await interaction.channel.send({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`User Banned`)
        .setColor("DarkRed")
        .addFields({
          name: ` `,
          value: `Banned ${banUseObj.user.tag} For ${reason}`,
          inline: true
        });
      await interaction.channel.send({ embeds: [embed] });
    }
    await interaction.guild.bans.create(banUser);
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: `Banned ${banUseObj.user.tag}`
    });
  }
};
