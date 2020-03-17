const { Client } = require("discord.js");
const Handler = require("./imports/Handler");

const client = new Client({
    partials: ["MESSAGE", "CHANNEL"]
});

const handler = new Handler(client, {
    folders: {
        modules: __dirname + "/modules/"
    },
    prefix: [process.env.PREFIX]
});

client.on("ready", () => {
    client.user.setPresence({
        status: "online",
        activity: {
            name: "felicidade!",
            type: "PLAYING"
        }
    });

    handler.register();

    console.log(`Running and logged as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
