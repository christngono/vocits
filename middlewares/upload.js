import multer from 'multer';
import path from 'path';

// 📂 Destination du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier local
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // extension (.jpg, .png...)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// 📌 Filtre pour accepter seulement des images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

export const upload = multer({ storage, fileFilter });
