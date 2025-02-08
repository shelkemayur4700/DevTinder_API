const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();

const REGION = "ap-south-1";
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACESS,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});

module.exports = { sesClient };
