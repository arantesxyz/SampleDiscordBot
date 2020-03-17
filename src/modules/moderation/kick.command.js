const Command = require("../../imports/Command");
const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../imports/helper");
const {
    NotEnoughArguments,
    BotWithoutPermission,
    NoPermission,
    MemberDoesNotExist
} = require("../../errors/errors");

module.exports = class ping extends Command {
    constructor() {
        const options = {
            alias: ["kick"],
            category: "Moderação",
            description: "Kickar.",
            usage: "expulsar <Membro> <Motivo>",
            permission: ["bot.kick", "bot.admin"]
        };
        super("expulsar", options);
    }

    /**
     * Kicks an user
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message contetn without the command
     */
    async run(client, message, args) {
        if (args.length < 2) {
            throw new NotEnoughArguments(this.usage);
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            throw new NoPermission();
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            throw new BotWithoutPermission();
        }

        const toKick =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!toKick) {
            throw new MemberDoesNotExist();
        }

        if (toKick.id === message.author.id) {
            return message
                .reply("Hey! Você não pode se expulsar!")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (!toKick.kickable) {
            throw new BotWithoutPermission();
        }

        const promptEmbed = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor("Você tem 30 segundos para responder!")
            .setDescription(`Deseja expulsar ${toKick}?`);

        await message.channel.send(promptEmbed).then(async (msg) => {
            const emoji = await promptMessage(msg, message.author, 30, [
                "✅",
                "❌"
            ]);

            if (emoji === "✅") {
                msg.delete();

                await toKick.kick(args.slice(1).join(" "));
            } else {
                msg.delete();

                message
                    .reply(`expulsão cancelada.`)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        });
    }
};
