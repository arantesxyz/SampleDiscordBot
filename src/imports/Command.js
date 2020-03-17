const Toggleable = require("./Toggleable");

module.exports = class Command extends Toggleable {
    constructor(
        name,
        {
            alias = [],
            usage = "",
            category = "",
            description = "",
            hideHelp = false,
            allowPrivate = false,
            permission = null,
            guildOnly = false,
            botChannelOnly = false
        }
    ) {
        super();

        // TODO: validate options
        if (!name || typeof name != "string")
            throw new Error("Command name is required.");

        this.name = name;

        this.alias = alias;
        this.usage = process.env.PREFIX + usage;
        this.category = category;
        this.description = description;
        this.hideHelp = hideHelp;
        this.allowPrivate = allowPrivate;
        this.permission = permission;
        this.guildOnly = guildOnly;
        this.botChannelOnly = botChannelOnly;
    }

    // TODO: Implement ACL permission system.
    hasPermission(member, permission) {
        if (!permission) permission = this.permission;

        if (!permission) return true;

        return member.roles.cache.some((r) =>
            r.name.match(new RegExp(permission.join("|"), "i"))
        );
    }

    async run(client, message, args, meta) {
        throw { message: this.name + " comando em desenvolvimento!" };
    }
};
