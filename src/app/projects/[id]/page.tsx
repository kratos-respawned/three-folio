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
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ImageGrid } from "./image-grid";
type Params = Promise<{ id: string | undefined }>;
const CachedProduct = cache(async (id: string) => {
  const project = await db.project.findUnique({
    where: {
      id: id || "",
    },
    include: {
      images: true,
    },
  });
  return project;
});

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;
  if (!id) {
    return { title: "Not Found", description: "Err" };
  }
  const project = await CachedProduct(id);
  const images =
    project?.images.map((image) => ({
      url: image.imageUrl,
    })) || [];

  return {
    title: project?.name || "Project",
    description: project?.description || "Project description",
    openGraph: {
      images: [...images],
    },
  };
}
const Project = async (props: { params: Params }) => {
  const params = await props.params;
  const projectPromise = db.project.findUnique({
    where: {
      id: params.id || "",
    },
    include: {
      images: true,
    },
  });
  const moreProjectsPromise = db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const [project, moreProjects] = await Promise.all([
    projectPromise,
    moreProjectsPromise,
  ]);
  if (!project) {
    notFound();
  }
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
              <BreadcrumbPage>Room Interior</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
          {project.name}
        </h1>
        <p className="text-muted-foreground">{project.description}</p>
      </section>
      <ImageGrid images={project.images} />
      <hr />
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
                .filter((p) => p.id !== project.id)
                .map((p) => (
                  <CarouselItem key={p.id} className="sm:basis-1/2">
                    <ProjectCard {...p} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </main>
  );
};
export default Project;
