module.exports.welcomeCard = (name) => {
  let card = {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.3",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "Image",
            url: "https://c.tenor.com/CigpzapemsoAAAAi/hi-robot.gif",
          },
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text: `Welcome User! ${name} Bot.I am your personal assistant. I can help you with your leave application request. Type help to know all my features.How can i help you?`,
                wrap: true,
                style: "default",
                fontType: "Monospace",
                size: "Medium",
                weight: "Bolder",
                color: "Good",
                isSubtle: true,
              },
            ],
          },
        ],
      },
    ],
  };
  return card;
};
