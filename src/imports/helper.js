const fetch = require("node-fetch");

module.exports = {
    // TODO: review this function
    getMember: function(message, toFind = "") {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find((member) => {
                return (
                    member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
                );
            });
        }

        if (!target) target = message.member;

        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat("pt-BR").format(date);
    },

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;

        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) =>
            validReactions.includes(reaction.emoji.name) &&
            user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time })
            .then(
                (collected) => collected.first() && collected.first().emoji.name
            );
    },

    awaitMessage: async function(channel, who, time) {
        time *= 1000;

        const filter = (m) => true;

        return channel
            .awaitMessages(filter, { max: 1, time })
            .then((collected) => collected.first());
    }
};
