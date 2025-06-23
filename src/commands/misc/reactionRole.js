const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "reaction",
  description: "Reaction Roles. `Edit embed in the bots files`",
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  //botPermissions: [PermissionFlagsBits.Administrator],

  callback: (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const roles = [
      {
        id: "1382445927788445736",
        label: "Red"
      },
      {
        id: "1382445977176117419",
        label: "Pink"
      },
      {
        id: "1382445979537768628",
        label: "Lime"
      },
      {
        id: "1382446088866500679",
        label: "Blue"
      },
      {
        id: "1382446092146446336",
        label: "Cyan"
      }
    ];

    if (interaction.commandName === "reaction") {
      const embed = new EmbedBuilder()
        .setTitle("Claim your Role !")
        .setColor("Navy")
        .addFields(
          {
            name: "🔴 Red",
            value: " ",
            inline: false
          },
          {
            name: "🩷 Pink",
            value: " ",
            inline: false
          },
          {
            name: "🍋‍🟩 Lime",
            value: " ",
            inline: false
          },
          {
            name: "🔷 Blue",
            value: " ",
            inline: false
          },
          {
            name: "🩵 Cyan",
            value: " ",
            inline: false
          },
          {
            name: " ",
            value:
              "If the bot is offline, Ping server \nowner for the role you would like",
            inline: false
          }
        );

      const row = new ActionRowBuilder();
      roles.forEach((role) => {
        row.components.push(
          new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.label)
            .setStyle(ButtonStyle.Success)
        );
      });

      interaction.channel.send({
        embeds: [embed],
        components: [row]
      });
    }
  }
};
