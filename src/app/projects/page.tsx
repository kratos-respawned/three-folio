import { ProjectCard } from "@/components/project-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import Link from "next/link";

const Projects = async () => {
  const projects = await db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className=" ">
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
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
        Projects
      </h2>
      <section className="mt-12 grid grid-cols-2 gap-2">
        {projects.length === 0 && (
          <p className="text-muted-foreground">No projects found</p>
        )}
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </section>
    </main>
  );
};
export default Projects;
