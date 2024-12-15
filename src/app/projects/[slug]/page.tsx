import { ProjectCard } from "@/components/project-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ImageGrid } from "./image-grid";
import { groq, SanityDocument } from "next-sanity";
import { client } from "@/lib/sanity";

type Params = Promise<{ slug: string | undefined }>;
const projectQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  description,
  video,
  mainImage {
    asset-> {
      "imageUrl": url + "?w=800&h=600&fit=crop"
    }
  },
  "images": images[] {
    asset-> {
      url,
      "imageUrl": url + "?w=800&h=600&fit=fillmax"
    }
  }
}`;
const options = {
  next: {
    tags: ["more-projects"],
  },
};
const moreProjectsQuery = groq`*[_type == "post" && slug.current != $slug] | order(orderRank) [0...5] {
  title,
  slug,
  description,
  mainImage {
    asset-> {
      url,
      "imageUrl": url + "?w=624&h=428&fit=crop"
    }
  }
}`;
const CachedProduct = cache(async (slug: string) => {
  const project = await client.fetch<SanityDocument>(
    projectQuery,
    { slug },
    {
      next: {
        revalidate: 60,
      },
    }
  );
  return project;
});

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const slug = params.slug;
  if (!slug) {
    return { title: "Not Found", description: "Err" };
  }
  const project = await CachedProduct(slug);

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      images: [project.mainImage.asset.imageUrl],
    },
  };
}
const Project = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  if (!slug) {
    notFound();
  }
  const project = await CachedProduct(slug);
  const moreProjects = await client.fetch<SanityDocument[]>(
    moreProjectsQuery,
    { slug },
    options
  );
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
                <Link href="/projects">Projects</Link>
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

      <ImageGrid
        images={images}
        videoId={
          project.video && project.video.video
            ? project.video.video.id
            : undefined
        }
      />
      <hr />
      {moreProjects && moreProjects.length > 0 ? (
        <section className="py-6  space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-bold">More Projects</h3>
            <Link
              href={"/projects"}
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-muted-foreground items-center leading-none group"
              )}
            >
              View All{" "}
              <ChevronRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
          <div className="px-12">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full "
            >
              <CarouselContent>
                {moreProjects
                  .sort(() => Math.random() - 0.5)
                  .map((p) => (
                    <CarouselItem key={p.slug.current} className="sm:basis-1/2">
                      <ProjectCard
                        id={project.slug.current}
                        key={project.slug.current}
                        name={project.title}
                        description={project.description}
                        mainImage={project.mainImage.asset.imageUrl}
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      ) : null}
    </main>
  );
};
export default Project;
