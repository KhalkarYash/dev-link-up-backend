const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, HTMLText, subject) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: HTMLText,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (HTMLText, subject, toAddress) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress ? toAddress : "yashmk2004@gmail.com",
    "yashmk2004@gmail.com",
    HTMLText,
    subject
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
