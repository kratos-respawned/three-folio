import { ProjectCard } from "@/components/project-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteConfigImages, siteQueries } from "@/constant";
import { client } from "@/lib/sanity";
import { categoryToTitle } from "@/lib/utils";
import { Metadata } from "next";
import {  type SanityDocument } from "next-sanity";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { fetchCategories } from "../fetchCategory";
import { notFound } from "next/navigation";
type Params = Promise<{ categoryName: string | undefined }>;
export async function generateStaticParams() {
    const categories = await client.fetch<{ title: string }[]>(
        siteQueries.categories.query,
        {},
        {
            next: { tags: [siteQueries.categories.cacheTag], revalidate:3600 },
        }
    );
    return categories
        .filter((c) => Boolean(c.title))
        .map((c) => ({ categoryName: c.title }));
}

export async function generateMetadata(props: { params: Params }):Promise<Metadata> {
    const params = await props.params;
    const title = params.categoryName;
    if (!title) return { title: "Category" };
    const categories = await client.fetch<{ _id: string; title: string }[]>(
        siteQueries.categories.query,
        {},
        { next: { tags: [siteQueries.categories.cacheTag], revalidate:3600 } }
    );
    const cat = categories.find((c) => c.title === title);
    return {
        title: `${categoryToTitle(cat?.title ?? title ?? "")} | Category`,
        description: `Projects in ${categoryToTitle(cat?.title ?? title ?? "")} category`,
        openGraph: {
            images: [siteConfigImages[title as keyof typeof siteConfigImages]],
            title: `${categoryToTitle(cat?.title ?? title ?? "")} | Category`,
            description: `Projects in ${categoryToTitle(cat?.title ?? title ?? "")} category`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${title}`,
            type: "website",
            siteName: "Deepak Bhandari Portfolio",
            locale: "en_IN",
        },
    };
}



const fetchProjectsByCategory = async(categoryId: string, title: string) =>{
    
   const projects = await client.fetch<SanityDocument[]>(
        siteQueries.projectsByCategory.query,
        { categoryId: categoryId },
    )
    return projects;
}

const CategoryPage = async (props: { params: Params }) => {
    "use cache"
    const params = await props.params;
    const title = params.categoryName;
    const category = (await fetchCategories()).find((c) => c.title === title);
    if (!category) {
        notFound();
    }
    const projects = await fetchProjectsByCategory(category._id, category.title);
    cacheLife("hours")
    return (
        <main className="pb-11 ">
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
                            <BreadcrumbLink asChild>
                                <Link href="/category">Categories</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{ categoryToTitle(category?.title ?? title ?? "")}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
                {categoryToTitle(category?.title ?? title ?? "")}
            </h2>
            <section className="mt-12 grid sm:grid-cols-2 gap-2">
                {projects.length === 0 && (
                    <p className="text-muted-foreground">No projects found</p>
                )}
                {projects.map((project) => (
                    <ProjectCard
                    categoryName={category.title}
                        id={project.slug?.current || "404"}
                        key={project.slug?.current || "404"}
                        name={project.title}
                        description={project.description}
                        mainImage={project.mainImage.asset.imageUrl}
                    />
                ))}
            </section>
        </main>
    );
};

export default CategoryPage;


