"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { api } from "@/lib/axios";
import { REVERB_APP_KEY, REVERB_HOST, REVERB_PORT } from "@/lib/app-config";

let echo: Echo<"reverb"> | null = null;

function createEcho() {
  return new Echo({
    broadcaster: "reverb",
    key: REVERB_APP_KEY,
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,

    forceTLS: true,
    enabledTransports: ["ws", "wss"],

    authorizer: (channel) => ({
      authorize: async (socketId, callback) => {
        try {
          const response = await api.post("/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          });

          callback(null, response.data);
        } catch (error) {
          callback(error as Error, null);
        }
      },
    }),
  });
}

export function getEcho() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!Cookies.get("access_token")) {
    return null;
  }

  if (!echo) {
    window.Pusher = Pusher;
    echo = createEcho();
  }

  return echo;
}

export function disconnectEcho() {
  if (echo) {
    echo.disconnect();
    echo = null;
  }
}
