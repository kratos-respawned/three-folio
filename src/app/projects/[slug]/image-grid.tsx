"use client";

import { cn } from "@/lib/utils";
import { YouTubeEmbed } from "@next/third-parties/google";
import Image from "next/image";
import { useRef, useState } from "react";

export const ImageGrid = ({
  images,
  videoId,
}: {
  images: string[];
  videoId: string | undefined;
}) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const imageRef = useRef<HTMLImageElement>(null);
  return (
    <section className="py-6 space-y-3">
      {videoId ? <YouTubeEmbed videoid={videoId} /> : null}
      <div className="w-full relative max-w-2xl h-full mx-auto overflow-hidden ">
        <Image
          ref={imageRef}
          src={activeImage}
          className="h-[450px] sticky object-contain border-black border-2 rounded-lg  "
          alt="test"
          width={800}
          height={600}
          priority
        />
      </div>
      <div className="sm:grid-cols-2 grid gap-3">
        {images.map((image) => (
          <div key={image} className="relative overflow-hidden rounded-lg">
            <Image
              onClick={() => {
                setActiveImage(image);
                imageRef.current?.scrollIntoView({ behavior: "smooth" });
                // open new tab with image
              }}
              src={image}
              className={cn(
                "sm:max-h-[200px] object-contain bg-white rounded-lg",
                activeImage === image
                  ? " pointer-events-none"
                  : "cursor-pointer"
              )}
              alt="test"
              width={500}
              priority
              height={375}
            />
            {activeImage === image && (
              <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
