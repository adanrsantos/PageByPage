const GoogleStrategy = require('passport-google-oath20').Strategy;
const passport = require('passport');
const db = require('./models/db'); // Database connection

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback", // URL Google will redireect users to after login
        },
        async (accessToken, refreshToken, profile, done) => {
            // Checks if user already exist in our database
            const result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
            let user = result.rows[0];

            if (!user) {
                //If the user doesn't exist, make a new one
                const newUser = await db.query(
                    'INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *',
                    [profile.id, profile.displayName, profile.emails[0].value]
                );
                user = newUser.rows[0];
            }
            
            // Pass user object to Passport
            return done(null, user);
            
        }
    )
);