const { Client, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");

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

module.exports = {
  name: "gamble",
  description: "Guess for a random number with difficultys",
  options: [
    {
      name: "easy",
      description: "Guess for a number between 1-20",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 20
    },
    {
      name: "normal",
      description: "Guess for a number between 1-50",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 50
    },
    {
      name: "hard",
      description: "Guess for a number between 1-100",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 100
    },
    {
      name: "extreme",
      description: "Guess for a number between 1-250",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 250
    },
    {
      name: "impossible",
      description: "Guess for a number between 1-500",
      type: ApplicationCommandOptionType.Number,
      minValue: 1,
      maxValue: 500
    }
  ],
  deleted: false,

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const easyNum = getRandomXp(1, 20);
    const easyXp = getRandomXp(5, 30);
    const normalNum = getRandomXp(1, 50);
    const normalXp = getRandomXp(15, 50);
    const hardNum = getRandomXp(1, 100);
    const hardXp = getRandomXp(30, 75);
    const extNum = getRandomXp(1, 250);
    const extXp = getRandomXp(75, 125);
    const impNum = getRandomXp(1, 500);
    const impXp = getRandomXp(125, 250);

    const query = {
      userId: interaction.user.id,
      guildId: interaction.guild.id
    };

    try {
      if (!interaction.options.get("easy")?.value && !interaction.options.get("normal")?.value && !interaction.options.get("hard")?.value && !interaction.options.get("extreme")?.value && !interaction.options.get("impossible")?.value) {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply("Please Select a difficulty");
        return;
      }

      if (easyNum === interaction.options.get("easy")?.value || normalNum === interaction.options.get("normal")?.value || hardNum === interaction.options.get("hard")?.value || extNum === interaction.options.get("expert")?.value || impNum === interaction.options.get("impossible")?.value) {
        const gbl = new EmbedBuilder().setTitle("✅ Correct").setColor("Random");
        if (easyNum === interaction.options.get("easy")?.value) {
          gbl.addFields({
            name: ` `,
            value: `You got the number correct! it was ${easyNum} and you gained ${easyXp} xp`
          });
        } else if (normalNum === interaction.options.get("normal")?.value) {
          gbl.addFields({
            name: ` `,
            value: `You got the number correct! it was ${normalNum} and you gained ${normalXp} xp`
          });
        } else if (hardNum === interaction.options.get("hard")?.value) {
          gbl.addFields({
            name: ` `,
            value: `You got the number correct! it was ${hardNum} and you gained ${hardXp} xp`
          });
        } else if (extNum === interaction.options.get("expert")?.value) {
          gbl.addFields({
            name: ` `,
            value: `You got the number correct! it was ${extNum} and you gained ${extXp} xp`
          });
        } else if (impNum === interaction.options.get("impossible")?.value) {
          gbl.addFields({
            name: ` `,
            value: `You got the number correct! it was ${impNum} and you gained ${impXp} xp`
          });
        }
        interaction.reply({ embeds: [gbl] });

        const level = await Level.findOne(query);
        if (level) {
          if (easyNum === interaction.options.get("easy")?.value) {
            level.xp += easyXp;
          } else if (normalNum === interaction.options.get("normal")?.value) {
            level.xp += normalXp;
          } else if (hardNum === interaction.options.get("hard")?.value) {
            level.xp += hardXp;
          } else if (extNum === interaction.options.get("expert")?.value) {
            level.xp += extXp;
          } else if (impNum === interaction.options.get("impossible")?.value) {
            level.xp += impXp;
          }

          if (level.xp > calculateLevelXp(level.level)) {
            level.xp = 0;
            level.level += 1;

            if (interaction.guild.id === "1342817423140851746") {
              client.channels.cache.get("1366193038220857454").send(`${interaction.member} has leveled up to **level ${level.level}** `);

              const embed = new EmbedBuilder()
                .setTitle(` `)
                .setColor("DarkRed")
                .addFields({
                  name: ` `,
                  value: `${interaction.member} has leveled up to **level ${level.level}**`,
                  inline: true
                });
              client.channels.cache.get("1366193038220857454").send({ embeds: [embed] });
            }
          }
          await level.save().catch((e) => {
            console.log(`Error saving updated level ${e}`);
            return;
          });
        }
      } else {
        const fail = new EmbedBuilder().setTitle("❎ Incorrect").setColor("Random");

        if (interaction.options.get("easy")?.value) {
          fail.addFields({
            name: ` `,
            value: `You guessed ${interaction.options.get("easy")?.value}. the answer was was ${easyNum}`
          });
        } else if (interaction.options.get("normal")?.value) {
          fail.addFields({
            name: ` `,
            value: `You guessed ${interaction.options.get("normal")?.value}. the answer was was ${normalNum}`
          });
        } else if (interaction.options.get("hard")?.value) {
          fail.addFields({
            name: ` `,
            value: `You guessed ${interaction.options.get("hard")?.value}. the answer was was ${hardNum}`
          });
        } else if (interaction.options.get("extreme")?.value) {
          fail.addFields({
            name: ` `,
            value: `You guessed ${interaction.options.get("extreme")?.value}. the answer was was ${extNum}`
          });
        } else if (interaction.options.get("impossible")?.value) {
          fail.addFields({
            name: ` `,
            value: `You guessed ${interaction.options.get("impossible")?.value}. the answer was was ${impNum}`
          });
        }

        interaction.reply({ embeds: [fail] });
      }
    } catch (er) {
      console.log(er);
    }
  }
};
