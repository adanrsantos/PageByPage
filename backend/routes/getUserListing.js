const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        let { userSearch } = req.body;

        // Check if userSearch is a number (user_id) or a string (username)
        const isNumeric = !isNaN(userSearch);

        // Convert userSearch to the correct type if it's numeric
        if (isNumeric) {
            userSearch = parseInt(userSearch); // Convert to number if it's a numeric string
        }

        const query = `
            SELECT u.username, ul.listing_id, ul.initial_quantity, ul.current_quantity, ul.price, ul.creation_date, ul.active,
            m.main_picture, m.title, m.manga_id
            FROM user_listings ul
            JOIN user_info u ON ul.user_id = u.user_id
            JOIN manga m ON ul.manga_id = m.manga_id
            WHERE u.username = $1 OR ul.user_id = $2;
        `;

        // Pass userSearch and the corresponding type to the query
        const data = await pool.query(query, [userSearch, isNumeric ? userSearch : null]);

        if (data.rows.length > 0) {
            console.log("Successfully retrieved user listing");
            res.json(data.rows);
        } else {
            console.log("No listings found for user:", userSearch);
            res.status(404).json({ error: "No listings found for this user." });
        }
    } catch (error) {
        console.error("Error retrieving user listing:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;