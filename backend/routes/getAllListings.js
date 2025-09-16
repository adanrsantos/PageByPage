const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async(req,res) => {
    try {
        const data = await pool.query(`
            SELECT u.username, ul.listing_id, ul.initial_quantity, ul.current_quantity, ul.price, ul.creation_date, ul.active
            FROM user_listings ul
            JOIN user_info u ON ul.user_id = u.user_id
        `,);
        console.log("Successful Retrieved All Listings");
        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;