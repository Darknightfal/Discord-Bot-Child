const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "rules",
  description: "Send Embeded Rules To This Channel. `Edit embed in bot files`",
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: async (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "rules") {
      const embed = new EmbedBuilder()
        .setTitle("🛑 Server Rules.")
        .setColor("DarkRed")
        .addFields(
          {
            name: "1. Be Respectful",
            value:
              "Be respectful to all members of the community. Do not harass members based on Religion, Gender, Sexuality, or any other forms of harassment.",
            inline: false
          },
          {
            name: "2. English Only",
            value:
              "Use English in all text channels to esure clear communication between all members of the community.",
            inline: false
          },
          /*{
            name: "3. No NSFW Content",
            value:
              "Sending any form of NSFW (Not safe for work) content is NOT allowed. This includes any Pornography materials, Gore violence and/or any other forms of explicit content.",
            inline: false
          },
          {
                    name: '4. No Advertisement',
                    value: 'Advertisement of other Servers, Website, or any other external content is not allowed. Users with Media role are exempt from this rule to an extent.',
                    inline: false,
          }, */
          {
            name: "3. Use common sense",
            value:
              "Use common sense when interacting with members of the community.",
            inline: false
          },
          {
            name: "4. Polotics Or Religious Content",
            value:
              "Do not discuss Religious or political topics in any channel of the discord.",
            inline: false
          },
          {
            name: "5. Threats",
            value:
              "Do not threaten members of the community. This includes Emotional, Physical, or Cyber threats.",
            inline: false
          }
          /*{
            name: "6. Channels",
            value: `Use channels for their respected purposes.`,
            inline: false
          }*/
        );
      interaction.channel.send({ embeds: [embed] });
    }
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply("Rules have been sent in this channel");
    return;
  }
};
