import { env } from "@/env";
import ImageKit from "imagekit";
export const imgKit = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_KEY,
  privateKey: env.IMAGEKIT_SECRET,
  urlEndpoint: env.NEXT_PUBLIC_IMGKIT_URL,
});
