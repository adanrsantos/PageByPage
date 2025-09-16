const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        const { navSearch, filter } = req.body;

        // Format the search query (replace spaces with & for AND in full-text search)
        const searchQuery = navSearch.split(' ').join(' & ');

        // Construct the SQL query with ranking based on full-text search
        const data = await pool.query(`
            SELECT ul.listing_id, ul.user_id, ul.manga_id, ul.current_quantity, ul.price, ul.creation_date, ul.active, 
                m.title, m.title_english, m.score, m.authors, m.synopsis, m.main_picture, user_info.username,
                ts_rank(to_tsvector('english', m.title || ' ' || COALESCE(m.title_english, '') || ' ' || COALESCE(m.synopsis, '') || ' ' || COALESCE(m.authors::text, '') || ' ' || user_info.username), 
                        to_tsquery('english', $1)) AS rank
            FROM user_listings ul
            JOIN manga m ON ul.manga_id = m.manga_id
            JOIN user_info ON ul.user_id = user_info.user_id
            WHERE to_tsvector('english', m.title || ' ' || COALESCE(m.title_english, '') || ' ' || COALESCE(m.synopsis, '') || ' ' || COALESCE(m.authors::text, '') || ' ' || user_info.username) 
                  @@ to_tsquery('english', $1)
            AND ul.active = true
            ORDER BY rank DESC, 
            CASE 
                WHEN $2 = 'price' THEN ul.price::text
                WHEN $2 = 'current_quantity' THEN ul.current_quantity::text
                WHEN $2 = 'date' THEN ul.creation_date::text
                ELSE ul.listing_id::text
            END;
        `, [searchQuery, filter]);

        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;