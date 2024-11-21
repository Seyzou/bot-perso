const TwitchAPI = require('node-twitch').default
const config = require("../../config");
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors, time, TimestampStyles } = require("discord.js");
const moment = require('moment');
moment.locale('fr');
const twitch = new TwitchAPI({
    client_id: config.twitch.client_id,
    client_secret: config.twitch.client_secret
})

module.exports = async (client) => {
    let IsLiveMemory = false
    let mess;
    const run = async function Run() {
        await twitch.getStreams({ channel: config.twitch.channel_name }).then(async data => {
            const r = data.data[0]
            let ThisGuildOnly = client.guilds.cache.get("1208769358214602793")
            const ChannelAnnounceLive = ThisGuildOnly.channels.cache.find(x => x.id === "1304887676947796018")

            if (r !== undefined) {
                const date = new Date(moment(r.started_at).format())
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setAuthor({ name: `${r.user_name} is now on stream !`, url: `https://twitch.tv/${client.config.twitch.channel_name}`, })
                    .setDescription(`### 🎬 - **${r.title}**`)
                    .setTimestamp()
                    .addFields(
                        {
                            name: "Category",
                            value: `\`${r.game_name}\``,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: '\u200b',
                            inline: true
                        },
                        {
                            name: 'Duration',
                            value: `${time(date, TimestampStyles.RelativeTime)}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `👀 ${r.viewer_count} viewers` })
                    .setThumbnail("https://cdn.discordapp.com/attachments/1308564541394649171/1309101301522497597/telechargement_1.jpg?ex=67405b18&is=673f0998&hm=f6d53d68b26c7bd6cee60fe0e76171db8d3e651c465b47d5d742e04b699b605a&")
                    .setImage(`${r.getThumbnailUrl()}`);

                const confirm = new ButtonBuilder()
                    .setURL(`https://twitch.tv/${client.config.twitch.channel_name}`)
                    .setLabel("Go to the stream")
                    .setEmoji("1308559652111519806")
                    .setStyle(ButtonStyle.Link);

                const row = new ActionRowBuilder().addComponents(confirm);
                if (r.type === "live") {
                    if (IsLiveMemory === false || IsLiveMemory === undefined) {
                        IsLiveMemory = true
                        mess = await ChannelAnnounceLive.send({ content: "<@&1280103995578388612>", embeds: [embed], components: [row] });
                    } else if (IsLiveMemory === true) {
                        mess.edit({ embeds: [embed], components: [row] });
                    }
                } else {

                    if (IsLiveMemory === true) {
                        IsLiveMemory = false
                        const em = new EmbedBuilder(mess.embeds[0])
                        .setAuthor({name: `stream ended for ${r.user_name}`, url: `https://twitch.tv/${client.config.twitch.channel_name}`,})
                        .setThumbnail("https://cdn.discordapp.com/attachments/1308564541394649171/1309101314801664000/telechargement.jpg?ex=67405b1b&is=673f099b&hm=d6d4bd72d691dfbd6bc3a3955ff3437a9bf1507647c0cf5e4c9505e6c87a438b&")
                        mess.edit({ content: "Stream ended ! `Use /calendar to see when i'm gonna stream again`",  embeds: [em] })
                    }
                }
            } else {

                if (IsLiveMemory === true) {
                    IsLiveMemory = false
                    const em = new EmbedBuilder(mess.embeds[0])
                        .setAuthor({name: `stream ended for ${r.user_name}`, url: `https://twitch.tv/${client.config.twitch.channel_name}`,})
                        .setThumbnail("https://cdn.discordapp.com/attachments/1308564541394649171/1309101314801664000/telechargement.jpg?ex=67405b1b&is=673f099b&hm=d6d4bd72d691dfbd6bc3a3955ff3437a9bf1507647c0cf5e4c9505e6c87a438b&")
                    mess.edit({ content: "Stream ended ! `Use /calendar to see when i'm gonna stream again`", embeds: [em] })
                }
            }
        })
    }
    setInterval(run, 1000 * 15)
}