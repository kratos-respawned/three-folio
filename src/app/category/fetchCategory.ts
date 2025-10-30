import { siteQueries } from "@/constant";
import { client } from "@/lib/sanity";
import { SanityDocument } from "next-sanity";
import { cacheTag } from "next/cache";

export const fetchCategories = async() =>{
    "use cache"
   const categories = await client.fetch<{ title: string; _id: string }[]>(siteQueries.categories.query, {})
   cacheTag(siteQueries.categories.cacheTag);
   return categories;
};