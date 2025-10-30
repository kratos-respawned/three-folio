import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGrid } from "./image-grid";
import { SanityDocument } from "next-sanity";
import { client } from "@/lib/sanity";
import { siteQueries } from "@/constant";
import { cacheLife, cacheTag} from "next/cache";
import { Suspense } from "react";
import { MoreProjectsCarousel, MoreProjectsCarouselSkeleton } from "./more-projects-carousel";
import { categoryToTitle } from "@/lib/utils";

type Params = Promise<{ slug: string | undefined, categoryName:string }>;
type ProjectWithCategory = SanityDocument & { category?: Array<{ _ref: string }> };


const fetchProject = async (slug: string) => {
  "use cache"
  cacheLife("hours")
  cacheTag(siteQueries.project.cacheTag(slug));
  const project = await client.fetch<SanityDocument>(
    siteQueries.project.query,
    { slug },
  );
  return project;
};

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const slug = params.slug;
  if (!slug) {
    return { title: "Not Found", description: "Err" };
  }
  const project = await fetchProject(slug);
  return {
    title: project.title,
    description: project.description,
  };
}
const Project = async (props: { params: Params }) => {
  "use cache"
  cacheLife("hours")
  const params = await props.params;
  const slug = params.slug;
  const categoryName = categoryToTitle(params.categoryName);
  if (!slug) {
    notFound();
  }
  cacheTag(siteQueries.project.cacheTag(slug)+"-page");
  const project = await fetchProject(slug) as ProjectWithCategory;
  if (!project) {
    notFound();
  }
  const images = project.images.map((image: any) => {
    return image.asset.imageUrl;
  });

  return (
    <main className="pb-12 ">
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
                <Link href={`/category/${params.categoryName}`}>{categoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
          {project.title}
        </h1>
        <p className="text-muted-foreground ">{project.description}</p>
      </section>

      <ImageGrid images={images} videoId={project.videoId} />
      <hr />
      {/* Carousel area */}
      <Suspense fallback={<MoreProjectsCarouselSkeleton />}>
        <MoreProjectsCarousel project={project} />
      </Suspense>
    </main>
  );
};
export default Project;
