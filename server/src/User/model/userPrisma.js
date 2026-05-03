import prisma from "../../utils/prisma.js";

export const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const findUserById = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: userId },
  });
};

export const createUser = async (userData) => {
  return await prisma.users.create({
    data: userData,
  });
};

export const updateUserVerification = async (userId, isVerified) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { is_verified: isVerified },
  });
};

export const findVerificationToken = async (token) => {
  return await prisma.verification_token.findUnique({
    where: { token },
  });
};

export const createVerificationToken = async (tokenData) => {
  return await prisma.verification_token.create({
    data: tokenData,
  });
};

export const findVerificationTokenByUserId = async (userId) => {
  return await prisma.verification_token.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
};

export const deleteVerificationToken = async (token) => {
  return await prisma.verification_token.delete({
    where: { token },
  });
};

export const deleteVerificationTokensByUserId = async (userId) => {
  return await prisma.verification_token.deleteMany({
    where: { user_id: userId },
  });
};

export const updateUserRefreshToken = async (userId, refreshToken) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { refresh_token: refreshToken },
  });
};

export const findUserByRefreshToken = async (refreshToken) => {
  return await prisma.users.findFirst({
    where: { refresh_token: refreshToken },
  });
};

export const updateUserProfile = async (userId, profileData) => {
  return await prisma.users.update({
    where: { id: userId },
    data: profileData,
  });
};
