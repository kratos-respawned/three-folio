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

const Project = async ({ params }: { params: { id: string | undefined } }) => {
  const id = params["id"];
  console.log(id);
  const projectPromise = db.project.findUnique({
    where: {
      id: params.id || "",
    },
    include: {
      images: true,
    },
  });
  const moreProjectsPromise = db.project.findMany({
    take: 6,
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
      <section className="py-6 space-y-3">
        <div className="w-full relative max-w-2xl aspect-[4/3]  ">
          <Image
            src={project.images[0].imageUrl}
            className="w-full object-cover object-center aspect-[4/3]  rounded-xl "
            alt="test"
            priority
            fill
          />
        </div>
        <div className="sm:grid-cols-2 grid gap-3">
          {project.images
            .filter((image) => image.thumbnail !== project.mainImage)
            .map((image) => (
              <Image
                key={image.id}
                src={image.imageUrl}
                className="w-full aspect-[4/3] object-cover rounded-xl "
                alt="test"
                width={500}
                priority
                height={375}
              />
            ))}
        </div>
      </section>
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
