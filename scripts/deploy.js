const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.PERSONAL_AWS_ACCESS_KEY,
  secretAccessKey: process.env.PERSONAL_AWS_SECRET_ACCESS_KEY,
});

function emptyBucket(bucketName, callback) {
  let params = {
    Bucket: bucketName,
    Prefix: '.next/',
  };

  s3.listObjects(params, (err, data) => {
    if (err) return callback(err);

    if (data.Contents.length === 0) return callback();

    params = { Bucket: bucketName };
    params.Delete = { Objects: [] };

    data.Contents.forEach((content) => {
      params.Delete.Objects.push({ Key: content.Key });
    });

    return s3.deleteObjects(params, (err2, data2) => {
      if (err2) return callback(err2);
      if (data2.Contents.length === 1000) return emptyBucket(bucketName, callback);
      return callback();
    });
  });
}

function uploadDir(s3Path, bucketName) {
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
emptyBucket('nba-streams-bucket', (err) => {
  if (err) {
    return err;
  }
  return uploadDir(nextBuildPath, 'nba-streams-bucket');
});
