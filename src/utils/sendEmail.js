const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  senderName,
  fromUser
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>New Connection Request</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #007bff;">You've Received a New Connection Request!</h2>
              <p>Hi there,</p>
              <p><strong>${senderName}</strong> has sent you a connection request on <strong>DevLinkUp</strong>.</p>
              <p>Expand your network by accepting the request and collaborating with like-minded developers.</p>
              <p>If you don’t want to connect, you can simply ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
          </html>
        `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
          You've Received a New Connection Request!

          Hi there,

          ${senderName} has sent you a connection request on DevLinkUp.

          Expand your network by accepting the request and collaborating with like-minded developers.

          If you don’t want to connect, you can simply ignore this email.

          -- 
          This is an automated email. Please do not reply.
        `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Hi ${fromUser}, you've received a new connection request on DevLinkUp!`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (senderName, fromUser) => {
  const sendEmailCommand = createSendEmailCommand(
    "yashmk2004@gmail.com",
    "yashmk2004@gmail.com",
    senderName,
    fromUser
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
