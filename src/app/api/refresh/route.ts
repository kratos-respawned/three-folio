import { revalidateTag } from "next/cache";

export const GET = (req: Request) => {
  revalidateTag("projects-list");
  revalidateTag("all-projects");
  revalidateTag("more-projects");
  return new Response("Refreshed", { status: 200 });
};
