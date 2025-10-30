import { Skeleton } from '@/components/ui/skeleton';
import { MoreProjectsCarouselSkeleton } from './more-projects-carousel';

export default function Loading() {
  return (
    <main className="pb-12 ">
      <header>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-80" />
        </div>
      </header>
      <section className="space-y-3 mt-6">
        <Skeleton className="h-14 w-2/3 mb-2" />
        <Skeleton className="h-8 w-40" />
      </section>
      {/* Image grid skeleton: 2 rows of 2 */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl w-full" />
        ))}
      </div>
      <MoreProjectsCarouselSkeleton />
    </main>
  );
}
