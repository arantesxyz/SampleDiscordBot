const Command = require("../../imports/Command");
const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../imports/helper");
const {
    NotEnoughArguments,
    BotWithoutPermission,
    NoPermission,
    MemberDoesNotExist
} = require("../../errors/errors");

module.exports = class Ban extends Command {
    constructor() {
        const options = {
            alias: ["banir"],
            category: "Moderação",
            description: "banir.",
            usage: "ban <Membro> <Motivo>",
            permission: ["bot.ban", "bot.admin"]
        };
        super("ban", options);
    }

    /**
     * Bans an user
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message contetn without the command
     */
    async run(client, message, args) {
        if (args.length < 2) {
            throw new NotEnoughArguments(this.usage);
        }

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            throw new NoPermission();
        }

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            throw new BotWithoutPermission();
        }

        const toBan =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!toBan) {
            throw new MemberDoesNotExist();
        }

        if (toBan.id === message.author.id) {
            return message
                .reply("Hey! Você não pode se banir!")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (!toBan.bannable) {
            throw new BotWithoutPermission();
        }

        const promptEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("Você tem 30 segundos para responder!")
            .setDescription(`Deseja banir ${toBan}?`);

        await message.channel.send(promptEmbed).then(async (msg) => {
            const emoji = await promptMessage(msg, message.author, 30, [
                "✅",
                "❌"
            ]);

            if (emoji === "✅") {
                msg.delete();

                await toBan.ban(args.slice(1).join(" "));
            } else {
                msg.delete();

                message
                    .reply(`banimento cancelado.`)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        });
    }
};
