const multer = require("multer");
const path = require("path");
const fs = require("fs");

// תיקיית העלאות
const uploadDir = "src/uploads";

// אם התיקייה לא קיימת → ליצור אותה
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// הגדרת אחסון
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// סינון סוגי קבצים
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;

  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime =
    file.mimetype.startsWith("image/") &&
    allowedTypes.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("רק קבצי תמונה מותרים"));
  }
};

// יצירת multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // עד 5MB
});

module.exports = upload;