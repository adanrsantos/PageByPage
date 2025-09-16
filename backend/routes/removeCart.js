const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    const client = await pool.connect();
    try {
        const { listing_id, buyer_id, cart_id, count } = req.body;
        
        await client.query('BEGIN');

        // Check existing cart item quantity
        const existingItem = await pool.query(`
            SELECT item_quantity FROM cart
            WHERE buyer_id = $1 AND listing_id = $2 AND cart_id = $3
        `, [buyer_id, listing_id, cart_id]);

        // Check current stock in user_listings
        const availableQuantity = await pool.query(`
            SELECT current_quantity, initial_quantity FROM user_listings
            WHERE listing_id = $1
        `, [listing_id]);

        // Extract quantities
        const cartQuantity = existingItem.rows[0]?.item_quantity || 0;
        const availableListingQuantity = availableQuantity.rows[0]?.current_quantity || 0;
        const initialListingQuantity = availableQuantity.rows[0]?.initial_quantity || 0;

        if (cartQuantity === 0) {
            throw new Error("Cart item not found or quantity is zero.");
        }

        const newCartQuantity = cartQuantity - count;

        // If items remain in the cart, update the cart quantity
        if (newCartQuantity > 0) {
            await pool.query(`
                UPDATE cart
                SET item_quantity = $1
                WHERE buyer_id = $2 AND listing_id = $3 AND cart_id = $4
            `, [newCartQuantity, buyer_id, listing_id, cart_id]);
        } 
        // If no items remain, delete the cart item
        else {
            await pool.query(`
                DELETE FROM cart
                WHERE buyer_id = $1 AND listing_id = $2 AND cart_id = $3
            `, [buyer_id, listing_id, cart_id]);
        }

        // Restore the quantity to user_listings
        const quantityToRestore = Math.min(count, cartQuantity); // Restore only what was removed
        const newAvailableQuantity = Math.min(
            availableListingQuantity + quantityToRestore,
            initialListingQuantity // Ensure it doesn't exceed the initial stock
        );

        await pool.query(`
            UPDATE user_listings
            SET current_quantity = $1
            WHERE listing_id = $2
        `, [newAvailableQuantity, listing_id]);

        await client.query('COMMIT');

        console.log("Successfully removed item(s) from cart and updated stock.");
        res.json("Success");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
});


module.exports = router;