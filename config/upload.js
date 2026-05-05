import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = [
    'public/uploads/profiles',
    'public/uploads/products',
    'public/uploads/portfolio',
    'public/uploads/heritage',
    'public/uploads/gallery',
    'public/uploads/destinations',
    'public/uploads/events',
    'public/uploads/workshops',
    'public/uploads/general'
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine upload folder based on file type
        let uploadPath = 'public/uploads/';
        
        if (req.path.includes('profile')) {
            uploadPath += 'profiles/';
        } else if (req.path.includes('product')) {
            uploadPath += 'products/';
        } else if (req.path.includes('portfolio')) {
            uploadPath += 'portfolio/';
        } else if (req.path.includes('heritage-gallery')) {
            uploadPath += 'heritage/';
        } else if (req.path.includes('gallery')) {
            uploadPath += 'gallery/';
        } else if (req.path.includes('destination')) {
            uploadPath += 'destinations/';
        } else if (req.path.includes('workshop')) {
            uploadPath += 'workshops/';
        } else if (req.path.includes('event')) {
            uploadPath += 'events/';
        } else {
            uploadPath += 'general/';
        }
        
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - accepts images, videos, audio, and documents for heritage gallery
const fileFilter = (req, file, cb) => {
    // For heritage gallery, allow more file types
    if (req.path.includes('heritage-gallery')) {
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi|mp3|wav|ogg|m4a|pdf|doc|docx/;
        const allowedMimes = /image\/|video\/|audio\/|application\/pdf|application\/msword|application\/vnd\.openxmlformats/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedMimes.test(file.mimetype);
        
        if (mimetype || extname) {
            return cb(null, true);
        } else {
            cb(new Error('Allowed: images, videos (mp4, webm), audio (mp3, wav), documents (pdf)'));
        }
    } else {
        // Default: only images
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
        }
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for heritage files (videos can be large)
    },
    fileFilter: fileFilter
});

export default upload;
