const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder
} = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Level = require("../../models/Level");
Font.loadDefault();

module.exports = {
  name: "level",
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
    if (!interaction.inGuild()) {
      interaction.reply("You can only use this command inside of a server");
      return;
    }

    const backgroundImage = "src/common/images/ZT.png";
    const tylerBgImage = "src/common/images/Eren-Banner-Tyler.jpg";
    const nightBgImage = "src/common/images/ZT-banner-image.png";
    const bannerDefault = "src/common/images/default-banner.png";

    const mentionUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    await interaction.deferReply();

    try {
      const fetchedLevel = await Level.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id
      });

      if (!fetchedLevel) {
        await interaction.editReply(
          mentionUserId
            ? `${targetUserObj.user.tag} does not have any levels yet, wait till they chat some more`
            : "You dont have any levels yet, Chat to gain levels"
        );
        return;
      }
      let allLevels = await Level.find({
        guildId: interaction.guild.id
      }).select("-_id userId level xp");

      allLevels.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });
      let currentRank =
        allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

      const card = new RankCardBuilder()
        .setDisplayName(targetUserObj.user.tag)
        .setUsername(`Level stats for ${targetUserObj.user.tag} `)
        .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
        .setCurrentXP(fetchedLevel.xp)
        .setRequiredXP(calculateLevelXp(fetchedLevel.level))
        .setLevel(fetchedLevel.level)
        .setRank(currentRank)
        .setTextStyles({
          level: "LEVEL",
          xp: "EXP",
          rank: "RANK"
        });

      if (targetUserObj.user.id === "869406935357743205") {
        card.setOverlay(90).setBackground(backgroundImage);
      } else if (targetUserObj.user.id === "810952830235836436") {
        card.setOverlay(90).setBackground(tylerBgImage);
      } else if (targetUserObj.user.id === "1026441153891012618") {
        card.setOverlay(90).setBackground(nightBgImage);
      } else {
        card.setOverlay(90).setBackground(bannerDefault);
      }

      const data = await card.build({
        format: "png"
      });

      const attachment = new AttachmentBuilder(data);
      await interaction.editReply({ files: [attachment] });
      return;
    } catch (error) {
      console.log(error);
    }
  }
};
