const Command = require("../../../Structures/Classes/BaseCommand");
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { t } = require("i18next");
const { Logger } = require("../../../Structures/Functions/Logger");
const logger = new Logger();

class BuyKey extends Command {
    constructor(client, dir) {
        super(client, dir, {
            data: new SlashCommandBuilder()
                .setName("buy-key")
                .setDescription("Permets d'acheter une clé de jeu aléatoire.")
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
        const keyPrice = 1000; // Coût de la clé

        await interaction.deferReply();

        const query = {
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        };
        let data = await client.db.MemberDatas.findOne(query);
        if (!data) {
            data = new client.db.MemberDatas(query)
            await data.save();
        }

        const userCurrency = data.currency || 0; // Anti-crash

        if (userCurrency < keyPrice) {
            return interaction.editReply(
                `❌ Vous n'avez pas assez de monnaie pour acheter une clé. Il vous faut **${keyPrice}** crédits.`
            );
        }

        const availableKeys = await client.db.GameKeys.find({ isSold: false });

        if (availableKeys.length === 0) {
            return interaction.editReply("❌ Aucune clé n'est disponible pour le moment.");
        }

        const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        randomKey.isSold = true;
        await randomKey.save();

        data.currency = userCurrency - keyPrice;
        await data.save();

        const embed = new EmbedBuilder()
            .setTitle("🎮 Clé achetée avec succès !")
            .setColor(Colors.Green)
            .setDescription(`Votre clé pour **${randomKey.gameName}** vient d'être envoyé dans tes mp.`)
            .setFooter({ text: "Merci pour votre achat !" });

        logger.info(`🔑 ${interaction.user.username} vient d'acheter une clé: ${randomKey.key}.`)
        await interaction.user.send({ content: `Voici votre clé **${randomKey.gameName}** :\n\`\`\`${randomKey.key}\`\`\`` }).catch(() => { })
        await interaction.editReply({ embeds: [embed] });
    }
}

module.exports = BuyKey;
