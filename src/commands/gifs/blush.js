const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "blush",
  description: "You blush",
  options: [
    {
      name: "user",
      description: "The user that made you blush",
      type: ApplicationCommandOptionType.Mentionable,
      required: false
    }
  ],
  deleted: false,

  callback: async (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const gifDir = "src/common/blush";

    try {
      const gifFiles = fs
        .readdirSync(gifDir)
        .filter((file) => file.endsWith(".gif"));
      const randomIndex = Math.floor(Math.random() * gifFiles.length);
      const gif = gifFiles[randomIndex];
      const toBlush = interaction.options.get("user")?.value;

      if (interaction.options.get("user")?.value) {
        const embed = new EmbedBuilder()
          .setTitle(` `)
          .setDescription(` `)
          .setImage(`attachment://${gif.split("/").pop()}`)
          .setColor("Blue");

        await interaction.reply({
          content: `<@${toBlush}> made <@${interaction.user.id}> blush 💖`,
          embeds: [embed],
          files: [path.join(gifDir, gif)]
        });
      } else {
        const embed2 = new EmbedBuilder()
          .setTitle(` `)
          .setDescription(` `)
          .setImage(`attachment://${gif.split("/").pop()}`)
          .setColor("Blue");

        await interaction.reply({
          content: `<@${interaction.user.id}> blushed`,
          embeds: [embed2],
          files: [path.join(gifDir, gif)]
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
