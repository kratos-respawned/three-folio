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
import { groq, SanityDocument } from "next-sanity";
import Link from "next/link";

type Params = Promise<{ categoryName: string | undefined }>;

const categoriesQuery = groq`*[_type == "category"]{
  _id,
  title,
  "slug": slug.current
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
    const categories = await client.fetch<{ title: string; slug?: string }[]>(
        categoriesQuery,
        {},
        {
            next: { revalidate: 60 },
        }
    );
    const toSlug = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    return categories.map((c) => ({ categoryName: c.slug ?? toSlug(c.title) }));
}

export async function generateMetadata(props: { params: Params }) {
    const params = await props.params;
    const slug = params.categoryName;
    if (!slug) return { title: "Category" };
    const categories = await client.fetch<{ _id: string; title: string; slug?: string }[]>(
        categoriesQuery,
        {},
        { next: { revalidate: 60 } }
    );
    const toSlug = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    const cat = categories.find((c) => c.slug === slug || toSlug(c.title) === slug);
    return {
        title: `${cat?.title ?? slug} | Category`,
        description: `Projects in ${cat?.title ?? slug} category`,
    };
}

const CategoryPage = async (props: { params: Params }) => {
    const params = await props.params;
    const slug = params.categoryName;

    const categories = await client.fetch<{ _id: string; title: string; slug?: string }[]>(
        categoriesQuery,
        {},
        { next: { revalidate: 60 } }
    );
    const toSlug = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    const category = categories.find((c) => c.slug === slug || toSlug(c.title) === slug);

    const projects = await client.fetch<SanityDocument[]>(
        byCategoryQuery,
        { categoryId: category?._id ?? "__nope__" },
        {
            next: {
                tags: ["category-projects", slug ?? "unknown-category"],
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
                            <BreadcrumbPage>{category?.title ?? slug}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
                {category?.title ?? slug}
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


