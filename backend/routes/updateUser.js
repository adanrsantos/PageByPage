const express = require("express");
const router = express.Router();
const pool = require("../db");

// Endpoint to update user details
router.post("/", async (req, res) => {
    try {
        const { user_id, field, value } = req.body;

        const userCheck = await pool.query("SELECT * FROM user_info WHERE user_id = $1", [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        let updateQuery = "";
        let updateValue = [value, user_id];
        if (field === "admin") {
            updateQuery = "UPDATE user_info SET admin = $1 WHERE user_id = $2";
            updateValue = [value, user_id];
        } else if (field === "username" || field === "email" || field === "first_name" || field === "last_name") {
            // For these fields, a simple update query
            updateQuery = `UPDATE user_info SET ${field} = $1 WHERE user_id = $2`;
        } else {
            return res.status(400).json({ message: "Invalid field" });
        }

        // Execute the update query
        const result = await pool.query(updateQuery, updateValue);

        if (result.rowCount === 0) {
            return res.status(500).json({ message: "Failed to update user" });
        }

        // Send a success response
        console.log("Success updating " + field + " with " + value);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;