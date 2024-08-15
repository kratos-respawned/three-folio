"use server";
import { env } from "@/env";
import { db } from "@/lib/db";
import { imgKit } from "@/lib/imgkit";

import { ImageSchema, ProjectFormSchema } from "@/schema/projectSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerAction } from "zsa";

export const GetImgKitTokenAction = createServerAction()
  .input(
    z.object({
      items: z.number().min(1).default(1),
      token: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    if (!input.token || input.token !== env.TOKEN)
      throw new Error("User not authenticated");
    try {
      const tokenArray: {
        token: string;
        expire: number;
        signature: string;
      }[] = [];
      for (let i = 0; i < input.items; i++) {
        const data = imgKit.getAuthenticationParameters();
        tokenArray.push(data);
      }
      return tokenArray;
    } catch (e) {
      throw new Error("Something went wrong, please try again later");
    }
  });

export const CreateProjectAction = createServerAction()
  .input(
    ProjectFormSchema.extend({
      images: z.array(ImageSchema),
      token: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    if (!input.token || input.token !== env.TOKEN)
      throw new Error("User not authenticated");
    try {
      const images = (input.images as ImageSchema[]).map((image, index) => {
        return {
          fileId: image.fileId,
          name: image.name,
          filePath: image.filePath,
          imageUrl: image.url,
          height: image.height,
          width: image.width,
          thumbnail: image.thumbnailUrl,
        };
      });
      await db.project.create({
        data: {
          name: input.name,
          description: input.description,
          mainImage: input.images[0].thumbnailUrl,
          images: {
            createMany: {
              data: [...images],
            },
          },
        },
      });
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath("/admin");
      return {
        success: true,
      };
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong, please try again later");
    }
  });

export const DeleteProjectAction = createServerAction()
  .input(z.object({ id: z.string(), token: z.string() }))
  .handler(async ({ ctx, input }) => {
    if (!input.token || input.token !== env.TOKEN)
      throw new Error("User not authenticated");
    try {
      const project = await db.project.findUnique({
        where: { id: input.id },
        include: { images: true },
      });
      if (!project) throw new Error("Project not found");
      const images = project.images.map((image) => image.fileId);
      const [resp, imgResp] = await Promise.all([
        db.project.delete({ where: { id: input.id } }),
        imgKit.bulkDeleteFiles(images),
      ]);
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath("/admin");
      return {
        success: true,
      };
    } catch (e) {
      throw new Error("Something went wrong, please try again later");
    }
  });
