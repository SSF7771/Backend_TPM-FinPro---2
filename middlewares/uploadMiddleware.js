const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) 
    return cb(null, true);

  cb(new Error("Format file harus pdf, jpg, jpeg, atau png"));
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB (kalo perlu)
});

module.exports = upload;