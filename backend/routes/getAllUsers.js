const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const data = await pool.query(`
            SELECT user_id, username, email, first_name, last_name, admin
            FROM user_info
        `)
        console.log("Success retrieving all users");
        res.json(data.rows);
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;