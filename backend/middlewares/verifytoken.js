import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) {
      return res
        .status(401)
        .send({ success: false, message: "Token required" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JSON_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: error.message });
  }
};

export default verifyToken;
