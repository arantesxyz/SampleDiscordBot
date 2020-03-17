const Command = require("../../imports/Command");

module.exports = class test extends Command {
    constructor() {
        const options = {
            alias: [],
            category: "Administration",
            description: "Administration",
            usage: "test",
            allowPrivate: true,
            hideHelp: true,
            permission: ["bot.test"]
        };
        super("test", options);
    }

    /**
     * Command for test purpouses only
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message content without the command
     */
    async run(client, message, args) {
        message.reply("EasterEgg!");
    }
};
