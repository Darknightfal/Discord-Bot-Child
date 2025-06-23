const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder
} = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Messages = require("../../models/Messages");
Font.loadDefault();

module.exports = {
  name: "messages-amount",
  description: "Shows a users level",
  options: [
    {
      name: "target-user",
      description: "The users level you want to see",
      type: ApplicationCommandOptionType.Mentionable
    }
  ],
  deleted: false,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const mentionUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedMessages = await Messages.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id
    });

    if (!fetchedMessages) {
      interaction.editReply(
        mentionUserId
          ? `${targetUserObj.user.tag} has not sent any messages yet, wait till they chat`
          : "You dont have any Messages yet, Chat to gain Messages"
      );
      return;
    }
    let allMessages = await Messages.find({
      guildId: interaction.guild.id
    }).select("-_id userId messages");

    allMessages.sort((a, b) => {
      if (a.messages === b.messages) {
        return b.xp - a.xp;
      } else {
        return b.messages - a.messages;
      }
    });
    const embed = new EmbedBuilder()
      .setTitle(`${targetUserObj.user.tag}'s Message Amount`)
      .setColor("DarkRed")
      .addFields({
        name: ` `, //${targetUserObj.user.tag}
        value: `Messages: ${fetchedMessages.messages}`,
        inline: false
      });
    interaction.editReply({ embeds: [embed] });
  }
};
