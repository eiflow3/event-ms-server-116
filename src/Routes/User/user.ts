import { Router } from "express";
import { Profile } from "../../Controllers/User/user";
import { verifyToken } from "../../Middlewares/authentication";
import { authorize } from "../../Middlewares/authorization";
export default (router: Router) => {
  router.get("/user", verifyToken, authorize("user"), Profile);
};
