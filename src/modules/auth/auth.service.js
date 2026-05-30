const jwt = require("jsonwebtoken");
const User = require("./auth.model");

// ─── JWT token generation ─────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────
const registerUser = async (data) => {
  const { name, email, password, phone, photoURL } = data;

  // Check email conflict
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, phone, photoURL });
  const token = generateToken(user._id);

  return { user, token };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async ({ email, password }) => {
  // Explicitly select password field since select: false is specified in the schema
  const user = await User.findOne({ email, is_active: true }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password))) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { user, token };
};

// ─── Get User By ID ───────────────────────────────────────────────────────────
const getUserById = async (id) => {
  return await User.findOne({ _id: id, is_active: true });
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = async (id, data) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
};

// ─── Change Password ──────────────────────────────────────────────────────────
const changePassword = async (id, { currentPassword, newPassword }) => {
  const user = await User.findById(id).select("+password");

  if (!(await user.isPasswordCorrect(currentPassword))) {
    const error = new Error("Current password is incorrect");
    error.status = 400;
    throw error;
  }

  user.password = newPassword; // pre-save hook handles hashing
  await user.save();

  return user;
};

// ─── Admin: Get all users ─────────────────────────────────────────────────────
const getAllUsers = async (filters = {}) => {
  return await User.find({ is_active: true, ...filters }).sort({ createdAt: -1 });
};

// ─── Admin: Update role ───────────────────────────────────────────────────────
const updateUserRole = async (id, role) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { role } },
    { new: true }
  );
};

// ─── Admin: Soft delete user ──────────────────────────────────────────────────
const deleteUser = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { is_active: false } },
    { new: true }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
