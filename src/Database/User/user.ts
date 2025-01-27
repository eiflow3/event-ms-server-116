import { prisma, user } from "../../Configs/prisma";

export const createUser = async (
  user: Omit<user, "id">
): Promise<{
  status: string;
  message: string;
  data?: Omit<user, "password">;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.user.create({
        data: user,

        select: {
          id: true,
          email: true,
          username: true,
          first_name: true,
          last_name: true,
        },
      });
      resolve({
        status: "success",
        message: "User created successfully",
        data: res,
      });
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
  user: Omit<user, "first_name" | "last_name"> | null;
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
