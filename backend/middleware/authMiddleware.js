import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // check token exists
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // token format:
    // Bearer token_here

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // attach user info to request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;