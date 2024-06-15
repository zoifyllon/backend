const { Storage } = require('@google-cloud/storage');
const path = require('path');

const pathKey = path.resolve('./serviceaccountkey.json');

const gcs = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: pathKey,
});

const bucketName = process.env.BUCKET_NAME;
const bucket = gcs.bucket(bucketName);

function publicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {}

ImgUpload.uploadToGcs = (req, res, next) => {
  if (!req.file) return next();

  let gcsname;
  if (req.file.fieldname === "detectImage") {
    gcsname = 'detect/' + Date.now().toString() + path.extname(req.file.originalname);
  } else if (req.file.fieldname === "profileImage") {
    gcsname = 'profile/' + Date.now().toString() + path.extname(req.file.originalname);
  } else {
    throw new Error("Invalid file fieldname");
  }

  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = publicUrl(gcsname);
    next();
  })

  stream.end(req.file.buffer);
}

ImgUpload.deleteFile = async (bucketUrl) => {
  bucketUrl = bucketUrl.split('/')[4] + '/' + bucketUrl.split('/')[5];

  if (bucketUrl !== 'profile/default_image.jpg') await bucket.file(bucketUrl).delete();
}

module.exports = ImgUpload;