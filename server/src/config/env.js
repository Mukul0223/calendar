require("dotenv").config();
const { z } = require("zod");

const envSchema = z.object({
  CLIENT_ORIGIN: z.string().min(1, "CLIENT_ORIGIN is required"),
  PORT: z.string().default("3001"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce
    .number({ message: "REFRESH_TOKEN_EXPIRES_IN must be a valid number" })
    .positive("REFRESH_TOKEN_EXPIRES_IN must be greater than 0"),
  NODE_ENV: z.string().default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:\n");
  console.error(z.treeifyError(parsedEnv.error));
  process.exit(1);
}

module.exports = parsedEnv.data;
