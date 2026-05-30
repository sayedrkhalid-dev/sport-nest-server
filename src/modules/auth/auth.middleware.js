const jwt = require("jsonwebtoken");
const User = require("./auth.model");

// ─── Validation Middleware (Zod) ──────────────────────────────────────────────
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
  };
};

// ─── Auth Middleware — JWT verify (with Cookie & Header support) ──────────────
const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check HTTPOnly Cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Fallback to Bearer token in headers
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in. Please log in to gain access.",
      });
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists or is inactive.",
      });
    }

    // Attach user to req
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    next(error);
  }
};

// ─── Role Guard ───────────────────────────────────────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { validateRequest, protect, restrictTo };
