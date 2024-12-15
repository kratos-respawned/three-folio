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
import { Metadata } from "next";
import { groq, SanityDocument } from "next-sanity";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Projects | Deepak Bhandari",
  description: "A collection of projects I have worked on",
};
const allProjectsQuery = groq`*[_type == "post" ] | order(orderRank) {
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
const Projects = async () => {
  const projects = await client.fetch<SanityDocument[]>(
    allProjectsQuery,
    {},
    {
      next: {
        tags: ["all-projects"],
      },
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
          <ProjectCard
            id={project.slug.current}
            key={project.slug.current}
            name={project.title}
            description={project.description}
            mainImage={project.mainImage.asset.imageUrl}
          />
        ))}
      </section>
    </main>
  );
};
export default Projects;
