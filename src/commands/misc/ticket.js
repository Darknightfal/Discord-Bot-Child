const {
  Client,
  Interaction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js");
const settings = require("../../utils/settings");

module.exports = {
  name: "ticket",
  description: "creates the ticket embed",
  deleted: true,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Tickets")
        .setDescription("Open a ticket if you have an issue");
      const button = new ActionRowBuilder();
      button.components.push(
        new ButtonBuilder()
          .setCustomId("Ticket")
          .setLabel("Open Ticket")
          .setStyle(ButtonStyle.Success)
      );
      const tick = await interaction.channel.send({
        embeds: [embed],
        components: [button]
      });
      const tickets = tick.createMessageComponentCollector();

      tickets.on("collect", async (i) => {
        if (i.customId === "Ticket") {
          let ticketname = `ticket-${interaction.user.tag}`;
          interaction.guild.channels.create({
            name: ticketname,
            type: 0,
            topic: "ticket",
            parent: settings.ticketCategory, //interaction.channel.parentId
            permissionOverwrites: [
              {
                id: interaction.guildId,
                deny: ["VIEW_CHANNEL"]
              },
              {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL"]
              }
            ]
          });
          console.log("Channel create");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};
