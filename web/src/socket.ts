import { nanoid } from "nanoid";
import { io } from "socket.io-client";

let userId = localStorage.getItem("gamePlayerId");

if (!userId) {
  userId = nanoid(20);
  localStorage.setItem("gamePlayerId", userId);
}

export const socket = io(import.meta.env.API_URL || "http://localhost:8080", {
  auth: {
    userId: userId,
  },
});
