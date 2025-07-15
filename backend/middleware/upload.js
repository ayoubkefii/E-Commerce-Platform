const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
  fileFilter: fileFilter,
});

// Single file upload
const uploadSingle = upload.single("image");

// Multiple files upload
const uploadMultiple = upload.array("images", 10);

// Single main image upload
const uploadMainImage = upload.single("main_image");

// Multiple files upload including main_image
const uploadProductImages = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "images", maxCount: 9 },
]);

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum is 10 files." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field." });
    }
  }

  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({ message: err.message });
  }

  next(err);
};

// Cloudinary upload helper (if using Cloudinary)
const uploadToCloudinary = async (file) => {
  try {
    const cloudinary = require("cloudinary").v2;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "ecommerce",
      use_filename: true,
      unique_filename: true,
    });

    // Delete local file after upload
    fs.unlinkSync(file.path);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
};

// Process uploaded files
const processUpload = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return next();
    }

    // DISABLED: Cloudinary upload logic
    // if (process.env.CLOUDINARY_CLOUD_NAME) {
    //   if (req.file) {
    //     req.file.url = await uploadToCloudinary(req.file);
    //   }
    //   if (req.files) {
    //     // Handle main_image
    //     if (req.files.main_image && req.files.main_image.length > 0) {
    //       for (let file of req.files.main_image) {
    //         file.url = await uploadToCloudinary(file);
    //       }
    //     }
    //     // Handle additional images
    //     if (req.files.images && req.files.images.length > 0) {
    //       for (let file of req.files.images) {
    //         file.url = await uploadToCloudinary(file);
    //       }
    //     }
    //   }
    // }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadMainImage,
  uploadProductImages,
  handleUploadError,
  processUpload,
  uploadToCloudinary,
};
