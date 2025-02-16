const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 5000;

const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.connect().then(() => {
    console.log('Connected to Redis');

    app.use(cors());
    app.use(express.json());

    app.post('/cart/:userId/add', async (req, res) => {
        const { userId } = req.params;
        const { productId, productName, quantity } = req.body;

        if (!productId || !productName || !quantity) {
            return res.status(400).send('Missing product details');
        }

        try {
            const cartKey = `cart:${userId}`;
            const product = { productId, productName, quantity };

            await client.hSet(cartKey, productId, JSON.stringify(product));
            res.send('Product added to cart');
        } catch (err) {
            console.error('Error adding product to cart:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/cart/:userId/remove', async (req, res) => {
        const { userId } = req.params;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).send('Missing product ID');
        }

        try {
            const cartKey = `cart:${userId}`;

            await client.hDel(cartKey, productId);
            res.send('Product removed from cart');
        } catch (err) {
            console.error('Error removing product from cart:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/cart/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            const cartKey = `cart:${userId}`;
            const cart = await client.hGetAll(cartKey);
            const cartItems = Object.values(cart).map((item) => JSON.parse(item));
            res.json(cartItems);
        } catch (err) {
            console.error('Error fetching cart:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});