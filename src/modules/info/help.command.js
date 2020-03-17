const Command = require("../../imports/Command");
const { MessageEmbed } = require("discord.js");
const { CommandDoesNotExist } = require("../../errors/errors");

module.exports = class help extends Command {
    constructor() {
        const options = {
            alias: ["h", "help"],
            category: "Info",
            description:
                "Todos os comandos ou informações sobre um comando específico.",
            usage: "ajuda [comando | atalho]",
            botChannelOnly: true
        };

        super("ajuda", options);
    }

    /**
     * Get especif help or whole help and send it to the user
     * @param {Object} client Bot client
     * @param {Object} message Message sent
     * @param {Array} args Message content without the command
     * @param {Object} meta Commands and alias map
     */
    async run(client, message, args, meta) {
        if (args.length > 0) return this.get(message, args[0], meta);
        else return this.getAll(message, meta.commands);
    }

    /**
     * Get the help of the requested command
     * @param {Object} message Message sent by the user
     * @param {Object} command The command help to get
     * @param {Object} meta Commands and alias ap
     */
    get(message, command, meta) {
        let cmd = meta.commands.get(command.toLowerCase());

        if (!cmd) {
            const alias = meta.alias.get(command.toLowerCase());
            if (!alias) throw new CommandDoesNotExist(command);

            cmd = meta.commands.get(alias.toLowerCase());
        }

        if (cmd.hideHelp) throw new CommandDoesNotExist(command);

        if (!cmd.hasPermission(message.member))
            throw new CommandDoesNotExist(command);

        message.author.send(
            new MessageEmbed()
                .setColor("RANDOM")
                .addField(
                    `${cmd.name}:`,
                    `**Comando:** \`${process.env.PREFIX}${cmd.name}\`\n**Descrição:** ${cmd.description}\n**Categoria:** ${cmd.category}\n**Uso:** ${cmd.usage}\n`
                )
        );
    }

    /**
     * Get all commands and send the help to the user
     * @param {Object} message Message sent by the user
     * @param {Object} commands Command map
     */
    getAll(message, commands) {
        const embed = new MessageEmbed().setColor("RANDOM");

        embed
            .setTitle("-== Ajuda ==-")
            .setDescription("Todos os comandos do servidor")
            .setTimestamp();

        const categories = {};

        commands.forEach((command) => {
            if (command.hideHelp) return;
            if (!command.hasPermission(message.member)) return;

            if (!categories[command.category])
                categories[command.category] = [];

            categories[command.category].push(command);
        });

        Object.keys(categories).forEach((key) => {
            embed.addField(
                `${key}:`,
                categories[key].map(
                    (cmd) =>
                        `**Comando:** \`${process.env.PREFIX}${cmd.name}\`\n**Descrição:** ${cmd.description}\n**Categoria:** ${cmd.category}\n**Uso:** ${cmd.usage}\n`
                )
            );
        });

        message.author.send(embed);
    }
};
