const Command = require("../../../Structures/Classes/BaseCommand");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    PermissionsBitField,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    EmbedBuilder,
    Colors
} = require("discord.js");
const { t } = require("i18next");

class addMoney extends Command {
    constructor(client, dir) {
        super(client, dir, {
            data: new SlashCommandBuilder()
                .setName('add-money')
                .setDescription("Ajouter de la monnaie à un utilisateur.")
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription("Utilisateur à créditer.")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription("Montant à ajouter.")
                        .setRequired(true)
                        .setMinValue(1)),

            options: {
                //  premiumGuild: true,
                //  premiumUser: true,
                devOnly: true,
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
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const query = {
            guildId: interaction.guild.id,
            userId: targetUser.id,
        };
        let data = await client.db.MemberDatas.findOne(query);
        if (!data) {
            data = new client.db.MemberDatas(query)
            await data.save();
        }

        data.currency = (data.currency || 0) + amount; // Anti-crash
        await data.save();

        await interaction.reply(`💰 **${amount}** crédits ont été ajoutés à ${targetUser.username}.`);

    }
}

module.exports = addMoney;
