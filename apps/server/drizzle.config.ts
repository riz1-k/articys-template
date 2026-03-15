import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: ".env",
});

export default defineConfig({
	schema: "./src/infrastructure/database/schema",
	out: "./src/infrastructure/database/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
