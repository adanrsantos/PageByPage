const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        const { user_id } = req.body;
        // Query for order_history and corresponding order_items
        const orders = await pool.query(`
            SELECT o.order_id, o.order_date, o.total_price, o.completed, oi.order_item_id, oi.item_quantity, oi.listing_id, u.price,
                m.main_picture, m.title, m.title_english, m.authors
            FROM order_history o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN user_listings u ON oi.listing_id = u.listing_id
            JOIN manga m ON u.manga_id = m.manga_id
            WHERE o.buyer_id = $1
            ORDER BY o.order_date DESC
        `, [user_id]);

        if (orders.rows.length === 0) {
            return res.status(404).json({ error: "No orders found" });
        }

        // Organize orders and order items into an array
        const ordersGrouped = {};
        orders.rows.forEach(order => {
            // Check if the order_id already exists in the grouped structure
            if (!ordersGrouped[order.order_id]) {
                ordersGrouped[order.order_id] = {
                    order_id: order.order_id,
                    order_date: order.order_date,
                    total_price: order.total_price,
                    items: [], // Initialize an empty array for items
                    completed: order.completed
                };
            }

            // Add the current order item to the corresponding order
            ordersGrouped[order.order_id].items.push({
                order_item_id: order.order_item_id,
                listing_id: order.listing_id,
                price: order.price,
                item_quantity: order.item_quantity,
                main_picture: order.main_picture, // Include main picture
                title: order.title, // Add title (original language if needed)
                title_english: order.title_english, // Include English title
                authors: order.authors // Add authors
            });
        });


        // Convert to array for easier response
        console.log("Success in retrieving order history");
        const orderArray = Object.values(ordersGrouped);
        res.json(orderArray);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;