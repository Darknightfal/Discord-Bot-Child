module.exports = {
  name: "ping",
  description: "Pong!",
  deleted: false,

  callback: (client, interaction) => {
    interaction.reply(`My current Ping is ${client.ws.ping}ms`);
  }
};
