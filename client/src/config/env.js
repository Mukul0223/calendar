import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.url("VITE_BASE_API_URL must be a valid url."),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:\n");
  console.error(z.treeifyError(parsedEnv.error));
}

export default parsedEnv.data;
