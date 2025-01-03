import { DeleteButton } from "@/components/delete-project-button";
import { NewProject } from "@/components/new-project";
import { ProjectCard } from "@/components/project-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { env } from "@/env";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
type Searchparams = Promise<{ token: string | undefined }>;
const Admin = async (props: { searchParams: Searchparams }) => {
  const params = await props.searchParams;
  const searchParams = params;
  if (!searchParams.token || searchParams.token !== env.TOKEN) {
    notFound();
  }
  const projects = await db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className=" w-full pb-12 ">
      <header className="w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl pt-3">
          Admin
        </h1>
        <p className="text-muted-foreground">
          This is the admin page. You can only access this page if you have the
          correct token. <br /> Add and remove projects, blog posts, and other
          content here.
        </p>
      </section>
      <section className="py-6 space-y-3">
        <div className="flex justify-between items-center relative">
          <h4 className="text-2xl font-semibold ">Projects</h4>
          <NewProject token={searchParams.token} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-2 pt-5">
          {projects.length === 0 && (
            <p className="text-muted-foreground">No projects found</p>
          )}
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-1">
              <ProjectCard {...project} />
              <DeleteButton id={project.id} token={searchParams.token} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
export default Admin;
