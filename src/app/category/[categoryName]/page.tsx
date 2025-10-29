import { ProjectCard } from "@/components/project-card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { client } from "@/lib/sanity";
import { categoryToTitle } from "@/lib/utils";
import { groq, SanityDocument } from "next-sanity";
import Link from "next/link";

type Params = Promise<{ categoryName: string | undefined }>;

const categoriesQuery = groq`*[_type == "category"]{
  _id,
  title,
  slug
}`;

const byCategoryQuery = groq`*[_type == "post" && references($categoryId)] | order(orderRank) {
  title,
  slug,
  description,
  mainImage {
    asset->{
      url,
      "imageUrl": url + "?w=624&h=428&fit=crop"
    }
  }
}`;

export async function generateStaticParams() {
    const categories = await client.fetch<{ title: string }[]>(
        categoriesQuery,
        {},
        {
            next: { revalidate: 60 },
        }
    );
    return categories
        .filter((c) => Boolean(c.title))
        .map((c) => ({ categoryName: c.title }));
}

export async function generateMetadata(props: { params: Params }) {
    const params = await props.params;
    const title = params.categoryName;
    if (!title) return { title: "Category" };
    const categories = await client.fetch<{ _id: string; title: string }[]>(
        categoriesQuery,
        {},
        { next: { revalidate: 60 } }
    );
    const cat = categories.find((c) => c.title === title);
    return {
        title: `${categoryToTitle(cat?.title ?? title ?? "")} | Category`,
        description: `Projects in ${categoryToTitle(cat?.title ?? title ?? "")} category`,
    };
}

const CategoryPage = async (props: { params: Params }) => {
    const params = await props.params;
    const title = params.categoryName;

    const categories = await client.fetch<{ _id: string; title: string }[]>(
        categoriesQuery,
        {},
        { next: { revalidate: 60 } }
    );
    const category = categories.find((c) => c.title === title);

    const projects = await client.fetch<SanityDocument[]>(
        byCategoryQuery,
        { categoryId: category?._id as string ?? "__nope__" },
        {
            next: {
                tags: ["category-projects", title ?? "unknown-category"],
            },
        }
    );

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
                            <BreadcrumbPage>{category?.title ?? title}</BreadcrumbPage>
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
                        id={project.slug?.current || "404"}
                        key={project.slug?.current || "404"}
                        name={project.title}
                        description={project.description}
                        mainImage={project.mainImage.asset.imageUrl}
                    />)
                )}
            </section>
        </main>
    );
};

export default CategoryPage;


