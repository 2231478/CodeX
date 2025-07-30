import jwt from 'jsonwebtoken';

const jwtHelper = {
    /**
     * Generate a JWT access token for a user object
     * @param {Object} user - The user object (must include ._id, .email, .name, etc.)
     * @returns {String} JWT access token
     */
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                userId: user._id?.toString(),
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    },

    /**
     * Generate a JWT refresh token for a user object
     * @param {Object} user - The user object (must include ._id, .email, etc.)
     * @returns {String} JWT refresh token
     */
    generateRefreshToken: (user) =>
    jwt.sign(
      {
        userId: user._id?.toString(),
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } 
    ),

    /**
     * Verify a JWT access token and return the decoded payload
     * @param {String} token - JWT token string
     * @returns {Object|null} Decoded payload if valid, null otherwise
     */
    verifyAccessToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return null;
        }
    },

    /**
     * Verify a JWT refresh token and return the decoded payload
     * @param {String} token - JWT token string
     * @returns {Object|null} Decoded payload if valid, null otherwise
     */
    verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return null;
    }
  }
};

export default jwtHelper;
