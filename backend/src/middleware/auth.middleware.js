import { verifyToken } from "../utils/jwt.utils.js";
import { redis } from "../config/redis.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Mechanism to check blacklisted token on redis 
  //tokens are blacklisted in redis one logout is clicked 
  const isBlacklisted = await redis.get(`blacklist:${token}`);

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Session expired. Please login again."
    });
  }

  try {
    const decoded = verifyToken(token);
    console.log(decoded, 'decoded===')
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden - Admin only" });
  }

  next();
};