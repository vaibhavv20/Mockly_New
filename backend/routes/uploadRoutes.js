const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const admin = require('../middleware/admin'); // Ensure only admins can upload

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Create unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'img-' + uniqueSuffix + ext);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload
router.post('/', admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }

        // Construct the full URL
        // In local development, it will be http://localhost:5000/uploads/filename.ext
        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

// GET /api/upload/list - Optional: List all uploaded images for the manager
router.get('/list', admin, (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const protocol = req.protocol;
        const host = req.get('host');
        
        // Filter only images and sort by newest first (based on stat mtime)
        const images = files
            .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
            .map(file => ({
                filename: file,
                url: `${protocol}://${host}/uploads/${file}`,
                time: fs.statSync(path.join(uploadDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Newest first

        res.json({ success: true, images });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to list images' });
    }
});

// DELETE /api/upload/:filename - Optional: Delete an image
router.delete('/:filename', admin, (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Image deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete image' });
    }
});

module.exports = router;
