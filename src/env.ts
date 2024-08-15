import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1).url(),
    IMAGEKIT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_IMAGEKIT_KEY: z.string().min(1),
    NEXT_PUBLIC_IMGKIT_URL: z.string().min(1).url(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    IMAGEKIT_SECRET: process.env.IMAGEKIT_SECRET,
    TOKEN: process.env.SECRET_TOKEN,
    NEXT_PUBLIC_IMGKIT_URL: process.env.NEXT_PUBLIC_IMGKIT_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_IMAGEKIT_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_KEY,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
