const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", async(req,res) => {
    const { username, email, password, first_name, last_name } = req.body;

    try {
        
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM user_info WHERE username = $1 OR email = $2", [username, email]);
        if (existingUser.rows.length > 0){
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query("INSERT INTO user_info (username, email, password, first_name, last_name) \
                                          VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [username, email, hashedPassword, first_name, last_name]
        );
        res.status(201).json({ message: 'User registered successfully!', user: newUser.rows[0] });
    } catch (error) {

        // Log error message
        console.error(error.message);

        // Check if error is due to unique constraint violation
        res.status(500).json({ error: 'Server error' });
        
        // if (error.code === "23505"){
        //     return res.status(409).json({ error: "Username or email already taken" });
        // }
    }
});

module.exports = router;