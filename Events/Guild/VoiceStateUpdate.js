const Event = require("../../Structures/Classes/BaseEvent");
const {
    Events,
    CommandInteraction,
    InteractionType,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    AttachmentBuilder,
    ActivityType,
    PresenceUpdateStatus,
    Colors,
} = require("discord.js");
const { LevelXp, msToHMS, Logger } = require("../../Structures/Functions/index");
const levelXp = new LevelXp();
const moment = require('moment');
moment.locale('fr');

const logger = new Logger();
const users = new Map();

class VoiceStateUpdate extends Event {
    constructor(client) {
        super(client, {
            name: Events.VoiceStateUpdate,
        });
    }

    async execute(oldState, newState) {
        const { client } = this;

        const member = oldState.member || newState.member;
        const guild = oldState.guild || newState.guild;

        if (!member || member.user.bot) return;

        let guildData = await client.db.PluginsData.findOne({ guildId: guild.id });
        if (!guildData) {
            guildData = new client.db.PluginsData({ guildId: guild.id });
            await guildData.save();
        }
        const query = {
            guildId: guild.id,
            userId: member.id,
        };

        let data = await client.db.MemberDatas.findOne(query);
        if (!data) {
            data = new client.db.MemberDatas(query)
            await data.save().catch(error =>
                console.error("Erreur lors de la sauvegarde des données :", error)
            );
        }

        if (!newState.channel && oldState.channel) {

            // User left the voice channel
            const joinedTimestamp = users.get(member.id); // Get the saved timestamp of when the user joined the voice channel
            if (!joinedTimestamp) return; // In case the bot restarted and the user left the voice channel after the restart (the Map will reset after a restart)
            const totalTime = new Date().getTime() - joinedTimestamp; // The total time the user has been i the voice channel in ms
            data.timeInVocal += totalTime;

            const minutes = Math.floor(totalTime / 60000); // Convertit le temps en minutes
            if (minutes < 1) {
                return;
            } else {
                for (let i = 0; i < minutes; i++) {
                    const chance = Math.random();
                    if (chance <= 0.25) {
                        const reward = 1; // Valeur de la pièce
                        data.currency = (data.currency || 0) + reward;
                    }
                }
            }

            await data.save().catch(error =>
                logger.error("Erreur lors de la sauvegarde des données de membre :", error)
            );
            if (guildData.plugins.levels.enabled) {
                await levelXp.updateXp(member, data, guildData, totalTime, "voc");
            }
        } else if (oldState.channel === null || oldState.channel && !newState.channel) {

            // User joined the voice channel
            users.set(member.id, new Date().getTime()); // Save the timestamp of when the user joined the voice channel

        }
    }
}

module.exports = VoiceStateUpdate;
