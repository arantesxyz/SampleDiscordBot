const Event = require("../../imports/Event");
const { MessageEmbed } = require("discord.js");

module.exports = class onJoin extends Event {
    constructor() {
        super("guildMemberAdd");
    }

    /**
     * Sent a welcome message
     * @param {Object} client Bot client
     * @param {Object} member Member that just joined the server
     */
    async run(client, member) {
        if (!member || member.user == client.user) return;

        const CHANNEL_NAME = /entrada/i;

        const channel = member.guild.channels.cache.find((channel) =>
            channel.name.match(CHANNEL_NAME)
        );

        const logEmbed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`${member.user.tag}!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(`Developers Community ©️ Todos os direitos reservados`)
            .setTimestamp()
            .setDescription(`Bem-Vindo(a)`)
            .addField("Sobre nós", "Lorem ipsum", true)
            .addField("n sei", "Lorem ipsum", true);

        channel.send(member.toString(), logEmbed);
    }
};
