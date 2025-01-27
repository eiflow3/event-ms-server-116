import { Router } from "express";
import { Login, Logout, Register } from "../../Controllers/User/user";
import { verifyToken } from "../../Middlewares/authentication";
import { authorize } from "../../Middlewares/authorization";
export default (router: Router) => {
  // User authentication
  router.get("/auth/login", Login);
  router.post("/auth/register", Register);
  router.get("/auth/logout", Logout);

  // Verify token
  router.post(
    "/auth/verify-token",
    verifyToken,
    authorize("user"),
    (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Token is valid",
      });
      res.end();
    }
  );
};
