const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async(req,res) => {
    try {
        const { buyer_id, listing_id, item_quantity } = req.body;
        
        const existingItem = await pool.query(`
            SELECT item_quantity FROM cart
            WHERE buyer_id = $1 AND listing_id = $2
        `, [buyer_id, listing_id]);

        const quantity = await pool.query(`
            SELECT current_quantity, initial_quantity FROM user_listings
            WHERE listing_id = $1
        `, [listing_id]);

        if (quantity.rows[0].current_quantity < item_quantity){
            console.log("Requested quantity exceeds available stock");
            return res.status(400).json({ error: "Not enough stock available" });
        }

        if (existingItem.rows.length > 0){
            const currentCartQuantity = existingItem.rows[0].item_quantity;
            const initialQuantity = quantity.rows[0].initial_quantity;
            const availableQuantity = quantity.rows[0].current_quantity;

            if (item_quantity <= availableQuantity){
                const updateItem = await pool.query(`
                    UPDATE cart
                    SET item_quantity = $1
                    WHERE buyer_id = $2 AND listing_id = $3
                    RETURNING *
                `, [item_quantity + currentCartQuantity, buyer_id, listing_id]);
                console.log("Cart item quantity updated");
                
                await pool.query(`
                    UPDATE user_listings
                    SET current_quantity = current_quantity - $1
                    WHERE listing_id = $2
                `, [item_quantity, listing_id]);
                res.json(updateItem.rows);
            } else {
                console.log("Requested quantity exceeds available stock");
                res.status(400).json({ error: "Requested quantity exceeds available stock" });
            }
        } else {
            const newItem = await pool.query(`
                INSERT INTO cart (buyer_id, listing_id, item_quantity)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [buyer_id, listing_id, item_quantity]);

            await pool.query(`
                UPDATE user_listings
                SET current_quantity = current_quantity - $1
                WHERE listing_id = $2
            `, [item_quantity, listing_id]);

            console.log("New Item added to cart");
            res.json(newItem.rows);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" })
    }
});

module.exports = router;