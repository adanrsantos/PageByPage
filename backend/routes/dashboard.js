const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async(req,res) => {
    try {
        const data = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM order_history) AS total_orders,
                (SELECT COUNT(*) FROM user_listings) AS total_listings,
                (SELECT COUNT(*) FROM user_info) AS total_users;
        `);
        console.log("Dashboard Successful");
        res.json(data.rows);        
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;