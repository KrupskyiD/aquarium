import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  createUser,
  createVerificationToken,
  findVerificationToken,
  deleteVerificationToken,
  deleteVerificationTokensByUserId,
  updateUserVerification,
  updateUserRefreshToken,
  findUserByRefreshToken,
} from "../model/userPrisma.js";
import { sendVerificationEmail } from "../../utils/mailer.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedName = name?.trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password are required",
      });
    }

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name: normalizedName,
      email: normalizedEmail,
      password_hash,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await deleteVerificationTokensByUserId(user.id);
    await createVerificationToken({
      token,
      user_id: user.id,
      expires_at,
    });

    let emailSent = true;
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (mailError) {
      emailSent = false;
      console.log(`Verification email failed: ${mailError}`);
    }

    res.status(201).json({
      status: "success",
      message: emailSent
        ? "Registration successful. Please verify your email."
        : "Registration successful, but verification email could not be sent. Please configure mail settings.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        // Dev fallback: allows manual verify when SMTP is not configured.
        verificationToken: process.env.NODE_ENV !== "production" ? token : undefined,
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
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(normalizedEmail);

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
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await updateUserRefreshToken(user.id, refreshToken);

    res.status(200).json({
      status: "success",
      data: {
        accessToken: token,
        refreshToken,
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

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    await deleteVerificationTokensByUserId(user.id);
    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await createVerificationToken({
      token,
      user_id: user.id,
      expires_at,
    });

    let emailSent = true;
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (mailError) {
      emailSent = false;
      console.log(`Resend verification email failed: ${mailError}`);
    }

    return res.status(200).json({
      status: "success",
      message: emailSent
        ? "Verification email sent"
        : "Verification token created, but email could not be sent. Please configure mail settings.",
      data: {
        email: normalizedEmail,
        verificationToken: process.env.NODE_ENV !== "production" ? token : undefined,
      },
    });
  } catch (e) {
    console.log(`Error resending verification email: ${e}`);
    return res.status(500).json({
      status: "error",
      message: "Cannot resend verification email",
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
      await deleteVerificationToken(token);
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

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await findUserByRefreshToken(refreshToken);

    if (!user || user.id !== decoded.id) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      status: "success",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (e) {
    console.log(`Error refreshing token: ${e}`);
    res.status(401).json({
      status: "error",
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await updateUserRefreshToken(userId, null);

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (e) {
    console.log(`Error logging out: ${e}`);
    res.status(500).json({
      status: "error",
      message: "Cannot logout",
    });
  }
};
