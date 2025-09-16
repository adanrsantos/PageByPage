const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST route to create a discount
router.post("/", async (req, res) => {
    try {
        const { name, description, discount_percent, start_date, end_date } = req.body;

        // Basic validation to ensure all fields are present
        if (!name || !description || discount_percent == null || !start_date || !end_date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the discount percentage is within the valid range
        if (discount_percent < 0 || discount_percent > 100) {
            return res.status(400).json({ error: "Discount percentage must be between 0 and 100" });
        }

        // Insert the new discount into the database
        const newDiscount = await pool.query(`
            INSERT INTO discount (name, description, discount_percent, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING discount_id, name, discount_percent, start_date, end_date
        `, [name, description, discount_percent, start_date, end_date]);

        // Respond with the newly created discount
        res.status(201).json(newDiscount.rows[0]);
    } catch (error) {
        console.error("Error creating discount:", error.message);
        res.status(500).json({ error: "Server error while creating discount" });
    }
});

module.exports = router;
