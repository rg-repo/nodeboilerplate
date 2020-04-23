const config = require('@src/config');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const limits = { fileSize: 5 * 1024 * 1024, files: 1 };
const acceptedExtensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
aws.config.update({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY
});
const storage = multerS3({
  s3: new aws.S3(),
  bucket: config.S3_BUCKET_NAME,
  key: (req, file, cb) => {
    const fileName = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileName[fileName.length - 1]}`);
  }
});
const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (
      acceptedExtensions.some((ext) => file.originalname.endsWith(`.${ext}`))
    ) {
      return cb(null, true);
    }
    const error = new Error(
      `Only ${acceptedExtensions.join(', ')} files are allowed!`
    );
    error.code = 'FILE_TYPE_NOT_ALLOWED';
    return cb(error);
  }
}).single('image');

module.exports = upload;
