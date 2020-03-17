module.exports = class BotWithoutPermisison extends Error {
    constructor(message) {
        if (!message) message = `Desculpa, não tenho permissão fazer isso!`;

        super(message);
        this.name = "BotWithoutPermisison";
    }
};
