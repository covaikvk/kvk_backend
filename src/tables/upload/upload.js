const express = require("express");
const { upload, uploadToS3, handleUploadErrors } = require("../../middlewares/upload.middleware");

const router = express.Router();

// @desc    Upload single image to S3
// @route   POST /api/upload
// @access  Public
router.post(
  "/",
  upload.single("image"),
  uploadToS3(),
  (req, res) => {
    res.status(200).json({
      message: "Uploaded",
      imageUrl: req.fileUrl
    });
  }
);

// Apply error handling middleware
router.use(handleUploadErrors);

module.exports = router;