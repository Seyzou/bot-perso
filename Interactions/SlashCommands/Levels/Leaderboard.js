const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");

const { progressBar, msToHMS } = require("../../../Structures/Functions/index");


class Leaderboard extends Command {
    constructor(client, dir) {
        super(client, dir, {
            data: new SlashCommandBuilder()
                .setName("leaderboard")
                .setDescription("Affiche un classement.")
                .setDMPermission(false)
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Type de classement")
                        .setRequired(true)
                        .addChoices(
                            { name: "Messages", value: "msg" },
                            { name: "Vocal", value: "voc" },
                            { name: "Monnaie", value: "currency" },
                            { name: "Level", value: "lvl" },
                        )
                ),
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
        const type = interaction.options.getString('type');
        const guildId = interaction.guild.id;
        let data = await client.db.MemberDatas.find({ guildId });
        if (!data) {
            return await interaction.reply({ content: "Aucune données trouvées pour ce serveur", ephemeral: true })
        }
        switch (type) {
            case "msg": {
                const topMessages = [...data]
                    .filter(member => member.messagesSend > 0)
                    .sort((a, b) => b.messagesSend - a.messagesSend)
                    .slice(0, 10); // Limite à 10 membres

                const embed = new EmbedBuilder()
                    .setTitle(`\`📋 Classement: 🖊️Messages                        \``)
                    .setColor(Colors.Yellow)
                    .setDescription(topMessages
                        .map((member, index) =>
                            `**${index + 1}.** <@${member.userId}> - **${member.messagesSend}** messages`
                        )
                        .join("\n") || "Aucun membre dans cette catégorie.")
                await interaction.reply({ embeds: [embed] })
                break;
            }
            case "voc": {
                const topVoice = [...data]
                    .filter(member => member.timeInVocal > 0)
                    .sort((a, b) => b.timeInVocal - a.timeInVocal)
                    .slice(0, 10); // Limite à 10 membres

                const embed = new EmbedBuilder()
                    .setTitle(`\`📋 Classement: 🔊Vocal                        \``)
                    .setColor(Colors.Yellow)
                    .setDescription(topVoice
                        .map((member, index) =>
                            `**${index + 1}.** <@${member.userId}> - **${msToHMS(member.timeInVocal)}**`
                        )
                        .join("\n") || "Aucun membre dans cette catégorie.")
                await interaction.reply({ embeds: [embed] })
                break;
            }
            case "lvl": {
                const topLevel = [...data]
                    .filter(member => member.level > 0)
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 10); // Limite à 10 membres

                const embed = new EmbedBuilder()
                    .setTitle(`\`📋 Classement: ⭐Level                        \``)
                    .setColor(Colors.Yellow)
                    .setDescription(topLevel
                        .map((member, index) =>
                            `**${index + 1}.** <@${member.userId}> - **${member.level}**`
                        )
                        .join("\n") || "Aucun membre dans cette catégorie.")
                await interaction.reply({ embeds: [embed] })
                break;
            }
            case "currency": {
                const topCurrency = [...data]
                    .filter(member => member.currency > 0)
                    .sort((a, b) => b.currency - a.currency)
                    .slice(0, 10); // Limite à 10 membres

                const embed = new EmbedBuilder()
                    .setTitle(`\`📋 Classement: Monnaie                        \``)
                    .setColor(Colors.Yellow)
                    .setDescription(topCurrency
                        .map((member, index) =>
                            `**${index + 1}.** <@${member.userId}> - **${member.currency} <:currency:1319403790281080843>**`
                        )
                        .join("\n") || "Aucun membre dans cette catégorie.")
                await interaction.reply({ embeds: [embed] })
                break;
            }
        }
    }
}

module.exports = Leaderboard;
