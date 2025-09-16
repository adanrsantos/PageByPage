const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    try {
        const { orderID, currentStatus } = req.body;
        let newStatus = currentStatus;
        if (!currentStatus){
            newStatus = true;
        }
        else{
            newStatus = false;
        }
        const data = await pool.query(`
            UPDATE order_history
            SET completed = $1
            WHERE order_id = $2;
        `, [newStatus, orderID]);
        console.log("Updated progress");
        res.json(data);
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ error: "Server error while updating order status" });
    }
});

module.exports = router;