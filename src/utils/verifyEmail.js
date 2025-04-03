const { VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./awsConfig.js");

// Delete this file when SES in production

const verifyEmail = async (email) => {
  try {
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: email,
    });
    await sesClient.send(command);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error verifying email:", error);
  }
};

module.exports = verifyEmail;
