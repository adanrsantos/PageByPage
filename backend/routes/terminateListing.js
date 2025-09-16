const express = require("express");
const router = express.Router();
const pool = require("../db");
// Endpoint to terminate a user (delete user)
router.delete("/", async (req, res) => {
    try {
        const { listing_id } = req.body;

        // Check if the user exists
        const userCheck = await pool.query("SELECT * FROM user_listings WHERE listing_id = $1", [listing_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user from the database
        const result = await pool.query("DELETE FROM user_listings WHERE listing_id = $1", [listing_id]);

        if (result.rowCount === 0) {
            return res.status(500).json({ message: "Failed to terminate user" });
        }
        // Send a success response
        console.log("User terminated successfully");
        res.json({ message: "User terminated successfully" });
    } catch (error) {
        console.error("Error terminating user:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;