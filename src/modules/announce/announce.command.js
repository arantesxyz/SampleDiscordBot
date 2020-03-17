const { MessageEmbed } = require("discord.js");
const Command = require("../../imports/Command");
const { NotEnoughArguments } = require("../../errors/errors");

module.exports = class ping extends Command {
    constructor() {
        const options = {
            alias: [],
            category: "Moderação",
            description: "Envia uma mensagem no canal de Anuncios.",
            usage: "anunciar <Título> ; <Mensagem>",
            hideHelp: true,
            permission: ["bot.anunciar", "bot.admin"]
        };
        super("anunciar", options);
    }

    /**
     * Sent a announce to a channel
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message content without the command
     */
    async run(client, message, args) {
        const CHANNEL_NAME = /avisos/i;

        const role = "@everyone";

        const [title, ...content] = args
            .join(" ")
            .split(";")
            .filter((a) => a);

        if (!title || !content) throw new NotEnoughArguments(this.usage);

        const embed = new MessageEmbed().setColor("RANDOM");
        embed
            .setTitle("Anúncio | " + title)
            .setDescription(content.join(";"))
            .setTimestamp()
            .setFooter(
                `Enviado por: ${message.author.username}`,
                message.author.avatarURL
            );

        const channel = message.guild.channels.cache.find((channel) =>
            channel.name.match(CHANNEL_NAME)
        );

        channel.send(role.toString(), embed);

        return message
            .reply(`Anúncio enviado no canal ${channel}`)
            .then((m) => m.delete({ timeout: 5000 }));
    }
};
