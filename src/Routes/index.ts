import { Router } from "express";
import user from "./User/user";
import authentication from "./Others/authentication";
import events from "./Others/events";

const router = Router();

export default (): Router => {
  authentication(router);
  events(router);
  user(router);
  return router;
};
