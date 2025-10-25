const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads"); 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`; 
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});

module.exports = upload;
