const {Client, Message} = require("discord.js");
const msgSent = require("../../models/Messages");

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
  if (!message.inGuild() || message.author.bot) return;

  const messagesToAdd = getRandomXp(1, 1);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id
  };

  try {
    const messagesSent = await msgSent.findOne(query);

    if (messagesSent) {
      messagesSent.messages += messagesToAdd;
      messagesSent.messagesSent += 1;

      await messagesSent.save().catch((e) => {
        console.log(`Error saving updated messages ${e}`);
        return;
      });
    } else {
      const newMessages = new msgSent({
        userId: message.author.id,
        guildId: message.guild.id,
        messages: messagesToAdd
      });

      await newMessages.save();
    }
  } catch (error) {
    console.log(`Error adding to messages sent: ${error}`);
  }
};
