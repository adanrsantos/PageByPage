const express = require("express");
const router = express.Router();
const pool = require("../db");

// Fetch default manga
router.get("/default", async (req, res) => {
    try {
        const data = await pool.query(`
            SELECT title, title_english, main_picture, score, authors, synopsis, manga_id
            FROM manga
            ORDER BY score DESC
            LIMIT 10
        `); // Fetch top 10 manga or any other default criteria
        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Search manga based on title
router.post("/", async (req, res) => {
    try {
        const { manga } = req.body;
        const title = manga.split(' ').join(' & ');

        const data = await pool.query(`
            SELECT title, title_english, main_picture, score, authors, synopsis, manga_id,
                ts_rank(to_tsvector(title || ' ' || COALESCE(title_english, '')), to_tsquery($1)) AS rank 
            FROM manga 
            WHERE to_tsvector(title || ' ' || title_english) @@ to_tsquery($1) 
            ORDER BY rank DESC
        `, [title]);

        res.json(data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
