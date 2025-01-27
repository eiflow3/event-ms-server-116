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
export default (router: Router) => {
  // Get all events
  router.get("/events", ShowEvents);

  // Get single event
  router.get("/events/:eventID", ShowEvent);

  // Get all events joined by user
  router.get("/my-events/:userID", UserJoinedEvent);

  // User registration to events
  router.post("/my-events/:userId/:eventID", UserRegisterEvent);

  router.delete("/my-events/:userId/:eventID", UserUnregisterEvent);

  // Event related routes
  // Create, delete, update event

  router.post("/events", CreateEvent);
  router.delete("/events/:eventID", DeleteEvent);
  router.patch("/events/:eventID", UpdateEvent);
};
