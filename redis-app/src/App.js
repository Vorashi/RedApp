import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    // eslint-disable-next-line no-unused-vars
    const [userId, setUserId] = useState('123'); 
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addToCart = async () => {
        if (!productId || !productName || !quantity) {
            alert('Please fill all fields');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/cart/${userId}/add`, {
                productId,
                productName,
                quantity,
            });
            alert('Product added to cart');
            fetchCart();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.post(`http://localhost:5000/cart/${userId}/remove`, {
                productId,
            });
            alert('Product removed from cart');
            fetchCart();
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    return (
        <div className="cart-container">
            <h1>Покупки</h1>
            <div className="product-form">
                <h2>Добавить Продукт</h2>
                <input
                    type="text"
                    placeholder="ID Продукта"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Название Продукта"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Количество"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button onClick={addToCart}>Добавить в Корзину</button>
            </div>
            <div>
                <h2>Корзина</h2>
                <button onClick={fetchCart}>Обновить Корзину</button>
                <ul className="cart-items">
                    {cart.map((item) => (
                        <li key={item.productId}>
                            <span>
                                {item.productName} (Quantity: {item.quantity})
                            </span>
                            <button
                                className="remove-button"
                                onClick={() => removeFromCart(item.productId)}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;