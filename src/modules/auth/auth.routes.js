const express = require("express");
const { validateRequest, protect, restrictTo } = require("./auth.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateRoleSchema,
} = require("./auth.validation");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("./auth.controller");

const router = express.Router();

// ─── Public routes (No token required) ────────────────────────────────────────
router.post("/auth/register", validateRequest(registerSchema), register);
router.post("/auth/login", validateRequest(loginSchema), login);
router.post("/auth/logout", logout);

// ─── Protected routes (Logged in user only) ───────────────────────────────────
router.get("/users/me", protect, getProfile);
router.put(
  "/users/me",
  protect,
  validateRequest(updateProfileSchema),
  updateProfile,
);
router.patch(
  "/users/me/password",
  protect,
  validateRequest(changePasswordSchema),
  changePassword,
);

// ─── Admin-only routes ────────────────────────────────────────────────────────
router.get("/users", protect, restrictTo("admin"), getAllUsers);
router.get("/users/:id", protect, restrictTo("admin"), getUserById);
router.patch(
  "/users/:id/role",
  protect,
  restrictTo("admin"),
  validateRequest(updateRoleSchema),
  updateUserRole,
);
router.delete("/users/:id", protect, restrictTo("admin"), deleteUser);

module.exports = router;
