import { config } from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env file
config();

export default defineConfig({
    schema: path.join("prisma", "schema.prisma"),
    migrations: {
        path: path.join("db", "migrations"),
    },
    engine: "classic",
    datasource: {
        url: env("DATABASE_URL")
    }
});