const Command = require("../../imports/Command");
const { NotEnoughArguments } = require("../../errors/errors");

module.exports = class BotAdmin extends Command {
    constructor() {
        const options = {
            alias: [],
            category: "Administration",
            description: "Administration",
            usage: "admin <setactivity> <PLAYING/WATCHING/LISTENING> <content>",
            allowPrivate: true,
            hideHelp: true,
            permission: ["bot.admin"]
        };
        super("botadmin", options);
    }

    /**
     * Get the subcommand and call the right function
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message content without the command
     */
    async run(client, message, args) {
        if (!args || !args.length) {
            throw new NotEnoughArguments(this.usage);
        }

        const [subcommand, ...params] = args;

        switch (subcommand.toLowerCase()) {
            case "setactivity":
                this.setStatus(message, params);
                return this._updatePresence(client);
            default:
                throw new NotEnoughArguments(this.usage);
        }
    }

    /**
     * Checks arguments and sets the status
     * @param {Object} message Message sent by the user
     * @param {Array} args Message content without the command and subcommand
     */
    setStatus(message, args) {
        let [type, ...content] = args;
        content = content.join(" ");
        type = type.toUpperCase();

        if (!type || !["PLAYING", "WATCHING", "LISTENING"].includes(type)) {
            return message
                .reply(
                    `${type} não é um tipo válido. Escolha entre PLAYING ou STREAMING.`
                )
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (!content || !content.length) {
            throw new NotEnoughArguments(this.usage);
        }

        this.activityContent = content;
        this.activityType = type;

        return message
            .reply("Bot atualizado!")
            .then((m) => m.delete({ timeout: 5000 }));
    }

    /**
     * Update the bot presence
     * @param {Object} client Bot client
     */
    _updatePresence(client) {
        client.user.setPresence({
            status: "online", // dnd, idle, online, invisible
            activity: {
                name: this.activityContent,
                type: this.activityType
            }
        });
    }
};
