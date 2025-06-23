const {
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "message-delete",
  description: "Delete messages",
  options: [
    {
      name: "amount",
      description: "The amount of messages you want to delete",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 100,
      required: true
    }
  ],
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.ManageMessages],

  callback: async (client, interaction) => {
    let messages;
    const timeNow = new Date();
    const number = interaction.options.get("amount").value;
    messages = await interaction.channel.messages.fetch({ limit: number });

    const validMessages = messages.filter((msg) => {
      const messageCreation = msg.createdAt;
      const messageOlder = (timeNow - messageCreation) / (1000 * 60 * 60 * 24);
      return messageOlder <= 1;
    });

    const invalidMessagesCount = messages.size - validMessages.size;

    if (invalidMessagesCount > 0) {
      //console.log('Some messages are older than 14 days');
      await interaction.channel.bulkDelete(validMessages);
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: `Deleted ${number} messages | Unable to delete {}`
      });
    } else {
      await interaction.channel.bulkDelete(validMessages);
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: `Deleted ${number} messages` });
    }
  }
};
