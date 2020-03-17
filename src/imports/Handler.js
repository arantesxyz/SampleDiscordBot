const Table = require("ascii-table");
const { NoPermission } = require("../errors/errors");
const Command = require("./Command");
const Event = require("./Event");

module.exports = class Handler {
    /**
     * Deals with events and commands
     * @param {Object} client Bot client
     * @param {Object} options Handle options
     */
    constructor(client, options = {}) {
        if (!client) throw new Error("No client specified.");

        if (!options.folders.modules)
            throw new Error("No modules folder specified.");

        if (!options.prefix || !options.prefix[0])
            throw new Error("No prefix specified.");

        if (!Array.isArray(options.prefix)) options.prefix = [options.prefix];
        options.prefix.sort((a, b) => a.length < b.length);

        this.client = client;
        this.options = options;
        this.commands = new Map();
        this.alias = new Map();
        this.events = new Map();

        this._load();
    }

    /**
     * @private
     * Gets all the .js files in a specific folder.
     * @param {String} folder Folder name to search for the files
     */
    _getFiles(folder) {
        if (!folder) throw new Error("A folder needs to be specified.");

        const fs = require("fs");

        const _readFilesRecursive = (dir) => {
            let files = [];

            fs.readdirSync(dir).forEach((file) => {
                const location = dir + "/" + file;

                if (fs.lstatSync(location).isDirectory()) {
                    files = files.concat(_readFilesRecursive(location));
                } else {
                    files.push(location);
                }
            });

            return files;
        };

        const files = _readFilesRecursive(folder);

        if (files.length <= 0)
            throw new Error(`No files to load in ${folder}!`);

        const jsFiles = files.filter((f) => f.endsWith(".js"));

        console.log(`Found ${jsFiles.length} files to load in ${folder}`);

        return jsFiles;
    }

    /**
     * @private
     * Loads a specific command
     * @param {Object} command Command to load
     */
    _loadCommand(command) {
        if (this.commands.has(command.name) || this.alias.has(command.name)) {
            throw new Error(
                `Can't load command, the name '${command.name}' is already used as a command name or alias`
            );
        }

        this.commands.set(command.name, command);

        command.alias.forEach((alias) => {
            if (this.commands.has(alias) || this.alias.has(alias)) {
                throw new Error(
                    `Can't load command, the alias '${alias}' is already used as a command name or alias`
                );
            }

            this.alias.set(alias, command.name);
        });
    }

    /**
     * @private
     * Load a specific event
     * @param {Object} event Event to load
     */
    _loadEvent(event) {
        if (!event || event.run() == -1)
            throw new Error(
                `Can't load event. Event is either invalid or doesn't contain run method.`
            );
        const events = this.events.get(event.name) || [];
        events.push(event);

        this.events.set(event.name, events);
    }

    /**
     * @private
     *
     * Loads all modules
     */
    _load() {
        const table = new Table("Modules");
        table.setHeading("File", "Load status");

        this._getFiles(this.options.folders.modules).forEach((f) => {
            try {
                const file = require(f);
                const loadedFile = new file();

                if (loadedFile instanceof Command)
                    this._loadCommand(loadedFile);
                else if (loadedFile instanceof Event)
                    this._loadEvent(loadedFile);
                else throw new Error("File is not a Command or Event");

                table.addRow(f, "✅");
            } catch (error) {
                console.log("#_load Error: ", error);
                table.addRow(f, `❌  -> Error to load file.`);
            }
        });

        console.log(table.toString());
    }

    /**
     * @private
     * Register commands
     */
    _registerCommands() {
        this.client.on("message", async (message) => {
            if (
                message.author.bot ||
                !message.content.startsWith(this.options.prefix)
            ) {
                return;
            }

            const [command, ...args] = message.content
                .slice(this.options.prefix.length)
                .split(" ");

            let cmd = this.commands.get(command.toLowerCase());

            if (!cmd) {
                const alias = this.alias.get(command.toLowerCase());
                if (!alias) return;

                cmd = this.commands.get(alias.toLowerCase());
            }

            if (!cmd || !cmd.isEnabled()) {
                return;
            }

            if (cmd.guildOnly && !message.guild) {
                message.channel.send(
                    "Este comando só é suportado no nosso servidor."
                );
                return;
            }

            if (
                cmd.botChannelOnly &&
                message.guild &&
                !message.channel.name.match(/comandos/i)
            )
                return;

            const metadata = {
                commands: this.commands,
                alias: this.alias,
                events: this.events
            };

            try {
                if (message.deletable) {
                    message.delete();
                }

                if (!cmd.allowPrivate && !message.guild)
                    return message
                        .reply(
                            `O comando \`${process.env.PREFIX}${cmd.name}\` só pode ser executado dentro do nosso servidor!`
                        )
                        .then((m) => m.delete({ timeout: 5000 }));

                if (!cmd.hasPermission(message.member))
                    throw new NoPermission();

                await cmd.run(this.client, message, args, metadata);
            } catch (err) {
                message
                    .reply(err.message || "Aconteceu um erro. :C")
                    .then((m) => m.delete({ timeout: err.deleteTime || 5000 }));
            }
        });
    }

    /**
     * @private
     * Register events
     */
    _registerEvents() {
        for (const [name, handlers] of this.events) {
            this.client.on(name, (...params) => {
                handlers.forEach((handler) => {
                    if (handler.isEnabled()) {
                        try {
                            const metadata = {
                                commands: this.commands,
                                alias: this.alias,
                                events: this.events
                            };
                            handler.run(this.client, ...params, metadata);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                });
            });
        }
    }

    /**
     * @public
     * Register events and commands
     */
    register() {
        this._registerEvents();
        this._registerCommands();
    }
};
