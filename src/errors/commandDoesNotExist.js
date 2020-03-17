module.exports = class CommandDoesNotExist extends Error {
    constructor(command, message) {
        if (!message) message = `O comando \`${command}\` não existe!`;

        super(message);
        this.name = "CommandDoesNotExist";
    }
};
