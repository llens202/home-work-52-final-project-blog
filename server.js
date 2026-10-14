import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import jsonServer from 'json-server';
import multer from 'multer';

// Шляхи до файлів і папок
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.join(__dirname, 'db.json');
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Обмеження для завантаження зображень
const MAX_FILE_COUNT = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);

// Створюємо папку для зображень, якщо її немає
fs.mkdirSync(uploadsDir, { recursive: true });

// Очищуємо назву файлу
const sanitizeFileName = (name = '') => {
  const raw = name.trim().toLowerCase();

  const cleaned = raw
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || 'image';
};

// Налаштовуємо збереження зображень на диску
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadsDir);
  },

  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension);

    const timestamp = Date.now();
    const randomChunk = Math.round(Math.random() * 1e9);
    const safeFileName = sanitizeFileName(baseName);

    callback(
      null,
      `${timestamp}-${randomChunk}-${safeFileName}${extension}`
    );
  },
});

// Налаштовуємо перевірку завантажуваних файлів
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILE_COUNT,
  },

  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      callback(
        new Error('Only PNG, JPG, JPEG and WEBP files are allowed.')
      );
      return;
    }

    callback(null, true);
  },
});

// Створюємо сервер і підключаємо базу даних
const server = jsonServer.create();
const router = jsonServer.router(dbFilePath);

const middlewares = jsonServer.defaults({
  static: publicDir,
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Маршрут для завантаження зображень
server.post(
  '/upload-images',
  upload.array('images', MAX_FILE_COUNT),
  (request, response) => {
    const uploadedFiles = request.files ?? [];

    const imagePaths = uploadedFiles.map(
      (file) => `/uploads/${file.filename}`
    );

    response.status(201).json({ imagePaths });
  }
);

// Маршрути для роботи з публікаціями
server.use(router);

// Обробка помилок
server.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      response.status(400).json({
        message: 'Each image must be no larger than 5MB.',
      });
      return;
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      response.status(400).json({
        message: 'Only up to 5 images can be uploaded.',
      });
      return;
    }
  }

  response.status(400).json({
    message: error.message ?? 'Image upload failed.',
  });
});

// Запускаємо сервер
server.listen(3009, () => {
  console.log('DevBlog server is running on http://localhost:3009');
});
