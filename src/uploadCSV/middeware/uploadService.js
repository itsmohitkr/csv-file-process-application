const multer = require("multer");
const path = require("path");

const uploadDirectory = path.resolve(__dirname, "../../data/uploads/");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    return cb(null, filename);
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });
const uploadCsv = upload.single("mycsvfile");

function saveFileLocally(req, res, next) {
  uploadCsv(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    next(); // Proceed to the next middleware
  });
}

module.exports = {
  saveFileLocally,
};
