import { prisma, event, joinedevent } from "../../Configs/prisma";

// Show all events
export const showAllEvents = (): Promise<{
  status: string;
  message: string;
  data: event[];
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = await prisma.event.findMany();

      resolve({
        status: "success",
        message: "Events fetched successfully",
        data: events,
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to fetch events",
        error: error,
      });
    }
  });
};

export const showEvent = (
  eventID: number
): Promise<{
  status: string;
  message: string;
  data: event;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: eventID,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      resolve({
        status: "success",
        message: "Event fetched successfully.",
        data: event,
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to fetch event.",
        error: error,
      });
    }
  });
};

// User joined events
export const getUserEvents = (
  userID: number
): Promise<{
  status: string;
  message: string;
  data: joinedevent[];
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = await prisma.joinedevent.findMany({
        where: {
          user_id: userID,
        },
      });

      resolve({
        status: "success",
        message: "Events fetched successfully",
        data: events,
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to fetch events.",
        error: error,
      });
    }
  });
};

// Register to event
export const userEventRegistration = (
  userID: number,
  eventID: number
): Promise<{
  status: string;
  message: string;
  data: joinedevent;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.joinedevent.create({
        data: {
          user_id: userID,
          event_id: eventID,
        },
      });

      resolve({
        status: "success",
        message: "Registered to event successfully",
        data: res,
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to register to event.",
        error: error,
      });
    }
  });
};

// Unregister from event
export const userEventUnregistration = (
  userID: number,
  eventID: number
): Promise<{
  status: string;
  message: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.joinedevent.deleteMany({
        where: {
          user_id: userID,
          event_id: eventID,
        },
      });

      resolve({
        status: "success",
        message: "Unregistered from event successfully",
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to unregister from event",
        error: error,
      });
    }
  });
};

// Create event
export const createNewEvent = (
  event: Omit<event, "id">
): Promise<{
  status: string;
  message: string;
  data: event;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.event.create({
        data: {
          ...event,
        },
      });

      resolve({
        status: "success",
        message: "Event created successfully",
        data: res,
      });
    } catch (error) {
      reject({
        message: "Failed to create event",
        error: error,
      });
    }
  });
};

// Update event
export const updateEvent = (
  eventID: number,
  event: Omit<Partial<event>, "id">
): Promise<{
  status: string;
  message: string;
  data: event;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.event.update({
        where: {
          id: eventID,
        },
        data: event,
      });

      resolve({
        status: "success",
        message: "Event updated successfully",
        data: res,
      });
    } catch (error) {
      reject({
        status: "error",
        message: "Failed to update event",
        error: error,
      });
    }
  });
};

// Delete event
export const deleteEvent = (
  eventID: number
): Promise<{
  status: string;
  message: string;
  data: event;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.event.delete({
        where: {
          id: eventID,
        },
      });

      resolve({
        status: "success",
        message: "Event deleted successfully",
        data: res,
      });
    } catch (error) {
      reject({
        message: "Failed to delete event",
        error: error,
      });
    }
  });
};
