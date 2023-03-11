import { nanoid } from "nanoid";
import { io } from "socket.io-client";

let userId = localStorage.getItem("game_user_id");

if (!userId) {
  userId = nanoid(20);
  localStorage.setItem("game_user_id", userId);
}

export const socket = io(import.meta.env.API_URL || "http://localhost:8080", {
  auth: {
    userId: userId,
  },
});
