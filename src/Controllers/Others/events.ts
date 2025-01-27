import { Request, Response } from "express";
import {
  createNewEvent,
  deleteEvent,
  getUserEvents,
  showAllEvents,
  showEvent,
  updateEvent,
  userEventRegistration,
  userEventUnregistration,
} from "../../Database/Others/events";

export const ShowEvents = async (req: Request, res: Response) => {
  try {
    const events = await showAllEvents();

    res.status(200).json({
      status: events.status,
      message: events.message,
      data: events.data,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }
};

export const ShowEvent = async (req: Request, res: Response) => {
  const { eventID } = req.params;

  if (!eventID) {
    res.status(400).json({
      status: "error",
      message: "Event ID is required",
      error: "Missing required parameter",
    });
    return;
  }

  try {
    const event = await showEvent(parseInt(eventID));

    res.status(200).json({
      status: event.status,
      message: event.message,
      data: event.data,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }
};

// ==============================
// User related controllers
// ==============================

export const UserJoinedEvent = async (req: Request, res: Response) => {
  const { userID } = req.params;

  if (!userID) {
    res.status(400).json({
      status: "error",
      message: "User ID is required",
      error: "Missing required parameter",
    });
    return;
  }

  try {
    const userEvents = await getUserEvents(parseInt(userID));

    res.status(200).json({
      status: userEvents.status,
      message: userEvents.message,
      data: userEvents.data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ status: err.status, message: err.message, error: err.error });
  } finally {
    res.end();
  }
};

export const UserRegisterEvent = async (req: Request, res: Response) => {
  const { userID, eventID } = req.params;

  if (!userID || !eventID) {
    res.status(400).json({
      status: "error",
      message: "User ID and Event ID are required",
      error: "Missing required parameters",
    });
    return;
  }

  try {
    const userRegistration = await userEventRegistration(
      parseInt(userID),
      parseInt(eventID)
    );

    res.status(200).json({
      status: userRegistration.status,
      message: userRegistration.message,
      data: userRegistration.data,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }
};

export const UserUnregisterEvent = async (req: Request, res: Response) => {
  const { userID, eventID } = req.params;

  if (!userID || !eventID) {
    res.status(400).json({
      status: "error",
      message: "User ID and Event ID are required",
      error: "Missing required parameters",
    });
    return;
  }

  try {
    const userUnregistration = await userEventUnregistration(
      parseInt(userID),
      parseInt(eventID)
    );

    res.status(200).json({
      status: userUnregistration.status,
      message: userUnregistration.message,
      data: userUnregistration.data,
    });
  } catch (err: any) {
    res.status(500).json({
      status: err.status,
      message: err.message,
      error: err.error,
    });
  }
};

// ==============================
// Organizer controllers
// ==============================

export const CreateEvent = async (req: Request, res: Response) => {
  const { userId, eventTitle, description, date, location, maxAttendees } =
    req.body;

  if (
    !userId ||
    !eventTitle ||
    !description ||
    !date ||
    !location ||
    !maxAttendees
  ) {
    res.status(400).json({
      status: "error",
      message:
        "User ID, Event Title, Description, Date, Location, and Max Attendees are required",
      error: "Missing required parameters",
    });
    return;
  }

  try {
    const event = {
      organizerId: parseInt(userId),
      event_name: eventTitle,
      location,
      date: date,
      time: new Date(date).toLocaleTimeString(),
      reminders: description,
      max_participants: Number(maxAttendees),
      registered_participants: 0,
    };

    const createEvent = await createNewEvent(event);

    res.status(200).json({
      status: createEvent.status,
      message: createEvent.message,
      data: createEvent.data,
    });
  } catch (err: any) {
    console.log(err);
    res
      .status(500)
      .json({ status: err.status, message: err.message, error: err.error });
  }
};

export const UpdateEvent = async (req: Request, res: Response) => {
  const { eventID } = req.params;
  const { eventTitle, description, date, location, maxAttendees } = req.body;

  if (!eventID) {
    res.status(400).json({
      status: "error",
      message: "Event ID is required",
      error: "Missing required parameter",
    });
    return;
  }

  if (!eventTitle && !description && !date && !location && !maxAttendees) {
    res.status(400).json({
      status: "error",
      message:
        "At least one of the following fields is required: Event Title, Description, Date, Location, Max Attendees",
      error: "Missing required parameter",
    });
    return;
  }

  try {
    const event = {
      event_name: eventTitle,
      location,
      date: date ? date : undefined,
      time: date ? new Date(date).toLocaleTimeString() : undefined,
      reminders: description,
      max_participants: maxAttendees,
    };

    const updateResult = await updateEvent(parseInt(eventID), event);

    res.status(200).json({
      status: updateResult.status,
      message: updateResult.message,
      data: updateResult.data,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ status: err.status, message: err.message, error: err.error });
  }
};

export const DeleteEvent = async (req: Request, res: Response) => {
  const { eventID } = req.params;
  try {
    const deleteResult = await deleteEvent(parseInt(eventID));

    res.status(200).json({
      status: deleteResult.status,
      message: deleteResult.message,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ status: err.status, message: err.message, error: err.error });
  }
};
