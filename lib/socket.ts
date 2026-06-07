"use client";

import { io, Socket } from "socket.io-client";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://9qc99pwv-3333.uks1.devtunnels.ms/";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(baseUrl?.replace(/\/$/, ""), {
      path: "/sanuxsocket/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
