module.exports = class MemberDoesNotExist extends Error {
    constructor(message) {
        if (!message) message = `O jogador não existe.`;

        super(message);
        this.name = "MemberDoesNotExist";
    }
};
