//home.js is going to display the listings 
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const { filter } = req.query; // Get the filter from the query parameters
        let orderBy = "user_listings.creation_date DESC"; // Default sorting (updated column name)

        if (filter === "highest") {
            orderBy = "manga.score DESC"; // Use score instead of rating
        } else if (filter === "lowest") {
            orderBy = "manga.score ASC"; // Use score instead of rating
        } else if (filter === "newest") {
            orderBy = "user_listings.creation_date DESC"; // Use creation_date here
        } else if (filter === "oldest") {
            orderBy = "user_listings.creation_date ASC"; // Use creation_date here
        } else if (filter === "atoz") {
            orderBy = "manga.title ASC";
        } else if (filter === "ztoa") {
            orderBy = "manga.title DESC";
        }

        const data = await pool.query(`
            SELECT user_listings.*, manga.*, user_info.username 
            FROM user_listings
            JOIN user_info ON user_listings.user_id = user_info.user_id
            JOIN manga ON user_listings.manga_id = manga.manga_id
            WHERE user_listings.active = TRUE AND user_listings.current_quantity > 0
            ORDER BY ${orderBy};
        `);

        console.log("Success in retrieving home listings");
        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
    }
});


module.exports = router;