import { createAuthClient } from "better-auth/react";
import { env } from "@/env/web";

export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
});
