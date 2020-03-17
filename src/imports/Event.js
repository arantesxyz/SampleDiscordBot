const Toggleable = require("./Toggleable");

module.exports = class Event extends Toggleable {
    constructor(name) {
        super();

        if (!name && typeof name != "string")
            throw new Error("Event name has to exits and be a string.");

        this.name = name;
    }

    run(client, ...params) {
        return -1;
    }
};
