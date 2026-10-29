
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// Перевіряємо наявність секретного ключа
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'JWT_SECRET відсутній або закороткий. Перевір файл .env'
  );
}

// Обмеження для завантаження зображень
const MAX_FILE_COUNT = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);

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

// Налаштовуємо збереження зображень
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

// Перевірка завантажуваних файлів
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
        new Error('Дозволені лише PNG, JPG, JPEG та WEBP.')
      );
      return;
    }

    callback(null, true);
  },
});

// Створюємо сервер і підключаємо базу даних
const server = jsonServer.create();
const router = jsonServer.router(dbFilePath);

server.use(
  jsonServer.defaults({
    static: publicDir,
  })
);

server.use(jsonServer.bodyParser);

// Допоміжна функція для відповіді без пароля
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

// Завантаження зображень
server.post(
  '/upload-images',
  requireAuth,
  upload.array('images', MAX_FILE_COUNT),
  (request, response) => {
    const uploadedFiles = request.files ?? [];

    const imagePaths = uploadedFiles.map(
      (file) => `/uploads/${file.filename}`
    );

    response.status(201).json({ imagePaths });
  }
);

// Реєстрація
server.post('/auth/register', async (request, response) => {
  try {
    const { name, email, password } = request.body ?? {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      password.length > 72
    ) {
      return response.status(400).json({
        message:
          'Вкажіть ім’я, коректний email і пароль довжиною від 8 до 72 символів.',
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return response.status(400).json({
        message: 'Введіть коректний email.',
      });
    }

    const users = router.db.get('users');

    const existingUser = users
      .find((user) => user.email === normalizedEmail)
      .value();

    if (existingUser) {
      return response.status(409).json({
        message: 'Користувач із таким email уже існує.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    };

    users.push(newUser).write();

    return response.status(201).json({
      message: 'Реєстрація успішна.',
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);

    return response.status(500).json({
      message: 'Не вдалося зареєструвати користувача.',
    });
  }
});

// Вхід
server.post('/auth/login', async (request, response) => {
  try {
    const { email, password } = request.body ?? {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return response.status(400).json({
        message: 'Введіть email і пароль.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = router.db.get('users');

    const user = users
      .find((item) => item.email === normalizedEmail)
      .value();

    // Не розкриваємо, чи існує email
    if (!user) {
      return response.status(401).json({
        message: 'Неправильний email або пароль.',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return response.status(401).json({
        message: 'Неправильний email або пароль.',
      });
    }

    // Токен створюється лише після перевірки пароля
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    return response.status(200).json({
      message: 'Вхід успішний.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);

    return response.status(500).json({
      message: 'Не вдалося виконати вхід.',
    });
  }
});

// Перевірка чинного токена
server.get('/auth/me', (request, response) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({
      message: 'Потрібна авторизація.',
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = router.db
      .get('users')
      .find({ id: payload.id })
      .value();

    if (!user) {
      return response.status(401).json({
        message: 'Користувача не знайдено.',
      });
    }

    return response.status(200).json({
      user: publicUser(user),
    });
  } catch {
    return response.status(401).json({
      message: 'Токен недійсний або термін його дії минув.',
    });
  }
});

function requireAuth(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({
      message: 'Спочатку увійдіть у свій акаунт.',
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = router.db
      .get('users')
      .find({ id: payload.id })
      .value();

    if (!user) {
      return response.status(401).json({
        message: 'Користувача не знайдено.',
      });
    }

    request.user = publicUser(user);
    next();
  } catch {
    return response.status(401).json({
      message: 'Токен недійсний або термін його дії минув.',
    });
  }
}

// Не дозволяємо отримувати користувачів напряму через json-server
server.use('/users', (_request, response) => {
  return response.status(404).json({
    message: 'Маршрут не знайдено.',
  });
});

server.post('/posts', requireAuth, (request, response) => {
  const newPost = {
    ...request.body,
    author: request.user.name,
    id: Date.now(),
  };

  const savedPost = router.db
    .get('posts')
    .push(newPost)
    .write();

  response.status(201).json(savedPost[savedPost.length - 1]);
});

// Маршрути json-server для публікацій
server.use(router);

// Обробка помилок
// eslint-disable-next-line no-unused-vars
server.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({
        message: 'Розмір одного зображення не повинен перевищувати 5 МБ.',
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return response.status(400).json({
        message: 'Можна завантажити не більше 5 зображень.',
      });
    }
  }

  return response.status(400).json({
    message: error.message ?? 'Не вдалося завантажити зображення.',
  });
});

// Запускаємо сервер
server.listen(3009, () => {
  console.log('DevBlog server is running on http://localhost:3009');
});
