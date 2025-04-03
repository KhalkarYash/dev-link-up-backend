const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();

// Delete this file when SES in production

const sesClient = new SESClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = sesClient;
