const { Client, Message, EmbedBuilder } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const cd = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
  if (message.channel.id === "1367633913702387763") return;
  if (!message.inGuild() || message.author.bot || cd.has(message.author.id))
    return;

  const xpToGive = getRandomXp(5, 20);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        if (message.guild.id === "1342817423140851746") {
          const embed = new EmbedBuilder()
            .setTitle(` `)
            .setColor("DarkRed")
            .addFields({
              name: ` `,
              value: `${message.member} has leveled up to **level ${level.level}**`,
              inline: true
            });
          client.channels.cache
            .get("1366193038220857454")
            .send({ embeds: [embed] });
        }
      }
      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });

      cd.add(message.author.id);
      setTimeout(() => {
        cd.delete(message.author.id);
      }, 30000);
    }

    // if (!level)
    else {
      // create new level
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive
      });

      await newLevel.save();
      cd.add(message.author.id);
      setTimeout(() => {
        cd.delete(message.author.id);
      }, 30000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
