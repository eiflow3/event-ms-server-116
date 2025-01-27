import { Router } from "express";
import { Login, Logout, Register } from "../../Controllers/User/user";
import { verifyToken } from "../../Middlewares/authentication";
export default (router: Router) => {
  // User authentication
  router.get("/auth/login", Login);
  router.get("/auth/register", Register);
  router.get("/auth/logout", Logout);

  // Verify token
  router.post("/auth/verify-token", verifyToken);
};
