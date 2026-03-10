const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ========== НАСТРОЙКА SWAGGER ==========
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API интернет-магазина',
            version: '1.0.0',
            description: 'API для управления товарами в интернет-магазине',
            contact: {
                name: 'Разработчик',
                email: 'developer@example.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер'
            }
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'category', 'description', 'price', 'stock'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Уникальный идентификатор товара',
                            example: 'abc123'
                        },
                        name: {
                            type: 'string',
                            description: 'Название товара',
                            example: 'Смартфон XYZ Pro'
                        },
                        category: {
                            type: 'string',
                            description: 'Категория товара',
                            example: 'Смартфоны'
                        },
                        description: {
                            type: 'string',
                            description: 'Подробное описание товара',
                            example: '6.7" AMOLED, 128 ГБ, тройная камера 108 Мп'
                        },
                        price: {
                            type: 'number',
                            description: 'Цена товара в рублях',
                            example: 49990
                        },
                        stock: {
                            type: 'integer',
                            description: 'Количество на складе',
                            example: 15
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Сообщение об ошибке'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Products',
                description: 'Управление товарами'
            }
        ]
    },
    apis: ['./app.js'], // Путь к файлу с аннотациями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Начальные данные (10 товаров)
let products = [
    { id: nanoid(6), name: 'Смартфон XYZ Pro', category: 'Смартфоны', description: '6.7" AMOLED, 128 ГБ, тройная камера 108 Мп', price: 49990, stock: 15 },
    { id: nanoid(6), name: 'Ноутбук ABC Air', category: 'Ноутбуки', description: '14" Retina, M2, 8 ГБ, 256 ГБ SSD', price: 89990, stock: 8 },
    { id: nanoid(6), name: 'Планшет Tab S8', category: 'Планшеты', description: '11" Super AMOLED, 128 ГБ, S Pen в комплекте', price: 39990, stock: 12 },
    { id: nanoid(6), name: 'Наушники AirPods Pro', category: 'Аксессуары', description: 'Беспроводные наушники с активным шумоподавлением', price: 19990, stock: 25 },
    { id: nanoid(6), name: 'Умные часы Watch 6', category: 'Аксессуары', description: 'Отслеживание сна, пульсометр, GPS', price: 29990, stock: 10 },
    { id: nanoid(6), name: 'Игровая консоль PS5', category: 'Игры', description: '825 ГБ SSD, беспроводной геймпад', price: 59990, stock: 5 },
    { id: nanoid(6), name: 'Монитор 4K 27"', category: 'Мониторы', description: '27" 4K UHD, IPS, HDR10, 60 Гц', price: 34990, stock: 7 },
    { id: nanoid(6), name: 'Клавиатура механическая', category: 'Аксессуары', description: 'Механическая клавиатура, RGB подсветка, переключатели Cherry MX', price: 7990, stock: 20 },
    { id: nanoid(6), name: 'Мышь игровая', category: 'Аксессуары', description: 'Оптическая мышь, 16000 DPI, 8 программируемых кнопок', price: 4990, stock: 30 },
    { id: nanoid(6), name: 'Внешний диск 1 ТБ', category: 'Хранение', description: 'Внешний SSD, USB-C, скорость до 1000 МБ/с', price: 8990, stock: 18 }
];

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для поиска товара
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

// ========== МАРШРУТЫ С ДОКУМЕНТАЦИЕЙ ==========

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *         example: abc123
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый смартфон"
 *               category:
 *                 type: string
 *                 example: "Смартфоны"
 *               description:
 *                 type: string
 *                 example: "Описание нового товара"
 *               price:
 *                 type: number
 *                 example: 29990
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock } = req.body;
    
    if (!name || !category || !description || !price || !stock) {
        return res.status(400).json({ error: "Все поля обязательны" });
    }
    
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Обновленное название"
 *               category:
 *                 type: string
 *                 example: "Новая категория"
 *               description:
 *                 type: string
 *                 example: "Обновленное описание"
 *               price:
 *                 type: number
 *                 example: 39990
 *               stock:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    const { name, category, description, price, stock } = req.body;
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    
    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) return res.status(404).json({ error: "Товар не найден" });
    
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация доступна по адресу http://localhost:${port}/api-docs`);
    console.log('Доступные маршруты:');
    console.log('GET    /api/products');
    console.log('GET    /api/products/:id');
    console.log('POST   /api/products');
    console.log('PATCH  /api/products/:id');
    console.log('DELETE /api/products/:id');
});