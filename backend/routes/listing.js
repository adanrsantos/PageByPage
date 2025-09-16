const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async(req,res) => {
    try {
        const { userID, mangaID, count, price } = req.body;
        
        const data = await pool.query(`
            INSERT INTO user_listings (user_id, manga_id, initial_quantity, current_quantity, price, creation_date)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *
        `, [userID, mangaID, count, count, price]);
        console.log("Listing Successful");
        res.json({message: "Listing Successful"});
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;