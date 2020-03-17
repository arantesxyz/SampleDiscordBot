module.exports = class NoPermission extends Error {
    constructor(message) {
        if (!message) message = `Você não pode fazer isso! :C`;

        super(message);
        this.name = "NoPermission";
    }
};
