// Updated aws.js configuration
const AWS = require("aws-sdk");
require("dotenv").config();

// Log credentials (remove this in production)
console.log("AWS Region:", process.env.AWS_REGION);
console.log("AWS Access Key ID length:", process.env.AWS_ACCESS_KEY_ID?.length);
console.log("AWS Secret Access Key length:", process.env.AWS_SECRET_ACCESS_KEY?.length);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1', // default region
  signatureVersion: 'v4' // explicitly set signature version
});

module.exports = s3;