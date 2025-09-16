const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/", async(req,res) => {
    try {
        // User input (username or email) and password
        const { userInput, password } = req.body;

        // Check if user exists
        const userLogin = await pool.query("SELECT * FROM user_info WHERE (email = $1 OR username = $1)",[userInput]);
        if (userLogin.rows.length === 0){
            return res.status(401).json({ error: "User not found." })
        }

        // If exists, get user info
        const user = userLogin.rows[0];

        // Check hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({ error: "Invalid password." });
        }

        // Log user login
        console.log("User logged in:", userLogin.rows[0].username);
        console.log("userID:", userLogin.rows[0].user_id);
        
        // Return user_id, username, and admin status to frontend
        res.json({message: "Login Successful", user_id: userLogin.rows[0].user_id , username: userLogin.rows[0].username, admin: userLogin.rows[0].admin });

    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;