module.exports = class Toggleable {
    /**
     * Enables/Disables commands or events.
     */
    constructor() {
        this.enabled = true;
    }

    isEnabled() {
        return this.enabled;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    enabled() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }
};
