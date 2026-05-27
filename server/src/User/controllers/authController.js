import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserVerification,
  updateUserRefreshToken,
  findUserByRefreshToken,
  updateUserProfile,
  updateUserPassword,
} from "../model/userPrisma.js";
import { sendVerificationEmail } from "../../utils/mailer.js";
import { getClientUrl } from "../../utils/appUrls.js";

const wantsHtmlResponse = (req) => (req.headers.accept || "").includes("text/html");

const redirectToVerifyPage = (res, query) => {
  const params = new URLSearchParams(query);
  return res.redirect(302, `${getClientUrl()}/verify-account?${params.toString()}`);
};

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

    // Создаем юзера в существующей таблице users
    const user = await createUser({
      name: normalizedName,
      email: normalizedEmail,
      password_hash,
    });

    // 🚀 НОВЫЙ ПОДХОД: Генерируем JWT токен для почты (живет 1 день)
    // База данных для этого не нужна!
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

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
  // Код логина остается БЕЗ ИЗМЕНЕНИЙ, он работает отлично
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
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
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

    // 🚀 Снова используем генерацию JWT вместо базы данных
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

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
      if (wantsHtmlResponse(req)) {
        return redirectToVerifyPage(res, { error: "missing_token" });
      }
      return res.status(400).json({
        status: "error",
        message: "Token is required",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await updateUserVerification(decoded.id, true);

      if (wantsHtmlResponse(req)) {
        return redirectToVerifyPage(res, { verified: "1" });
      }

      return res.status(200).json({
        status: "success",
        message: "Email verified successfully",
      });
    } catch (jwtError) {
      if (wantsHtmlResponse(req)) {
        return redirectToVerifyPage(res, { error: "invalid_token" });
      }
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }
  } catch (e) {
    console.log(`Error verifying email: ${e}`);
    if (wantsHtmlResponse(req)) {
      return redirectToVerifyPage(res, { error: "server_error" });
    }
    return res.status(500).json({
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

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (e) {
    console.log(`Error fetching profile: ${e}`);
    return res.status(500).json({
      status: "error",
      message: "Cannot fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      return res.status(400).json({
        status: "error",
        message: "Name and email are required",
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (normalizedEmail !== user.email) {
      const existingUser = await findUserByEmail(normalizedEmail);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          status: "error",
          message: "User with this email already exists",
        });
      }
    }

    const updatedUser = await updateUserProfile(userId, {
      name: normalizedName,
      email: normalizedEmail,
    });

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      },
    });
  } catch (e) {
    console.log(`Error updating profile: ${e}`);
    return res.status(500).json({
      status: "error",
      message: "Cannot update profile",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password and new password are required",
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Current password is invalid",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        status: "error",
        message: "New password must be different from current password",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(userId, newPasswordHash);
    await updateUserRefreshToken(userId, null);

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log(`Error changing password: ${e}`);
    return res.status(500).json({
      status: "error",
      message: "Cannot change password",
    });
  }
};
