const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  botToken: process.env.token,
  mongoUrl: process.env.mongoUrl,
  clientId: process.env.clientId,
  logChannel: process.env.logChannel,
  deploySlashOnReady: true,
  underDevelopment: true,
  developers: [
    {
      name: "SEY",
      id: "677932206189969448",
    },
    
  ],
  devGuilds: [
    {
      name: "SEY ici que ça se passe",
      id: "1208769358214602793",
    },
  ],
  betaTestGuilds: [],
  logWebhook: process.env.logWebhook,
};
