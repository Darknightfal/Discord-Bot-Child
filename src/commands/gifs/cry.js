const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "cry",
  description: "Youre crying",
  options: [
    {
      name: "user",
      description: "The user that made you cry",
      type: ApplicationCommandOptionType.Mentionable,
      required: false
    }
  ],
  deleted: false,

  callback: async (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const gifDirectory = "src/common/cry";

    try {
      const gifFiles = fs
        .readdirSync(gifDirectory)
        .filter((file) => file.endsWith(".gif"));
      const randomIndex = Math.floor(Math.random() * gifFiles.length);
      const gif = gifFiles[randomIndex];
      const toCry = interaction.options.get("user")?.value;

      if (interaction.options.get("user")?.value) {
        const embed = new EmbedBuilder()
          .setTitle(` `)
          .setDescription(` `)
          .setImage(`attachment://${gif.split("/").pop()}`)
          .setColor("Blue");

        await interaction.reply({
          content: `<@${toCry}> made <@${interaction.user.id}> cry `,
          embeds: [embed],
          files: [path.join(gifDirectory, gif)]
        });
      } else {
        const embed2 = new EmbedBuilder()
          .setTitle(` `)
          .setDescription(` `)
          .setImage(`attachment://${gif.split("/").pop()}`)
          .setColor("Blue");

        await interaction.reply({
          content: `<@${interaction.user.id}> is crying`,
          embeds: [embed2],
          files: [path.join(gifDirectory, gif)]
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
