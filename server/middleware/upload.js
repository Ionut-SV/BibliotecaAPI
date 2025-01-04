const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        console.log('Upload Path:', uploadPath);  // Logs the path to the console

        // Ensure the uploads folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Adjust this path as needed
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`); // Unique filename with timestamp
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
