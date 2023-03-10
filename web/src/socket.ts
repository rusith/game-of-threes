import { io } from "socket.io-client";
export const socket = io(import.meta.env.API_URL || "http://localhost:8080");
