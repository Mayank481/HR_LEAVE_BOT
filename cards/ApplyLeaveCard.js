module.exports.ApplyLeaveCard = (leavetype, leaveDays, leavedate) => {
  let card = {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.4",
    "body": [
        {
            "type": "Container",
            "items": [
                {
                    "type": "TextBlock",
                    "wrap": true,
                    "text": "Leave Application Form ",
                    "horizontalAlignment": "Center",
                    "size": "Large",
                    "weight": "Bolder",
                    "color": "Accent"
                }
            ],
            "style": "emphasis"
        },
        {
            "type": "Container",
            "items": [
                {
                    "type": "FactSet",
                    "facts": [
                        {
                            "title": "Leave Type",
                            "value": `${leavetype}`
                        },
                        {
                            "title": "Duration",
                            "value": `${leaveDays}`
                        },
                        {
                            "title": "Date",
                            "value": `${leavedate}`
                        }
                    ]
                }
            ],
            "horizontalAlignment": "Left"
        }
    ]
}
  return card;
};
