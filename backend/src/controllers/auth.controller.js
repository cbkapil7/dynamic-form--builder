import * as authService from "../services/auth.service.js";
import { redis } from "../config/redis.js";


export const registerController = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { token,user } = await authService.login(req.body);
    console.log(token)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //it should be true in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true ,email: user.email, role: user.role ,id:user.id});
  } catch (err) {
    next(err);
  }
};





export const logoutController = async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    await redis.set(
      `blacklist:${token}`,
      "true",
      "EX",
      60 * 60 * 24 // 1 day
    );
  }

  res.clearCookie("token");

  res.json({ message: "Logged out" });
};


export const meController = (req, res) => {
  res.json({ user: req.user });
};