const Event = require("../../imports/Event");

module.exports = class InviteBlockerOnEdit extends Event {
    constructor() {
        super("messageUpdate");
    }

    /**
     * Check if the new message is a discord invite and blocks it if so...
     * @param {Object} client Bot client
     * @param {Object} oldMessage Message before the update
     * @param {Object} newMessage Message after the update
     */
    async run(client, oldMessage, newMessage) {
        if (!newMessage || !newMessage.guild) return;

        const ROLE_NAME = /divulga/i;
        if (newMessage.member.roles.cache.some((r) => r.name.match(ROLE_NAME)))
            return;

        if (newMessage.content.match(/discord\.gg\/\w+/i)) {
            newMessage.delete();
            newMessage
                .reply("Você não pode enviar convites aqui.")
                .then((m) => m.delete({ timeout: 5000 }));
        }
    }
};
