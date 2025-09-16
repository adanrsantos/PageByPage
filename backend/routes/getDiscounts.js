const express = require("express");
const router = express.Router();
const pool = require("../db");

// Fetch all discount data
router.get("/", async (req, res) => {
    try {
        const data = await pool.query(`
            SELECT * FROM discount
        `);
        console.log("Discount History Retrieved");
        res.json(data.rows); // Sends an array of discount objects
    } catch (error) {
        console.error("Error fetching discount data:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
