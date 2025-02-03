import { prisma, event, joinedevent } from "../../Configs/prisma";

// Show all events
export const showAllEvents = (): Promise<{
  status: string;
  message: string;
  data: event[];
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = await prisma.event.findMany({
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      const formattedEvents = events.map((event) => {
        return {
          ...event,
          user: {
            id: event.user.id,
            full_name: `${event.user.first_name} ${event.user.last_name}`,
          },
        };
      });

      resolve({
        status: "success",
        message: "Events fetched successfully",
        data: formattedEvents,
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
        reject({
          status: "error",
          message: "Event not found",
        });
        return;
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
        include: {
          event: true,
        },
      });

      resolve({
        status: "success",
        message: "Joined Events fetched successfully",
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
      const res = await prisma.$transaction(async (tx) => {
        const isUserExist = await tx.user.findUnique({
          where: {
            id: userID,
          },
        });

        if (!isUserExist) {
          reject({
            status: "error",
            message: "User not found.",
          });
        }

        const isEventExist = await tx.event.findUnique({
          where: {
            id: eventID,
          },
        });

        if (!isEventExist) {
          reject({
            status: "error",
            message: "Event not found.",
          });
        }

        const alreadyJoined = await tx.joinedevent.findFirst({
          where: {
            user_id: userID,
            event_id: eventID,
          },
        });

        if (alreadyJoined) {
          reject({
            status: "error",
            message: "Already registered to this event.",
          });
        }

        const joinEvent = await tx.joinedevent.create({
          data: {
            user_id: userID,
            event_id: eventID,
          },
        });

        await tx.event.update({
          where: {
            id: joinEvent.event_id,
          },
          data: {
            registered_participants: {
              increment: 1,
            },
          },
        });

        return {
          status: "success",
          message: "Registered to event successfully.",
          data: joinEvent,
        };
      });

      resolve(res);
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
  data: joinedevent;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.$transaction(async (tx) => {
        const isUserExist = await tx.user.findUnique({
          where: {
            id: userID,
          },
        });

        if (!isUserExist) {
          reject({
            status: "error",
            message: "User not found.",
          });
        }

        const isEventExist = await tx.event.findUnique({
          where: {
            id: eventID,
          },
        });

        if (!isEventExist) {
          reject({
            status: "error",
            message: "Event not found.",
          });
        }

        const alreadyJoined = await tx.joinedevent.findFirst({
          where: {
            user_id: userID,
            event_id: eventID,
          },
        });

        if (!alreadyJoined) {
          reject({
            status: "error",
            message: "Not registered to this event.",
          });
        }

        const unjoinEvent = await tx.joinedevent.delete({
          where: {
            user_id_event_id: {
              user_id: userID,
              event_id: eventID,
            },
          },
        });

        await tx.event.update({
          where: {
            id: unjoinEvent.event_id,
          },
          data: {
            registered_participants: {
              decrement: 1,
            },
          },
        });

        return {
          status: "success",
          message: "Unregistered from event successfully.",
          data: unjoinEvent,
        };
      });

      resolve(res);
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
      const res = await prisma.$transaction(async (tx) => {
        const isEventExist = await tx.event.findUnique({
          where: {
            id: eventID,
          },
        });

        if (!isEventExist) {
          reject({
            status: "error",
            message: "Event not found.",
          });
        }

        const updatePartialData = Object.keys(event).reduce((acc, key) => {
          const k = key as keyof Omit<event, "id">;
          if (event[k] !== undefined) {
            (acc as any)[k] = event[k];
          }
          return acc;
        }, {} as Partial<Omit<event, "id">>);

        const updatedEvent = await tx.event.update({
          where: {
            id: eventID,
          },
          data: {
            ...updatePartialData,
          },
        });

        return {
          status: "success",
          message: "Event updated successfully",
          data: updatedEvent,
        };
      });

      resolve(res);
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
  data: event | null;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.$transaction(async (tx) => {
        const event = await tx.event.findFirst({
          where: {
            id: eventID,
          },
        });

        if (!event) {
          reject({
            status: "error",
            message: "Event not found.",
            data: null,
          });
        }

        await tx.event.delete({
          where: {
            id: eventID,
          },
        });

        return {
          status: "success",
          message: "Event deleted successfully",
          data: event,
        };
      });

      resolve(res);
    } catch (error: any) {
      reject({
        status: error.status,
        message: "Failed to delete event",
        error: error,
      });
    }
  });
};
