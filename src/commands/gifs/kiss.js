const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "kiss",
  description: "Kiss A User",
  options: [
    {
      name: "user",
      description: "The user you want to kiss",
      type: ApplicationCommandOptionType.Mentionable,
      required: true
    }
  ],
  deleted: false,

  callback: async (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const gifDirectory = "src/common/kiss";

    if (interaction.options.get("user")?.value === interaction.user.id) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply("You can not pat yourself");
      return;
    }

    try {
      const gifFiles = fs
        .readdirSync(gifDirectory)
        .filter((file) => file.endsWith(".gif"));
      const randomIndex = Math.floor(Math.random() * gifFiles.length);
      const gif = gifFiles[randomIndex];
      const userToKiss = interaction.options.get("user")?.value;

      const embed = new EmbedBuilder()
        .setTitle(` `)
        .setDescription(` `)
        .setImage(`attachment://${gif.split("/").pop()}`)
        .setColor("Blue");

      await interaction.reply({
        content: `<@${interaction.user.id}> Kissed <@${userToKiss}>`,
        embeds: [embed],
        files: [path.join(gifDirectory, gif)]
      });
    } catch (error) {
      console.log(error);
    }
  }
};
