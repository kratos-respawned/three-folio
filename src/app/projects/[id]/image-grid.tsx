"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type imageProps = {
  id: string;
  fileId: string;
  name: string;
  filePath: string;
  imageUrl: string;
  height: number;
  width: number;
  thumbnail: string;
  projectId: string | null;
};
export const ImageGrid = ({ images }: { images: imageProps[] }) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  return (
    <section className="py-6 space-y-3">
      <div className="w-full relative max-w-2xl h-full mx-auto overflow-hidden ">
        <Image
          src={activeImage.imageUrl}
          className="w-full object-contain border-black border-2 rounded-lg  "
          alt="test"
          width={800}
          height={600}
          priority
        />
      </div>
      <div className="sm:grid-cols-2 grid gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg">
            <Image
              onClick={() => setActiveImage(image)}
              src={image.imageUrl}
              className={cn(
                "w-full object-contain rounded-lg",
                activeImage.id === image.id
                  ? " pointer-events-none"
                  : "cursor-pointer"
              )}
              alt="test"
              width={500}
              priority
              height={375}
            />
            {activeImage.id === image.id && (
              <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
