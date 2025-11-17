// config/config.js
export const config = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_change_in_production",
    JWT_EXPIRES_IN: "1h",
    BCRYPT_ROUNDS: 10
  };