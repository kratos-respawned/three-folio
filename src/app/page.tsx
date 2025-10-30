import { SkillsOrbit, SkillsSection } from "@/components/skills-orbit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {  cn } from "@/lib/utils";
import { FileVideo, Library, Youtube } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CategoriesList, CategoriesSkeleton } from "@/components/categories-list";

export default function Home() {
  return (
    <main className="flex flex-col   space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <h1 className="text-3xl font-bold grayscale tracking-tighter sm:text-5xl xl:text-6xl/none">
                Hi, I&apos;m Deepak 👋
              </h1>

              <p className="max-w-[600px] md:text-xl">
              Product & Architectural Visualizer crafting realistic and engaging 3D visuals.
              </p>
            </div>

            <Avatar className="size-28 border">
              <AvatarImage alt="Deepak Bhandari" className="grayscale" src={"/profile.jpeg"} />
              <AvatarFallback>DB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>
      <section id="about">
        <h2 className="text-xl font-bold">About</h2>
        <p className=" max-w-full text-pretty font-sans  text-muted-foreground ">
        I’m a 3D Visualizer specializing in product animations and architectural renders. I focus on modeling, texturing, and rendering detailed visuals that help brands and designers showcase their ideas with clarity and impact.
I mainly work in Blender, and also use Unreal Engine for real-time visualization. With a strong eye for composition and lighting, I aim to create visuals that feel immersive, elegant, and emotionally engaging. I’m always excited to collaborate on new projects that push creative boundaries and bring fresh ideas to life.
        </p>
      </section>
      <section id="experience">
        <div className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <Card className="flex justify-start gap-3 items-center px-5 border-0 py-3">
            <Youtube className="size-10 font-thin " />
            <div className="flex-1">
              <div className="flex justify-between  ">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  Youtuber
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  2019 - Present
                </div>
              </div>
              <div className="font-sans text-xs">
                Created content based on 3D Animation and VFX
              </div>
            </div>
          </Card>
          <Card className="flex justify-start gap-3 items-center px-5 border-0 py-3">
            <FileVideo className="size-10 " />
            <div className="flex-1">
              <div className="flex justify-between  ">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  Freelance 3D Animator
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  2020 - Present
                </div>
              </div>
              <div className="font-sans text-xs">
                Creating 3D Animations for various clients and other youtube
                content creators.
              </div>
            </div>
          </Card>
          <Card className="flex justify-start gap-3 items-center px-5 border-0 py-3">
            <Library className="size-10 " />
            <div className="flex-1">
              <div className="flex justify-between  ">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  Educator
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  2020 - 2022
                </div>
              </div>
              <div className="font-sans text-xs">
                Taught 3D Animation and VFX to various clients.
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section id="skills">
        <div className="max-sm:space-y-8 w-full py-5">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Skills
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Tools & Technologies
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I have experience working with a variety of tools and
                technologies. Here are a few of my favorites.
              </p>
            </div>
          </div>
          <SkillsOrbit />
          <SkillsSection />
        </div>
      </section>
      <section id="work">
        <div className=" w-full py-5 pb-0">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Work
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Check out my latest work
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover projects grouped into categories like Archviz and Product viz.
              </p>
            </div>
          </div>
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesList />
          </Suspense>
          <Link
            href="/category"
            className={cn(
              buttonVariants({ variant: "link" }),
              "ml-auto block w-fit text-blue-500 "
            )}
          >
            browse all categories...
          </Link>
        </div>
      </section>
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-5">
          <div className="space-y-3">
            <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
              Contact
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Get in Touch
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Want to chat? Email me at {" "}
              <Link
                href={"mailto:3deepak277@gmail.com"}
                className="text-blue-500 hover:underline"
              >
                3deepak277@gmail.com
              </Link>{" "}
              or connect on {" "}
              <Link
                target="_blank"
                referrerPolicy="no-referrer"
                href={"https://www.linkedin.com/in/deepak-bhandari-700a58276"}
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}





