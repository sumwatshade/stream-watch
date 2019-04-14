const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

function uploadDir(s3Path, bucketName) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.PERSONAL_AWS_ACCESS_KEY,
    secretAccessKey: process.env.PERSONAL_AWS_SECRET_ACCESS_KEY,
  });

  function walkSync(currentDirPath, cb) {
    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        cb(filePath, stat);
      } else if (stat.isDirectory()) {
        walkSync(filePath, cb);
      }
    });
  }

  function callback(filePath) {
    const bucketPath = filePath.substring(s3Path.length + 1);
    const params = {
      Bucket: bucketName,
      Key: `_next/${bucketPath}`,
      Body: fs.readFileSync(filePath),
    };
    s3.putObject(params, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`Successfully uploaded ${bucketPath} to ${bucketName}`);
      }
    });
  }

  walkSync(s3Path, callback);
}


const nextBuildPath = path.join(process.cwd(), '.next');
uploadDir(nextBuildPath, 'nba-streams-bucket');
