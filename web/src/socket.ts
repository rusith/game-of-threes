import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';
import { playerIdKey } from '@app/consts';

let userId = localStorage.getItem(playerIdKey);

if (!userId) {
  userId = nanoid(20);
  localStorage.setItem(playerIdKey, userId);
}

export const socket = io(import.meta.env.API_URL || 'http://localhost:8080', {
  auth: {
    userId: userId
  }
});
