const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async(req,res) => {
    const client = await pool.connect();
    try {
        const { userID, shippingAddress, paymentInfo, totalPrice, totalItems} = req.body;
        const { addressLine1, addressLine2, city, state, zipCode, country } = shippingAddress;
        const { cardNumber, expiryDate, cvv, cardHolder } = paymentInfo;

        await client.query('BEGIN');

        const addressResult = await pool.query(`
            INSERT INTO shipping_address (user_id, address_line1, address_line2, city, state, zip_code, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [userID, addressLine1, addressLine2, city, state, zipCode, country]);
        console.log("Successful Add to Address");

        const fullCart = await pool.query(`
            SELECT c.cart_id, c.buyer_id, c.listing_id, c.item_quantity, ul.price
            FROM cart c
            JOIN user_listings ul ON c.listing_id = ul.listing_id
            WHERE c.buyer_id = $1
        `, [userID]);
        
        console.log("Successful in getting full cart");

        const orderHistory = await pool.query(`
            INSERT INTO order_history (buyer_id, address_id, discount_id, total_price)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [userID, addressResult.rows[0].address_id, null, totalPrice]);
        console.log("Successful Add to OrderHistory");

        for (const item of fullCart.rows) {
            const { listing_id, item_quantity, price } = item;

            const orderItem = await pool.query(`
                INSERT INTO order_items (order_id, listing_id, item_quantity, listing_price)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [orderHistory.rows[0].order_id, listing_id, item_quantity, price]);
        }

        const removeCart = await pool.query(`
            DELETE FROM cart
            WHERE buyer_id = $1
        `, [userID]);
        console.log("Success deleting");

        await client.query('COMMIT');
        res.json(addressResult.rows);
    } catch (error) {
        console.error("This is too address: " + error.message);
    }
});

module.exports = router;