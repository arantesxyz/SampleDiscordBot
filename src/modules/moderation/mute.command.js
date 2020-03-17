const Command = require("../../imports/Command");
const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../imports/helper");
const {
    NotEnoughArguments,
    MemberDoesNotExist
} = require("../../errors/errors");

module.exports = class Mute extends Command {
    constructor() {
        const options = {
            alias: ["mute"],
            category: "Moderação",
            description: "Mutar.",
            usage: "mutar <Membro> <Motivo>",
            permission: ["bot.mute", "bot.admin"]
        };
        super("mutar", options);
    }

    /**
     * Mutes an user
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message contetn without the command
     */
    async run(client, message, args) {
        if (args.length < 2) {
            throw new NotEnoughArguments(this.usage);
        }

        const toMute =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!toMute) {
            throw new MemberDoesNotExist();
        }

        if (toMute.id === message.author.id) {
            return message
                .reply("Hey! Você não pode se mutar!")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        const promptEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("Você tem 30 segundos para responder!")
            .setDescription(`Deseja mutar ${toMute}?`);

        const role = message.guild.roles.cache.find((role) =>
            role.name.match(/Silenciado/i)
        );

        await message.channel.send(promptEmbed).then(async (msg) => {
            const emoji = await promptMessage(msg, message.author, 30, [
                "✅",
                "❌"
            ]);

            if (emoji === "✅") {
                msg.delete();

                toMute.roles.add(role);
            } else {
                msg.delete();

                message
                    .reply(`mute cancelado.`)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        });
    }
};
