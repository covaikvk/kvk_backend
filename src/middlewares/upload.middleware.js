// upload.middleware.js
const multer = require("multer");
const s3 = require("../config/aws");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload to S3
const uploadToS3 = () => {
  return async (req, res, next) => {
    if (!req.file) return next();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,   // ✅ must be defined
      Key: `uploads/${Date.now()}_${path.basename(req.file.originalname)}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      const data = await s3.upload(params).promise();
      req.fileUrl = data.Location; // store uploaded file URL
      next();
    } catch (err) {
      console.error("❌ S3 Upload Error:", err);
      res.status(500).json({ error: "S3 Upload failed", details: err.message });
    }
  };
};

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  res.status(400).json({ error: err.message });
};

module.exports = { upload, uploadToS3, handleUploadErrors };
