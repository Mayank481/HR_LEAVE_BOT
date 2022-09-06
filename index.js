//input restify

const restify = require("restify");

require("dotenv").config();
//input botbuilder

const PORT = process.env.PORT || 5000;

const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
} = require("botbuilder");

const { BotActivityHandler } = require("./BotActivityHandler");
const {RunDialog} = require('./Dialogs/RootDialog')
//adaptor

const adaptor = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

//adaptor error handler

adaptor.onTurnError = async (context, error) => {
  console.log("Error Occured => ", error);

  //send a msg to user about error
  await context.sendActivity("Bot encountered an error ");
};

//create server

let server = restify.createServer();
server.listen(PORT, () => {
  console.log(`${server.name} listenin g to ${server.url}`);
});

const memory = new MemoryStorage();

let conversationState = new ConversationState(memory);

//activity handler object
const rootDialog = new RunDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState, rootDialog);

server.post("/api/messages", (req, res) => {
  adaptor.processActivity(req, res, async (context) => {
    await mainBot.run(context);
  });
});
