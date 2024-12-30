const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");

const { progressBar, msToHMS } = require("../../../Structures/Functions/index");


class Balance extends Command {
    constructor(client, dir) {
        super(client, dir, {
            data: new SlashCommandBuilder()
                .setName("balance")
                .setDescription("Affiche votre monnaie ou celle du membre.")
                .setDMPermission(false)
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('Le membre')
                        .setRequired(false)),

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
        const target = interaction.options.getUser('target');
        if (target && target.bot) {
            return interaction.reply({ content: "Cette commande n'est pas utilisable sur les 🤖 bots!", ephemeral: true });
        }
        const query = {
            guildId: interaction.guild.id,
            userId: target ? target.id : interaction.user.id,
        };
        let data = await client.db.MemberDatas.findOne(query);
        if (!data) {
            data = new client.db.MemberDatas(query)
            await data.save();
        }

        const currency = parseInt(data.currency || 0, 10);

        const embed = new EmbedBuilder()
            .setColor(Colors.NotQuiteBlack)
            .setThumbnail(target ?
                target.displayAvatarURL({ dynamic: true }) :
                interaction.user.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`<:currency:1319403790281080843> ${target ?
                `\`${target.username} possède: ${currency} coins.                        \``
                : `\`Tu possèdes: ${currency} coins.                        \``}
                 `)
            .setTimestamp()
        await interaction.reply({ embeds: [embed] })
    }
}

module.exports = Balance;
