import db from "../models/index.js";
import { hashPassword } from "./bcrypt.util.js";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await db.User.findOne({
      where: { role: "ADMIN" }
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashed = await hashPassword(process.env.ADMIN_PASSWORD); 

    await db.User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: "ADMIN"
    });

    console.log("===== Admin created successfully =======");
  } catch (error) {
    console.error(" Error creating admin:", error);
  }
};