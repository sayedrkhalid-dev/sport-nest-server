const mongoose = require("mongoose");
const authService = require("./auth.service");

const isValidId = (id) => mongoose.isValidObjectId(id);

// ─── Cookie Helper ────────────────────────────────────────────────────────────
const setCookieToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─── POST /auth/register ──────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    // Set secure cookie
    setCookieToken(res, token);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    // Set secure cookie
    setCookieToken(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /auth/logout ────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /users/me ────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /users/me ────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const updated = await authService.updateProfile(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /users/me/password ─────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /users (admin only) ──────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filters = {};
    if (role) filters.role = role;

    const users = await authService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /users/:id (admin only) ──────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await authService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /users/:id/role (admin only) ──────────────────────────────────────
const updateUserRole = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const updated = await authService.updateUserRole(req.params.id, req.body.role);
    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /users/:id (admin only) ──────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const deleted = await authService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
