
import { siteQueries } from "@/constant";
import { client } from "@/lib/sanity";
import { SanityDocument } from "next-sanity";
import {   revalidateTag } from "next/cache";

export const GET = async(req: Request) => {
  revalidateTag(siteQueries.categories.cacheTag+"-page","max")
  revalidateTag(siteQueries.categories.cacheTag,"max")
  const categories = await client.fetch<{ title: string }[]>(siteQueries.categories.query, {});
  categories.forEach(category => {
    revalidateTag(siteQueries.projectsByCategory.cacheTag(category.title),"max")
  })
  const projects = await client.fetch<SanityDocument[]>(siteQueries.allProjects.query, {});
  projects.forEach(project => {
    revalidateTag(siteQueries.project.cacheTag(project.slug.current),"max")
    revalidateTag(siteQueries.project.cacheTag(project.slug.current)+"-page","max")
  });
  revalidateTag(siteQueries.allProjects.cacheTag,"max")
  return new Response("Refreshed", { status: 200 });
};
