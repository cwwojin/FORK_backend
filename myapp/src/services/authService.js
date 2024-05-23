const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/index'); // pooled connection

class AuthService {
    async loginUser({ userId, password }) {
        try {
            const query = 'SELECT * FROM "user" WHERE account_id = $1';
            const { rows } = await pool.query(query, [userId]);
            const user = rows[0];

            if (!user) {
                throw new Error('User not found');
            }

            // Validate the password with bcrypt
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                throw new Error('Invalid credentials');
            }

            // Sign the JWT with user ID and user type
            const token = jwt.sign(
                { id: user.id, userId: user.account_id, userType: user.user_type },
                process.env.JWT_SECRET || 'your_secret_key',
                {
                    expiresIn: '1h',
                }
            );

            // return the token, relevant user details
            return {
                token,
                userId: user.account_id,
                userType: user.user_type,
                id: user.id,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();
