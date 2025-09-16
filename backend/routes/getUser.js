const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        const { userSearch } = req.body;

        // Query to fetch user details, orders, listings, and cart item count
        const data = await pool.query(`
            SELECT 
                ui.user_id, 
                ui.username, 
                ui.email, 
                ui.first_name, 
                ui.last_name, 
                ui.admin,
                COUNT(DISTINCT oh.order_id) AS total_orders,
                COUNT(DISTINCT ul.listing_id) AS total_listings,
                COALESCE(SUM(c.item_quantity), 0) AS total_cart_items
            FROM user_info ui
            LEFT JOIN order_history oh ON ui.user_id = oh.buyer_id
            LEFT JOIN user_listings ul ON ui.user_id = ul.user_id
            LEFT JOIN cart c ON ui.user_id = c.buyer_id
            WHERE ui.username = $1
            GROUP BY ui.user_id;
        `, [userSearch]);

        if (data.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all registered users
        console.log("User and related data retrieved successfully");
        res.json(data.rows[0]);
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;