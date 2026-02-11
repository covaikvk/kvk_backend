const express = require('express');
const router = express.Router();

const createProduct = async (req, res) => {
    try {
        const { name, price, description, image_url } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const [result] = await pool.query(
            'INSERT INTO products (name, price, description, image_url) VALUES (?, ?, ?, ?)',
            [name, price, description, image_url]
        );
        res.status(201).json({ id: result.insertId, name, price, description, image_url });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image_url } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        await pool.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image_url = ? WHERE id = ?',
            [name, price, description, image_url, id]
        );
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = { createProduct, getAllProducts, updateProduct, deleteProduct };