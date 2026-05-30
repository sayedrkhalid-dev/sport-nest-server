const { z } = require("zod");

const passwordValidator = z
  .string({ required_error: "Password is required" })
  .min(6, { message: "Password must be at least 6 characters" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  });

// ─── Register Schema ──────────────────────────────────────────────────────────
const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, { message: "Name must be at least 2 characters" }),

      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" })
        .toLowerCase(),

      password: passwordValidator,

      confirmPassword: z.string({ required_error: "Please confirm your password" }),

      phone: z
        .string()
        .regex(/^(\+8801|01)[3-9]\d{8}$/, {
          message: "Invalid Bangladeshi phone number",
        })
        .optional()
        .nullable(),

      photoURL: z
        .string()
        .url({ message: "Invalid photo URL format" })
        .optional()
        .nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

// ─── Login Schema ─────────────────────────────────────────────────────────────
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .toLowerCase(),

    password: z.string({ required_error: "Password is required" }),
  }),
});

// ─── Update Profile Schema ────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      phone: z
        .string()
        .regex(/^(\+8801|01)[3-9]\d{8}$/, {
          message: "Invalid Bangladeshi phone number",
        })
        .optional()
        .nullable(),
      photoURL: z.string().url({ message: "Invalid photo URL" }).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required to update",
    }),
});

// ─── Change Password Schema ───────────────────────────────────────────────────
const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string({ required_error: "Current password is required" }),
      newPassword: passwordValidator,
      confirmNewPassword: z.string({ required_error: "Please confirm your new password" }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }),
});

// ─── Admin: Update User Role ──────────────────────────────────────────────────
const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["user", "admin"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be either 'user' or 'admin'",
    }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateRoleSchema,
};
