const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        const { sortBy } = req.body;
        console.log(sortBy);

        // Validate and parse the sortBy parameter
        const validSortColumns = ["total_price", "order_date", "buyer_id"];
        const validSortDirections = ["ASC", "DESC"];

        const [column, direction] = sortBy.split(" ");
        
        // Validate column and direction
        if (!validSortColumns.includes(column) || !validSortDirections.includes(direction)) {
            return res.status(400).json({ message: "Invalid sorting parameter" });
        }

        const query = `
            SELECT 
                o.order_id, 
                u.username,
                o.total_price,
                SUM(oi.item_quantity) AS total_items
            FROM order_history o
            JOIN user_info u ON o.buyer_id = u.user_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            GROUP BY o.order_id, u.username, o.total_price
            ORDER BY ${column} ${direction}
        `;

        const data = await pool.query(query);
        console.log("Success retrieving all orders");
        res.json(data.rows);
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
