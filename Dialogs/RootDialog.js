const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const {LuisRecognizer} = require('botbuilder-ai')
const { dialog} = require("../Constants/DialogIds");

const { ApplyLeaveDialog,HelpDialog } = require("./index");

const ParseMessage = "ParseMessage";

const luisConfig = {
  applicationId: '37c46af0-5e00-4030-975e-6705abd01dcb',
  endpointKey: 'c21a1d29336545ee956b4008643c88bc',
  endpoint: 'https://mayankbotluis.cognitiveservices.azure.com/',
}

class RunDialog extends ComponentDialog {
  constructor(conversationState) {
    super(dialog.ROOT_DIALOG);

    if (!conversationState) throw new Error("conversationState state required");

    this.conversationState = conversationState;

    this.addDialog(
      new WaterfallDialog(dialog.ROOT_DIALOG_WF1, [this.routeMessage.bind(this)])
    );

    this.recognizer = new LuisRecognizer(luisConfig,{
      apiVersion: 'v3'
    })

    this.addDialog(new HelpDialog(conversationState));
    this.addDialog(new ApplyLeaveDialog(conversationState));


    this.initialDialogId = dialog.ROOT_DIALOG_WF1;
  }

  async run(context, accessor) {
    try {
        //bot asked to user and wait for resopnse
      const dialogSet = new DialogSet(accessor);
      dialogSet.add(this);
      const dialogContext = await dialogSet.createContext(context);
      const result = await dialogContext.continueDialog();
      //whenever bot and user both not in conversation then just begain with the id      
      if (result && result.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
      } else {
        console.log("dialog stack is empty");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async routeMessage(stepContext) {
  
     if(stepContext.context.activity.value && stepContext.context.activity.value.actiontype) {
      switch(stepContext.context.activity.value.actiontype) {
        case 'applyLeaveAction':
          let formvalue = stepContext.context.activity.value;
          delete stepContext.context.activity.value;
          return  await stepContext.beginDialog(dialog.LEAVE_DIALOG, {
            formReFill: true,
            value : formvalue
          })
      }

    }else {
      let luisresponse = await this.recognizer.recognize(stepContext.context);
      let luisIntent = luisresponse.luisResult.prediction.topIntent;
     // console.log(JSON.stringify(luisresponse.luisResult.prediction)); 
      switch(luisIntent) {
        case 'ApplyLeave':
          return  await stepContext.beginDialog(dialog.LEAVE_DIALOG,{
            luisResult: true,
            entities : luisresponse.luisResult.prediction.entities,
          })
           break;
        case 'leave status':
            break;
        case 'help':
          return  await stepContext.beginDialog(dialog.HELP_DIALOG)
            break;
        default:
            await stepContext.context.sendActivity('Soory I am still learning can you please refresh your query')
    }  
    }

      
 

    return await stepContext.endDialog();
  }

}

module.exports.RunDialog = RunDialog;
