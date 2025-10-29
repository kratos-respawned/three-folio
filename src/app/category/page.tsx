import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { siteConfigImages } from "@/constant";
import { client } from "@/lib/sanity";
import { categoryToTitle } from "@/lib/utils";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Categories | Deepak Bhandari",
    description: "Browse projects by category",
};

const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  title,
  _id,
  "slug": slug.current,
  description
}`;

const Categories = async () => {
    const categories = await client.fetch<{ title: string; slug?: string; description?: string }[]>(
        categoriesQuery,
        {},
        {
            next: { tags: ["all-categories"], revalidate: 60 },
        }
    );


    return (
        <main className=" pb-11 ">
            <header>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Categories</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
                Categories
            </h2>

            <section className="mt-12 grid sm:grid-cols-2 gap-2">
                {categories.length === 0 && (
                    <p className="text-muted-foreground">No categories found</p>
                )}
                {categories.map((cat) => {
                    const hrefSlug = cat.title;
                    return (
                        <Link key={hrefSlug} href={`/category/${hrefSlug}`} className="block cursor-pointer">
                            <Card className="overflow-hidden aspect-[4/3] max-w-2xl w-full relative group">
                                <Image
                                    src={siteConfigImages[cat.title as keyof typeof siteConfigImages]}
                                    alt={cat.title}
                                    className="object-cover object-center opacity-70"
                                    fill
                                />
                                <div className="absolute grid items-end px-3 pb-3 bg-gradient-to-t from-black/65 inset-0 text-white">
                                    <div>
                                        <h4 className="text-base font-semibold">{categoryToTitle(cat.title)}</h4>
                                        {cat.description ? (
                                            <p className="text-xs line-clamp-1">{cat.description}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </section>
        </main>
    );
};

export default Categories;


