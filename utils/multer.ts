const multer = require('multer');

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create the multer instance with your storage options
const upload = multer({ storage: storage });

module.exports = upload;
