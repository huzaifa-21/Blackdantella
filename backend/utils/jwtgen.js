import jwt from "jsonwebtoken";

const generateAccessToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.JSON_SECRET_KEY, { expiresIn });
};

const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
};

export { generateAccessToken, generateRefreshToken };
