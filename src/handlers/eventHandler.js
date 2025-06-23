const path = require("path");
const getAllFiles = require("../utils/getAllFiles");
const fs = require("fs");
const { EmbedBuilder, ActivityType } = require("discord.js");
require("dotenv").config();
const { Player } = require("discord-player");

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }

  // Activity and DND mode

  client.on("ready", async () => {
    client.user.setStatus("dnd");
    client.user.setActivity({
      name: "Distortlight Is my father",
      type: ActivityType.Custom
    });
  });

  // Messages Replys

  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes("meow")) {
      message.reply("That's a good lil kitty !");
    }
    if (message.author.id === "869406935357743205") {
      if (message.content.toLowerCase() === "kitten") {
        message.reply("You have called Master ");
      }
      if (message.content.toLowerCase() === "pewpew") {
        message.channel.send("@everyone");
      }
    }
  });

  //message created logging

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === "1333402609918152714") return;
    if (message.channel.id === "1329194952626012342") return;

    // Image & message pinning to a channel

    if (message.reference && message.reference.messageId) {
      if (
        message.author.id == "869406935357743205" ||
        "1330373117192700040" ||
        "810952830235836436"
      ) {
        if (message.content.toLowerCase() === "pin") {
          const repliedTo = await message.channel.messages.fetch(
            message.reference.messageId
          );

          const repliedToUser = repliedTo.author.id;
          const rGuildId = repliedTo.guild.id;
          const rChannelId = repliedTo.channel.id;
          const repliedToMsgId = repliedTo.id;

          const i = repliedTo.attachments.find((attachment) =>
            attachment.contentType?.startsWith("image/")
          );

          const ch = await client.channels.fetch("1384074577411444816");
          if (!ch.isTextBased()) return;

          const pinningBoard = new EmbedBuilder()
            .setTitle("⭐⭐⭐⭐⭐\n• Star Board •")
            .setColor("Yellow")
            .addFields({
              name: ` `,
              value: `\n**Starred User**: <@${repliedToUser}>\n- https://discord.com/channels/${rGuildId}/${rChannelId}/${repliedToMsgId}\n- ${repliedTo.content}`
            });

          if (i) {
            pinningBoard.setImage(i.url);
          }
          await ch.send({ embeds: [pinningBoard] });
          message.delete();
        }
      }
    }

    if (message.content === "") return;
    if (message.content === "pin") return;

    //to be deleted ifs

    // Message Logging

    console.log(
      `[${message.channel.name}] ${message.author.tag} ==> ${message.content}`
    );
    const messageLogger = fs.createWriteStream(
      "src/loggers/The-Boys/BoysMessageSent.txt",
      { flags: "a" }
    );
    messageLogger.write(
      `[${message.channel.name}] ${message.author.tag} ==> ${message.content}\n`
    );
    messageLogger.end();

    // Discord Logs | Message Logging

    const MessageLogger = new EmbedBuilder()
      .setTitle(`Message Sent`)
      .setColor("DarkRed")
      .addFields({
        name: ` `,
        value: `**Channel**: \n- https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}\n**Discord Tag**: \n- <@${message.author.id}>\n**Message**: \n- ${message.content}`,
        inline: true
      });
    client.channels.cache
      .get("1382447649428602940")
      .send({ embeds: [MessageLogger] });
  });

  // Message Updated logging

  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    if (oldMessage.channel.id === "1333402609918152714") return;
    if (oldMessage.channel.id === "1329194952626012342") return;
    if (newMessage.content === "") return;
    if (newMessage.content === "pin") return;

    //to be deleted ifs

    console.log(
      `[${newMessage.channel.name}] ${newMessage.author.tag} ==> ${oldMessage.content} –→ ${newMessage.content}`
    );
    if (newMessage.guild.id === "1342817423140851746") {
      const messageLogger = fs.createWriteStream(
        "src/loggers/The-Boys/BoysMessageUpdated.txt",
        { flags: "a" }
      );
      messageLogger.write(
        `[${newMessage.channel.name}] ${newMessage.author.tag} ==> ${oldMessage.content} –→ ${newMessage.content}\n`
      );
      messageLogger.end();
    }

    // Discord Logs | Message Updated Logging

    const MessageLogger = new EmbedBuilder()
      .setTitle(`Message Updated`)
      .setColor("DarkRed")
      .addFields({
        name: ` `,
        value: `**Channel**: \n- https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}\n**Discord Tag**: \n- <@${oldMessage.author.tag}>\n**Old Contents**: \n- ${oldMessage.content}\n**New Content**: \n- ${newMessage.content}`,
        inline: true
      });
    client.channels.cache
      .get("1382447649428602940")
      .send({ embeds: [MessageLogger] });

    // Channel embed for mason

    if (oldMessage.author.id === "1254396155782107218") {
      const messagLog = new EmbedBuilder()
        .setTitle(`Message Updated`)
        .setColor("DarkRed")
        .addFields({
          name: ` `,
          value: `**Discord Tag**: \n- ${oldMessage.author.tag}\n**Old Contents**: \n- ${oldMessage.content}`,
          inline: true
        });
      oldMessage.reply({ embeds: [messagLog] });
    }
  });

  // Message Deleted Logging

  client.on("messageDelete", (message) => {
    if (message.author.bot) return;
    if (message.channel.id === "1333402609918152714") return;
    if (message.channel.id === "1329194952626012342") return;
    if (message.content === "") return;
    if (message.content === "pin") return;

    //to be deleted ifs

    //File Message deleted logging

    console.log(
      `[${message.channel.name}] ${message.author.tag} ==> ${message.content}`
    );
    if (message.guild.id === "1342817423140851746") {
      const messageLogger = fs.createWriteStream(
        "src/loggers/The-Boys/BoysMessageDeleted.txt",
        { flags: "a" }
      );
      messageLogger.write(
        `[${message.channel.name}] ${message.author.tag} ==> ${message.content}\n`
      );
      messageLogger.end();
    }

    // Discord Logs | Message Deleted Logging

    const MessageLogger = new EmbedBuilder()
      .setTitle(`Message Deleted`)
      .setColor("DarkRed")
      .addFields({
        name: ` `,
        value: `**Channel**: \n‖ https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}\n**Discord Tag**: \n‖ ${message.author.tag}\n**Contents**: \n‖ ${message.content}`,
        inline: true
      });
    client.channels.cache
      .get("1382447649428602940")
      .send({ embeds: [MessageLogger] });

    //Send Embed in channel of a deleted Message

    if (message.author.id == "869406935357743205") return;

    const messagLog = new EmbedBuilder()
      .setTitle(`Message Deleted`)
      .setColor("DarkRed")
      .addFields({
        name: ` `,
        value: `**Discord Tag**: \n- ${message.author.tag}\n**Contents**: \n- ${message.content}`,
        inline: true
      });
    message.channel.send({ embeds: [messagLog] });
  });

  // Boosted the server

  client.on("guildMemberUpdate", (oldMember, newMember) => {
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;
    const Boosted = new EmbedBuilder()
      .setTitle("New server booster")
      .setColor("Purple")
      .addFields({
        name: " ",
        value: `⭐ ${newMember.user.tag} just boosted the server !!`,
        inline: false
      });
    if (!oldStatus && newStatus) {
      client.channels.cache
        .get("1342817423719534636")
        .send({ embeds: [Boosted] });
      console.log(`${newMember.user.tag} just boosted the server`);
      return;
    }
    if (oldStatus && !newStatus) {
      client.channels.cache
        .get("1342817423719534636")
        .send({ embeds: [Boosted] });
      console.log(`${newMember.user.tag} stopped boosting the server`);
      return;
    }
  });

  // Reaction Roles

  client.on("interactionCreate", async (interaction) => {
    if (interaction.channel.id === "1382446790090948759") {
      if (!interaction.isButton()) return;
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.guild.roles.cache.get(interaction.customId);

      if (!role) {
        interaction.editReply({
          content: "I couldn't find that Role."
        });
        return;
      }
      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed.`);
        return;
      }
      await interaction.member.roles.add(role);
      await interaction.editReply(`The role ${role} has been added.`);
    }
  });
};
