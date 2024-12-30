const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");
const { Logger } = require("../../../Structures/Functions/Logger");
const logger = new Logger();

class Stock extends Command {
    constructor(client, dir) {
        super(client, dir, {
            data: new SlashCommandBuilder()
                .setName("stock")
                .setDescription("Afficher le stock de clés disponibles.")
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
        const availableKeys = await client.db.GameKeys.find({ isSold: false });

        if (availableKeys.length === 0) {
            return await interaction.reply("Aucune clé n'est disponible en ce moment.");
        }

        const stock = availableKeys.reduce((acc, key) => {
            acc[key.gameName] = (acc[key.gameName] || 0) + 1;
            return acc;
        }, {});

        const embed = new EmbedBuilder()
            .setTitle("📦 Stock de Clés Disponibles")
            .setColor(Colors.Blue)
            .setDescription(`Il y a actuellement ${availableKeys.length} clé(s) de disponible dans la boutique. \n\n*Toutes les clés dans la boutique sont achetées par lot. Je ne peux donc pas vérifier si elles fonctionnent.*`)
            .setFooter({ text: "Stock actuel de la boutique." });

        await interaction.reply({ embeds: [embed] });
    }
}

module.exports = Stock;
