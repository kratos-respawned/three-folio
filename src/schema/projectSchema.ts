import { z } from "zod";
export const ProjectFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(1000),
  images: z.any(),
});
export type ProjectFormSchema = z.infer<typeof ProjectFormSchema>;

export const ImageSchema = z.object({
  fileId: z.string(),
  name: z.string(),
  filePath: z.string(),
  url: z.string(),
  height: z.number(),
  width: z.number(),
  thumbnailUrl: z.string(),
});
export type ImageSchema = z.infer<typeof ImageSchema>;
