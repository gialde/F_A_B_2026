const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON из тела запросов
app.use(express.json());

// Начальные данные (товары)
let products = [
    { id: 1, name: 'Смартфон XYZ Pro', price: 49990 },
    { id: 2, name: 'Ноутбук ABC Air', price: 89990 },
    { id: 3, name: 'Планшет Tab S8', price: 39990 },
    { id: 4, name: 'Наушники AirPods Pro', price: 19990 },
    { id: 5, name: 'Умные часы Watch 6', price: 29990 }
];

// Для генерации новых ID (начинаем с 6, так как уже есть 5 товаров)
let nextId = 6;

// ========== READ (GET) ==========

// Получить все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// Получить один товар по ID
app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

// ========== CREATE (POST) ==========

// Создать новый товар
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    // Валидация: проверяем, что поля переданы
    if (!name || !price) {
        return res.status(400).json({ error: 'Необходимо указать название и цену' });
    }
    
    // Проверяем, что цена - число
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Цена должна быть положительным числом' });
    }
    
    const newProduct = {
        id: nextId++,
        name: name,
        price: price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// ========== UPDATE (PUT) ==========

// Обновить товар полностью
app.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, price } = req.body;
    
    // Проверяем, что переданы оба поля
    if (!name || !price) {
        return res.status(400).json({ error: 'Необходимо указать название и цену' });
    }
    
    // Проверяем, что цена - число
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Цена должна быть положительным числом' });
    }
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Обновляем товар
    product.name = name;
    product.price = price;
    
    res.json(product);
});

// ========== UPDATE (PATCH) ==========

// Частичное обновление товара
app.patch('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, price } = req.body;
    
    // Обновляем только те поля, которые переданы
    if (name !== undefined) {
        if (typeof name !== 'string') {
            return res.status(400).json({ error: 'Название должно быть строкой' });
        }
        product.name = name;
    }
    
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Цена должна быть положительным числом' });
        }
        product.price = price;
    }
    
    res.json(product);
});

// ========== DELETE ==========

// Удалить товар
app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Удаляем товар из массива
    const deletedProduct = products.splice(index, 1)[0];
    res.json({ message: 'Товар удален', product: deletedProduct });
});

// ========== Запуск сервера ==========

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log('Доступные маршруты:');
    console.log('GET    /products          - получить все товары');
    console.log('GET    /products/:id      - получить товар по ID');
    console.log('POST   /products          - создать новый товар');
    console.log('PUT    /products/:id      - полностью обновить товар');
    console.log('PATCH  /products/:id      - частично обновить товар');
    console.log('DELETE /products/:id      - удалить товар');
});