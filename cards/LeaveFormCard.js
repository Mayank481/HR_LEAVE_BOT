module.exports.LeaveFormCard = () => {
  let card = {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.3",
    "body": [
        {
            "type": "Container",
            "items": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://celebaltech.com/assets/img/celebal.webp",
                                            "separator": true,
                                            "horizontalAlignment": "Left",
                                            "size": "Medium"
                                        }
                                    ],
                                    "horizontalAlignment": "Left",
                                    "backgroundImage": {
                                        "verticalAlignment": "Center"
                                    },
                                    "separator": true
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "wrap": true,
                                            "text": "Leave Application",
                                            "fontType": "Default",
                                            "size": "Default",
                                            "weight": "Bolder",
                                            "color": "Good",
                                            "horizontalAlignment": "Center",
                                            "separator": true
                                        }
                                    ],
                                    "horizontalAlignment": "Center",
                                    "verticalContentAlignment": "Center",
                                    "separator": true
                                }
                            ],
                            "separator": true
                        }
                    ]
                }
            ]
        },
        {
            "type": "TextBlock",
            "wrap": true,
            "separator": true,
            "text": "Please select the type of leave",
            "fontType": "Monospace",
            "size": "Default",
            "weight": "Bolder",
            "color": "Attention",
            "isSubtle": true
        },
        {
            "type": "Input.ChoiceSet",
            "choices": [
                {
                    "title": "Sick Leave",
                    "value": "SL"
                },
                {
                    "title": "Casual Leave",
                    "value": "CL"
                },
                {
                    "title": "Earned Leave",
                    "value": "EL"
                }
            ],
            "separator": true,
            "id": "leaveType",
            "placeholder": "-----Select---- ",
            "isRequired": true,
            "label": "require",
            "errorMessage": "This field in require"
        },
        {
            "type": "TextBlock",
            "wrap": true,
            "separator": true,
            "text": "Please enter the number of days.",
            "fontType": "Monospace",
            "size": "Default",
            "weight": "Bolder",
            "color": "Attention",
            "isSubtle": true
        },
        {
            "type": "Input.Number",
            "id": "noDays",
            "placeholder": "Enter the number of days",
            "min": 0,
            "separator": true,
            "isRequired": true,
            "label": "require",
            "errorMessage": "This field is require"
        },
        {
            "type": "TextBlock",
            "wrap": true,
            "separator": true,
            "text": "Please select the date on which you apply the leave",
            "fontType": "Monospace",
            "size": "Default",
            "weight": "Bolder",
            "color": "Attention",
            "isSubtle": true
        },
        {
            "type": "Input.Date",
            "separator": true,
            "id": "leaveDate",
            "isRequired": true,
            "label": "require",
            "errorMessage": "This field is require"
        },
        {
            "type": "ActionSet",
            "id": "leaveApplyed",
            "horizontalAlignment": "Center",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Apply",
                    "id": "applyLeave",
                    "style": "positive",
                    "data": {
                        "actiontype": "applyLeaveAction"
                    }
                },
                {
                    "type": "Action.Submit",
                    "title": "Cencel",
                    "id": "cencelLeave",
                    "style": "destructive"
                }
            ],
            "separator": true
        }
    ]
}
  return card;
};
