import { v4 as uuidv4 } from "uuid";

export function getDeviceId() {
  let id = localStorage.getItem("deviceId");

  if (!id) {
    id = uuidv4();
    localStorage.setItem("deviceId", id);
  }

  return id;
}

export function getSessionId() {
  let id = localStorage.getItem("sessionId");

  if (!id) {
    id = uuidv4();
    localStorage.setItem("sessionId", id);
  }

  return id;
}
