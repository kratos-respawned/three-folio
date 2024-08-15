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
import { Metadata } from "next";
import Link from "next/link";
export const dynamic="auto"
export const revalidate=3600
export const metadata: Metadata = {
  title: 'Projects | Deepak Bhandari',
  description: 'A collection of projects I have worked on',
}
 
const Projects = async () => {
  const projects = await db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
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
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
        Projects
      </h2>
      <section className="mt-12 grid sm:grid-cols-2 gap-2">
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
