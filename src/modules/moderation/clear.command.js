const Command = require("../../imports/Command");
const { BotWithoutPermission } = require("../../errors/errors");

module.exports = class clear extends Command {
    constructor() {
        const options = {
            alias: ["clear"],
            category: "Moderação",
            description: "Limpa o chat. (Máximo de 100 mensagens)",
            usage: "limpar [quantidade]",
            permission: ["bot.limpar", "bot.admin"]
        };
        super("limpar", options);
    }

    /**
     * Clear the chat
     * @param {Object} client Bot client
     * @param {Object} message Message sent by the user
     * @param {Array} args Message contetn without the command
     */
    async run(client, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message
                .reply("Você não pode fazer isso! :C")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (!args[0]) {
            return message
                .reply(`Utilize: \`${this.usage}\``)
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (isNaN(args[0])) {
            return message
                .reply("Hey! Isso não é um numero...")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (parseInt(args[0]) <= 0) {
            return message
                .reply("Ops, não é possível deletar 0 mensagens.")
                .then((m) => m.delete({ timeout: 5000 }));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            throw new BotWithoutPermission();
        }

        let amount = parseInt(args[0]);

        if (amount > 100) amount = 100;

        message.channel
            .bulkDelete(amount, true)
            .then((deleted) =>
                message.channel
                    .send(`Deletei \`${deleted.size}\` mensagens!`)
                    .then((m) => m.delete({ timeout: 5000 }))
            )
            .catch((err) => message.reply(`Algo deu errado... :C`));
    }
};
