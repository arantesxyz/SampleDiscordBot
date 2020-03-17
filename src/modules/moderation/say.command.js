const { MessageEmbed } = require("discord.js");
const Command = require("../../imports/Command");
const { NotEnoughArguments } = require("../../errors/errors");

module.exports = class Say extends Command {
    constructor() {
        const options = {
            alias: ["say"],
            category: "Moderação",
            description: "Repete a mensagem.",
            usage: "dizer <Mensagem>",
            permission: ["bot.say", "bot.admin"]
        };
        super("dizer", options);
    }

    /**
     * Repeates what the user said
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message contetn without the command
     */
    async run(client, message, args) {
        if (!args.length) throw new NotEnoughArguments(this.usage);

        return message.channel.send(args.join(" "));
    }
};
