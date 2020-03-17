module.exports = class NotEnoughArguments extends Error {
    constructor(usage, message) {
        if (!message) message = "Utilize: " + usage;

        super(message);
        this.name = "notEnoughArguments";
    }
};
