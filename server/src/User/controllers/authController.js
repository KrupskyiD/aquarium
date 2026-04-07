import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  createUser,
  createVerificationToken,
  findVerificationToken,
  deleteVerificationToken,
  updateUserVerification,
} from "../model/userPrisma.js";
import { sendVerificationEmail } from "../../utils/mailer.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      password_hash,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await createVerificationToken({
      token,
      user_id: user.id,
      expires_at,
    });

    await sendVerificationEmail(email, token);

    res.status(201).json({
      status: "success",
      message: "Registration successful. Please verify your email.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(`Error registering user: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    if (!user.is_verified) {
      return res.status(401).json({
        status: "error",
        message: "Please verify your email first",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (e) {
    console.log(`Error logging in: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot login",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token is required",
      });
    }

    const verificationToken = await findVerificationToken(token);

    if (!verificationToken) {
      return res.status(400).json({
        status: "error",
        message: "Invalid token",
      });
    }

    if (verificationToken.expires_at < new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Token has expired",
      });
    }

    await updateUserVerification(verificationToken.user_id, true);

    await deleteVerificationToken(token);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (e) {
    console.log(`Error verifying email: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot verify email",
    });
  }
};
