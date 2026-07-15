import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

let echo: ReturnType<typeof createEcho> | null = null;

function createEcho() {
  return new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
    wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080"),
    wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080"),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    },
  });
}

export function getEcho(): ReturnType<typeof createEcho> | null {
  if (typeof window === "undefined") return null;

  if (!echo) {
    (window as any).Pusher = Pusher;
    echo = createEcho();
  }

  return echo;
}
