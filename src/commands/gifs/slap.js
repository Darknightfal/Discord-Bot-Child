const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "slap",
  description: "Slaps A User",
  options: [
    {
      name: "user",
      description: "The user you want to slap",
      type: ApplicationCommandOptionType.Mentionable,
      required: true
    }
  ],
  deleted: false,

  callback: async (Client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const gifDirectory = "src/common/slap";

    if (interaction.options.get("user")?.value === interaction.user.id) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply("You can not slap yourself");
      return;
    }

    if (interaction.options.get("user")?.value === "1285206397931487262") {
      await interaction.reply("You Cannot slap a child");
      return;
    }

    try {
      const gifFiles = fs
        .readdirSync(gifDirectory)
        .filter((file) => file.endsWith(".gif"));
      const randomIndex = Math.floor(Math.random() * gifFiles.length);
      const gif = gifFiles[randomIndex];
      const userToSlap = interaction.options.get("user")?.value;

      const embed = new EmbedBuilder()
        .setTitle(` `)
        .setDescription(` `)
        .setImage(`attachment://${gif.split("/").pop()}`)
        .setColor("Blue");

      await interaction.reply({
        content: `<@${interaction.user.id}> Slapped <@${userToSlap}>`,
        embeds: [embed],
        files: [path.join(gifDirectory, gif)]
      });
    } catch (error) {
      console.log(error);
    }
  }
};
