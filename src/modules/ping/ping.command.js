const Command = require("../../imports/Command");

module.exports = class ping extends Command {
    constructor() {
        const options = {
            alias: [],
            category: "Info",
            description: "Latencia.",
            usage: "ping",
            allowPrivate: true,
            botChannelOnly: true
        };
        super("ping", options);
    }

    /**
     * Uses math to calculate the API ping
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message content without the command
     */
    async run(client, message, args) {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(
            `🏓 Pong!
        A latêcia é de ${Math.floor(
            msg.createdTimestamp - message.createdTimestamp
        )}ms`
        ).then((m) => m.delete({ timeout: 5000 }));
    }
};
