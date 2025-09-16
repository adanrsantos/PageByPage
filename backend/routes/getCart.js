const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async(req,res) => {
    try {
        const { user_id } = req.body;
        
        const data = await pool.query(`
            SELECT * 
            FROM cart
            JOIN user_listings ON cart.listing_id = user_listings.listing_id
            JOIN manga ON user_listings.manga_id = manga.manga_id
            WHERE buyer_id = $1
            ORDER BY cart_id DESC
        `, [user_id]);
        console.log("Successful Retrieved Cart");
        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;