import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string;
  mainImage: string;
};

export const ProjectCard = ({
  id,
  name,
  description,
  mainImage,
}: ProjectCardProps) => {
  return (
    <Link href={`/projects/${id}`} className="block cursor-pointer">
      <Card className="overflow-hidden aspect-[4/3] max-w-2xl w-full  relative group">
        <Image src={mainImage} alt="test"  className="object-cover  object-center" fill  />

        <div className="absolute grid items-end px-3 pb-3  bg-gradient-to-t from-black/65 inset-0 text-white">
          <div>
            <h4 className="text-base font-semibold flex items-center">
              {name}
              <ChevronRight className="size-4 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-300 transition-all" />
            </h4>
            <p className="text-xs">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
