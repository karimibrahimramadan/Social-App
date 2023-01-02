const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AppError = require("./appError");

const fileValidation = {
  image: ["image/png", "image/jpeg"],
};

const upload = function (customPath, customValidation) {
  if (!customPath) {
    customPath = "general";
  }
  const fullPath = path.join(__dirname, `../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      req.dest = `uploads/${customPath}`;
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "_" + file.originalname);
    },
  });
  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("File format is not supported", 400), false);
    }
  };
  const uploads = multer({ dest: fullPath, fileFilter, storage });
  return uploads;
};

module.exports = {
  fileValidation,
  upload,
};
