import { revalidateTag } from "next/cache";

export const GET = (req: Request) => {
  revalidateTag("projects-list","max");
  revalidateTag("all-projects","max");
  revalidateTag("more-projects","max");
  return new Response("Refreshed", { status: 200 });
};
