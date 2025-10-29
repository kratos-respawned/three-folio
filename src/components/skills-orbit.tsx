import Image from "next/image";
import { Icons } from "./Icons";
import { Card, CardContent } from "./ui/card";
import OrbitingCircles from "./ui/orbiting-circle";

export function SkillsOrbit() {
  return (
    <div className="relative  hidden min-[500px]:flex h-[500px] w-full   items-center justify-center overflow-hidden rounded-lg  bg-background ">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Skills
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[40px] w-[40px] dark:invert border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Icons.youtube />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[40px] w-[40px] dark:invert border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <Icons.unreal />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[50px] dark:invert w-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <Icons.blender />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] dark:invert w-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <Image src="/3ds.png" width={100} height={100} alt="maya" />
      </OrbitingCircles>
    </div>
  );
}

export const SkillsSection = () => {
  return (
    <div className="grid  max-[500px]:grid-cols-2  min-[500px]:hidden gap-4">
      <Card className="">
        <CardContent className="pt-6  grid place-items-center">
          <Image src="/3ds.png" width={64} height={64} alt="maya" />
          <span className="sr-only">Autodesk</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="pt-6  grid place-items-center">
          <Icons.blender className="w-16" />
          <span className="sr-only">Blender</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="pt-6  grid place-items-center">
          <Icons.unreal className="w-16" />
          <span className="sr-only">Unreal Engine</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="pt-6  grid place-items-center">
          <Icons.youtube className="w-16" />
          <span className="sr-only">Youtube</span>
        </CardContent>
      </Card>
    </div>
  );
};
