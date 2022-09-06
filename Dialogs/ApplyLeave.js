const {
  ComponentDialog,
  WaterfallDialog,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
  TextPrompt,
  Dialog,
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { dialog } = require("../Constants/DialogIds");
const { ApplyLeaveCard } = require("../cards/ApplyLeaveCard");
const { LeaveFormCard } = require("../cards/LeaveFormCard");
const Recognizers = require("@microsoft/recognizers-text-suite");

//const applyLeaveDialogFormWF1 = 'applyLeaveDialogFormWF1';
const ChoicePromptDialog = "ChoicePromptDialog";
const NumberPromptDialog = "NumberPromptDialog";
const TextPromptDialog = "TextPromptDialog";

class applyLeaveDialog extends ComponentDialog {
  constructor(conversationState) {
    super(dialog.LEAVE_DIALOG);

    if (!conversationState) throw new Error("conversationState state required");

    this.conversationState = conversationState;
    this.applyLeaveStateAccessor =
      this.conversationState.createProperty("ApplyLeaveState");
    this.addDialog(new ChoicePrompt(ChoicePromptDialog));
    this.addDialog(new NumberPrompt(NumberPromptDialog));
    this.addDialog(new NumberPrompt(TextPromptDialog));
    // this.addDialog(
    //   new WaterfallDialog(dialog.LEAVE_DIALOG_WF1, [
    //     this.askleavetype.bind(this),
    //     this.askNoOfDays.bind(this),
    //     this.askleavedate.bind(this),
    //     this.applyApplication.bind(this),
    //   ])
    // );

    this.addDialog(
      new WaterfallDialog(dialog.applyLeaveDialogFormWF1, [
        this.preprocessEntities.bind(this),
        this.askleavetype.bind(this),
        this.askNoOfDays.bind(this),
        this.askleavedate.bind(this),
        this.applyApplication.bind(this),
      ])
    );

    this.initialDialogId = dialog.applyLeaveDialogFormWF1;
  }

  //---------------- pre processing luis entities-------------------------------

  async preprocessEntities(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {
       // console.log(JSON.stringify(stepContext.options.entities));
        let numberEntities = stepContext.options.entities.number
          ? stepContext.options.entities.number[0]
          : null;
        let leaveTypeEntities = stepContext.options.entities.leavetype
          ? stepContext.options.entities.leavetype[0][0]
          : null;
        let dateTimeEntities = stepContext.options.entities.datetimeV2
          ? stepContext.options.entities.datetimeV2
          : null;
        let dateFrameObj = {};
        //console.log(leaveTypeEntities);

        if (dateTimeEntities != null) {
          dateTimeEntities.forEach((subEntities, index) => {
            if (subEntities.type === "duration") {
              dateFrameObj["duration"] = subEntities.values[0]["timex"]
                .replace("P", "")
                .replace("D", "");
            }

            if (subEntities.type === "date") {
              dateFrameObj["date"] =
                subEntities.values[0]["resolution"][0]["value"];
            }
          });
        }

        stepContext.values.entities = {
          numberEntities,
          leaveTypeEntities,
          dateFrameObj,
        };
        //console.log(stepContext.values.entities);

        return await stepContext.next();

        //return ComponentDialog.EndOfTurn;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //--------------- END --------------------------------------------------------

  //---------------- USER INPUT THROUGH ADAPTIVE CARD ---------------------------
  async showform(stepContext) {
    //console.log("inside 2nd step =>", stepContext.values.entities);
    if (
      !stepContext.context.values.entities.leaveTypeEntities &&
      stepContext.context.values.entities.leaveTypeEntities == null
    ) {
       await stepContext.prompt(ChoicePromptDialog, {
        prompt: "Please help me with the type of leave to apply for",
        choices: ChoiceFactory.toChoices([
          "sick leave",
          "Casual leave",
          "Earned leave",
        ]),
      });
    } else {
      return await stepContext.next();
    }
  }

  async preprocessUserInput(stepContext) {
    try {
      let userInput = stepContext.context.activity.value;
      let dialogData = await this.applyLeaveStateAccessor.get(
        stepContext.context,
        {}
      );
      dialogData.leaveType = userInput.leaveType;
      dialogData.leavedays = userInput.noDays;
      dialogData.leavedate = userInput.leaveDate;
      if (parseInt(dialogData.leavedays) > 3) {
        await stepContext.context.sendActivity(
          "You can only apply for 3 days of leave in a row.Please enter the number of details once again"
        );
        return stepContext.endDialog();
      } else {
        await stepContext.context.sendActivity(
          "Thank you I have all I need to apply the leave apply the leave application.Please wait while I apply your leave application"
        );
        return await stepContext.next();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //---------------- END ---------------------------

  async askleavetype(stepContext) {
    //console.log(stepContext.values.entities);
    if (stepContext.values.entities.leaveTypeEntities) {
      return await stepContext.next();
    } else {
      await stepContext.prompt(ChoicePromptDialog, {
        prompt: "Please help me with the type of leave you want to apply for",
        choices: ChoiceFactory.toChoices([
          "Sick Leave",
          "Casual Leave",
          "Earned Leave",
        ]),
      });
      return ComponentDialog.EndOfTurn;
    }
  }

  async askNoOfDays(stepContext) {
    let dialogData = await this.applyLeaveStateAccessor.get(
      stepContext.context,
      {}
    );
    //console.log("Step second ===>",stepContext.values.entities);
    if (stepContext.values.entities.leaveTypeEntities) {
      dialogData.leaveType = stepContext.values.entities.leaveTypeEntities;
    } else {
      dialogData.leaveType = stepContext.context.activity.text;
    }

    if (
      stepContext.values.entities.numberEntities &&
      stepContext.values.entities.numberEntities
    ) {
      return await stepContext.next();
    } else {
      await stepContext.context.sendActivity(
        "Please provide how many days you want to leave"
      );
      return ComponentDialog.EndOfTurn;
    }
    // console.log("leavetype is =>",dialogData);
  }

  async askleavedate(stepContext) {
    let dialogData = await this.applyLeaveStateAccessor.get(
      stepContext.context
    );
    if (stepContext.values.entities.numberEntities) {
      dialogData.leavedays = stepContext.values.entities.numberEntities;
    } else {
      dialogData.leavedays = stepContext.context.activity.text;
    }
    //console.log("leavetype is =>",dialogData);
    if (
      stepContext.values.entities.dateFrameObj &&
      stepContext.values.entities.dateFrameObj.date
    ) {
      return await stepContext.next();
    } else {
      await stepContext.context.sendActivity(
        "Please provide the perticular date from you applied."
      );
      return ComponentDialog.EndOfTurn;
    }
  }
  async applyApplication(stepContext) {
    let dialogData = await this.applyLeaveStateAccessor.get(
      stepContext.context
    );
    if (
      stepContext.values.entities.dateFrameObj &&
      stepContext.values.entities.dateFrameObj.date
    ) {
      dialogData.leaveDate = stepContext.values.entities.dateFrameObj.date;
    } else {
      dialogData.leaveDate = stepContext.context.activity.text;
    }
    // if(stepContext.result && !dialogData.leavedate){
    // dialogData.leavedate = stepContext.result;
    // }
    // console.log("dialog data ==>",dialogData);
    await stepContext.context.sendActivity({
      attachments: [
        CardFactory.adaptiveCard(
          ApplyLeaveCard(
            dialogData.leaveType,
            dialogData.leavedays,
            dialogData.leaveDate
          )
        ),
      ],
    });
    //console.log("Days ==>",dialogData);
    return stepContext.endDialog();
  }
}

module.exports.applyLeaveDialog = applyLeaveDialog;
