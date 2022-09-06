const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const {CardFactory} = require('botbuilder')
const { dialog } = require("../Constants/DialogIds");



class HelpDialog extends ComponentDialog {
  constructor(conversationState) {
    super(dialog.HELP_DIALOG);

    if (!conversationState) throw new Error("conversationState state required");

    this.conversationState = conversationState;

    this.addDialog(
      new WaterfallDialog(dialog.HELP_DIALOG_WF1, [this.sendHelpSuggesstions.bind(this)])
    );

    this.initialDialogId = dialog.HELP_DIALOG_WF1;
  }

  async sendHelpSuggesstions(stepContext) {
    await stepContext.context.sendActivity(
      'I can help you with your leave application request. Click "Apply Leave" button below or write apply leave'
    );
    await stepContext.context.sendActivity({
      attachments: [
        CardFactory.heroCard(
          "here are some suggestion that you can try :-",
          null,
          CardFactory.actions([
            {
              type: "imBack",
              title: "Apply Leave",
              value: "Apply leave",
            },
            {
              type: "imBack",
              title: "Leave Status",
              value: "leave status",
            },
            {
              type: "imBack",
              title: "Help",
              value: "Help",
            },
          ])
        ),
      ],
    });
    return await stepContext.endDialog();
  }
}


module.exports.HelpDialog = HelpDialog;