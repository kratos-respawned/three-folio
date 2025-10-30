import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryToTitle } from "@/lib/utils";
import { siteConfigImages, siteQueries } from "@/constant";
import { client } from "@/lib/sanity";
import {  type SanityDocument } from "next-sanity";
import { cache } from "react";



const fetchCategories = cache(() =>
  client.fetch<SanityDocument[]>(siteQueries.categories.query, {}, {
    next: { tags: [siteQueries.categories.cacheTag], revalidate:3600 },
  })
);

export async function CategoriesList() {
"use cache"
  const categories = await fetchCategories();
  return (
    <div className="mt-12 grid sm:grid-cols-2 gap-2">
      {categories.length === 0 && (
        <p className="text-muted-foreground">No categories found</p>
      )}
      {categories
        .filter((cat) => Boolean(cat.title))
        .map((cat) => {
          const hrefSlug = cat.title;
          return (
            <Link
              key={hrefSlug}
              href={`/category/${hrefSlug}`}
              className="block cursor-pointer"
            >
              <Card className="overflow-hidden aspect-[4/3] max-w-2xl w-full relative group">
                <Image
                  src={siteConfigImages[cat.title as keyof typeof siteConfigImages]}
                  alt={cat.title}
                  className="object-cover object-center opacity-70"
                  fill
                />
                <div className="absolute grid items-end px-3 pb-3 bg-gradient-to-t from-black/65 inset-0 text-white">
                  <div>
                    <h4 className="text-base font-semibold ">{categoryToTitle(cat.title)}</h4>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="mt-12 grid sm:grid-cols-2 gap-2">
      {[...Array(2)].map((_, i) => (
        <Card
          className="overflow-hidden aspect-[4/3] max-w-2xl w-full relative group"
          key={i}
        >
          <Skeleton className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute grid items-end px-3 pb-3 bg-gradient-to-t from-black/65 inset-0 text-white">
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
