const { ActivityHandler, CardFactory ,TeamsActivityHandler } = require("botbuilder");

const { welcomeCard } = require("./cards/index");

class BotActivityHandler extends TeamsActivityHandler {
  constructor(conversationState,rootDialog) {
    super();

    if (!conversationState) throw new Error("conversationState state required");

    this.conversationState = conversationState;
    this.rootDialog = rootDialog;
    this.accessor = this.conversationState.createProperty('DialogAccessor')

    //Message event

    // this.onMembersAdded(async(context) => {
    //     await context.sendActivity('Welcome');
    //     })

    this.onMessage(async (context, next) => {
      await this.rootDialog.run(context, this.accessor) 
      await next();
    });

    // this.onMembersAdded(async (context, next) => {
    //   if (
    //     context.activity.membersAdded &&
    //     context.activity.membersAdded[1].id == context.activity.from.id
    //   ) {
    //     await context.sendActivity({
    //       attachments: [CardFactory.adaptiveCard(welcomeCard("Mayank"))],
    //     });
    //     await context.sendActivity({
    //       attachments: [
    //         CardFactory.heroCard(
    //           "here are some suggestion that you can try :-",
    //           null,
    //           CardFactory.actions([
    //             {
    //               type: "imBack",
    //               title: "Apply Leave",
    //               value: "Apply leave",
    //             },
    //             {
    //               type: "imBack",
    //               title: "Leave Status",
    //               value: "leave status",
    //             },
    //             {
    //               type: "imBack",
    //               title: "Help",
    //               value: "Help",
    //             },
    //           ])
    //         ),
    //       ],
    //     });
    //   }
    //   await next();
    // });
  }

  //this function provide the info to the constructor.
  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
