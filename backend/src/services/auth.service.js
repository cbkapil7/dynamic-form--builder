import db from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.util.js";
import { signToken } from "../utils/jwt.utils.js";
import { createError } from "../utils/error.util.js";

export const register = async (data) => {

  const email = data.email?.toLowerCase().trim();

  if (!email || !data.password) {
    throw createError("Email and password are required", 400);
  }

  const existing = await db.User.findOne({
    where: { email }
  });

  if (existing) {
    throw createError("User already exists", 409);
  }

  const hashed = await hashPassword(data.password);

  const user = await db.User.create({
    email,
    password: hashed,
    role: data.role || "USER"
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
};

export const login = async (data) => {

  const email = data.email?.toLowerCase().trim();

  if (!email || !data.password) {
    throw createError("Email and password are required", 400);
  }

  const user = await db.User.findOne({
    where: { email }
  });

  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw createError("Invalid credentials", 401);
  }
  console.log(user, "user")
  const token = signToken({
    id: user.id,
    role: user.role,
    email: user.email
  });
  console.log(token);
  return { token ,user};
};