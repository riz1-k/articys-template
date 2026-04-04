import pino from "pino";
import { appConfig } from "@/core/config/app.config";

export const logger = pino({
	name: "articys-server",
	level: appConfig.logging.level,
	transport: appConfig.isProduction
		? undefined
		: {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:HH:MM:ss",
					ignore: "pid,hostname",
					singleLine: true,
				},
			},
});
