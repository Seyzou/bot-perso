const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");
const { t } = require("i18next");
const TwitchAPI = require('node-twitch').default
const config = require("../../../config");

const twitch = new TwitchAPI({
    client_id: config.twitch.client_id,
    client_secret: config.twitch.client_secret
})

class Calendar extends Command {
  constructor(client, dir) {
    super(client, dir, {
      data: new SlashCommandBuilder()
        .setName("calendar")
        .setDescription("Show the calendar")
        .setDMPermission(false),
      options: {
        //  premiumGuild: true,
        //  premiumUser: true,
        //  devOnly: false,
      },
    });
  }
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("../../../Structures/Classes/BotClient").BotClient} client
   * @param {string} lng
   */
  async execute(interaction, client, lng) {
    let IsStream = false
    await twitch.getStreams({ channel: client.config.twitch.channel_name }).then(async data => {
      const r = data.data[0]
      if (r) IsStream = true;
    })
    let c = await client.db.calendarData.findOne(
      {
        guildId: interaction.guildId,
      }
    );
    const embed = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setTitle("🗓️ Calendar of the week");
      if (IsStream) {
        embed.setDescription(`> ### I'm on stream right now ! [<:twitch:1308559652111519806> Clic here to see](https://twitch.tv/${client.config.twitch.channel_name})`)
        .setThumbnail("https://cdn.discordapp.com/attachments/1308564541394649171/1308564612081389668/a5c64be4ef196c530849132e9e56f449.gif?ex=673e6743&is=673d15c3&hm=9a44106aa5f9e10e62f844784810e41f4cddb7eb925af9d4cf4644f3ab37f190&")
      };
    if (!c) {
      c = await client.db.calendarData.create({
        guildId: interaction.guildId,
      });
      embed.addFields(
        {
          name: "Monday",
          value: `${c.monday == "undefined" ? "`None`" : c.monday}`,
          inline: true
        },
        {
          name: "Tuesday",
          value: `${c.tuesday == "undefined" ? "`None`" : c.tuesday}`,
          inline: true
        },
        {
          name: "Wednesday",
          value: `${c.wednesday == "undefined" ? "`None`" : c.wednesday}`,
          inline: true
        },
        {
          name: "Thursday",
          value: `${c.thursday == "undefined" ? "`None`" : c.thursday}`,
          inline: true
        },
        {
          name: "Friday",
          value: `${c.friday == "undefined" ? "`None`" : c.friday}`,
          inline: true
        },
        {
          name: "Saturday",
          value: `${c.saturday == "undefined" ? "`None`" : c.saturday}`,
          inline: true
        },
        {
          name: "Sunday",
          value: `${c.sunday == "undefined" ? "`None`" : c.sunday}`,
          inline: false
        },

      )
      await interaction.reply({ embeds: [embed], content: "" });
    } else {
      embed.addFields(
        {
          name: "Monday",
          value: `${c.monday == "undefined" ? "`None`" : c.monday}`,
          inline: true
        },
        {
          name: "Tuesday",
          value: `${c.tuesday == "undefined" ? "`None`" : c.tuesday}`,
          inline: true
        },
        {
          name: "Wednesday",
          value: `${c.wednesday == "undefined" ? "`None`" : c.wednesday}`,
          inline: true
        },
        {
          name: "Thursday",
          value: `${c.thursday == "undefined" ? "`None`" : c.thursday}`,
          inline: true
        },
        {
          name: "Friday",
          value: `${c.friday == "undefined" ? "`None`" : c.friday}`,
          inline: true
        },
        {
          name: "Saturday",
          value: `${c.saturday == "undefined" ? "`None`" : c.saturday}`,
          inline: true
        },
        {
          name: "Sunday",
          value: `${c.sunday == "undefined" ? "`None`" : c.sunday}`,
          inline: false
        },

      )
      await interaction.reply({ embeds: [embed], content: "" });
    }
  }
}

module.exports = Calendar;
