import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface TokenPayload {
  username: string;
  role: string;
}

if (!process.env.JWT_SECRET_ACCESS_KEY) {
  throw new Error("JWT_SECRET_ACCESS_KEY is not defined");
}

export const generateAccessToken = (payload: TokenPayload) => {
  return Jwt.sign(payload, process.env.JWT_SECRET_ACCESS_KEY as string, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    Jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS_KEY as string,
      (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
          return;
        }
        resolve(decoded as TokenPayload);
      }
    );
  });
};

export const getUserRole = (
  token: string
): {
  username: string;
  role: string;
} => {
  return Jwt.decode(token) as TokenPayload;
};

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject({
          status: "error",
          message: "Failed to hash password",
          error: err,
        });
        return;
      }
      resolve(hash);
    });
  });
};

export const setAccessCookie = (res: any, token: string) => {
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    partition: true,
  });
};
