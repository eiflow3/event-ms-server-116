import { Router } from "express";
import { Profile } from "../../Controllers/User/user";
export default (router: Router) => {
  router.get("/user/:username", Profile);
};
