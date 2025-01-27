import { prisma, User } from "../../Configs/prisma";

export const createUser = async (
  user: Omit<User, "id">
): Promise<{
  status: string;
  message: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.user.create({
        data: user,
      });
      resolve({ status: "success", message: "User created successfully" });
    } catch (error) {
      reject({
        status: "error",
        message: "User creation failed",
        error: error,
      });
    }
  });
};

export const getUserCredential = async (
  username: string
): Promise<{
  status: string;
  user: Omit<User, "first_name" | "last_name"> | null;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },

        select: {
          id: true,
          password: true,
          email: true,
          username: true,
        },
      });
      resolve({ status: "success", user });
    } catch (error) {
      reject({
        status: "error",
        error: error,
      });
    }
  });
};
