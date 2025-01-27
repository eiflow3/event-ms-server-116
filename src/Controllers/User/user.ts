import { Request, Response } from "express";
import { createUser, getUserCredential } from "../../Database/User/user";
import { generateAccessToken, hashPassword } from "../../Services";

export const Login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const userData = await getUserCredential(username);

    if (!userData.user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    if (userData.user.password !== password) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    // Generate token
    const token = generateAccessToken({
      username: userData.user.username.toString(),
      role: "user",
    });

    res.status(200).json({
      status: userData.status,
      message: "Login successful",
      token: token,
    });
  } catch (error: any) {
    res.status(500).json({
      status: error.status,
      message: error.message,
    });
  } finally {
    res.end();
  }
};

export const Register = async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName } = req.body;

  if (!email || !password || !username || !firstName || !lastName) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const userData = await getUserCredential(email);

    if (userData.user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      email,
      password: hashedPassword,
      username,
      first_name: firstName,
      last_name: lastName,
    };

    const userCreation = await createUser(user);

    res.status(200).json({
      status: userCreation.status,
      message: userCreation.message,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  } finally {
    res.end();
  }
};

export const Profile = async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  try {
    const userData = await getUserCredential(username);

    if (!userData.user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      status: userData.status,
      user: userData.user,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  } finally {
    res.end();
  }
};

export const Logout = async (req: Request, res: Response) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout successful" });
};
