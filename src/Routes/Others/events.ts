import { Router } from "express";
import {
  CreateEvent,
  DeleteEvent,
  ShowEvent,
  ShowEvents,
  UpdateEvent,
  UserJoinedEvent,
  UserRegisterEvent,
  UserUnregisterEvent,
} from "../../Controllers/Others/events";
import { verifyToken } from "../../Middlewares/authentication";
import { authorize } from "../../Middlewares/authorization";
export default (router: Router) => {
  // Get all events
  router.get("/events", verifyToken, authorize("user"), ShowEvents);

  // Get single event
  router.get("/events/:eventID", verifyToken, authorize("user"), ShowEvent);

  // Get all events joined by user
  router.get(
    "/my-events/:userID",
    verifyToken,
    authorize("user"),
    UserJoinedEvent
  );

  // User registration to events
  router.post(
    "/my-events/:userID/:eventID",
    verifyToken,
    authorize("user"),
    UserRegisterEvent
  );

  router.delete(
    "/my-events/:userID/:eventID",
    verifyToken,
    authorize("user"),
    UserUnregisterEvent
  );

  // Event related routes
  // Create, delete, update event

  router.post("/events", verifyToken, authorize("user"), CreateEvent);
  router.delete(
    "/events/:eventID",
    verifyToken,
    authorize("user"),
    DeleteEvent
  );
  router.patch("/events/:eventID", verifyToken, authorize("user"), UpdateEvent);
};
