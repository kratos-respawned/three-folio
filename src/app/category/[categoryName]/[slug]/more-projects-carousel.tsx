import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProjectCard } from '@/components/project-card';
import { Skeleton } from '@/components/ui/skeleton';
import { siteQueries } from '@/constant';
import { client } from '@/lib/sanity';
import { cacheLife, cacheTag } from 'next/cache';
import { SanityDocument } from 'next-sanity';

export async function MoreProjectsCarousel({ project }: { project: SanityDocument & { category?: Array<{ _ref: string }> } }) {
  "use cache";
  cacheLife("hours");
  const categoryId = project.category && Array.isArray(project.category) ? project.category[0]?._ref : undefined;
  cacheTag(siteQueries.similarProjects.cacheTag({categoryId:categoryId ?? ""}));
  if (!categoryId) {
    return null;
  }
  const similarProjects = await client.fetch<{
    title: string,
    slug: {current: string},
    description: string,
    mainImage: {asset: {imageUrl: string}}
  }[]>(
    siteQueries.similarProjects.query,
    { slug: project.slug.current, categoryId },
  );
  return (
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
          View All{' '}
          <ChevronRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
      <div className="max-md:px-12">
        <Carousel opts={{ align: 'start' }} className="w-full ">
          <CarouselContent>
            {similarProjects
              .sort(() => Math.random() - 0.5)
              .map((p) => (
                <CarouselItem key={p.slug.current} className="md:basis-1/2">
                  <ProjectCard
                    id={p.slug.current}
                    key={p.slug.current}
                    name={p.title}
                    description={p.description}
                    mainImage={p.mainImage.asset.imageUrl}
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

export function MoreProjectsCarouselSkeleton() {
  return (
    <section className="py-6  space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="max-md:px-12">
        <div className="flex space-x-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="md:basis-1/2 w-full">
              <Skeleton className="aspect-[4/3] rounded-xl w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
