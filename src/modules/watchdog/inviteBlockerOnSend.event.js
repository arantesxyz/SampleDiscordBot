const Event = require("../../imports/Event");

module.exports = class InviteBlockerOnSend extends Event {
    constructor() {
        super("message");
    }

    /**
     * Check if the message is a discord invite and blocks it if so...
     * @param {Object} client Bot client
     * @param {Object} message Message sent
     */
    async run(client, message) {
        if (!message || !message.guild || message.author.bot) return;

        const ROLE_NAME = /bot\.divulgar/i;

        if (message.member.roles.cache.some((r) => r.name.match(ROLE_NAME)))
            return;

        if (message.content.match(/discord\.gg\/\w+/i)) {
            message.delete();
            message
                .reply("Você não pode enviar convites aqui.")
                .then((m) => m.delete({ timeout: 5000 }));
        }
    }
};
