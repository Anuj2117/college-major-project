const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const myS3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: myS3,
    acl: "public-read",
    bucket: "newhisbucket2",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      console.log("inside the middleware", file);
      cb(null, file.originalname);
    },
  }),
});

module.exports = { upload };
